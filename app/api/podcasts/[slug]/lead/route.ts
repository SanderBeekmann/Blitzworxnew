import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { upsertSubscriber, hasBeenSent, sendTemplateEmail } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geldig e-mailadres is verplicht' }, { status: 400 });
    }

    // Find the podcast
    const { data: podcast, error: podcastError } = await supabase
      .from('podcasts')
      .select('id, title, audio_url, show_notes, description')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (podcastError || !podcast) {
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    // Insert podcast lead
    const { error: leadError } = await supabase.from('podcast_leads').insert({
      podcast_id: podcast.id,
      email,
      name: name || null,
      source_page: `/podcasts/${slug}`,
    });

    if (leadError) {
      console.error('Supabase podcast lead error:', leadError);
      return NextResponse.json({ error: 'Kon lead niet opslaan' }, { status: 500 });
    }

    // Create or link to main clients table for CRM integration
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingClient) {
      await supabase.from('clients').insert({
        email,
        name: name || email.split('@')[0],
        phone: '',
        status: 'prospect',
        notes: `Lead via podcast: ${slug}`,
      });
    }

    // Increment download count
    await supabase
      .from('podcasts')
      .update({ download_count: (podcast.audio_url ? 1 : 0) })
      .eq('id', podcast.id);

    // Subscribe + send welcome email (non-blocking)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';
    const subscriberId = await upsertSubscriber(email, name || null, 'podcast', slug, [slug]);

    if (subscriberId) {
      const alreadySent = await hasBeenSent(subscriberId, 'podcast_welcome');
      if (!alreadySent) {
        const showNotesPreview = (podcast.show_notes || podcast.description || '')
          .substring(0, 200)
          .replace(/[#*_]/g, '');

        await sendTemplateEmail(email, 'podcast_welcome', {
          name: name || 'daar',
          podcast_title: podcast.title,
          podcast_url: `${siteUrl}/podcasts/${slug}`,
          show_notes_preview: showNotesPreview,
          podcasts_url: `${siteUrl}/podcasts`,
          contact_url: `${siteUrl}/contact`,
        }, subscriberId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Podcast lead capture error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
