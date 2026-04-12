import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { upsertSubscriber } from '@/lib/email';
import type { AuditIssue } from './seo-checks';
import type { AiAnalysisResult } from './ai-analyzer';
import type { SeoSignals } from './seo-checks';
import type { SecuritySignals } from './security-checks';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contact@blitzworx.nl';
const NOTIFY_EMAIL = 'sander@blitzworx.nl';
const CONSENT_TEXT_VERSION = 'v1-2026-04-11';
const MB_API_TOKEN = process.env.MONEYBIRD_API_TOKEN;
const MB_ADMIN_ID = process.env.MONEYBIRD_ADMINISTRATION_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(/\/$/, '');
}

function isBlockedDomain(url: string): boolean {
  const { hostname } = new URL(url);
  const blocked = ['localhost', '127.0.0.1', '0.0.0.0'];
  if (blocked.includes(hostname)) return true;
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(hostname)) return true;
  return false;
}

// ── GET: Poll job status ──
export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId parameter.' }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Service niet beschikbaar.' }, { status: 503 });
  }

  const { data: job, error } = await supabase
    .from('website_score_jobs')
    .select('status, result, error')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job niet gevonden.' }, { status: 404 });
  }

  if (job.status === 'completed') {
    return NextResponse.json({ status: 'completed', result: job.result });
  }

  if (job.status === 'failed') {
    return NextResponse.json({ status: 'failed', error: job.error || 'Analyse mislukt.' });
  }

  return NextResponse.json({ status: job.status });
}

// ── POST: Start job OR unlock with email ──
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = body.url;
    const email = body.email?.trim() || null;
    const newsletterOptIn = body.newsletterOptIn === true;
    const consentIp = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || null;

    if (!rawUrl?.trim()) {
      return NextResponse.json({ error: 'Vul een URL in.' }, { status: 400 });
    }

    let url: string;
    try {
      url = normalizeUrl(rawUrl);
    } catch {
      return NextResponse.json({ error: 'Ongeldige URL. Controleer het adres en probeer opnieuw.' }, { status: 400 });
    }

    if (isBlockedDomain(url)) {
      return NextResponse.json({ error: 'Deze URL kan niet worden geanalyseerd.' }, { status: 400 });
    }

    // ── Email unlock flow (results already exist) ──
    if (email && body.jobId) {
      return handleEmailUnlock(body.jobId, email, url, newsletterOptIn, consentIp);
    }

    // ── Start new analysis job ──
    if (!supabase) {
      return NextResponse.json({ error: 'Service niet beschikbaar.' }, { status: 503 });
    }

    // Create job record
    const { data: job, error: insertError } = await supabase
      .from('website_score_jobs')
      .insert({ url, status: 'pending' })
      .select('id')
      .single();

    if (insertError || !job) {
      console.error('Failed to create job:', insertError);
      return NextResponse.json({ error: 'Kon analyse niet starten.' }, { status: 500 });
    }

    // Trigger background function (fire-and-forget)
    fetch(`${SITE_URL}/.netlify/functions/website-score-worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id, url }),
    }).catch((err) => {
      console.error('Failed to trigger worker:', err);
    });

    return NextResponse.json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Website score API error:', err);
    return NextResponse.json({ error: 'Er ging iets mis. Probeer het later opnieuw.' }, { status: 500 });
  }
}

// ── Email unlock: send report + enroll sequences ──
async function handleEmailUnlock(
  jobId: string,
  email: string,
  url: string,
  newsletterOptIn: boolean,
  consentIp: string | null
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service niet beschikbaar.' }, { status: 503 });
  }

  // Fetch the completed job result
  const { data: job } = await supabase
    .from('website_score_jobs')
    .select('result')
    .eq('id', jobId)
    .eq('status', 'completed')
    .single();

  if (!job?.result) {
    return NextResponse.json({ error: 'Resultaten niet gevonden.' }, { status: 404 });
  }

  const response = job.result;

  // Store in website_scans
  let scanId: string | null = null;
  const { data: scanRow } = await supabase
    .from('website_scans')
    .insert({
      url,
      email,
      score_overall: response.overall,
      score_speed: response.categories?.find((c: any) => c.id === 'snelheid')?.score ?? 0,
      score_seo: response.categories?.find((c: any) => c.id === 'seo')?.score ?? 0,
      score_security: response.categories?.find((c: any) => c.id === 'beveiliging')?.score ?? 0,
      score_accessibility: response.categories?.find((c: any) => c.id === 'toegankelijkheid')?.score ?? 0,
      newsletter_opted_in: newsletterOptIn,
      consent_text_version: newsletterOptIn ? CONSENT_TEXT_VERSION : null,
      consent_ip: newsletterOptIn ? consentIp : null,
      full_report: response,
    })
    .select('id')
    .single();
  scanId = scanRow?.id ?? null;

  // Send email report
  try {
    await sendReportEmail(email, url, response);
  } catch (err) {
    console.error('Failed to send report email:', err);
  }

  // Newsletter subscription
  if (newsletterOptIn) {
    try {
      await upsertSubscriber(email, null, 'website_score', url, ['website_score', 'newsletter']);
    } catch (err) {
      console.error('Newsletter subscribe failed:', err);
    }
  }

  // Email sequence enrollment
  try {
    const nextSendAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('email_sequences').insert({
      scan_id: scanId,
      email,
      url,
      status: 'active',
      current_step: 2,
      next_send_at: nextSendAt,
    });
  } catch (err) {
    console.error('Sequence enrollment failed:', err);
  }

  // CRM lead
  try {
    await createCrmLead(email, url);
  } catch (err) {
    console.error('CRM lead creation failed:', err);
  }

  return NextResponse.json({ ok: true });
}

// ── Email rendering ──
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function emailShell(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#040711;font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td align="center" style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:40px 32px 32px;border-bottom:1px solid #545c52"><a href="https://blitzworx.nl" style="text-decoration:none;color:#fefadc;font-size:22px;font-weight:700;letter-spacing:0.5px">BLITZWORX</a></td></tr><tr><td style="padding:32px">${content}</td></tr><tr><td style="padding:24px 32px;border-top:1px solid #545c52"><p style="margin:0 0 8px;color:#8b8174;font-size:13px">Webdesign That Worx!</p><p style="margin:0;color:#545c52;font-size:12px">&copy; ${new Date().getFullYear()} BLITZWORX. Alle rechten voorbehouden.</p></td></tr></table></td></tr></table></body></html>`;
}

