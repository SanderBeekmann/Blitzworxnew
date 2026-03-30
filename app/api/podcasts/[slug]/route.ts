import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  const { slug } = await params;

  try {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    // Increment play count
    await supabase
      .from('podcasts')
      .update({ play_count: (data.play_count || 0) + 1 })
      .eq('id', data.id);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Public podcast fetch error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
