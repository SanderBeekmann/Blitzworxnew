import Anthropic from '@anthropic-ai/sdk';
import type { ScrapedContent } from './content-scraper';
import type { AuditIssue } from './seo-checks';

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL_ID = 'claude-sonnet-4-6';
const AI_TIMEOUT_MS = 45000;

export interface ContentFinding {
  category: string;
  score: number; // 1-5
  observation: string;
  recommendation: string;
}

export interface AiAnalysisResult {
  executiveSummary: string;
  contentFindings: ContentFinding[];
}

function buildContentContext(content: ScrapedContent): string {
  const parts: string[] = [];

  // Hero section
  parts.push(`## Hero sectie
- H1: "${content.hero.heading || '(geen H1 gevonden)'}"
- Subtekst: "${content.hero.subheading || '(geen subtekst)'}"
- Primaire CTA button: "${content.hero.primaryCta || '(geen CTA gevonden)'}"`);

  // Page metadata (from Firecrawl)
  if (content.pageMetadata) {
    const m = content.pageMetadata;
    parts.push(`## Pagina metadata
- Title tag: "${m.title || '(leeg)'}"
- Meta description: "${m.description || '(leeg)'}"
- OG title: "${m.ogTitle || '(leeg)'}"
- OG description: "${m.ogDescription || '(leeg)'}"`);
  }

  // Sections
  if (content.sections.length > 0) {
    const sectionList = content.sections
      .map((s, i) => `  ${i + 1}. "${s.heading}"${s.firstParagraph ? ` - "${s.firstParagraph.slice(0, 120)}"` : ''}`)
      .join('\n');
    parts.push(`## Paginasecties (H2 koppen)\n${sectionList}`);
  }

  // Navigation
  if (content.navigation.length > 0) {
    parts.push(`## Navigatie items\n${content.navigation.join(' | ')}`);
  }

  // CTAs
  if (content.ctas.length > 0) {
    parts.push(`## Alle CTA's/buttons op de pagina\n${content.ctas.map((c) => `"${c}"`).join(', ')}`);
  }

  // Forms
  if (content.forms.length > 0) {
    const formList = content.forms
      .map((f) => `- "${f.label}" (${f.fieldCount} velden: ${f.fieldTypes.join(', ')})`)
      .join('\n');
    parts.push(`## Formulieren\n${formList}`);
  }

  // Contact info
  const ci = content.contactInfo;
  parts.push(`## Contactgegevens
- Telefoonnummer(s): ${ci.phones.length > 0 ? ci.phones.join(', ') : 'NIET gevonden'}
- E-mailadres(sen): ${ci.emails.length > 0 ? ci.emails.join(', ') : 'NIET gevonden'}
- Adres: ${ci.addresses.length > 0 ? ci.addresses.join(', ') : 'NIET gevonden'}`);

  // Trust signals
  const ts = content.trustSignals;
  parts.push(`## Vertrouwenssignalen
- Testimonials/reviews sectie: ${ts.hasTestimonials ? 'JA' : 'NEE'}
- Review platform (Trustpilot/Google/KiYOH): ${ts.hasReviews ? 'JA' : 'NEE'}
- Klantlogo's: ${ts.hasClientLogos ? 'JA' : 'NEE'}
- Certificeringen/keurmerken: ${ts.hasCertifications ? 'JA' : 'NEE'}
- Concrete cijfers: ${ts.metrics.length > 0 ? ts.metrics.join(', ') : 'GEEN gevonden'}`);

  // Copy stats
  const cs = content.copyStats;
  parts.push(`## Tekst statistieken
- Totaal woorden: ${cs.totalWords}
- Gemiddelde zinslengte: ${cs.avgSentenceLength} woorden
- Aantal paragrafen: ${cs.paragraphCount}
- Prijsvermelding: ${cs.hasPriceMention ? 'JA' : 'NEE'}
- Taal: ${content.languageHints.detectedLang} (${content.languageHints.isDutch ? 'Nederlands' : 'niet-Nederlands'})`);

  // Footer
  if (content.footer.text) {
    parts.push(`## Footer\n"${content.footer.text.slice(0, 300)}"`);
  }

  // Design signals
  const ds = content.designSignals;
  parts.push(`## Visueel & Design
- Fonts: ${ds.fonts.length > 0 ? ds.fonts.join(', ') : 'Alleen systeemfonts'}
- Custom fonts: ${ds.hasCustomFonts ? 'JA' : 'NEE (alleen standaard fonts)'}
- Kleurenpalet: ${ds.colors.length > 0 ? ds.colors.slice(0, 10).join(', ') : 'Niet gedetecteerd'}
- Donkere achtergrond: ${ds.hasDarkBackground ? 'JA' : 'NEE'}
- Layout technieken: ${ds.layoutTechniques.length > 0 ? ds.layoutTechniques.join(', ') : 'Geen moderne layout gedetecteerd'}
- Afbeeldingen: ${ds.imageCount} stuks
- Video's: ${ds.videoCount} stuks
- Animaties/transities: ${ds.hasAnimations ? 'JA' : 'NEE'}
- Favicon: ${ds.hasFavicon ? 'JA' : 'NEE'}
- Viewport meta (mobiel-vriendelijk): ${ds.viewportMeta ? 'JA' : 'NEE'}`);

  return parts.join('\n\n');
}

