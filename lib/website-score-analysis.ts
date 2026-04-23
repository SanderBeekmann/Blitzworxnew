/**
 * Standalone website score analysis module.
 * No Next.js dependencies - can be used from Netlify functions.
 */

import Anthropic from '@anthropic-ai/sdk';
import FirecrawlApp from '@mendable/firecrawl-js';
import * as cheerio from 'cheerio';

// ── Types ──

export interface AuditIssue {
  title: string;
  description: string;
  displayValue?: string;
  score: number;
}

export interface ContentFinding {
  category: string;
  score: number;
  observation: string;
  recommendation: string;
}

export interface AiAnalysisResult {
  executiveSummary: string;
  contentFindings: ContentFinding[];
}

interface SeoSignals {
  titleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  totalImages: number;
  imagesMissingAlt: number;
  wordCount: number;
  hasCanonical: boolean;
  hasStructuredData: boolean;
  hasViewportMeta: boolean;
  hasLangAttribute: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  internalLinkCount: number;
  externalLinkCount: number;
}

interface SecuritySignals {
  httpsEnabled: boolean;
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
  permissionsPolicy: boolean;
}

interface DetailedCategory {
  id: string;
  label: string;
  score: number;
  advice: string;
  issues: AuditIssue[];
}

export interface AnalysisResult {
  url: string;
  overall: number;
  categories: DetailedCategory[];
  scannedAt: string;
  signals: {
    seo: SeoSignals | null;
    security: SecuritySignals | null;
  };
  aiAnalysis: AiAnalysisResult | null;
}

// ── Score helpers ──

function clampScore(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10;
}

// Map a CrUX overall_category to a 0-10 score. Deterministic field data.
function cruxCategoryToScore(category: string | undefined): number | null {
  if (category === 'FAST') return 9;
  if (category === 'AVERAGE') return 6;
  if (category === 'SLOW') return 3;
  return null;
}

const CATEGORY_TO_LIGHTHOUSE: Record<string, string[]> = {
  snelheid: ['performance'],
  seo: ['seo'],
  beveiliging: ['best-practices'],
  toegankelijkheid: ['accessibility'],
};

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();
}

// ── PageSpeed ──

async function fetchPageSpeed(url: string, apiKey: string): Promise<any | null> {
  const params = new URLSearchParams({ url, key: apiKey, strategy: 'mobile', category: 'performance' });
  ['accessibility', 'seo', 'best-practices'].forEach((c) => params.append('category', c));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

function extractScores(data: any) {
  // Snelheid: prefer CrUX field data (deterministic 28-day window). Fall back to Lighthouse lab score.
  const lhSpeed = clampScore((data.lighthouseResult?.categories?.performance?.score ?? 0) * 10);
  const cruxCategory =
    data.loadingExperience?.overall_category || data.originLoadingExperience?.overall_category;
  const cruxScore = cruxCategoryToScore(cruxCategory);
  const speed = cruxScore !== null ? clampScore(cruxScore * 0.6 + lhSpeed * 0.4) : lhSpeed;

  const seo = clampScore((data.lighthouseResult?.categories?.seo?.score ?? 0) * 10);
  const accessibility = clampScore((data.lighthouseResult?.categories?.accessibility?.score ?? 0) * 10);

  const finalUrl = data.lighthouseResult?.finalUrl ?? '';
  const isHttps = finalUrl.startsWith('https://');
  const audits = data.lighthouseResult?.audits ?? {};
  const httpsAudit = audits['is-on-https']?.score ?? (isHttps ? 1 : 0);
  const redirectsHttp = audits['redirects-http']?.score ?? 0;
  const security = clampScore(((httpsAudit + redirectsHttp + (isHttps ? 1 : 0)) / 3) * 10);

  return { snelheid: speed, seo, beveiliging: security, toegankelijkheid: accessibility };
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
      if (audit.score === null || audit.score === undefined || audit.score >= 0.9) continue;

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

// ── Site fetching ──

interface SiteResult {
  html: string | null;
  markdown: string | null;
  metadata: any;
  headers: Record<string, string>;
  finalUrl: string;
  robotsTxt: string | null;
  sitemapFound: boolean;
}

async function fetchSiteContent(url: string): Promise<SiteResult | null> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  let html: string | null = null;
  let markdown: string | null = null;
  let metadata: any = null;
  let headers: Record<string, string> = {};
  let finalUrl = url;
  let robotsTxt: string | null = null;
  let sitemapFound = false;

  // Try Firecrawl first
  if (firecrawlKey) {
    try {
      const app = new FirecrawlApp({ apiKey: firecrawlKey });
      const result = await app.scrape(url, {
        formats: ['html', 'markdown'],
        onlyMainContent: false,
        timeout: 30000,
      });
      html = (result as any).html || null;
      markdown = (result as any).markdown || null;
      metadata = (result as any).metadata || null;
    } catch (err) {
      console.error('Firecrawl failed, falling back:', err);
    }
  }

  // Fallback: direct fetch
  if (!html) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'BlitzWorx-Scanner/1.0' },
        redirect: 'follow',
      });
      clearTimeout(timeout);
      finalUrl = res.url;
      html = await res.text();
      res.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
    } catch {
      return null;
    }
  }

  // Robots.txt + sitemap
  try {
    const origin = new URL(url).origin;
    const robotsRes = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    if (robotsRes.ok) {
      robotsTxt = await robotsRes.text();
      sitemapFound = robotsTxt.toLowerCase().includes('sitemap:');
    }
    if (!sitemapFound) {
      const sitemapRes = await fetch(`${origin}/sitemap.xml`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      sitemapFound = sitemapRes.ok;
    }
  } catch {}

  return { html, markdown, metadata, headers, finalUrl, robotsTxt, sitemapFound };
}

