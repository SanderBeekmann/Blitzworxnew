import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { upsertSubscriber } from '@/lib/email';
import { fetchSite } from './site-fetcher';
import { runSeoChecks, SeoCheckResult, SeoSignals, AuditIssue } from './seo-checks';
import { runSecurityChecks, SecurityCheckResult, SecuritySignals } from './security-checks';
import { buildDynamicAdvice } from './advice-builder';
import { scrapeContent, ScrapedContent } from './content-scraper';
import { runAiAnalysis, AiAnalysisResult } from './ai-analyzer';

const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const PAGESPEED_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contact@blitzworx.nl';
const NOTIFY_EMAIL = 'sander@blitzworx.nl';
const CONSENT_TEXT_VERSION = 'v1-2026-04-11';
const MB_API_TOKEN = process.env.MONEYBIRD_API_TOKEN;
const MB_ADMIN_ID = process.env.MONEYBIRD_ADMINISTRATION_ID;

interface CategoryScore {
  id: string;
  label: string;
  score: number;
  advice: string;
}

interface DetailedCategory extends CategoryScore {
  issues: AuditIssue[];
}

const CATEGORY_TO_LIGHTHOUSE: Record<string, string[]> = {
  snelheid: ['performance'],
  seo: ['seo'],
  beveiliging: ['best-practices'],
  toegankelijkheid: ['accessibility'],
};

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

function clampScore(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10;
}

function extractSpeedScore(data: any): number {
  return clampScore((data.lighthouseResult?.categories?.performance?.score ?? 0) * 10);
}

function extractSeoScore(data: any): number {
  return clampScore((data.lighthouseResult?.categories?.seo?.score ?? 0) * 10);
}

function extractAccessibilityScore(data: any): number {
  return clampScore((data.lighthouseResult?.categories?.accessibility?.score ?? 0) * 10);
}

function extractSecurityScore(data: any): number {
  const finalUrl = data.lighthouseResult?.finalUrl ?? '';
  const isHttps = finalUrl.startsWith('https://');
  const audits = data.lighthouseResult?.audits ?? {};
  const httpsAudit = audits['is-on-https']?.score ?? (isHttps ? 1 : 0);
  const redirectsHttp = audits['redirects-http']?.score ?? 0;
  return clampScore(((httpsAudit + redirectsHttp + (isHttps ? 1 : 0)) / 3) * 10);
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();
}

function extractCategoryIssues(data: any, categoryId: string, maxIssues = 6): AuditIssue[] {
  const lighthouseCategories = CATEGORY_TO_LIGHTHOUSE[categoryId] || [];
  const issues: AuditIssue[] = [];
  const seen = new Set<string>();

  for (const lhCat of lighthouseCategories) {
    const category = data.lighthouseResult?.categories?.[lhCat];
    const auditRefs = category?.auditRefs ?? [];
    const audits = data.lighthouseResult?.audits ?? {};

    for (const ref of auditRefs) {
      const audit = audits[ref.id];
      if (!audit || seen.has(ref.id)) continue;
      if (audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'manual') continue;
      if (audit.score === null || audit.score === undefined) continue;
      if (audit.score >= 0.9) continue;

      seen.add(ref.id);
      issues.push({
        title: audit.title || ref.id,
        description: stripMarkdown(audit.description || ''),
        displayValue: audit.displayValue,
        score: audit.score,
      });
    }
  }

  issues.sort((a, b) => a.score - b.score);
  return issues.slice(0, maxIssues);
}

async function fetchPageSpeed(url: string): Promise<any | null> {
  if (!API_KEY) return null;

  const params = new URLSearchParams({
    url,
    key: API_KEY,
    strategy: 'mobile',
    category: 'performance',
  });
  ['accessibility', 'seo', 'best-practices'].forEach((c) => params.append('category', c));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`${PAGESPEED_URL}?${params}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('PageSpeed API error:', err);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    clearTimeout(timeout);
    console.error('PageSpeed fetch failed:', err?.message || err);
    return null;
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

function emailShell(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#040711;font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td align="center" style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:40px 32px 32px;border-bottom:1px solid #545c52"><a href="https://blitzworx.nl" style="text-decoration:none;color:#fefadc;font-size:22px;font-weight:700;letter-spacing:0.5px">BLITZWORX</a></td></tr><tr><td style="padding:32px">${content}</td></tr><tr><td style="padding:24px 32px;border-top:1px solid #545c52"><p style="margin:0 0 8px;color:#8b8174;font-size:13px">Webdesign That Worx!</p><p style="margin:0;color:#545c52;font-size:12px">&copy; ${new Date().getFullYear()} BLITZWORX. Alle rechten voorbehouden.</p></td></tr></table></td></tr></table></body></html>`;
}

