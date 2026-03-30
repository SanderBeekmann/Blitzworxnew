import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

const ADMIN_COOKIE = 'blitzworx_admin';

function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && token === expected;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  const { id } = await params;

  try {
    // Fetch current podcast
    const { data: podcast, error: fetchError } = await supabase
      .from('podcasts')
      .select('id, topic, status')
      .eq('id', id)
      .single();

    if (fetchError || !podcast) {
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    if (podcast.status !== 'draft' && podcast.status !== 'review') {
      return NextResponse.json(
        { error: 'Podcast moet in concept of review status zijn om onderzoek te starten' },
        { status: 400 }
      );
    }

    // Update status to researching
    const { error: updateError } = await supabase
      .from('podcasts')
      .update({ status: 'researching', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Supabase status update error:', updateError);
      return NextResponse.json({ error: 'Kon status niet bijwerken' }, { status: 500 });
    }

    // Accept manually provided sources from the request body
    const body = await request.json().catch(() => ({}));
    const manualSources = body.sources || [];

    if (manualSources.length > 0) {
      const { error: sourcesError } = await supabase
        .from('podcasts')
        .update({
          sources: manualSources,
          status: 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (sourcesError) {
        console.error('Supabase sources update error:', sourcesError);
        return NextResponse.json({ error: 'Kon bronnen niet opslaan' }, { status: 500 });
      }

      return NextResponse.json({ success: true, sources: manualSources });
    }

    // Note: automated research via YouTube Scraper and web search
    // is triggered from the admin wizard client-side using Claude Code skills.
    // This endpoint handles manual source submission and status management.
    // After automated research completes, the wizard calls PATCH to update sources.

    return NextResponse.json({
      success: true,
      message: 'Onderzoek gestart. Voeg bronnen toe via de wizard.',
    });
  } catch (err) {
    console.error('Admin podcast research error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