// ── SEO Checks (simplified inline) ──

function runSeoChecks(html: string, url: string, robotsTxt: string | null, sitemapFound: boolean) {
  const $ = cheerio.load(html);
  const issues: AuditIssue[] = [];
  let passed = 0;
  const total = 13;

  const title = $('title').first().text().trim();
  const titleLen = title.length;
  if (titleLen >= 30 && titleLen <= 60) passed++; else issues.push({ title: 'Title tag optimaliseren', description: titleLen === 0 ? 'Geen title tag gevonden.' : `Title is ${titleLen} tekens (optimaal: 30-60).`, score: titleLen === 0 ? 0 : 0.5 });

  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || '';
  const descLen = metaDesc.length;
  if (descLen >= 120 && descLen <= 160) passed++; else issues.push({ title: 'Meta description optimaliseren', description: descLen === 0 ? 'Geen meta description gevonden.' : `Description is ${descLen} tekens (optimaal: 120-160).`, score: descLen === 0 ? 0 : 0.5 });

  const h1Count = $('h1').length;
  if (h1Count === 1) passed++; else issues.push({ title: 'H1 heading', description: h1Count === 0 ? 'Geen H1 gevonden.' : `${h1Count} H1 tags gevonden (optimaal: 1).`, score: 0.3 });

  const imgs = $('img');
  const totalImages = imgs.length;
  let missingAlt = 0;
  imgs.each((_, el) => { if (!$(el).attr('alt')?.trim()) missingAlt++; });
  if (missingAlt === 0) passed++; else issues.push({ title: 'Afbeeldingen zonder alt-tekst', description: `${missingAlt} van ${totalImages} afbeeldingen mist alt-tekst.`, displayValue: `${missingAlt} afbeeldingen`, score: 0.4 });

  if ($('link[rel="canonical"]').length > 0) passed++; else issues.push({ title: 'Canonical link ontbreekt', description: 'Voeg een canonical link toe.', score: 0.5 });
  if ($('meta[property^="og:"]').length >= 2) passed++; else issues.push({ title: 'Open Graph tags ontbreken', description: 'Voeg og:title en og:description toe.', score: 0.6 });
  if ($('script[type="application/ld+json"]').length > 0) passed++; else issues.push({ title: 'Structured data ontbreekt', description: 'Voeg JSON-LD structured data toe.', score: 0.5 });
  if ($('meta[name="viewport"]').length > 0) passed++; else issues.push({ title: 'Viewport meta ontbreekt', description: 'Voeg viewport meta tag toe.', score: 0.2 });
  if ($('html').attr('lang')) passed++; else issues.push({ title: 'Lang attribuut ontbreekt', description: 'Voeg lang="nl" toe aan de html tag.', score: 0.6 });
  if (robotsTxt) passed++; else issues.push({ title: 'robots.txt ontbreekt', description: 'Maak een robots.txt bestand aan.', score: 0.7 });
  if (sitemapFound) passed++; else issues.push({ title: 'Sitemap ontbreekt', description: 'Maak een XML sitemap aan.', score: 0.6 });

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText.split(/\s+/).length;
  if (wordCount >= 200) passed++; else issues.push({ title: 'Te weinig tekst', description: `Slechts ${wordCount} woorden gevonden (minimaal 200).`, score: 0.4 });

  const links = $('a[href]');
  let internal = 0, external = 0;
  const origin = new URL(url).origin;
  links.each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('/') || href.startsWith(origin)) internal++;
    else if (href.startsWith('http')) external++;
  });
  if (internal >= 3) passed++; else issues.push({ title: 'Weinig interne links', description: `${internal} interne links gevonden (minimaal 3).`, score: 0.5 });

  const signals: SeoSignals = {
    titleLength: titleLen, metaDescriptionLength: descLen, h1Count, totalImages,
    imagesMissingAlt: missingAlt, wordCount, hasCanonical: $('link[rel="canonical"]').length > 0,
    hasStructuredData: $('script[type="application/ld+json"]').length > 0,
    hasViewportMeta: $('meta[name="viewport"]').length > 0,
    hasLangAttribute: !!$('html').attr('lang'),
    hasRobotsTxt: !!robotsTxt, hasSitemap: sitemapFound,
    internalLinkCount: internal, externalLinkCount: external,
  };

  return { issues, passedCount: passed, totalChecks: total, signals };
}

