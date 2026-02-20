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
  const { status, phase, notes } = body;

  const phases = ['lead', 'contact_opgenomen', 'offerte_aangevraagd', 'offerte_verzonden', 'onderhandeling', 'gewonnen', 'verloren'];
  const statuses = ['new', 'contacted', 'completed'];

  const updates: Record<string, unknown> = {};
  if (phase !== undefined) {
    if (!phases.includes(phase)) {
      return NextResponse.json({ error: 'Ongeldige fase' }, { status: 400 });
    }
    updates.phase = phase;
  }
  if (status !== undefined) {
    if (!statuses.includes(status)) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 });
    }
    updates.status = status;
  }
  if (notes !== undefined) {
    updates.notes = typeof notes === 'string' ? notes : '';
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Geen velden om bij te werken' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Kon lead niet bijwerken' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin lead update error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}

export async function DELETE(
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
    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Kon lead niet verwijderen' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin lead delete error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
