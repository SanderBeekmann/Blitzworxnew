import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const TO_EMAIL = 'sander@blitzworx.nl';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contact@blitzworx.nl';

const PROJECT_LABELS: Record<string, string> = {
  website: 'Nieuwe website',
  redesign: 'Website redesign',
  branding: 'Branding / huisstijl',
  other: 'Anders',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_xxxx')) {
    return NextResponse.json(
      { error: 'E-mail configuratie ontbreekt. Voeg een geldige RESEND_API_KEY toe aan .env (zie https://resend.com/api-keys)' },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await request.json();
    const { name, email, phone, message, projectType, preferredDate, preferredTime } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Naam, e-mail, telefoon en bericht zijn verplicht.' },
        { status: 400 }
      );
    }

    if (!preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Kies een datum en tijd voor je gesprek.' },
        { status: 400 }
      );
    }

    const projectLabel = PROJECT_LABELS[projectType] ?? projectType ?? '-';

    if (supabase) {
      const { error: dbError } = await supabase.from('leads').insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        project_type: projectType ?? 'other',
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        phase: 'lead',
      });

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        return NextResponse.json(
          { error: 'Kon aanvraag niet opslaan. Probeer het later opnieuw.' },
          { status: 500 }
        );
      }
    }

    const emailStyles = {
      bg: '#040711',
      text: '#fefadc',
      accent: '#cacaaa',
      border: '#545c52',
      muted: '#8b8174',
    };

    const leadHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${emailStyles.bg};font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5;color:${emailStyles.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${emailStyles.bg};padding:32px 24px;">
    <tr><td style="max-width:560px;margin:0 auto;">
      <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:${emailStyles.text};">Nieuwe lead – Blitzworx</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid ${emailStyles.border};border-radius:8px;overflow:hidden;">
        <tr><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};color:${emailStyles.accent};font-weight:600;">Project</td><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};">${escapeHtml(projectLabel)}</td></tr>
        <tr><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};color:${emailStyles.accent};font-weight:600;">Naam</td><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};color:${emailStyles.accent};font-weight:600;">E-mail</td><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};"><a href="mailto:${escapeHtml(email)}" style="color:${emailStyles.accent};text-decoration:underline;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};color:${emailStyles.accent};font-weight:600;">Telefoon</td><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};"><a href="tel:${escapeHtml(phone.replace(/\s/g, ''))}" style="color:${emailStyles.accent};text-decoration:underline;">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding:12px 16px;color:${emailStyles.accent};font-weight:600;">Gesprek</td><td style="padding:12px 16px;">${escapeHtml(preferredDate)} om ${escapeHtml(preferredTime)}</td></tr>
      </table>
      <p style="margin:20px 0 8px;color:${emailStyles.accent};font-weight:600;">Bericht</p>
      <p style="margin:0;padding:16px;background:rgba(84,92,82,0.3);border:1px solid ${emailStyles.border};border-radius:8px;white-space:pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    </td></tr>
  </table>
</body>
</html>`;

    const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${emailStyles.bg};font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5;color:${emailStyles.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${emailStyles.bg};padding:32px 24px;">
    <tr><td style="max-width:560px;margin:0 auto;">
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${emailStyles.text};">Bedankt voor je bericht!</h1>
      <p style="margin:0 0 24px;color:${emailStyles.text};">We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact op.</p>
      <h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:${emailStyles.accent};">Samenvatting</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid ${emailStyles.border};border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};color:${emailStyles.accent};font-weight:600;">Project</td><td style="padding:12px 16px;border-bottom:1px solid ${emailStyles.border};">${escapeHtml(projectLabel)}</td></tr>
        <tr><td style="padding:12px 16px;color:${emailStyles.accent};font-weight:600;">Gesprek gepland</td><td style="padding:12px 16px;">${escapeHtml(preferredDate)} om ${escapeHtml(preferredTime)}</td></tr>
      </table>
      <p style="margin:0;color:${emailStyles.muted};font-size:14px;">Heb je vragen? Mail naar <a href="mailto:${TO_EMAIL}" style="color:${emailStyles.accent};text-decoration:underline;">${TO_EMAIL}</a>.</p>
    </td></tr>
  </table>
</body>
</html>`;

    const fromAddress = `Blitzworx <${FROM_EMAIL}>`;

    const [{ error: leadError }, { error: clientError }] = await Promise.all([
      resend.emails.send({
        from: fromAddress,
        to: [TO_EMAIL],
        replyTo: [email.trim()],
        subject: `Lead: ${name.trim()} – ${projectLabel} – ${preferredDate} ${preferredTime}`,
        html: leadHtml,
      }),
      resend.emails.send({
        from: fromAddress,
        to: [email.trim()],
        subject: 'Bedankt voor je bericht – Blitzworx',
        html: clientHtml,
      }),
    ]);

    if (leadError) {
      console.error('Resend lead email error:', leadError);
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    if (clientError) {
      console.error('Resend client email error:', clientError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het versturen.' },
      { status: 500 }
    );
  }
}
