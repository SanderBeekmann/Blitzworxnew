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
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase clients fetch error:', error);
      return NextResponse.json({ error: 'Kon klanten niet ophalen' }, { status: 500 });
    }

    const { data: leadCounts } = await supabase
      .from('leads')
      .select('client_id')
      .not('client_id', 'is', null);

    const countByClient: Record<string, number> = {};
    (leadCounts ?? []).forEach((l) => {
      const id = l.client_id as string;
      countByClient[id] = (countByClient[id] ?? 0) + 1;
    });

    const result = (clients ?? []).map((c) => ({
      ...c,
      leads_count: countByClient[c.id] ?? 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('Admin clients API error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
