import type { AuditIssue, SeoSignals } from './seo-checks';
import type { SecuritySignals } from './security-checks';

interface AdviceContext {
  score: number;
  issues: AuditIssue[];
  seoSignals?: SeoSignals;
  securitySignals?: SecuritySignals;
}

const POSITIVE_MESSAGES: Record<string, string> = {
  snelheid: 'Je website laadt snel. Bezoekers hoeven niet te wachten en Google waardeert de snelheid.',
  seo: 'Je SEO staat goed in elkaar. Titles, meta tags, structured data en technische basis zijn allemaal aanwezig.',
  beveiliging: 'Je website is goed beveiligd. HTTPS is actief en alle belangrijke security headers zijn ingesteld.',
  toegankelijkheid: 'Je website scoort goed op toegankelijkheid. De meeste gebruikers kunnen je site zonder problemen gebruiken.',
};

function detectPatterns(issues: AuditIssue[]): string | null {
  const titles = issues.map((i) => i.title.toLowerCase()).join(' ');

  if (titles.includes('afbeelding') || titles.includes('image') || titles.includes('alt-attribuut')) {
    const imageIssues = issues.filter((i) =>
      /image|afbeelding|alt|webp|jpeg|png/i.test(i.title)
    ).length;
    if (imageIssues >= 2) return 'Focus op beeldoptimalisatie';
  }

  if (titles.includes('header') || titles.includes('csp') || titles.includes('hsts')) {
    const securityIssues = issues.filter((i) =>
      /header|csp|hsts|policy|x-frame|nosniff/i.test(i.title)
    ).length;
    if (securityIssues >= 2) return 'Security headers ontbreken';
  }

  if (titles.includes('weinig content') || titles.includes('woorden')) {
    return 'Content depth is een aandachtspunt';
  }

  if (titles.includes('meta') || titles.includes('title') || titles.includes('canonical')) {
    const metaIssues = issues.filter((i) =>
      /meta|title|canonical|open graph|og/i.test(i.title)
    ).length;
    if (metaIssues >= 2) return 'On-page metadata is incompleet';
  }

  return null;
}

function getSuggestion(issue: AuditIssue): string {
  const title = issue.title.toLowerCase();

  if (title.includes('title')) return 'Schrijf een pakkende title van 50-60 tekens met je belangrijkste keyword vooraan.';
  if (title.includes('meta description')) return 'Voeg een meta description van 150-160 tekens toe die bezoekers overtuigt door te klikken.';
  if (title.includes('h1')) return 'Gebruik precies 1 H1 per pagina met het hoofdonderwerp.';
  if (title.includes('alt-attribuut')) return 'Geef elke content-afbeelding een beschrijvende alt-tekst; decoratieve mogen alt="".';
  if (title.includes('canonical')) return 'Voeg een canonical link toe in de head van elke pagina.';
  if (title.includes('open graph')) return 'Voeg og:title, og:description en og:image toe voor betere previews op social media.';
  if (title.includes('structured data')) return 'Voeg JSON-LD schema toe (Organization, LocalBusiness, FAQPage) voor rich results in Google.';
  if (title.includes('hsts')) return 'Stel de Strict-Transport-Security header in via je hosting of CDN.';
  if (title.includes('csp')) return 'Configureer een Content-Security-Policy header om XSS attacks te voorkomen.';
  if (title.includes('viewport')) return 'Voeg <meta name="viewport" content="width=device-width, initial-scale=1"> toe.';
  if (title.includes('robots.txt')) return 'Maak een robots.txt bestand aan in de root van je site met een sitemap referentie.';
  if (title.includes('sitemap')) return 'Genereer een sitemap.xml en maak deze bereikbaar op /sitemap.xml.';
  if (title.includes('content') || title.includes('woorden')) return 'Breid de content uit met diepere uitleg, use-cases en context.';
  return '';
}

export function buildDynamicAdvice(categoryId: string, context: AdviceContext): string {
  const { score, issues } = context;

  if (issues.length === 0) {
    return POSITIVE_MESSAGES[categoryId] || 'Alle checks zijn geslaagd in deze categorie.';
  }

  if (issues.length <= 2) {
    const topIssue = issues[0];
    const suggestion = getSuggestion(topIssue);
    const scoreNote = score >= 7 ? 'Bijna perfect.' : score >= 4 ? 'Redelijke basis, maar er is werk aan de winkel.' : 'Hier liggen grote kansen.';
    return `${scoreNote} Belangrijkste verbeterpunt: ${topIssue.title}. ${suggestion}`.trim();
  }

  const pattern = detectPatterns(issues);
  const topIssue = issues[0];
  const scoreNote = score >= 7
    ? `${issues.length} kleine verbeterpunten gevonden.`
    : score >= 4
    ? `${issues.length} verbeterpunten gevonden, meerdere met impact.`
    : `${issues.length} serieuze verbeterpunten gevonden.`;

  const patternSuffix = pattern ? ` ${pattern} is het grootste thema.` : '';
  return `${scoreNote} Het meest impactvol: ${topIssue.title}.${patternSuffix}`.trim();
}
