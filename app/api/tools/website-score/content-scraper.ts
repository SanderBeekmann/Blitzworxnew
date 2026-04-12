import * as cheerio from 'cheerio';
import type { FirecrawlMetadata } from './site-fetcher';

export interface ScrapedContent {
  hero: {
    heading: string;
    subheading: string;
    primaryCta: string;
  };
  sections: Array<{
    heading: string;
    firstParagraph: string;
  }>;
  navigation: string[];
  footer: {
    text: string;
    links: string[];
  };
  ctas: string[];
  forms: Array<{
    label: string;
    fieldCount: number;
    fieldTypes: string[];
  }>;
  contactInfo: {
    phones: string[];
    emails: string[];
    addresses: string[];
  };
  trustSignals: {
    hasTestimonials: boolean;
    hasReviews: boolean;
    hasClientLogos: boolean;
    hasCertifications: boolean;
    metrics: string[];
  };
  copyStats: {
    totalWords: number;
    avgSentenceLength: number;
    paragraphCount: number;
    hasPriceMention: boolean;
  };
  languageHints: {
    detectedLang: string;
    isDutch: boolean;
  };
  /** Clean markdown from Firecrawl (null if only HTML available) */
  markdownContent: string | null;
  /** Page metadata from Firecrawl */
  pageMetadata: FirecrawlMetadata | null;
  /** Design signals extracted from CSS/HTML */
  designSignals: DesignSignals;
}

export interface DesignSignals {
  fonts: string[];
  colors: string[];
  hasCustomFonts: boolean;
  hasDarkBackground: boolean;
  layoutTechniques: string[];
  imageCount: number;
  videoCount: number;
  hasAnimations: boolean;
  hasFavicon: boolean;
  viewportMeta: boolean;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '...';
}

function extractHero($: cheerio.CheerioAPI): ScrapedContent['hero'] {
  const h1 = cleanText($('h1').first().text());

  let subheading = '';
  const h1El = $('h1').first();
  if (h1El.length > 0) {
    const next = h1El.nextAll('p').first();
    if (next.length > 0) {
      subheading = cleanText(next.text());
    } else {
      const parentNext = h1El.parent().find('p').first();
      if (parentNext.length > 0) {
        subheading = cleanText(parentNext.text());
      }
    }
  }
  if (!subheading) {
    subheading = cleanText($('p').first().text());
  }

  let primaryCta = '';
  const firstBtn = $('a[class*="btn"], button, a[class*="button"], a[class*="cta"]').first();
  if (firstBtn.length > 0) {
    primaryCta = cleanText(firstBtn.text());
  }

  return {
    heading: truncate(h1, 200),
    subheading: truncate(subheading, 400),
    primaryCta: truncate(primaryCta, 100),
  };
}

function extractSections($: cheerio.CheerioAPI): ScrapedContent['sections'] {
  const sections: ScrapedContent['sections'] = [];
  $('h2').slice(0, 8).each((_, el) => {
    const heading = cleanText($(el).text());
    if (!heading) return;
    const nextP = $(el).nextAll('p').first();
    const firstParagraph = cleanText(nextP.text()) || '';
    sections.push({
      heading: truncate(heading, 150),
      firstParagraph: truncate(firstParagraph, 300),
    });
  });
  return sections;
}

function extractNavigation($: cheerio.CheerioAPI): string[] {
  const items: string[] = [];
  const navSelector = 'nav a, header a[href]';
  $(navSelector).slice(0, 15).each((_, el) => {
    const text = cleanText($(el).text());
    if (text && text.length < 50 && !items.includes(text)) {
      items.push(text);
    }
  });
  return items;
}

function extractFooter($: cheerio.CheerioAPI): ScrapedContent['footer'] {
  const footerEl = $('footer').first();
  const text = truncate(cleanText(footerEl.text()), 500);
  const links: string[] = [];
  footerEl.find('a').slice(0, 20).each((_, el) => {
    const linkText = cleanText($(el).text());
    if (linkText && !links.includes(linkText)) links.push(linkText);
  });
  return { text, links };
}

function extractCtas($: cheerio.CheerioAPI): string[] {
  const ctas = new Set<string>();
  const selectors = [
    'a[class*="btn"]',
    'button',
    'a[class*="button"]',
    'a[class*="cta"]',
    'input[type="submit"]',
  ];
  selectors.forEach((sel) => {
    $(sel).each((_, el) => {
      const text = cleanText($(el).text()) || cleanText($(el).attr('value') ?? '');
      if (text && text.length < 60 && text.length > 0) {
        ctas.add(text);
      }
    });
  });
  return Array.from(ctas).slice(0, 15);
}

