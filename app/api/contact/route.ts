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

function getBuiltInLeadHtml(
  projectLabel: string,
  name: string,
  email: string,
  phone: string,
  preferredDate: string,
  preferredTime: string,
  message: string
): string {
  const safe = { projectLabel: escapeHtml(projectLabel), name: escapeHtml(name), email: escapeHtml(email), phone: escapeHtml(phone.replace(/\s/g, '')), msg: escapeHtml(message).replace(/\n/g, '<br>') };
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Regular.woff') format('woff');font-weight:400}@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Bold.woff') format('woff');font-weight:700}</style></head><body style="margin:0;padding:0;background:#040711;font-family:'Gilroy',system-ui,sans-serif;font-size:16px;line-height:1.5;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td style="padding:32px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td><h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#fefadc">Nieuwe lead – Blitzworx</h1><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #545c52;border-radius:8px"><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Project</td><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#fefadc">${safe.projectLabel}</td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Naam</td><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#fefadc">${safe.name}</td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">E-mail</td><td style="padding:12px 16px;border-bottom:1px solid #545c52"><a href="mailto:${safe.email}" style="color:#cacaaa;text-decoration:underline">${safe.email}</a></td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Telefoon</td><td style="padding:12px 16px;border-bottom:1px solid #545c52"><a href="tel:${phone.replace(/\D/g, '')}" style="color:#cacaaa;text-decoration:underline">${escapeHtml(phone)}</a></td></tr><tr><td style="padding:12px 16px;color:#cacaaa;font-weight:600">Gesprek</td><td style="padding:12px 16px;color:#fefadc">${escapeHtml(preferredDate)} om ${escapeHtml(preferredTime)}</td></tr></table><p style="margin:20px 0 8px;color:#cacaaa;font-weight:600">Bericht</p><p style="margin:0;padding:16px;background:#545c52;border:1px solid #545c52;border-radius:8px;color:#fefadc;white-space:pre-wrap">${safe.msg}</p></td></tr></table></td></tr></table></body></html>`;
}

function getBuiltInClientHtml(
  projectLabel: string,
  preferredDate: string,
  preferredTime: string
): string {
  const safe = { projectLabel: escapeHtml(projectLabel), preferredDate: escapeHtml(preferredDate), preferredTime: escapeHtml(preferredTime) };
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Regular.woff') format('woff');font-weight:400}@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Bold.woff') format('woff');font-weight:700}</style></head><body style="margin:0;padding:0;background:#040711;font-family:'Gilroy',system-ui,sans-serif;font-size:16px;line-height:1.5;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td style="padding:32px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td><h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#fefadc">Bedankt voor je bericht!</h1><p style="margin:0 0 24px;color:#fefadc">We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact op.</p><h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#cacaaa">Samenvatting</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #545c52;border-radius:8px;margin-bottom:24px"><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Project</td><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#fefadc">${safe.projectLabel}</td></tr><tr><td style="padding:12px 16px;color:#cacaaa;font-weight:600">Gesprek gepland</td><td style="padding:12px 16px;color:#fefadc">${safe.preferredDate} om ${safe.preferredTime}</td></tr></table><p style="margin:0;color:#8b8174;font-size:14px">Heb je vragen? Mail naar <a href="mailto:sander@blitzworx.nl" style="color:#cacaaa;text-decoration:underline">sander@blitzworx.nl</a>.</p></td></tr></table></td></tr></table></body></html>`;
}

function fillTemplate(
  html: string,
  vars: Record<string, string>
): string {
  let out = html;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return out;
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
      const emailNorm = email.trim().toLowerCase();
      let clientId: string | null = null;

      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', emailNorm)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
        await supabase
          .from('clients')
          .update({ name: name.trim(), phone: phone.trim(), updated_at: new Date().toISOString() })
          .eq('id', clientId);
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            email: emailNorm,
            name: name.trim(),
            phone: phone.trim(),
          })
          .select('id')
          .single();

        if (clientError) {
          console.error('Supabase client insert error:', clientError);
          return NextResponse.json(
            { error: 'Kon aanvraag niet opslaan. Probeer het later opnieuw.' },
            { status: 500 }
          );
        }
        clientId = newClient?.id ?? null;
      }

      const { error: dbError } = await supabase.from('leads').insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        project_type: projectType ?? 'other',
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        phase: 'lead',
        client_id: clientId,
      });

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        return NextResponse.json(
          { error: 'Kon aanvraag niet opslaan. Probeer het later opnieuw.' },
          { status: 500 }
        );
      }
    }

    const templateVars: Record<string, string> = {
      name: escapeHtml(name.trim()),
      email: escapeHtml(email.trim()),
      phone: escapeHtml(phone.trim()),
      phoneTel: phone.replace(/\D/g, ''),
      message: escapeHtml(message.trim()).replace(/\n/g, '<br>'),
      projectLabel: escapeHtml(projectLabel),
      preferredDate: escapeHtml(preferredDate),
      preferredTime: escapeHtml(preferredTime),
    };

    let leadHtml: string;
    let clientHtml: string;
    let leadSubject: string;
    let clientSubject: string;

    if (supabase) {
      const { data: templates } = await supabase
        .from('email_templates')
        .select('slug, subject, html_body')
        .in('slug', ['lead_notification', 'client_confirmation']);

      const leadTpl = templates?.find((t) => t.slug === 'lead_notification');
      const clientTpl = templates?.find((t) => t.slug === 'client_confirmation');

      if (leadTpl?.html_body && clientTpl?.html_body) {
        leadHtml = fillTemplate(leadTpl.html_body, templateVars);
        clientHtml = fillTemplate(clientTpl.html_body, templateVars);
        leadSubject = fillTemplate(leadTpl.subject, templateVars);
        clientSubject = fillTemplate(clientTpl.subject, templateVars);
      } else {
        leadHtml = getBuiltInLeadHtml(projectLabel, name.trim(), email.trim(), phone.trim(), preferredDate, preferredTime, message.trim());
        clientHtml = getBuiltInClientHtml(projectLabel, preferredDate, preferredTime);
        leadSubject = `Lead: ${name.trim()} – ${projectLabel} – ${preferredDate} ${preferredTime}`;
        clientSubject = 'Bedankt voor je bericht – Blitzworx';
      }
    } else {
      leadHtml = getBuiltInLeadHtml(projectLabel, name.trim(), email.trim(), phone.trim(), preferredDate, preferredTime, message.trim());
      clientHtml = getBuiltInClientHtml(projectLabel, preferredDate, preferredTime);
      leadSubject = `Lead: ${name.trim()} – ${projectLabel} – ${preferredDate} ${preferredTime}`;
      clientSubject = 'Bedankt voor je bericht – Blitzworx';
    }

    const fromAddress = `Blitzworx <${FROM_EMAIL}>`;

    const [{ error: leadError }, { error: clientError }] = await Promise.all([
      resend.emails.send({
        from: fromAddress,
        to: [TO_EMAIL],
        replyTo: [email.trim()],
        subject: leadSubject,
        html: leadHtml,
      }),
      resend.emails.send({
        from: fromAddress,
        to: [email.trim()],
        subject: clientSubject,
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
