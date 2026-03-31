import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(page('Ongeldige link', 'Deze uitschrijflink is niet geldig.'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 400,
    });
  }

  let email: string;
  try {
    email = Buffer.from(token, 'base64url').toString('utf-8');
  } catch {
    return new NextResponse(page('Ongeldige link', 'Deze uitschrijflink is niet geldig.'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 400,
    });
  }

  if (supabase) {
    await supabase
      .from('email_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase());
  }

  return new NextResponse(
    page('Uitgeschreven', 'Je ontvangt geen e-mails meer van Blitzworx. Je kunt dit venster sluiten.'),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

function page(title: string, message: string): string {
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - Blitzworx</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#040711;font-family:system-ui,sans-serif;color:#fefadc}div{text-align:center;max-width:400px;padding:2rem}h1{font-size:1.5rem;margin:0 0 0.5rem}p{color:#8b8174;font-size:0.875rem;margin:0}a{color:#cacaaa;text-decoration:none}a:hover{text-decoration:underline}</style></head><body><div><h1>${title}</h1><p>${message}</p><p style="margin-top:1.5rem"><a href="https://blitzworx.nl">Terug naar blitzworx.nl</a></p></div></body></html>`;
}