function extractForms($: cheerio.CheerioAPI): ScrapedContent['forms'] {
  const forms: ScrapedContent['forms'] = [];
  $('form').slice(0, 5).each((_, el) => {
    const $form = $(el);
    const fields = $form.find('input, textarea, select');
    const fieldTypes = new Set<string>();
    fields.each((_, field) => {
      const type = $(field).attr('type') || $(field).prop('tagName')?.toString().toLowerCase() || 'text';
      fieldTypes.add(type);
    });

    let label = cleanText($form.find('button[type="submit"], input[type="submit"]').first().text() || $form.find('input[type="submit"]').first().attr('value') || '');
    if (!label) {
      const heading = $form.closest('section, div').find('h2, h3').first();
      label = cleanText(heading.text());
    }
    if (!label) label = 'Onbekend formulier';

    forms.push({
      label: truncate(label, 100),
      fieldCount: fields.length,
      fieldTypes: Array.from(fieldTypes).filter((t) => t !== 'hidden' && t !== 'submit'),
    });
  });
  return forms;
}

function extractContactInfo(text: string): ScrapedContent['contactInfo'] {
  const phoneRegex = /(?:\+31|0031|0)[\s-]?[1-9](?:[\s-]?\d){8}/g;
  const phones = Array.from(new Set((text.match(phoneRegex) || []).map(cleanText))).slice(0, 3);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = Array.from(new Set(text.match(emailRegex) || [])).slice(0, 3);

  const addressRegex = /\d{4}\s?[A-Z]{2}\b[^,]*/g;
  const addresses = Array.from(new Set((text.match(addressRegex) || []).map(cleanText))).slice(0, 2);

  return { phones, emails, addresses };
}

function extractTrustSignals(text: string, $?: cheerio.CheerioAPI): ScrapedContent['trustSignals'] {
  const bodyText = text.toLowerCase();

  const testimonialKeywords = ['testimonial', 'reviews', 'wat klanten zeggen', 'beoordelingen', 'recensies', 'ervaringen', 'referenties'];
  const hasTestimonials = testimonialKeywords.some((k) => bodyText.includes(k));

  const reviewKeywords = ['trustpilot', 'google reviews', 'kiyoh', '5 sterren', '\u2605\u2605\u2605\u2605', 'review score'];
  const hasReviews = reviewKeywords.some((k) => bodyText.includes(k));

  let hasClientLogos = false;
  if ($) {
    hasClientLogos = $('section, div').toArray().some((el) => {
      const className = ($(el).attr('class') || '').toLowerCase();
      const id = ($(el).attr('id') || '').toLowerCase();
      const matches = /client|partner|logo|merken/i.test(className + ' ' + id);
      return matches && $(el).find('img').length >= 3;
    });
  }

  const certKeywords = ['iso 9001', 'iso-9001', 'certified', 'gecertificeerd', 'keurmerk', 'erkend'];
  const hasCertifications = certKeywords.some((k) => bodyText.includes(k));

  const metricsRegex = /(\d+[\+.]?\d*)\s*(klanten|projecten|jaar|tevreden|gebruikers|reviews|medewerkers|bedrijven)/gi;
  const metricsMatches = text.match(metricsRegex) || [];
  const metrics = Array.from(new Set(metricsMatches.map(cleanText))).slice(0, 5);

  return { hasTestimonials, hasReviews, hasClientLogos, hasCertifications, metrics };
}

function extractCopyStats(text: string, paragraphCount: number): ScrapedContent['copyStats'] {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
  const hasPriceMention = /\u20ac\s?\d|EUR\s?\d|\d+\s?euro|vanaf\s?\u20ac?\d/i.test(text);

  return {
    totalWords: words.length,
    avgSentenceLength,
    paragraphCount,
    hasPriceMention,
  };
}

function extractLanguageHints($: cheerio.CheerioAPI, metadata?: FirecrawlMetadata | null): ScrapedContent['languageHints'] {
  const lang = metadata?.language || $('html').attr('lang') || '';
  const isDutch = /^nl/i.test(lang);
  return { detectedLang: lang || 'unknown', isDutch };
}