function scoreBarColor(score: number): string {
  if (score < 4) return '#c45c5c';
  if (score < 7) return '#c4a85c';
  return '#cacaaa';
}

async function sendReportEmail(email: string, url: string, response: any): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return;
  }

  const resend = new Resend(apiKey);
  const overall = response.overall;
  const categories = response.categories || [];
  const aiAnalysis = response.aiAnalysis || null;

  const categorySections = categories
    .map((cat: any) => {
      const color = scoreBarColor(cat.score);
      const pct = Math.round(cat.score * 10);
      const issuesList = (cat.issues || [])
        .map((issue: AuditIssue) => {
          const dv = issue.displayValue ? `<span style="color:#c45c5c;font-weight:600;margin-left:6px">${escapeHtml(issue.displayValue)}</span>` : '';
          const desc = issue.description ? `<p style="margin:4px 0 0;color:#8b8174;font-size:12px;line-height:1.5">${escapeHtml(issue.description).slice(0, 280)}</p>` : '';
          return `<div style="padding:12px 0;border-bottom:1px solid rgba(84,92,82,0.3)"><p style="margin:0;color:#fefadc;font-size:13px;font-weight:600">${escapeHtml(issue.title)}${dv}</p>${desc}</div>`;
        })
        .join('');
      const issuesHeader = cat.issues?.length > 0
        ? `<p style="margin:16px 0 4px;color:#cacaaa;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700">Verbeterpunten (${cat.issues.length})</p>`
        : '';
      return `<div style="margin-bottom:32px;padding:20px;background:#0d1117;border:1px solid #545c52;border-radius:4px"><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px"><p style="margin:0;color:#fefadc;font-size:18px;font-weight:700">${escapeHtml(cat.label)}</p><p style="margin:0;color:${color};font-size:20px;font-weight:700">${cat.score.toFixed(1)}<span style="color:#545c52;font-size:14px"> / 10</span></p></div><div style="height:6px;background:#1a1d28;border-radius:3px;overflow:hidden;margin:10px 0 14px"><div style="height:100%;width:${pct}%;background:${color}"></div></div><p style="margin:0;color:#cacaaa;font-size:13px;line-height:1.6">${escapeHtml(cat.advice || '')}</p>${issuesHeader}${issuesList}</div>`;
    })
    .join('');

  const overallColor = scoreBarColor(overall);

  let aiBlock = '';
  if (aiAnalysis?.executiveSummary) {
    const summaryHtml = escapeHtml(aiAnalysis.executiveSummary).split(/\n\n+/).map((p: string) => `<p style="margin:0 0 14px;color:#fefadc;font-size:14px;line-height:1.7">${p}</p>`).join('');
    aiBlock = `<div style="margin-bottom:32px;padding:24px;background:#0d1117;border:1px solid #cacaaa;border-radius:4px"><p style="margin:0 0 12px;color:#cacaaa;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">AI Analyse</p>${summaryHtml}</div>`;
  }

  let findingsBlock = '';
  if (aiAnalysis?.contentFindings?.length > 0) {
    const items = aiAnalysis.contentFindings.map((f: any) => {
      const sc = f.score >= 4 ? '#cacaaa' : f.score >= 3 ? '#c4a85c' : '#c45c5c';
      return `<div style="padding:16px 0;border-bottom:1px solid rgba(84,92,82,0.3)"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px"><p style="margin:0;color:#fefadc;font-size:15px;font-weight:700">${escapeHtml(f.category)}</p><p style="margin:0;color:${sc};font-size:14px;font-weight:700">${f.score}/5</p></div><p style="margin:0 0 6px;color:#cacaaa;font-size:13px;line-height:1.55">${escapeHtml(f.observation)}</p><p style="margin:0;color:#8b8174;font-size:12px;line-height:1.55;font-style:italic">${escapeHtml(f.recommendation)}</p></div>`;
    }).join('');
    findingsBlock = `<div style="margin-bottom:32px;padding:24px;background:#0d1117;border:1px solid #545c52;border-radius:4px"><p style="margin:0 0 12px;color:#cacaaa;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">Content & Marketing Review</p>${items}</div>`;
  }

  const content = `<h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fefadc">Jouw website score rapport</h1><p style="margin:0 0 24px;color:#8b8174;font-size:14px">${escapeHtml(url)}</p><div style="padding:24px;background:#0d1117;border:1px solid #545c52;border-radius:4px;text-align:center;margin-bottom:32px"><p style="margin:0 0 4px;color:#8b8174;font-size:13px;text-transform:uppercase;letter-spacing:1px">Overall score</p><p style="margin:0;font-size:48px;font-weight:700;color:${overallColor};line-height:1">${overall.toFixed(1)}<span style="color:#545c52;font-size:24px"> / 10</span></p></div>${aiBlock}${findingsBlock}${categorySections}<div style="margin-top:32px;padding:24px;background:#0d1117;border-left:3px solid #cacaaa"><p style="margin:0 0 8px;color:#fefadc;font-size:16px;font-weight:700">Wil je deze punten laten verbeteren?</p><p style="margin:0 0 16px;color:#cacaaa;font-size:14px;line-height:1.6">BlitzWorx bouwt websites die snel laden, goed scoren in Google en er professioneel uitzien op elk apparaat. Ik kijk samen met je naar de grootste knelpunten.</p><a href="https://blitzworx.nl/contact" style="display:inline-block;background:#cacaaa;padding:12px 24px;color:#040711;font-size:14px;font-weight:600;text-decoration:none;border-radius:2px">Plan een vrijblijvend gesprek</a></div>`;

  await resend.emails.send({
    from: `BlitzWorx <${FROM_EMAIL}>`,
    to: email,
    bcc: NOTIFY_EMAIL,
    subject: `Jouw website score voor ${url}: ${overall.toFixed(1)}/10`,
    html: emailShell(content),
  });
}

