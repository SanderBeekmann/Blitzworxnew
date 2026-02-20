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

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase leads fetch error:', error);
      return NextResponse.json({ error: 'Kon leads niet ophalen' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin leads API error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