function buildPrompt(
  content: ScrapedContent | null,
  url: string,
  overall: number,
  scores: Record<string, number>,
  topIssues: AuditIssue[]
): string {
  const technicalScores = `Technische scores (schaal 0-10):
- Overall: ${overall}/10
- Snelheid: ${scores.snelheid}/10
- SEO: ${scores.seo}/10
- Beveiliging: ${scores.beveiliging}/10
- Toegankelijkheid: ${scores.toegankelijkheid}/10`;

  const topIssuesList = topIssues
    .slice(0, 8)
    .map((i, idx) => `${idx + 1}. ${i.title}${i.displayValue ? ` (${i.displayValue})` : ''}`)
    .join('\n');

  const contentSection = content
    ? buildContentContext(content)
    : 'Content data niet beschikbaar - baseer je analyse op de technische scores.';

  return `Je bent een senior website auditor en conversie-optimalisatie expert die gespecialiseerd is in het Nederlands MKB. Je doet een audit van ${url}.

Je doel: geef de ondernemer een eerlijk, bruikbaar rapport dat hen laat zien wat er CONCREET beter kan aan hun website. Geen vage adviezen, geen buzzwords - specifieke observaties en actiegerichte aanbevelingen.

---

# TECHNISCHE DATA

${technicalScores}

Top technische problemen:
${topIssuesList || 'Geen significante technische problemen gevonden.'}

---

# WEBSITE CONTENT ANALYSE

${contentSection}

${content?.markdownContent ? `---

# VOLLEDIGE PAGINA-INHOUD (markdown)

${content.markdownContent.slice(0, 8000)}` : ''}

---

# OPDRACHT

Lever TWEE onderdelen:

## DEEL A: Executive Summary

Schrijf 3 korte, puntige paragrafen (gescheiden door dubbele newlines):

**Paragraaf 1 - Wat werkt** (1-2 zinnen): Benoem specifiek wat deze site goed doet. Refereer naar concrete elementen die je in de data ziet (een specifieke heading, een trust signal, een duidelijke CTA). Geen generieke complimenten.

**Paragraaf 2 - Grootste knelpunten** (2-3 zinnen): Benoem de 2-3 grootste problemen die bezoekers waarschijnlijk doen afhaken. Koppel technische problemen aan zakelijke impact. Bijvoorbeeld: "Je pagina laadt in 4.2 seconden op mobiel - onderzoek toont dat 53% van bezoekers afhaakt na 3 seconden."

**Paragraaf 3 - Een prioriteit** (1-2 zinnen): Als deze ondernemer maar 1 ding mag verbeteren, wat zou dat zijn? Kies het punt met de hoogste impact-per-effort ratio.

Stijlregels voor de summary:
- Spreek de ondernemer direct aan met "je" en "jouw"
- Wees specifiek: noem de exacte tekst/elementen die je ziet
- Geen marketing-jargon of cliches als "een professionele uitstraling"
- Onderbouw claims met data waar mogelijk (laadtijd, woordaantal, ontbrekende elementen)

## DEEL B: Content & Marketing Review

Beoordeel deze 6 aspecten. Geef per aspect een score (1-5), een observatie, en een aanbeveling.

### Scoreschaal
- 1 = Kritiek: ontbreekt volledig of is actief schadelijk
- 2 = Zwak: poging aanwezig maar ineffectief
- 3 = Basis: functioneel maar mist overtuigingskracht
- 4 = Goed: effectief, kleine verbeterpunten
- 5 = Uitstekend: best practice niveau

### De 6 aspecten

1. **Value Proposition** - Begrijpt een bezoeker binnen 5 seconden wat dit bedrijf doet, voor wie, en waarom zij de juiste keuze zijn?
   Kijk naar: H1 tekst, subtekst, is er een duidelijk "voor wie" en "wat los je op"?

2. **CTA Kwaliteit** - Zijn de call-to-actions specifiek, actiegericht en verleidelijk?
   Kijk naar: alle button-teksten. "Lees meer" en "Klik hier" zijn zwak. "Plan een gratis gesprek" of "Ontvang je offerte" zijn sterk. Is er een duidelijke primaire vs secundaire CTA?

3. **Social Proof** - Zijn er overtuigende vertrouwenssignalen?
   Kijk naar: testimonials (met naam + foto?), reviews (welk platform, hoeveel?), klantlogo's, certificeringen, concrete cijfers ("150+ projecten"). Kwantiteit EN kwaliteit tellen.

4. **Contact & Vertrouwen** - Kan een bezoeker makkelijk contact opnemen? Voelt het bedrijf betrouwbaar?
   Kijk naar: is er een telefoonnummer zichtbaar? E-mailadres? Fysiek adres? KvK nummer? Is er een contactpagina in de navigatie?

5. **Tekst Kwaliteit** - Is de copy klantgericht, concreet, en vrij van jargon?
   Kijk naar: wordt de klant aangesproken of praat het bedrijf over zichzelf? Zijn er concrete voordelen of alleen features? Is de tekst scanbaar (korte alinea's, bullets)?

6. **Navigatie & Structuur** - Vindt een bezoeker snel wat die zoekt?
   Kijk naar: aantal navigatie-items (5-7 is optimaal), zijn labels duidelijk? Is er een logische hiërarchie? Zijn er geen doodlopende paden?

### Regels voor observaties en aanbevelingen
- **Observatie**: beschrijf letterlijk wat je ziet in de data. Citeer exacte teksten tussen aanhalingstekens. Wees niet vaag.
  GOED: "Je primaire CTA zegt 'Meer informatie' - dit is passief en geeft de bezoeker geen reden om te klikken."
  SLECHT: "De CTA's kunnen beter."

- **Aanbeveling**: geef een concrete actie die de ondernemer morgen kan uitvoeren.
  GOED: "Vervang 'Meer informatie' door 'Vraag een gratis website-check aan' - dit is specifiek, gratis verlaagt de drempel, en het benoemt wat de bezoeker krijgt."
  SLECHT: "Maak de CTA's actiegerichter."

---

# RESPONSE FORMAT

Antwoord met ALLEEN onderstaand JSON object. Geen markdown codeblocks, geen extra tekst eromheen.

{
  "executiveSummary": "paragraaf 1\\n\\nparagraaf 2\\n\\nparagraaf 3",
  "findings": [
    {
      "category": "Value Proposition",
      "score": 3,
      "observation": "Je H1 zegt '...' maar het is niet duidelijk voor wie dit bedrijf werkt en welk probleem ze oplossen.",
      "recommendation": "Herschrijf de H1 naar '[concreet voorstel]' zodat bezoekers direct zien wat je voor hen kunt betekenen."
    },
    {
      "category": "CTA Kwaliteit",
      "score": 2,
      "observation": "...",
      "recommendation": "..."
    },
    {
      "category": "Social Proof",
      "score": 1,
      "observation": "...",
      "recommendation": "..."
    },
    {
      "category": "Contact & Vertrouwen",
      "score": 4,
      "observation": "...",
      "recommendation": "..."
    },
    {
      "category": "Tekst Kwaliteit",
      "score": 3,
      "observation": "...",
      "recommendation": "..."
    },
    {
      "category": "Navigatie & Structuur",
      "score": 3,
      "observation": "...",
      "recommendation": "..."
    }
  ]
}`;
}

