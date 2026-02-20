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
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Klant niet gevonden' }, { status: 404 });
    }

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error('Supabase leads fetch error:', leadsError);
    }

    return NextResponse.json({ ...client, leads: leads ?? [] });
  } catch (err) {
    console.error('Admin client fetch error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}

export async function PATCH(
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
  const body = await request.json();
  const { company_name, notes, status } = body;

  const validStatuses = ['prospect', 'active', 'completed', 'archived'];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (company_name !== undefined) updates.company_name = company_name;
  if (notes !== undefined) updates.notes = notes;
  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 });
    }
    updates.status = status;
  }

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json({ error: 'Geen velden om bij te werken' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase client update error:', error);
      return NextResponse.json({ error: 'Kon klant niet bijwerken' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin client update error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