// ── CRM lead creation ──
function domainToCompanyName(siteUrl: string): string {
  try {
    const hostname = new URL(siteUrl).hostname.replace(/^www\./, '');
    const parts = hostname.split('.');
    return parts.length > 1 ? parts.slice(0, -1).join('.') : hostname;
  } catch {
    return siteUrl;
  }
}

async function createCrmLead(email: string, siteUrl: string): Promise<void> {
  if (!MB_API_TOKEN || !MB_ADMIN_ID || !supabase) return;

  const companyName = domainToCompanyName(siteUrl);
  const mbBase = `https://moneybird.com/api/v2/${MB_ADMIN_ID}`;

  const searchRes = await fetch(
    `${mbBase}/contacts.json?query=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${MB_API_TOKEN}` } }
  );

  if (searchRes.ok) {
    const contacts = await searchRes.json();
    if (Array.isArray(contacts) && contacts.length > 0) {
      await supabase.from('contact_metadata').upsert(
        { moneybird_contact_id: contacts[0].id, category: 'lead', website: siteUrl },
        { onConflict: 'moneybird_contact_id' }
      );
      return;
    }
  }

  const createRes = await fetch(`${mbBase}/contacts.json`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MB_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: { company_name: companyName, email, country: 'NL', delivery_method: 'Email' } }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text().catch(() => '');
    console.error(`Moneybird create failed ${createRes.status}: ${errText}`);
    return;
  }

  const newContact = await createRes.json();
  await supabase.from('contact_metadata').upsert(
    { moneybird_contact_id: newContact.id, category: 'lead', website: siteUrl },
    { onConflict: 'moneybird_contact_id' }
  );
}
