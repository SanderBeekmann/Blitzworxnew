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

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase podcasts fetch error:', error);
      return NextResponse.json({ error: 'Kon podcasts niet ophalen' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin podcasts API error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { title, topic, tags, description } = body;

    if (!title || !topic) {
      return NextResponse.json(
        { error: 'Titel en onderwerp zijn verplicht' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const { data, error } = await supabase
      .from('podcasts')
      .insert({
        title,
        slug,
        topic,
        description: description || null,
        tags: tags || [],
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Er bestaat al een podcast met deze titel' },
          { status: 409 }
        );
      }
      console.error('Supabase podcast create error:', error);
      return NextResponse.json({ error: 'Kon podcast niet aanmaken' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Admin podcast create error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