async function callClaude(prompt: string): Promise<string | null> {
  if (!API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set, skipping AI analysis');
    return null;
  }

  const client = new Anthropic({ apiKey: API_KEY });

  try {
    const response = await client.messages.create({
      model: MODEL_ID,
      max_tokens: 4096,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock ? textBlock.text : null;
  } catch (err) {
    console.error('Claude API error:', err);
    return null;
  }
}

function parseAnalysis(response: string): AiAnalysisResult | null {
  try {
    // Strip markdown code fences if present
    const cleaned = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    const executiveSummary = typeof parsed.executiveSummary === 'string' ? parsed.executiveSummary.trim() : '';

    const expectedCategories = [
      'Value Proposition',
      'CTA Kwaliteit',
      'Social Proof',
      'Contact & Vertrouwen',
      'Tekst Kwaliteit',
      'Navigatie & Structuur',
    ];

    const contentFindings: ContentFinding[] = Array.isArray(parsed.findings)
      ? parsed.findings
          .filter((f: any) => f && typeof f === 'object')
          .map((f: any) => ({
            category: String(f.category || ''),
            score: Math.max(1, Math.min(5, Number(f.score) || 3)),
            observation: String(f.observation || ''),
            recommendation: String(f.recommendation || ''),
          }))
          .filter((f: ContentFinding) => f.category && f.observation)
      : [];

    // Ensure all 6 categories are present (fill missing with defaults)
    for (const cat of expectedCategories) {
      if (!contentFindings.some((f) => f.category === cat)) {
        contentFindings.push({
          category: cat,
          score: 3,
          observation: 'Niet genoeg data beschikbaar voor een volledige beoordeling.',
          recommendation: 'Controleer dit aspect handmatig.',
        });
      }
    }

    if (!executiveSummary && contentFindings.length === 0) return null;

    return { executiveSummary, contentFindings };
  } catch (err) {
    console.error('Failed to parse AI response:', err);
    return null;
  }
}

export async function runAiAnalysis(
  content: ScrapedContent | null,
  url: string,
  overall: number,
  scores: Record<string, number>,
  topIssues: AuditIssue[]
): Promise<AiAnalysisResult | null> {
  if (!API_KEY) return null;

  try {
    const prompt = buildPrompt(content, url, overall, scores, topIssues);
    const response = await callClaude(prompt);
    if (!response) return null;
    return parseAnalysis(response);
  } catch (err) {
    console.error('AI analysis failed:', err);
    return null;
  }
}