// ── Security Checks ──

function runSecurityChecks(headers: Record<string, string>, finalUrl: string) {
  const issues: AuditIssue[] = [];
  let passed = 0;
  const total = 7;
  const has = (h: string) => !!headers[h.toLowerCase()];

  const httpsEnabled = finalUrl.startsWith('https://');
  if (httpsEnabled) passed++; else issues.push({ title: 'HTTPS niet actief', description: 'Website draait niet op HTTPS.', score: 0 });
  if (has('strict-transport-security')) passed++; else issues.push({ title: 'HSTS header ontbreekt', description: 'Voeg Strict-Transport-Security header toe.', score: 0.3 });
  if (has('content-security-policy')) passed++; else issues.push({ title: 'CSP header ontbreekt', description: 'Voeg Content-Security-Policy header toe.', score: 0.4 });
  if (has('x-frame-options')) passed++; else issues.push({ title: 'X-Frame-Options ontbreekt', description: 'Bescherm tegen clickjacking.', score: 0.4 });
  if (has('x-content-type-options')) passed++; else issues.push({ title: 'X-Content-Type-Options ontbreekt', description: 'Voeg nosniff header toe.', score: 0.5 });
  if (has('referrer-policy')) passed++; else issues.push({ title: 'Referrer-Policy ontbreekt', description: 'Stel een referrer policy in.', score: 0.6 });
  if (has('permissions-policy')) passed++; else issues.push({ title: 'Permissions-Policy ontbreekt', description: 'Beperk browser API toegang.', score: 0.6 });

  const signals: SecuritySignals = {
    httpsEnabled, hsts: has('strict-transport-security'), csp: has('content-security-policy'),
    xFrameOptions: has('x-frame-options'), xContentTypeOptions: has('x-content-type-options'),
    referrerPolicy: has('referrer-policy'), permissionsPolicy: has('permissions-policy'),
  };

  return { issues, passedCount: passed, totalChecks: total, signals };
}

// ── AI Analysis ──

