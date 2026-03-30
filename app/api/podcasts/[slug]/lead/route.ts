import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      .select('id, audio_url')
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Podcast lead capture error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
