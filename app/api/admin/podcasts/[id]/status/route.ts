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

export async function GET(
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
    const { data, error } = await supabase
      .from('podcasts')
      .select('id, status, audio_url, audio_duration, sources, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase podcast status error:', error);
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin podcast status error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
