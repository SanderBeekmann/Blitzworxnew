import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendTemplateEmail } from '@/lib/email';

const SEQUENCE = [
  { template: 'podcast_followup_3d', afterTemplate: 'podcast_welcome', delayDays: 3 },
  { template: 'podcast_newsletter_invite', afterTemplate: 'podcast_followup_3d', delayDays: 4 },
];

export async function GET(request: Request) {
  // Simple auth via query param to prevent abuse
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET && process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  let sent = 0;
  let skipped = 0;

  // Get all active podcast subscribers
  const { data: subscribers } = await supabase
    .from('email_subscribers')
    .select('id, email, name')
    .eq('source', 'podcast')
    .is('unsubscribed_at', null);

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, message: 'Geen actieve subscribers' });
  }

  for (const sub of subscribers) {
    // Get all sends for this subscriber
    const { data: sends } = await supabase
      .from('email_sends')
      .select('template_slug, sent_at')
      .eq('subscriber_id', sub.id);

    const sendMap = new Map(
      (sends || []).map((s) => [s.template_slug, new Date(s.sent_at)])
    );

    // Get podcast info from the subscriber's source_detail
    const { data: subData } = await supabase
      .from('email_subscribers')
      .select('source_detail')
      .eq('id', sub.id)
      .single();

    const podcastSlug = subData?.source_detail;
    let podcastTitle = 'onze podcast';

    if (podcastSlug) {
      const { data: podcast } = await supabase
        .from('podcasts')
        .select('title')
        .eq('slug', podcastSlug)
        .single();
      if (podcast) podcastTitle = podcast.title;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';
    const vars = {
      name: sub.name || 'daar',
      podcast_title: podcastTitle,
      podcast_url: `${siteUrl}/podcasts/${podcastSlug || ''}`,
      podcasts_url: `${siteUrl}/podcasts`,
      contact_url: `${siteUrl}/contact`,
      diensten_url: `${siteUrl}/diensten`,
      blog_url: `${siteUrl}/blog`,
    };

    for (const step of SEQUENCE) {
      // Already sent this template?
      if (sendMap.has(step.template)) {
        skipped++;
        continue;
      }

      // Previous template sent?
      const prevSentAt = sendMap.get(step.afterTemplate);
      if (!prevSentAt) continue;

      // Enough days passed?
      const daysSince = (Date.now() - prevSentAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < step.delayDays) continue;

      const success = await sendTemplateEmail(sub.email, step.template, vars, sub.id);
      if (success) sent++;
    }
  }

  return NextResponse.json({ sent, skipped, subscribers: subscribers.length });
}
