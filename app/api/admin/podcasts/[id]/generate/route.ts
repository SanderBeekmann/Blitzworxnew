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
  _request: Request,
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
    // Fetch podcast with sources
    const { data: podcast, error: fetchError } = await supabase
      .from('podcasts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !podcast) {
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    if (podcast.status !== 'draft' && podcast.status !== 'review') {
      return NextResponse.json(
        { error: 'Podcast moet in concept of review status zijn om te genereren' },
        { status: 400 }
      );
    }

    const sources = podcast.sources || [];
    if (sources.length === 0) {
      return NextResponse.json(
        { error: 'Voeg eerst bronnen toe voordat je genereert' },
        { status: 400 }
      );
    }

    // Update status to generating
    const { error: updateError } = await supabase
      .from('podcasts')
      .update({ status: 'generating', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Supabase status update error:', updateError);
      return NextResponse.json({ error: 'Kon status niet bijwerken' }, { status: 500 });
    }

    // Note: The actual NotebookLM generation is orchestrated from the admin wizard
    // client-side using Claude Code's NotebookLM MCP integration:
    // 1. Create notebook with podcast topic
    // 2. Add sources (YouTube URLs, article URLs)
    // 3. Generate Audio Overview
    // 4. Poll until complete
    // 5. Download audio -> upload to Supabase Storage
    // 6. PATCH this podcast with audio_url, audio_duration
    // 7. Status automatically set to 'review' after successful upload
    //
    // This endpoint handles the status transition and validation.

    return NextResponse.json({
      success: true,
      podcast_id: id,
      topic: podcast.topic,
      sources,
      message: 'Generatie gestart. Gebruik de wizard om het proces te volgen.',
    });
  } catch (err) {
    console.error('Admin podcast generate error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