function scoreBarColor(score: number): string {
  if (score < 4) return '#c45c5c';
  if (score < 7) return '#c4a85c';
  return '#cacaaa';
}

function buildIssuesList(issues: AuditIssue[]): string {
  if (issues.length === 0) {
    return '<p style="margin:8px 0 0;color:#cacaaa;font-size:13px;font-style:italic">Geen verbeterpunten gevonden in deze categorie.</p>';
  }

  return issues
    .map((issue) => {
      const displayValue = issue.displayValue
        ? `<span style="color:#c45c5c;font-weight:600;margin-left:6px">${escapeHtml(issue.displayValue)}</span>`
        : '';
      const description = issue.description
        ? `<p style="margin:4px 0 0;color:#8b8174;font-size:12px;line-height:1.5">${escapeHtml(issue.description).slice(0, 280)}</p>`
        : '';
      return `<div style="padding:12px 0;border-bottom:1px solid rgba(84,92,82,0.3)"><p style="margin:0;color:#fefadc;font-size:13px;font-weight:600">${escapeHtml(issue.title)}${displayValue}</p>${description}</div>`;
    })
    .join('');
}

function buildSignalsBlock(
  catId: string,
  seoSignals: SeoSignals | null,
  securitySignals: SecuritySignals | null
): string {
  if (catId === 'seo' && seoSignals) {
    const parts = [
      `Title: ${seoSignals.titleLength || 'afwezig'}${seoSignals.titleLength ? ' tekens' : ''}`,
      `Meta desc: ${seoSignals.metaDescriptionLength || 'afwezig'}${seoSignals.metaDescriptionLength ? ' tekens' : ''}`,
      `H1: ${seoSignals.h1Count}`,
      `Alt ontbreekt: ${seoSignals.imagesMissingAlt}/${seoSignals.totalImages}`,
      `Woorden: ${seoSignals.wordCount}`,
      `Canonical: ${seoSignals.hasCanonical ? 'ja' : 'nee'}`,
      `Schema: ${seoSignals.hasStructuredData ? 'ja' : 'nee'}`,
    ];
    return `<p style="margin:12px 0 0;padding:10px 12px;background:#040711;border-radius:2px;color:#8b8174;font-size:11px;font-family:monospace">${parts.join(' | ')}</p>`;
  }

  if (catId === 'beveiliging' && securitySignals) {
    const yn = (v: boolean) => (v ? 'ja' : 'nee');
    const parts = [
      `HTTPS: ${yn(securitySignals.httpsEnabled)}`,
      `HSTS: ${yn(securitySignals.hsts)}`,
      `CSP: ${yn(securitySignals.csp)}`,
      `X-Frame: ${yn(securitySignals.xFrameOptions)}`,
      `nosniff: ${yn(securitySignals.xContentTypeOptions)}`,
      `Referrer: ${yn(securitySignals.referrerPolicy)}`,
      `Permissions: ${yn(securitySignals.permissionsPolicy)}`,
    ];
    return `<p style="margin:12px 0 0;padding:10px 12px;background:#040711;border-radius:2px;color:#8b8174;font-size:11px;font-family:monospace">${parts.join(' | ')}</p>`;
  }

  return '';
}

function buildAiSummaryBlock(aiAnalysis: AiAnalysisResult | null): string {
  if (!aiAnalysis || !aiAnalysis.executiveSummary) return '';

  const summaryHtml = escapeHtml(aiAnalysis.executiveSummary)
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 14px;color:#fefadc;font-size:14px;line-height:1.7">${p}</p>`)
    .join('');

  return `<div style="margin-bottom:32px;padding:24px;background:#0d1117;border:1px solid #cacaaa;border-radius:4px"><p style="margin:0 0 12px;color:#cacaaa;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">AI Analyse</p>${summaryHtml}</div>`;
}

function buildContentFindingsBlock(aiAnalysis: AiAnalysisResult | null): string {
  if (!aiAnalysis?.contentFindings || aiAnalysis.contentFindings.length === 0) return '';

  const items = aiAnalysis.contentFindings
    .map((finding) => {
      const scoreColor = finding.score >= 4 ? '#cacaaa' : finding.score >= 3 ? '#c4a85c' : '#c45c5c';
      return `<div style="padding:16px 0;border-bottom:1px solid rgba(84,92,82,0.3)">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
          <p style="margin:0;color:#fefadc;font-size:15px;font-weight:700">${escapeHtml(finding.category)}</p>
          <p style="margin:0;color:${scoreColor};font-size:14px;font-weight:700">${finding.score}/5</p>
        </div>
        <p style="margin:0 0 6px;color:#cacaaa;font-size:13px;line-height:1.55">${escapeHtml(finding.observation)}</p>
        <p style="margin:0;color:#8b8174;font-size:12px;line-height:1.55;font-style:italic">${escapeHtml(finding.recommendation)}</p>
      </div>`;
    })
    .join('');

  return `<div style="margin-bottom:32px;padding:24px;background:#0d1117;border:1px solid #545c52;border-radius:4px"><p style="margin:0 0 12px;color:#cacaaa;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">Content & Marketing Review</p>${items}</div>`;
}

