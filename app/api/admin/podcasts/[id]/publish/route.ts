import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/podcasts';

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
    const { data: podcast, error: fetchError } = await supabase
      .from('podcasts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !podcast) {
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    if (podcast.status !== 'review' && podcast.status !== 'draft') {
      return NextResponse.json(
        { error: 'Podcast moet in review of concept status zijn om te publiceren' },
        { status: 400 }
      );
    }

    if (!podcast.audio_url) {
      return NextResponse.json(
        { error: 'Podcast heeft nog geen audio. Genereer eerst de podcast.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const blogSlug = `podcast-${generateSlug(podcast.title)}`;

    const { data, error: updateError } = await supabase
      .from('podcasts')
      .update({
        status: 'published',
        published_at: now,
        updated_at: now,
        blog_slug: blogSlug,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase publish error:', updateError);
      return NextResponse.json({ error: 'Kon podcast niet publiceren' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      podcast: data,
      blog_slug: blogSlug,
    });
  } catch (err) {
    console.error('Admin podcast publish error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
