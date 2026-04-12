import * as cheerio from 'cheerio';

export interface AuditIssue {
  title: string;
  description: string;
  displayValue?: string;
  score: number;
}

export interface SeoSignals {
  titleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  imagesMissingAlt: number;
  totalImages: number;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  hasViewport: boolean;
  hasLang: boolean;
  hasRobots: boolean;
  hasSitemap: boolean;
  robotsHasSitemap: boolean;
}

export interface SeoCheckResult {
  issues: AuditIssue[];
  signals: SeoSignals;
  passedCount: number;
  totalChecks: number;
}

interface CheckContext {
  $: cheerio.CheerioAPI;
  url: string;
  hostname: string;
  robotsTxt: string | null;
  sitemapFound: boolean;
}

function addIssue(issues: AuditIssue[], title: string, description: string, displayValue?: string, score = 0.3) {
  issues.push({ title, description, displayValue, score });
}

function checkTitle($: cheerio.CheerioAPI, issues: AuditIssue[]): { passed: boolean; length: number } {
  const title = $('title').first().text().trim();
  const length = title.length;

  if (!title) {
    addIssue(issues, 'Pagina heeft geen title tag', 'De title is wat Google toont in de zoekresultaten. Zonder title mist je pagina de belangrijkste SEO-factor.');
    return { passed: false, length: 0 };
  }
  if (length < 30 || length > 60) {
    addIssue(
      issues,
      `Title is ${length < 30 ? 'te kort' : 'te lang'}: ${length} tekens`,
      'De ideale title is 50-60 tekens. Google knipt langere titles af in de zoekresultaten.',
      `${length} tekens`,
      length < 30 ? 0.4 : 0.6
    );
    return { passed: false, length };
  }
  return { passed: true, length };
}

function checkMetaDescription($: cheerio.CheerioAPI, issues: AuditIssue[]): { passed: boolean; length: number } {
  const desc = $('meta[name="description"]').attr('content')?.trim() ?? '';
  const length = desc.length;

  if (!desc) {
    addIssue(issues, 'Pagina heeft geen meta description', 'De meta description is de tekst onder je title in Google. Zonder deze tekst maakt Google zelf een samenvatting die vaak minder aantrekkelijk is.');
    return { passed: false, length: 0 };
  }
  if (length < 120 || length > 160) {
    addIssue(
      issues,
      `Meta description is ${length < 120 ? 'te kort' : 'te lang'}: ${length} tekens`,
      'De ideale meta description is 150-160 tekens. Gebruik deze ruimte om bezoekers te overtuigen door te klikken.',
      `${length} tekens`,
      0.5
    );
    return { passed: false, length };
  }
  return { passed: true, length };
}

function checkH1($: cheerio.CheerioAPI, issues: AuditIssue[]): { passed: boolean; count: number } {
  const count = $('h1').length;
  if (count === 0) {
    addIssue(issues, 'Geen H1 heading gevonden', 'Elke pagina hoort precies 1 H1 te hebben die het onderwerp beschrijft. Dit is belangrijk voor zowel SEO als toegankelijkheid.');
    return { passed: false, count };
  }
  if (count > 1) {
    addIssue(issues, `${count} H1 tags gevonden`, 'Gebruik precies 1 H1 per pagina. Voor subsecties gebruik je H2, H3, etc.', `${count} H1 tags`, 0.5);
    return { passed: false, count };
  }
  return { passed: true, count };
}

function checkImages($: cheerio.CheerioAPI, issues: AuditIssue[]): { passed: boolean; total: number; missing: number } {
  const images = $('img');
  const total = images.length;
  let missing = 0;
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt.trim() === '') missing++;
  });

  if (total === 0) return { passed: true, total: 0, missing: 0 };

  const ratio = missing / total;
  if (ratio > 0.1) {
    addIssue(
      issues,
      `${missing} van ${total} afbeeldingen missen een alt-attribuut`,
      'Alt-teksten helpen Google om afbeeldingen te begrijpen en zijn essentieel voor screenreaders. Een lege alt="" mag alleen bij pure decoratie.',
      `${missing}/${total}`,
      Math.max(0.1, 1 - ratio)
    );
    return { passed: false, total, missing };
  }
  return { passed: true, total, missing };
}

function checkCanonical($: cheerio.CheerioAPI, issues: AuditIssue[]): boolean {
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) {
    addIssue(issues, 'Geen canonical URL gevonden', 'Een canonical URL voorkomt duplicate content problemen. Google weet dan welke versie van een pagina geindexeerd moet worden.');
    return false;
  }
  return true;
}

function checkOgTags($: cheerio.CheerioAPI, issues: AuditIssue[]): boolean {
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');

  const present = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  if (present < 3) {
    const missing = 3 - present;
    addIssue(
      issues,
      `${missing} van 3 Open Graph tags ontbreken`,
      'Open Graph tags bepalen hoe je pagina verschijnt als iemand de link deelt op Facebook, LinkedIn of WhatsApp. Zonder deze tags krijg je een saaie preview.',
      `${missing} missing`,
      0.4
    );
    return false;
  }
  return true;
}

function checkStructuredData($: cheerio.CheerioAPI, issues: AuditIssue[]): boolean {
  const jsonLd = $('script[type="application/ld+json"]');
  if (jsonLd.length === 0) {
    addIssue(
      issues,
      'Geen structured data gevonden',
      'JSON-LD structured data helpt Google om je pagina te begrijpen en kan rich results opleveren (sterren, prijzen, FAQ). Dit is een gemiste kans voor zichtbaarheid.',
      undefined,
      0.5
    );
    return false;
  }
  return true;
}