function buildReportHtml(
  url: string,
  overall: number,
  categories: DetailedCategory[],
  seoSignals: SeoSignals | null = null,
  securitySignals: SecuritySignals | null = null,
  aiAnalysis: AiAnalysisResult | null = null
): string {
  const categorySections = categories
    .map((cat) => {
      const color = scoreBarColor(cat.score);
      const pct = Math.round(cat.score * 10);
      const issuesList = buildIssuesList(cat.issues);
      const issuesHeader = cat.issues.length > 0
        ? `<p style="margin:16px 0 4px;color:#cacaaa;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700">Verbeterpunten (${cat.issues.length})</p>`
        : '';
      const signalsBlock = buildSignalsBlock(cat.id, seoSignals, securitySignals);
      return `<div style="margin-bottom:32px;padding:20px;background:#0d1117;border:1px solid #545c52;border-radius:4px"><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px"><p style="margin:0;color:#fefadc;font-size:18px;font-weight:700">${escapeHtml(cat.label)}</p><p style="margin:0;color:${color};font-size:20px;font-weight:700">${cat.score.toFixed(1)}<span style="color:#545c52;font-size:14px"> / 10</span></p></div><div style="height:6px;background:#1a1d28;border-radius:3px;overflow:hidden;margin:10px 0 14px"><div style="height:100%;width:${pct}%;background:${color}"></div></div><p style="margin:0;color:#cacaaa;font-size:13px;line-height:1.6">${escapeHtml(cat.advice)}</p>${signalsBlock}${issuesHeader}${issuesList}</div>`;
    })
    .join('');

  const overallColor = scoreBarColor(overall);
  const aiSummaryBlock = buildAiSummaryBlock(aiAnalysis);
  const contentFindingsBlock = buildContentFindingsBlock(aiAnalysis);
  const content = `<h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fefadc">Jouw website score rapport</h1><p style="margin:0 0 24px;color:#8b8174;font-size:14px">${escapeHtml(url)}</p><div style="padding:24px;background:#0d1117;border:1px solid #545c52;border-radius:4px;text-align:center;margin-bottom:32px"><p style="margin:0 0 4px;color:#8b8174;font-size:13px;text-transform:uppercase;letter-spacing:1px">Overall score</p><p style="margin:0;font-size:48px;font-weight:700;color:${overallColor};line-height:1">${overall.toFixed(1)}<span style="color:#545c52;font-size:24px"> / 10</span></p></div>${aiSummaryBlock}${contentFindingsBlock}${categorySections}<div style="margin-top:32px;padding:24px;background:#0d1117;border-left:3px solid #cacaaa"><p style="margin:0 0 8px;color:#fefadc;font-size:16px;font-weight:700">Wil je deze punten laten verbeteren?</p><p style="margin:0 0 16px;color:#cacaaa;font-size:14px;line-height:1.6">BlitzWorx bouwt websites die snel laden, goed scoren in Google en er professioneel uitzien op elk apparaat. Ik kijk samen met je naar de grootste knelpunten.</p><a href="https://blitzworx.nl/contact" style="display:inline-block;background:#cacaaa;padding:12px 24px;color:#040711;font-size:14px;font-weight:600;text-decoration:none;border-radius:2px">Plan een vrijblijvend gesprek</a></div><p style="margin:24px 0 0;color:#545c52;font-size:11px;text-align:center">Rapport gebaseerd op Google PageSpeed Insights + AI analyse</p>`;
  return emailShell(content);
}

async function sendReportEmail(
  email: string,
  url: string,
  overall: number,
  categories: DetailedCategory[],
  seoSignals: SeoSignals | null,
  securitySignals: SecuritySignals | null,
  aiAnalysis: AiAnalysisResult | null
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return;
  }

  const resend = new Resend(apiKey);
  const html = buildReportHtml(url, overall, categories, seoSignals, securitySignals, aiAnalysis);

  await resend.emails.send({
    from: `BlitzWorx <${FROM_EMAIL}>`,
    to: email,
    bcc: NOTIFY_EMAIL,
    subject: `Jouw website score voor ${url}: ${overall.toFixed(1)}/10`,
    html,
  });
}

