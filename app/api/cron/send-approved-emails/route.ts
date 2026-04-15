import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const LAST_STEP = 5;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Sander van Blitzworx <contact@blitzworx.nl>';
const BATCH_SIZE = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY niet geconfigureerd' }, { status: 503 });
  }
  const resend = new Resend(apiKey);

  const nowIso = new Date().toISOString();

  // Only pick up approved emails that have never been sent.
  // sent_at IS NULL prevents picking up rows that succeeded at Resend but
  // failed to update the DB row afterward.
  // scheduled_send_at NULL is treated as "send ASAP" - older rows created
  // before the generate route started setting a schedule, or rows from the
  // output-router approval flow which does not schedule.
  const { data: dueEmails, error: queryErr } = await supabase
    .from('sequence_emails')
    .select('id, sequence_id, step, subject, body_html, body_text, scheduled_send_at')
    .eq('status', 'approved')
    .is('sent_at', null)
    .or(`scheduled_send_at.is.null,scheduled_send_at.lte.${nowIso}`)
    .order('scheduled_send_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE);

  if (queryErr) {
    console.error('Cron query failed:', queryErr);
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }

  if (!dueEmails || dueEmails.length === 0) {
    return NextResponse.json({ checked: 0, claimed: 0, sent: 0, failed: 0, skipped: 0 });
  }

  let claimedCount = 0;
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const email of dueEmails) {
    // Atomically claim this row: approved -> sending.
    // If another worker already claimed it, rowCount is 0 and we skip.
    const { data: claimed, error: claimErr } = await supabase
      .from('sequence_emails')
      .update({ status: 'sending' })
      .eq('id', email.id)
      .eq('status', 'approved')
      .is('sent_at', null)
      .select('id')
      .maybeSingle();

    if (claimErr) {
      console.error('Claim failed for email', email.id, claimErr);
      skipped++;
      continue;
    }
    if (!claimed) {
      skipped++;
      continue;
    }
    claimedCount++;

    // Fetch parent sequence (need recipient + status check)
    const { data: sequence } = await supabase
      .from('email_sequences')
      .select('id, email, status, enrolled_at')
      .eq('id', email.sequence_id)
      .single();

    if (!sequence || sequence.status !== 'active') {
      // Release the claim back to approved so it can be cleaned up manually,
      // but mark rejected to avoid re-pickup.
      await supabase
        .from('sequence_emails')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          error: `Sequence not active (${sequence?.status ?? 'missing'})`,
        })
        .eq('id', email.id);
      skipped++;
      continue;
    }

    let resendId: string | null = null;
    let sendError: string | null = null;

    try {
      // Idempotency-Key ensures that if we retry the same sequence_email.id
      // within Resend's idempotency window, the same result is returned rather
      // than a duplicate email being delivered.
      const result = await resend.emails.send(
        {
          from: FROM_EMAIL,
          to: sequence.email,
          subject: email.subject,
          html: email.body_html,
          text: email.body_text ?? undefined,
          tags: [
            { name: 'sequence', value: 'website_score' },
            { name: 'step', value: String(email.step) },
          ],
        },
        { idempotencyKey: `seq-email-${email.id}` }
      );
      resendId = result.data?.id ?? null;
      if (!resendId && result.error) {
        sendError = JSON.stringify(result.error);
      }
    } catch (err) {
      sendError = err instanceof Error ? err.message : String(err);
    }

    const now = new Date().toISOString();
    await supabase
      .from('sequence_emails')
      .update({
        status: resendId ? 'sent' : 'failed',
        sent_at: resendId ? now : null,
        resend_id: resendId,
        error: sendError,
      })
      .eq('id', email.id)
      .eq('status', 'sending');

    if (resendId) {
      sent++;
      const isLastStep = email.step >= LAST_STEP;
      const nextStep = email.step + 1;

      let nextScheduledAt: string | null = null;
      if (!isLastStep) {
        const { data: nextEmail } = await supabase
          .from('sequence_emails')
          .select('scheduled_send_at')
          .eq('sequence_id', email.sequence_id)
          .eq('step', nextStep)
          .maybeSingle();
        nextScheduledAt = nextEmail?.scheduled_send_at ?? null;
      }

      const updatePayload: Record<string, unknown> = {
        current_step: nextStep,
        last_send_at: now,
        next_send_at: isLastStep ? null : nextScheduledAt,
      };
      if (isLastStep) {
        updatePayload.status = 'completed';
        updatePayload.completed_at = now;
      }

      await supabase.from('email_sequences').update(updatePayload).eq('id', email.sequence_id);
    } else {
      failed++;
    }
  }

  return NextResponse.json({
    checked: dueEmails.length,
    claimed: claimedCount,
    sent,
    failed,
    skipped,
  });
}
