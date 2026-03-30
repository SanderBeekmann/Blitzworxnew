import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import type { PodcastStatus } from '@/lib/podcasts';

const ADMIN_COOKIE = 'blitzworx_admin';

function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && token === expected;
}

const VALID_STATUSES: PodcastStatus[] = [
  'draft', 'researching', 'generating', 'review', 'published', 'archived',
];

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
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase podcast fetch error:', error);
      return NextResponse.json({ error: 'Podcast niet gevonden' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin podcast fetch error:', err);
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

  const allowedFields = [
    'title', 'description', 'show_notes', 'transcript', 'seo_title',
    'seo_description', 'tags', 'status', 'sources', 'audio_url',
    'audio_duration', 'thumbnail_url',
  ];

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === 'status' && !VALID_STATUSES.includes(body[field])) {
        return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 });
      }
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Geen velden om bij te werken' }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('podcasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase podcast update error:', error);
      return NextResponse.json({ error: 'Kon podcast niet bijwerken' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin podcast update error:', err);
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
    const { error } = await supabase.from('podcasts').delete().eq('id', id);

    if (error) {
      console.error('Supabase podcast delete error:', error);
      return NextResponse.json({ error: 'Kon podcast niet verwijderen' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin podcast delete error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
