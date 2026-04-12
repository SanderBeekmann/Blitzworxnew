import { fetchSite } from './site-fetcher';
import { runSeoChecks, SeoCheckResult, AuditIssue } from './seo-checks';
import { runSecurityChecks, SecurityCheckResult } from './security-checks';
import { buildDynamicAdvice } from './advice-builder';
import { scrapeContent, ScrapedContent } from './content-scraper';
import { runAiAnalysis, AiAnalysisResult } from './ai-analyzer';

const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const PAGESPEED_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const CATEGORY_TO_LIGHTHOUSE: Record<string, string[]> = {
  snelheid: ['performance'],
  seo: ['seo'],
  beveiliging: ['best-practices'],
  toegankelijkheid: ['accessibility'],
};

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
    seo: any;
    security: any;
  };
  aiAnalysis: AiAnalysisResult | null;
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

    return { id, label, score: scores[id], advice, issues };
  });
}

export async function runFullAnalysis(url: string): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error('Service tijdelijk niet beschikbaar.');
  }

  const [pagespeedResult, siteData] = await Promise.allSettled([
    fetchPageSpeed(url),
    fetchSite(url),
  ]);

  if (pagespeedResult.status === 'rejected' || !pagespeedResult.value) {
    throw new Error('Kon de website niet analyseren. Controleer of het adres bereikbaar is.');
  }

  const data = pagespeedResult.value;
  const site = siteData.status === 'fulfilled' ? siteData.value : null;

  let seoCheck: SeoCheckResult | null = null;
  let securityCheck: SecurityCheckResult | null = null;
  let scrapedContent: ScrapedContent | null = null;

  if (site?.html) {
    try { seoCheck = runSeoChecks(site.html, url, site.robotsTxt, site.sitemapFound); } catch (err) { console.error('SEO checks failed:', err); }
    try { scrapedContent = scrapeContent(site.html, site.markdown, site.metadata); } catch (err) { console.error('Content scraping failed:', err); }
  }

  if (site?.headers) {
    try { securityCheck = runSecurityChecks(site.headers, site.finalUrl); } catch (err) { console.error('Security checks failed:', err); }
  }

  const lighthouseScores = {
    snelheid: extractSpeedScore(data),
    seo: extractSeoScore(data),
    beveiliging: extractSecurityScore(data),
    toegankelijkheid: extractAccessibilityScore(data),
  };

  const ownSeo = seoCheck ? (seoCheck.passedCount / seoCheck.totalChecks) * 10 : lighthouseScores.seo;
  const ownSec = securityCheck ? (securityCheck.passedCount / securityCheck.totalChecks) * 10 : lighthouseScores.beveiliging;

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

  const topIssues: AuditIssue[] = [];
  if (seoCheck) topIssues.push(...seoCheck.issues);
  if (securityCheck) topIssues.push(...securityCheck.issues);
  topIssues.push(...extractCategoryIssues(data, 'snelheid'));
  topIssues.push(...extractCategoryIssues(data, 'toegankelijkheid'));
  topIssues.sort((a, b) => a.score - b.score);

  let aiAnalysis: AiAnalysisResult | null = null;
  try {
    aiAnalysis = await runAiAnalysis(scrapedContent, url, overall, scores, topIssues.slice(0, 10));
  } catch (err) {
    console.error('AI analysis failed:', err);
  }

  const categories = buildDetailedCategories(scores, data, seoCheck, securityCheck);

  return {
    url,
    overall,
    categories,
    scannedAt: new Date().toISOString(),
    signals: {
      seo: seoCheck?.signals ?? null,
      security: securityCheck?.signals ?? null,
    },
    aiAnalysis,
  };
}
