import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const TO_EMAIL = 'sander@blitzworx.nl';

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'E-mail configuratie ontbreekt. Voeg RESEND_API_KEY toe aan .env.local' },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await request.json();
    const { name, email, message, projectType } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Naam, e-mail en bericht zijn verplicht.' },
        { status: 400 }
      );
    }

    const projectLabels: Record<string, string> = {
      website: 'Nieuwe website',
      redesign: 'Website redesign',
      branding: 'Branding / huisstijl',
      other: 'Anders',
    };
    const projectLabel = projectLabels[projectType] ?? projectType ?? '-';

    const html = `
      <h2>Nieuw contactformulier bericht</h2>
      <p><strong>Project:</strong> ${projectLabel}</p>
      <p><strong>Naam:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Bericht:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Blitzworx Contact <onboarding@resend.dev>',
      to: [TO_EMAIL],
      replyTo: [email.trim()],
      subject: `Contactformulier: ${name.trim()} - ${projectLabel}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het versturen.' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
