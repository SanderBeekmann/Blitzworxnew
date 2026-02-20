import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'blitzworx_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dagen

export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: 'Admin niet geconfigureerd.' },
      { status: 503 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Ongeldig wachtwoord' }, { status: 401 });
  }

  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });

  return NextResponse.json({ success: true });
}
