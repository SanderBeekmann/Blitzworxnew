import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

const EVENT_COLUMN_MAP: Record<string, string> = {
  'email.delivered': 'delivered_at',
  'email.opened': 'opened_at',
  'email.clicked': 'clicked_at',
  'email.bounced': 'bounced_at',
  'email.complained': 'complained_at',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (WEBHOOK_SECRET) {
      const svixId = request.headers.get('svix-id');
      if (!svixId) {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 401 });
      }
    }

    const eventType: string = body.type ?? '';
    const resendId: string = body.data?.email_id ?? '';

    if (!resendId || !eventType) {
      return NextResponse.json({ received: true });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const { data: existing } = await supabase
      .from('sequence_emails')
      .select('id')
      .eq('resend_id', resendId)
      .maybeSingle();

    await supabase.from('resend_webhook_events').insert({
      event_type: eventType,
      resend_id: resendId,
      sequence_email_id: existing?.id ?? null,
      payload: body,
      processed: Boolean(existing),
    });

    if (!existing) {
      return NextResponse.json({ received: true, matched: false });
    }

    const column = EVENT_COLUMN_MAP[eventType];
    if (column) {
      await supabase
        .from('sequence_emails')
        .update({ [column]: new Date().toISOString() })
        .eq('id', existing.id);
    }

    if (eventType === 'email.bounced' || eventType === 'email.complained') {
      const { data: seqEmail } = await supabase
        .from('sequence_emails')
        .select('sequence_id')
        .eq('id', existing.id)
        .single();

      if (seqEmail) {
        await supabase
          .from('email_sequences')
          .update({
            status: 'stopped',
            stopped_reason: eventType === 'email.bounced' ? 'bounced' : 'spam_complaint',
            next_send_at: null,
          })
          .eq('id', seqEmail.sequence_id);
      }
    }

    return NextResponse.json({ received: true, matched: true, event: eventType });
  } catch (err) {
    console.error('Resend webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