function mergeIssues(lighthouseIssues: AuditIssue[], customIssues: AuditIssue[], max = 8): AuditIssue[] {
  const combined = [...customIssues, ...lighthouseIssues];
  combined.sort((a, b) => a.score - b.score);
  return combined.slice(0, max);
}

function buildDetailedCategories(
  scores: Record<string, number>,
  data: any | null,
  seoCheck: SeoCheckResult | null,
  securityCheck: SecurityCheckResult | null
): DetailedCategory[] {
  const labels: Record<string, string> = {
    snelheid: 'Snelheid',
    seo: 'SEO',
    beveiliging: 'Beveiliging',
    toegankelijkheid: 'Toegankelijkheid',
  };

  return Object.entries(labels).map(([id, label]) => {
    const lighthouseIssues = data ? extractCategoryIssues(data, id) : [];
    let issues = lighthouseIssues;

    if (id === 'seo' && seoCheck) {
      issues = mergeIssues(lighthouseIssues, seoCheck.issues);
    } else if (id === 'beveiliging' && securityCheck) {
      issues = mergeIssues(lighthouseIssues, securityCheck.issues);
    }

    const advice = buildDynamicAdvice(id, {
      score: scores[id],
      issues,
      seoSignals: id === 'seo' ? seoCheck?.signals : undefined,
      securitySignals: id === 'beveiliging' ? securityCheck?.signals : undefined,
    });

    return {
      id,
      label,
      score: scores[id],
      advice,
      issues,
    };
  });
}