async function runAiAnalysisCall(
  url: string,
  overall: number,
  scores: Record<string, number>,
  topIssues: AuditIssue[]
): Promise<AiAnalysisResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const issuesList = topIssues.slice(0, 8).map((i, idx) => `${idx + 1}. ${i.title}${i.displayValue ? ` (${i.displayValue})` : ''}`).join('\n');

  const prompt = `Je bent een senior website auditor. Analyseer ${url}.

Scores (0-10): Overall ${overall}, Snelheid ${scores.snelheid}, SEO ${scores.seo}, Beveiliging ${scores.beveiliging}, Toegankelijkheid ${scores.toegankelijkheid}.

Top problemen:
${issuesList || 'Geen significante problemen.'}

Geef een JSON object met:
- "executiveSummary": 3 korte paragrafen gescheiden door dubbele newlines
- "findings": array van 6 objecten met category, score (1-5), observation, recommendation

Categories: Value Proposition, CTA Kwaliteit, Social Proof, Contact & Vertrouwen, Tekst Kwaliteit, Navigatie & Structuur.

Schrijf in het Nederlands, spreek de ondernemer aan met "je". Alleen JSON, geen markdown.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find((b) => b.type === 'text');
    if (!text) return null;

    const cleaned = text.text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      executiveSummary: parsed.executiveSummary || '',
      contentFindings: (parsed.findings || []).map((f: any) => ({
        category: String(f.category || ''),
        score: Math.max(1, Math.min(5, Number(f.score) || 3)),
        observation: String(f.observation || ''),
        recommendation: String(f.recommendation || ''),
      })),
    };
  } catch (err) {
    console.error('AI analysis error:', err);
    return null;
  }
}

// ── Advice builder (simplified) ──

function buildAdvice(id: string, score: number): string {
  if (id === 'snelheid') {
    if (score >= 7) return 'Je website laadt snel. Kleine optimalisaties kunnen de ervaring nog verbeteren.';
    if (score >= 4) return 'De laadtijd kan beter. Focus op het optimaliseren van afbeeldingen en het verminderen van JavaScript.';
    return 'Je website is te traag. Dit kost bezoekers en Google-posities. Prioriteit: afbeeldingen comprimeren en ongebruikte code verwijderen.';
  }
  if (id === 'seo') {
    if (score >= 7) return 'Goede SEO-basis. Werk aan content en backlinks voor betere posities.';
    if (score >= 4) return 'Er zijn SEO-verbeterpunten. Focus op meta tags, heading structuur en technische SEO.';
    return 'De SEO heeft serieuze aandacht nodig. Begin met de basis: title tags, meta descriptions en heading structuur.';
  }
  if (id === 'beveiliging') {
    if (score >= 7) return 'Goede beveiligingsbasis. Overweeg aanvullende security headers.';
    if (score >= 4) return 'Voeg ontbrekende security headers toe voor betere bescherming.';
    return 'De beveiliging is onvoldoende. Zorg minimaal voor HTTPS en basis security headers.';
  }
  if (score >= 7) return 'Goede toegankelijkheid. Kleine verbeteringen mogelijk voor screenreaders en toetsenbordnavigatie.';
  if (score >= 4) return 'De toegankelijkheid kan beter. Focus op contrast, alt-teksten en ARIA labels.';
  return 'De website is slecht toegankelijk. Dit beperkt je bereik en kan juridische risicos opleveren.';
}

// ── Main analysis function ──

export async function runFullAnalysis(url: string): Promise<AnalysisResult> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) throw new Error('Service tijdelijk niet beschikbaar.');

  const [psResult, site] = await Promise.allSettled([
    fetchPageSpeed(url, apiKey),
    fetchSiteContent(url),
  ]);

  const psData = psResult.status === 'fulfilled' ? psResult.value : null;
  if (!psData) throw new Error('Kon de website niet analyseren.');

  const siteData = site.status === 'fulfilled' ? site.value : null;

  let seoCheck: ReturnType<typeof runSeoChecks> | null = null;
  let secCheck: ReturnType<typeof runSecurityChecks> | null = null;

  if (siteData?.html) {
    try { seoCheck = runSeoChecks(siteData.html, url, siteData.robotsTxt, siteData.sitemapFound); } catch {}
  }
  if (siteData?.headers && Object.keys(siteData.headers).length > 0) {
    try { secCheck = runSecurityChecks(siteData.headers, siteData.finalUrl); } catch {}
  }

  const lhScores = extractScores(psData);
  const ownSeo = seoCheck ? (seoCheck.passedCount / seoCheck.totalChecks) * 10 : lhScores.seo;
  const ownSec = secCheck ? (secCheck.passedCount / secCheck.totalChecks) * 10 : lhScores.beveiliging;

  // Own checks are deterministic (DOM/header inspection); weight them higher than Lighthouse.
  const scores = {
    ...lhScores,
    seo: clampScore(lhScores.seo * 0.2 + ownSeo * 0.8),
    beveiliging: clampScore(lhScores.beveiliging * 0.3 + ownSec * 0.7),
  };

  const overall = clampScore(scores.snelheid * 0.4 + scores.seo * 0.3 + scores.beveiliging * 0.2 + scores.toegankelijkheid * 0.1);

  const topIssues: AuditIssue[] = [
    ...(seoCheck?.issues || []),
    ...(secCheck?.issues || []),
    ...extractCategoryIssues(psData, 'snelheid'),
    ...extractCategoryIssues(psData, 'toegankelijkheid'),
  ].sort((a, b) => a.score - b.score);

  let aiAnalysis: AiAnalysisResult | null = null;
  try {
    aiAnalysis = await runAiAnalysisCall(url, overall, scores, topIssues.slice(0, 10));
  } catch {}

  const labels: Record<string, string> = { snelheid: 'Snelheid', seo: 'SEO', beveiliging: 'Beveiliging', toegankelijkheid: 'Toegankelijkheid' };

  const categories: DetailedCategory[] = Object.entries(labels).map(([id, label]) => {
    const lhIssues = extractCategoryIssues(psData, id);
    let issues = lhIssues;
    if (id === 'seo' && seoCheck) issues = [...seoCheck.issues, ...lhIssues].sort((a, b) => a.score - b.score).slice(0, 8);
    if (id === 'beveiliging' && secCheck) issues = [...secCheck.issues, ...lhIssues].sort((a, b) => a.score - b.score).slice(0, 8);

    const catScore = scores[id as keyof typeof scores];
    return { id, label, score: catScore, advice: buildAdvice(id, catScore), issues };
  });

  return {
    url, overall, categories,
    scannedAt: new Date().toISOString(),
    signals: { seo: seoCheck?.signals ?? null, security: secCheck?.signals ?? null },
    aiAnalysis,
  };
}