function checkWordCount($: cheerio.CheerioAPI, issues: AuditIssue[]): { passed: boolean; count: number } {
  $('script, style, noscript').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter((w) => w.length > 0);
  const count = words.length;

  if (count < 200) {
    addIssue(
      issues,
      `Weinig content: ${count} woorden`,
      'Google waardeert diepgaande content. Pagina\'s met minder dan 200 woorden ranken zelden op competitieve zoektermen. Overweeg meer context, uitleg of use-cases toe te voegen.',
      `${count} woorden`,
      count < 100 ? 0.2 : 0.5
    );
    return { passed: false, count };
  }
  return { passed: true, count };
}

function checkViewport($: cheerio.CheerioAPI, issues: AuditIssue[]): boolean {
  const viewport = $('meta[name="viewport"]').attr('content');
  if (!viewport) {
    addIssue(
      issues,
      'Geen viewport meta tag',
      'Zonder viewport tag toont je site op mobiel verkeerd - teksten worden te klein, layout breekt. Dit is een van de belangrijkste mobiele instellingen.'
    );
    return false;
  }
  return true;
}

function checkLang($: cheerio.CheerioAPI, issues: AuditIssue[]): boolean {
  const lang = $('html').attr('lang');
  if (!lang) {
    addIssue(
      issues,
      'Geen lang attribuut op html element',
      'Het lang attribuut vertelt browsers en screenreaders in welke taal je site is. Belangrijk voor toegankelijkheid en SEO in het juiste land.',
      undefined,
      0.6
    );
    return false;
  }
  return true;
}

function countLinks($: cheerio.CheerioAPI, hostname: string): { internal: number; external: number } {
  let internal = 0;
  let external = 0;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      const linkUrl = new URL(href, `https://${hostname}`);
      if (linkUrl.hostname === hostname || linkUrl.hostname === `www.${hostname}` || `www.${linkUrl.hostname}` === hostname) {
        internal++;
      } else {
        external++;
      }
    } catch {
      // ignore invalid URLs
    }
  });
  return { internal, external };
}

function checkRobots(robotsTxt: string | null, issues: AuditIssue[]): { hasRobots: boolean; hasSitemap: boolean } {
  if (!robotsTxt) {
    addIssue(
      issues,
      'Geen robots.txt gevonden',
      'robots.txt vertelt crawlers welke pagina\'s ze mogen bezoeken. Zonder dit bestand missen Google en andere zoekmachines belangrijke instructies.',
      undefined,
      0.5
    );
    return { hasRobots: false, hasSitemap: false };
  }

  const hasSitemap = /^sitemap:/im.test(robotsTxt);
  if (!hasSitemap) {
    addIssue(
      issues,
      'robots.txt mist sitemap referentie',
      'Voeg een regel toe zoals "Sitemap: https://jouwdomein.nl/sitemap.xml" aan je robots.txt. Dit helpt crawlers je sitemap te vinden.',
      undefined,
      0.6
    );
  }
  return { hasRobots: true, hasSitemap };
}

function checkSitemapFile(sitemapFound: boolean, issues: AuditIssue[]): boolean {
  if (!sitemapFound) {
    addIssue(
      issues,
      'Geen sitemap.xml gevonden',
      'Een sitemap helpt Google alle pagina\'s van je site efficient te indexeren. Dit is vooral belangrijk voor sites met veel pagina\'s.',
      undefined,
      0.5
    );
    return false;
  }
  return true;
}

export function runSeoChecks(
  html: string,
  url: string,
  robotsTxt: string | null,
  sitemapFound: boolean
): SeoCheckResult {
  const $ = cheerio.load(html);
  const hostname = new URL(url).hostname;
  const issues: AuditIssue[] = [];

  const results = {
    title: checkTitle($, issues),
    meta: checkMetaDescription($, issues),
    h1: checkH1($, issues),
    images: checkImages($, issues),
    canonical: checkCanonical($, issues),
    og: checkOgTags($, issues),
    jsonLd: checkStructuredData($, issues),
    wordCount: checkWordCount($, issues),
    viewport: checkViewport($, issues),
    lang: checkLang($, issues),
    robots: checkRobots(robotsTxt, issues),
    sitemap: checkSitemapFile(sitemapFound, issues),
  };

  const links = countLinks($, hostname);

  const passedCount = [
    results.title.passed,
    results.meta.passed,
    results.h1.passed,
    results.images.passed,
    results.canonical,
    results.og,
    results.jsonLd,
    results.wordCount.passed,
    results.viewport,
    results.lang,
    results.robots.hasRobots,
    results.robots.hasSitemap,
    results.sitemap,
  ].filter(Boolean).length;

  const totalChecks = 13;

  const signals: SeoSignals = {
    titleLength: results.title.length,
    metaDescriptionLength: results.meta.length,
    h1Count: results.h1.count,
    imagesMissingAlt: results.images.missing,
    totalImages: results.images.total,
    hasCanonical: results.canonical,
    hasOgTags: results.og,
    hasStructuredData: results.jsonLd,
    internalLinks: links.internal,
    externalLinks: links.external,
    wordCount: results.wordCount.count,
    hasViewport: results.viewport,
    hasLang: results.lang,
    hasRobots: results.robots.hasRobots,
    hasSitemap: results.sitemap,
    robotsHasSitemap: results.robots.hasSitemap,
  };

  return { issues, signals, passedCount, totalChecks };
}