function buildResponse(
  url: string,
  scores: Record<string, number>,
  scannedAt: string,
  data: any | null = null,
  seoCheck: SeoCheckResult | null = null,
  securityCheck: SecurityCheckResult | null = null,
  aiAnalysis: AiAnalysisResult | null = null
) {
  const categories: DetailedCategory[] = buildDetailedCategories(scores, data, seoCheck, securityCheck);

  const overall = clampScore(
    scores.snelheid * 0.40 +
    scores.seo * 0.30 +
    scores.beveiliging * 0.20 +
    scores.toegankelijkheid * 0.10
  );

  return {
    url,
    overall,
    categories,
    scannedAt,
    signals: {
      seo: seoCheck?.signals ?? null,
      security: securityCheck?.signals ?? null,
    },
    aiAnalysis,
  };
}

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

  // Check if a contact with this email already exists
  const searchRes = await fetch(
    `${mbBase}/contacts.json?query=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${MB_API_TOKEN}` } }
  );

  if (searchRes.ok) {
    const contacts = await searchRes.json();
    if (Array.isArray(contacts) && contacts.length > 0) {
      // Already in Moneybird - ensure "lead" category in metadata
      await supabase.from('contact_metadata').upsert(
        {
          moneybird_contact_id: contacts[0].id,
          category: 'lead',
          website: siteUrl,
        },
        { onConflict: 'moneybird_contact_id' }
      );
      return;
    }
  }

  // Create new contact in Moneybird
  const createRes = await fetch(`${mbBase}/contacts.json`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MB_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contact: {
        company_name: companyName,
        email,
        country: 'NL',
        delivery_method: 'Email',
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text().catch(() => '');
    console.error(`Moneybird create failed ${createRes.status}: ${errText}`);
    return;
  }

  const newContact = await createRes.json();

  // Tag as "lead" in dashboard's contact_metadata
  await supabase.from('contact_metadata').upsert(
    {
      moneybird_contact_id: newContact.id,
      category: 'lead',
      website: siteUrl,
    },
    { onConflict: 'moneybird_contact_id' }
  );
}

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

    if (!API_KEY) {
      return NextResponse.json({ error: 'Service tijdelijk niet beschikbaar.' }, { status: 503 });
    }

    // Parallel fetch: PageSpeed + our own site fetch (HTML + headers + robots + sitemap)
    const [pagespeedResult, siteData] = await Promise.allSettled([
      fetchPageSpeed(url),
      fetchSite(url),
    ]);

    if (pagespeedResult.status === 'rejected' || !pagespeedResult.value) {
      return NextResponse.json(
        { error: 'Kon de website niet analyseren. Controleer of het adres bereikbaar is.' },
        { status: 422 }
      );
    }

    const data = pagespeedResult.value;
    const site = siteData.status === 'fulfilled' ? siteData.value : null;

    // Run custom SEO + security checks on fetched HTML
    let seoCheck: SeoCheckResult | null = null;
    let securityCheck: SecurityCheckResult | null = null;
    let scrapedContent: ScrapedContent | null = null;

    if (site?.html) {
      try {
        seoCheck = runSeoChecks(site.html, url, site.robotsTxt, site.sitemapFound);
      } catch (err) {
        console.error('SEO checks failed:', err);
      }

      try {
        scrapedContent = scrapeContent(site.html, site.markdown, site.metadata);
      } catch (err) {
        console.error('Content scraping failed:', err);
      }
    }

    if (site?.headers) {
      try {
        securityCheck = runSecurityChecks(site.headers, site.finalUrl);
      } catch (err) {
        console.error('Security checks failed:', err);
      }
    }

    // Base Lighthouse scores
    const lighthouseScores = {
      snelheid: extractSpeedScore(data),
      seo: extractSeoScore(data),
      beveiliging: extractSecurityScore(data),
      toegankelijkheid: extractAccessibilityScore(data),
    };

    // Enrich SEO and security with our own checks (weighted average)
    const ownSeo = seoCheck
      ? (seoCheck.passedCount / seoCheck.totalChecks) * 10
      : lighthouseScores.seo;
    const ownSec = securityCheck
      ? (securityCheck.passedCount / securityCheck.totalChecks) * 10
      : lighthouseScores.beveiliging;

    const scores = {
      ...lighthouseScores,
      seo: clampScore(lighthouseScores.seo * 0.3 + ownSeo * 0.7),
      beveiliging: clampScore(lighthouseScores.beveiliging * 0.4 + ownSec * 0.6),
    };

    const overall = clampScore(
      scores.snelheid * 0.40 +
      scores.seo * 0.30 +
      scores.beveiliging * 0.20 +
      scores.toegankelijkheid * 0.10
    );

    // Collect all top issues across categories for AI context
    const topIssues: AuditIssue[] = [];
    if (seoCheck) topIssues.push(...seoCheck.issues);
    if (securityCheck) topIssues.push(...securityCheck.issues);
    topIssues.push(...extractCategoryIssues(data, 'snelheid'));
    topIssues.push(...extractCategoryIssues(data, 'toegankelijkheid'));
    topIssues.sort((a, b) => a.score - b.score);

    // Run AI analysis (parallel would require restructuring - doing sequentially but fast)
    let aiAnalysis: AiAnalysisResult | null = null;
    try {
      aiAnalysis = await runAiAnalysis(scrapedContent, url, overall, scores, topIssues.slice(0, 10));
    } catch (err) {
      console.error('AI analysis failed:', err);
    }

    const response = buildResponse(url, scores, new Date().toISOString(), data, seoCheck, securityCheck, aiAnalysis);

    // Store scan + cache the full response so the email agent can reference weak points
    let scanId: string | null = null;
    if (supabase) {
      const { data: scanRow } = await supabase
        .from('website_scans')
        .insert({
          url,
          email,
          score_overall: overall,
          score_speed: scores.snelheid,
          score_seo: scores.seo,
          score_security: scores.beveiliging,
          score_accessibility: scores.toegankelijkheid,
          newsletter_opted_in: newsletterOptIn,
          consent_text_version: newsletterOptIn ? CONSENT_TEXT_VERSION : null,
          consent_ip: newsletterOptIn ? consentIp : null,
          full_report: response,
        })
        .select('id')
        .single();
      scanId = scanRow?.id ?? null;
    }

    if (email) {
      try {
        await sendReportEmail(
          email,
          url,
          response.overall,
          response.categories,
          seoCheck?.signals ?? null,
          securityCheck?.signals ?? null,
          aiAnalysis
        );
      } catch (err) {
        console.error('Failed to send report email:', err);
      }
    }

    if (email && newsletterOptIn) {
      // Active opt-in: upsertSubscriber will re-activate a previously unsubscribed
      // email because the user just explicitly re-consented via the checkbox.
      try {
        await upsertSubscriber(email, null, 'website_score', url, ['website_score', 'newsletter']);
      } catch (err) {
        console.error('Newsletter subscribe failed:', err);
      }
    }

    // Enroll the lead in the nurture sequence. Step 1 is the transactional
    // report above; step 2 goes out 2 days later via the dashboard email agent.
    if (email && supabase) {
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
    }

    // Auto-create CRM lead in Moneybird + contact_metadata
    if (email && supabase) {
      try {
        await createCrmLead(email, url);
      } catch (err) {
        console.error('CRM lead creation failed:', err);
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error('Website score API error:', err);
    return NextResponse.json({ error: 'Er ging iets mis. Probeer het later opnieuw.' }, { status: 500 });
  }
}