function extractDesignSignals($: cheerio.CheerioAPI): DesignSignals {
  // Extract colors from inline styles and style tags
  const allStyles = $('style').map((_, el) => $(el).text()).get().join(' ');
  const inlineStyles = $('[style]').map((_, el) => $(el).attr('style') || '').get().join(' ');
  const cssText = allStyles + ' ' + inlineStyles;

  const colorRegex = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
  const rawColors = cssText.match(colorRegex) || [];
  const colors = Array.from(new Set(rawColors)).slice(0, 15);

  // Extract fonts
  const fontRegex = /font-family:\s*([^;}"]+)/gi;
  const rawFonts: string[] = [];
  let fontMatch;
  while ((fontMatch = fontRegex.exec(cssText)) !== null) {
    rawFonts.push(fontMatch[1].trim());
  }
  // Also check link/style for Google Fonts or external font references
  const googleFonts = $('link[href*="fonts.googleapis.com"]').map((_, el) => {
    const href = $(el).attr('href') || '';
    const familyMatch = href.match(/family=([^&:]+)/);
    return familyMatch ? familyMatch[1].replace(/\+/g, ' ') : '';
  }).get().filter(Boolean);

  const allFonts = Array.from(new Set([...rawFonts, ...googleFonts])).slice(0, 8);
  const systemFonts = ['arial', 'helvetica', 'times', 'sans-serif', 'serif', 'monospace', 'system-ui'];
  const hasCustomFonts = allFonts.some(
    (f) => !systemFonts.some((sf) => f.toLowerCase().includes(sf))
  );

  // Dark background detection
  const bodyBg = $('body').attr('style') || '';
  const htmlClass = ($('html').attr('class') || '' + ' ' + $('body').attr('class') || '').toLowerCase();
  const hasDarkBackground = /dark/i.test(htmlClass)
    || /background(-color)?:\s*#[0-3]/i.test(bodyBg + cssText)
    || /bg-(black|dark|slate-9|gray-9|zinc-9|neutral-9)/i.test(htmlClass);

  // Layout techniques
  const layoutTechniques: string[] = [];
  if (/display:\s*grid/i.test(cssText)) layoutTechniques.push('CSS Grid');
  if (/display:\s*flex/i.test(cssText)) layoutTechniques.push('Flexbox');
  if ($('[class*="container"], [class*="wrapper"], [class*="max-w-"]').length > 0) layoutTechniques.push('Container layout');
  if ($('[class*="grid"], [class*="col-"], [class*="grid-cols"]').length > 0) layoutTechniques.push('Grid system');

  // Media counts
  const imageCount = $('img').length;
  const videoCount = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;

  // Animations
  const hasAnimations = /animation|transition|@keyframes|transform/i.test(cssText)
    || $('[class*="animate"], [class*="motion"], [class*="fade"], [class*="slide"]').length > 0;

  // Favicon
  const hasFavicon = $('link[rel*="icon"]').length > 0;

  // Viewport
  const viewportMeta = $('meta[name="viewport"]').length > 0;

  return {
    fonts: allFonts,
    colors,
    hasCustomFonts,
    hasDarkBackground,
    layoutTechniques,
    imageCount,
    videoCount,
    hasAnimations,
    hasFavicon,
    viewportMeta,
  };
}

/** Scrape content from HTML (with optional Firecrawl enrichments) */
export function scrapeContent(
  html: string,
  markdown?: string | null,
  metadata?: FirecrawlMetadata | null
): ScrapedContent {
  const $ = cheerio.load(html);

  // Use markdown for text-based analysis if available, otherwise extract from HTML
  let plainText: string;
  if (markdown) {
    plainText = markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // strip images
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links to text
      .replace(/[#*_~`>]/g, '') // strip markdown syntax
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    $('script, style, noscript').remove();
    plainText = $('body').text().replace(/\s+/g, ' ').trim();
  }

  const paragraphCount = markdown
    ? (markdown.match(/\n\n/g) || []).length + 1
    : $('p').length;

  return {
    hero: extractHero($),
    sections: extractSections($),
    navigation: extractNavigation($),
    footer: extractFooter($),
    ctas: extractCtas($),
    forms: extractForms($),
    contactInfo: extractContactInfo(plainText),
    trustSignals: extractTrustSignals(plainText, $),
    copyStats: extractCopyStats(plainText, paragraphCount),
    languageHints: extractLanguageHints($, metadata),
    markdownContent: markdown ? truncate(markdown, 15000) : null,
    pageMetadata: metadata ?? null,
    designSignals: extractDesignSignals($),
  };
}
