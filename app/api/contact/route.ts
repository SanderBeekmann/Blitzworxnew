import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const TO_EMAIL = 'sander@blitzworx.nl';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contact@blitzworx.nl';

const PROJECT_LABELS: Record<string, string> = {
  website: 'Nieuwe website',
  redesign: 'Website redesign',
  branding: 'Branding / huisstijl',
  diensten: 'Diensten aanvraag',
  other: 'Anders',
};

function getProjectLabel(projectType: string): string {
  if (PROJECT_LABELS[projectType]) return PROJECT_LABELS[projectType];
  if (projectType.startsWith('onderhoud-')) return 'Onderhoudspakket';
  const parts = projectType.split(', ').map((p) => PROJECT_LABELS[p] ?? p);
  return parts.join(', ');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function emailShell(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#040711;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td align="center" style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:40px 32px 32px;border-bottom:1px solid #545c52"><a href="https://blitzworx.nl" style="text-decoration:none;color:#fefadc;font-size:22px;font-weight:700;letter-spacing:0.5px">BLITZWORX</a></td></tr><tr><td style="padding:32px">${content}</td></tr><tr><td style="padding:24px 32px;border-top:1px solid #545c52"><p style="margin:0 0 8px;color:#8b8174;font-size:13px">Webdesign That Worx!</p><p style="margin:0;color:#545c52;font-size:12px">&copy; ${new Date().getFullYear()} BLITZWORX. Alle rechten voorbehouden.</p></td></tr></table></td></tr></table></body></html>`;
}

function buildLeadHtml(args: {
  projectLabel: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
}): string {
  const s = {
    projectLabel: escapeHtml(args.projectLabel),
    name: escapeHtml(args.name),
    email: escapeHtml(args.email),
    phone: escapeHtml(args.phone),
    phoneTel: args.phone.replace(/\D/g, ''),
    company: escapeHtml(args.company),
    message: escapeHtml(args.message).replace(/\n/g, '<br>'),
    when: args.preferredDate && args.preferredTime
      ? `${escapeHtml(args.preferredDate)} om ${escapeHtml(args.preferredTime)}`
      : 'Geen afspraak gepland',
  };
  const content = `<h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#fefadc">Nieuwe lead</h1><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;width:120px;vertical-align:top">Project</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${s.projectLabel}</td></tr><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">Naam</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${s.name}</td></tr>${s.company ? `<tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">Bedrijf</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${s.company}</td></tr>` : ''}<tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">E-mail</td><td style="padding:14px 0;border-bottom:1px solid #545c52"><a href="mailto:${s.email}" style="color:#cacaaa;text-decoration:underline">${s.email}</a></td></tr><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;vertical-align:top">Telefoon</td><td style="padding:14px 0;border-bottom:1px solid #545c52"><a href="tel:${s.phoneTel}" style="color:#cacaaa;text-decoration:underline">${s.phone}</a></td></tr><tr><td style="padding:14px 0;color:#8b8174;font-size:14px;vertical-align:top">Gesprek</td><td style="padding:14px 0;color:#fefadc">${s.when}</td></tr></table><p style="margin:24px 0 10px;color:#cacaaa;font-size:14px;font-weight:600">Bericht</p><div style="padding:16px 20px;background:#0d1117;border-left:3px solid #cacaaa;color:#fefadc;white-space:pre-wrap;font-size:15px">${s.message}</div>`;
  return emailShell(content);
}

function buildClientHtml(args: {
  projectLabel: string;
  preferredDate: string;
  preferredTime: string;
  isService: boolean;
}): string {
  const s = {
    projectLabel: escapeHtml(args.projectLabel),
    preferredDate: escapeHtml(args.preferredDate),
    preferredTime: escapeHtml(args.preferredTime),
  };
  const hasMeeting = Boolean(args.preferredDate && args.preferredTime);

  const intro = args.isService
    ? `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fefadc">Bedankt voor je aanvraag!</h1><p style="margin:0 0 28px;color:#cacaaa;font-size:15px">Ik heb je aanvraag ontvangen en neem binnen 1 werkdag contact met je op.</p>`
    : hasMeeting
      ? `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fefadc">Bedankt voor je bericht!</h1><p style="margin:0 0 28px;color:#cacaaa;font-size:15px">Ik heb je aanvraag ontvangen en kijk uit naar ons gesprek op ${s.preferredDate} om ${s.preferredTime}.</p>`
      : `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fefadc">Bedankt voor je bericht!</h1><p style="margin:0 0 28px;color:#cacaaa;font-size:15px">Ik heb je bericht ontvangen en neem zo snel mogelijk contact met je op.</p>`;

  const detailRow = hasMeeting
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px"><tr><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#8b8174;font-size:14px;width:140px">Project</td><td style="padding:14px 0;border-bottom:1px solid #545c52;color:#fefadc">${s.projectLabel}</td></tr><tr><td style="padding:14px 0;color:#8b8174;font-size:14px">Gesprek gepland</td><td style="padding:14px 0;color:#fefadc">${s.preferredDate} om ${s.preferredTime}</td></tr></table>`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px"><tr><td style="padding:14px 0;color:#8b8174;font-size:14px;width:140px">Aangevraagd</td><td style="padding:14px 0;color:#fefadc">${s.projectLabel}</td></tr></table>`;

  const content = `${intro}${detailRow}<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#cacaaa;padding:14px 28px;text-align:center"><a href="https://blitzworx.nl" style="color:#040711;font-size:15px;font-weight:600;text-decoration:none">Bekijk onze website</a></td></tr></table><p style="margin:28px 0 0;color:#8b8174;font-size:13px">Heb je vragen? Mail naar <a href="mailto:sander@blitzworx.nl" style="color:#cacaaa;text-decoration:underline">sander@blitzworx.nl</a></p>`;
  return emailShell(content);
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const eh = Math.min(23, Math.floor(total / 60));
  const em = total % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

function generatePlaceholderId(): string {
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapOnboardingType(
  projectType: string
): 'website' | 'webshop' | 'app' | 'automatisering' {
  if (projectType === 'diensten' || projectType.startsWith('onderhoud-')) {
    return 'automatisering';
  }
  return 'website';
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_xxxx')) {
    return NextResponse.json(
      { error: 'E-mail configuratie ontbreekt.' },
      { status: 503 }
    );
  }
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database niet geconfigureerd.' },
      { status: 503 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag.' }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const projectType = typeof body.projectType === 'string' ? body.projectType : '';
  const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate : '';
  const preferredTime = typeof body.preferredTime === 'string' ? body.preferredTime : '';

  if (!name || !email || !phone || !message || !projectType) {
    return NextResponse.json(
      { error: 'Naam, e-mail, telefoon, bericht en project zijn verplicht.' },
      { status: 400 }
    );
  }

  const isService = projectType === 'diensten' || projectType.startsWith('onderhoud-');
  const hasMeeting = Boolean(preferredDate && preferredTime);

  if (!isService && !hasMeeting) {
    return NextResponse.json(
      { error: 'Kies een datum en tijd voor je gesprek.' },
      { status: 400 }
    );
  }

  const projectLabel = getProjectLabel(projectType);
  const emailNorm = email.toLowerCase();

  // Check of we deze lead al kennen (op email in raw_lead_data)
  let moneybirdContactId: string | null = null;
  const { data: existingMetadata } = await supabase
    .from('contact_metadata')
    .select('moneybird_contact_id, raw_lead_data')
    .contains('raw_lead_data', { email: emailNorm })
    .limit(1)
    .maybeSingle();

  if (existingMetadata) {
    moneybirdContactId = existingMetadata.moneybird_contact_id;
  } else {
    moneybirdContactId = generatePlaceholderId();
  }

  const rawLeadData = {
    name,
    email: emailNorm,
    phone,
    company: company || null,
    source: 'website_contact_form',
    last_project_type: projectType,
    last_submitted_at: new Date().toISOString(),
  };

  const notes = [
    `Contactformulier: ${projectLabel}`,
    company ? `Bedrijf: ${company}` : null,
    hasMeeting
      ? `Gesprek gepland: ${preferredDate} om ${preferredTime}`
      : null,
    '',
    'Bericht:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const { error: metaErr } = await supabase
    .from('contact_metadata')
    .upsert(
      {
        moneybird_contact_id: moneybirdContactId,
        category: hasMeeting ? 'opvolgen' : 'prospect',
        notes,
        raw_lead_data: rawLeadData,
        last_interaction_date: new Date().toISOString(),
      },
      { onConflict: 'moneybird_contact_id' }
    );
  if (metaErr) {
    console.error('contact_metadata upsert error:', metaErr);
    return NextResponse.json(
      { error: 'Kon aanvraag niet opslaan. Probeer het later opnieuw.' },
      { status: 500 }
    );
  }

  if (hasMeeting) {
    const { error: evtErr } = await supabase.from('calendar_events').insert({
      titel: `Intake ${name} (${projectLabel})`,
      beschrijving: message.slice(0, 500),
      datum: preferredDate,
      start_tijd: preferredTime,
      eind_tijd: addMinutes(preferredTime, 30),
      type: 'meeting',
      status: 'gepland',
      event_category: 'crm',
      moneybird_contact_id: moneybirdContactId,
    });
    if (evtErr) console.error('calendar_events insert error:', evtErr);
  }

  const { data: existingSession } = await supabase
    .from('onboarding_sessions')
    .select('id')
    .eq('client_email', email)
    .in('status', ['pending', 'questionnaire_sent'])
    .maybeSingle();

  if (!existingSession) {
    const { error: obErr } = await supabase.from('onboarding_sessions').insert({
      client_name: name,
      client_email: email,
      company_name: company || null,
      project_type: mapOnboardingType(projectType),
      notes,
      status: 'pending',
      questions: null,
      moneybird_contact_id: moneybirdContactId,
    });
    if (obErr) console.error('onboarding_sessions insert error:', obErr);
  }

  await supabase.from('notifications').insert({
    type: 'agent_event',
    title: `Nieuwe lead: ${company || name}`,
    body: `${projectLabel}${hasMeeting ? ` - ${preferredDate} ${preferredTime}` : ''}\n\n${message.slice(0, 200)}`,
    source: 'website-contact',
    severity: 'info',
    action_type: 'navigate',
    action_payload: { url: `/crm/${moneybirdContactId}` },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress = `Blitzworx <${FROM_EMAIL}>`;

  const leadSubjectBase = `Lead: ${name} - ${projectLabel}`;
  const leadSubject = hasMeeting
    ? `${leadSubjectBase} - ${preferredDate} ${preferredTime}`
    : leadSubjectBase;
  const clientSubject = isService
    ? 'Bedankt voor je aanvraag - Blitzworx'
    : 'Bedankt voor je bericht - Blitzworx';

  const leadHtml = buildLeadHtml({
    projectLabel,
    name,
    email,
    phone,
    company,
    message,
    preferredDate,
    preferredTime,
  });
  const clientHtml = buildClientHtml({
    projectLabel,
    preferredDate,
    preferredTime,
    isService,
  });

  const [leadResult, clientResult] = await Promise.all([
    resend.emails.send({
      from: fromAddress,
      to: [TO_EMAIL],
      replyTo: [email],
      subject: leadSubject,
      html: leadHtml,
    }),
    resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: clientSubject,
      html: clientHtml,
    }),
  ]);

  if (leadResult.error) {
    console.error('Resend lead email error:', leadResult.error);
    return NextResponse.json({ error: leadResult.error.message }, { status: 500 });
  }
  if (clientResult.error) {
    console.error('Resend client email error:', clientResult.error);
  }

  return NextResponse.json({ success: true });
}
