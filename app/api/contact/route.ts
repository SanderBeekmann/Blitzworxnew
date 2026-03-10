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

function emailShell(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Regular.woff') format('woff');font-weight:400}@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Bold.woff') format('woff');font-weight:700}</style></head><body style="margin:0;padding:0;background:#040711;font-family:'Gilroy',system-ui,sans-serif;font-size:16px;line-height:1.6;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td align="center" style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><!-- Header --><tr><td style="padding:40px 32px 32px;border-bottom:1px solid #545c52"><a href="https://blitzworx.nl" style="text-decoration:none;color:#fefadc;font-size:22px;font-weight:700;letter-spacing:0.5px;font-family:'Gilroy',system-ui,sans-serif">BLITZWORX</a></td></tr><!-- Content --><tr><td style="padding:32px">${content}</td></tr><!-- Footer --><tr><td style="padding:24px 32px;border-top:1px solid #545c52"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><p style="margin:0 0 8px;color:#8b8174;font-size:13px">Webdesign That Worx!</p><p style="margin:0;color:#545c52;font-size:12px">&copy; ${new Date().getFullYear()} BLITZWORX. Alle rechten voorbehouden.</p></td><td align="right" valign="top"><a href="https://blitzworx.nl" style="color:#cacaaa;font-size:13px;text-decoration:none">blitzworx.nl</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
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
  const content = `<h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#fefadc">Nieuwe lead</h1><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;width:120px;vertical-align:top">Project</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${safe.projectLabel}</td></tr><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">Naam</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${safe.name}</td></tr><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">E-mail</td><td style="padding:14px 0;border-bottom:1px solid #545c52"><a href="mailto:${safe.email}" style="color:#cacaaa;text-decoration:underline">${safe.email}</a></td></tr><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">Telefoon</td><td style="padding:14px 0;border-bottom:1px solid #545c52"><a href="tel:${phone.replace(/\D/g, '')}" style="color:#cacaaa;text-decoration:underline">${escapeHtml(phone)}</a></td></tr><tr><td style="padding:14px 0;color:#8b8174;font-size:14px;vertical-align:top">Gesprek</td><td style="padding:14px 0;color:#fefadc">${escapeHtml(preferredDate)} om ${escapeHtml(preferredTime)}</td></tr></table><p style="margin:24px 0 10px;color:#cacaaa;font-size:14px;font-weight:600">Bericht</p><div style="padding:16px 20px;background:#0d1117;border-left:3px solid #cacaaa;color:#fefadc;white-space:pre-wrap;font-size:15px">${safe.msg}</div>`;
  return emailShell(content);
}

function getBuiltInClientHtml(
  projectLabel: string,
  preferredDate: string,
  preferredTime: string
): string {
  const safe = { projectLabel: escapeHtml(projectLabel), preferredDate: escapeHtml(preferredDate), preferredTime: escapeHtml(preferredTime) };
  const content = `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fefadc">Bedankt voor je bericht!</h1><p style="margin:0 0 28px;color:#cacaaa;font-size:15px">Ik heb je aanvraag succesvol ontvangen en kijk uit naar ons gesprek op ${safe.preferredDate} om ${safe.preferredTime}!</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px"><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;width:140px">Project</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${safe.projectLabel}</td></tr><tr><td style="padding:14px 0;color:#8b8174;font-size:14px">Gesprek gepland</td><td style="padding:14px 0;color:#fefadc">${safe.preferredDate} om ${safe.preferredTime}</td></tr></table><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#cacaaa;padding:14px 28px;text-align:center"><a href="https://blitzworx.nl" style="color:#040711;font-size:15px;font-weight:600;text-decoration:none;font-family:'Gilroy',system-ui,sans-serif">Bekijk onze website</a></td></tr></table><p style="margin:28px 0 0;color:#8b8174;font-size:13px">Heb je vragen? Mail naar <a href="mailto:sander@blitzworx.nl" style="color:#cacaaa;text-decoration:underline">sander@blitzworx.nl</a></p>`;
  return emailShell(content);
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
    const { name, email, phone, company, message, projectType, preferredDate, preferredTime } = body;

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

      // Sync to AgencyOS contacts table (same database)
      try {
        const { data: existingContact } = await supabase
          .from('contacts')
          .select('id')
          .eq('email', emailNorm)
          .single();

        if (!existingContact) {
          const { data: newContact } = await supabase.from('contacts').insert({
            naam: name.trim(),
            email: emailNorm,
            bedrijf: company?.trim() || '-',
            telefoon: phone.trim(),
            status: 'lead',
            bron: 'formulier',
            notities: `${projectLabel} — ${message.trim()}`,
          }).select('id').single();

          if (newContact) {
            // Create follow-up task in AgencyOS
            await supabase.from('tasks').insert({
              titel: `Follow-up: ${name.trim()} — ${company?.trim() || 'blitzworx.nl'}`,
              type: 'follow_up',
              prioriteit: 'hoog',
              status: 'open',
              contact_id: newContact.id,
              deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            });

            // Log activity
            await supabase.from('activities').insert({
              type: 'notitie',
              inhoud: `Nieuwe lead via blitzworx.nl contactformulier: ${name.trim()}`,
              contact_id: newContact.id,
            });
          }
        }
      } catch (syncErr) {
        // Non-blocking: don't fail the form submission if AgencyOS sync fails
        console.error('AgencyOS contacts sync error:', syncErr);
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
