import { siteUrl } from '@/lib/site';
import { posts, type Post } from '@/lib/posts';
import { cases, type Case } from '@/lib/cases';
import { supabase } from '@/lib/supabase';
import { getAllLandingPages, getLandingPageBySlug, type LandingPage } from '@/lib/landing-pages';

/**
 * Shared serializer for the markdown-mirror system. Every .md mirror served
 * from the site is built through buildMarkdownPage so the format stays
 * consistent for AI crawlers (llms.txt spec).
 */
export interface MarkdownPageInput {
  title: string;
  description?: string;
  url: string;
  publishedAt?: string;
  updatedAt?: string;
  content: string;
}

export function buildMarkdownPage(input: MarkdownPageInput): string {
  const lines: string[] = [];
  lines.push(`# ${input.title}`);
  lines.push('');
  if (input.description) {
    lines.push(`> ${input.description}`);
    lines.push('');
  }
  lines.push(`Source: ${input.url}`);
  if (input.publishedAt) lines.push(`Published: ${input.publishedAt}`);
  if (input.updatedAt) lines.push(`Updated: ${input.updatedAt}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(input.content.trim());
  lines.push('');
  return lines.join('\n');
}

export const markdownHeaders = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

/* ------------------------------------------------------------------ */
/* Static page descriptors                                             */
/* ------------------------------------------------------------------ */

interface StaticPage {
  /** path without leading slash, '' for home */
  path: string;
  title: string;
  description: string;
  body: string;
}

const STATIC_PAGES: StaticPage[] = [
  {
    path: '',
    title: 'BlitzWorx - Development, UI/UX Design & Branding voor Ondernemers',
    description:
      'BlitzWorx bouwt websites, webapplicaties en AI-automatiseringen voor ondernemers. Maatwerk dat groei oplevert.',
    body: `BlitzWorx is een Nederlandse studio voor webdesign, development, branding en AI-automatiseringen. We bouwen schaalbare websites en applicaties op maat voor ondernemers en MKB-bedrijven die online willen groeien.

## Wat we doen

- **Webdesign** - visueel ontwerp dat jouw merk versterkt en bezoekers overtuigt.
- **Development** - op maat gemaakte websites, dashboards en backends die meegroeien.
- **Branding** - merkidentiteit en huisstijl die je onderneming herkenbaar maken.
- **AI-automatiseringen** - slimme workflows, chatbots en integraties die tijd besparen.

## Voor wie

Ondernemers, MKB-bedrijven en scale-ups die een digitale partner zoeken voor de lange termijn. We werken vanuit Nederland en leveren in het Nederlands en Engels.

Bekijk onze [cases](${siteUrl}/cases.md), lees onze [blog](${siteUrl}/blog.md) of plan een [vrijblijvend gesprek](${siteUrl}/contact.md).`,
  },
  {
    path: 'about',
    title: 'Over BlitzWorx - Ontmoet Sander, Creative Developer',
    description:
      'BlitzWorx is opgericht door Sander, een creative developer met passie voor design en code. Lees het verhaal achter de studio.',
    body: `BlitzWorx is een one-person studio gerund door Sander - creative developer met een achtergrond in zowel design als development. Ik bouw digitale producten waarbij esthetiek en techniek hand in hand gaan.

Mijn werkwijze: kort op de bal, directe lijnen, geen onnodige tussenlagen. Je werkt rechtstreeks met de persoon die ontwerpt en bouwt. Dat scheelt tijd, miscommunicatie en kosten.

## Achtergrond

Met jarenlange ervaring in webdesign, frontend development (React, Next.js, TypeScript) en branding bouw ik websites die niet alleen mooi zijn, maar ook converteren en blijven werken. AI-automatiseringen zijn een steeds groter onderdeel van wat ik aanbied: van chatbots tot complete workflow-integraties.

## Contact

Plan een [vrijblijvend gesprek](${siteUrl}/contact.md) of bekijk eerder werk in de [cases](${siteUrl}/cases.md).`,
  },
  {
    path: 'contact',
    title: 'Contact - Plan een Vrijblijvend Gesprek',
    description:
      'Neem contact op met BlitzWorx voor webdesign, development of een AI-automatisering. Plan direct een vrijblijvend kennismakingsgesprek.',
    body: `Heb je een project in gedachten? Plan een vrijblijvend gesprek waarin we je idee, doelen en mogelijkheden bespreken.

- Website: ${siteUrl}/contact
- E-mail via het contactformulier op de site
- Reactietijd: meestal binnen 1 werkdag

We bespreken graag webdesign-, development-, branding- en AI-automatiseringsprojecten.`,
  },
  {
    path: 'diensten',
    title: 'Diensten - Development, Webdesign & Branding',
    description:
      'Webdesign, development, branding en AI-automatiseringen voor ondernemers. BlitzWorx helpt je online groeien met maatwerk dat werkt.',
    body: `BlitzWorx biedt vier kerndiensten, vaak gecombineerd binnen 1 project:

- [Webdesign](${siteUrl}/diensten/webdesign.md) - visueel ontwerp dat jouw merk versterkt en bezoekers overtuigt.
- [Development](${siteUrl}/diensten/development.md) - op maat gemaakte websites, dashboards en backends die meegroeien.
- [Branding](${siteUrl}/diensten/branding.md) - merkidentiteit en huisstijl die je onderneming herkenbaar maken.
- [AI-automatiseringen](${siteUrl}/diensten/ai-automatiseringen.md) - slimme workflows, chatbots en integraties die tijd besparen.`,
  },
  {
    path: 'diensten/webdesign',
    title: 'Webdesign - Professioneel Ontwerp voor Ondernemers',
    description:
      'Professioneel webdesign voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk. BlitzWorx maakt websites die werken.',
    body: `Webdesign bij BlitzWorx is geen sjabloonwerk. Elke website wordt op maat ontworpen met aandacht voor merkidentiteit, gebruikerservaring en conversie.

## Wat krijg je

- Visueel ontwerp dat past bij jouw merk en doelgroep
- Mobile-first responsive layouts
- Conversiegerichte structuur (heldere CTA's, vertrouwen-elementen)
- Snelle laadtijden en goede Core Web Vitals
- SEO-fundament op orde vanaf dag 1

## Werkwijze

1. Discovery - we bespreken je doelen, doelgroep en concurrenten
2. Strategie en wireframes
3. Visueel ontwerp in Figma
4. Development (zie [Development dienst](${siteUrl}/diensten/development.md))
5. Launch en optimalisatie

Plan een [vrijblijvend gesprek](${siteUrl}/contact.md) om te bespreken wat past bij jouw situatie.`,
  },
  {
    path: 'diensten/development',
    title: 'Development - Maatwerk Websites & Webapplicaties',
    description:
      'Maatwerk development van websites, webapplicaties en dashboards. Gebouwd met Next.js, TypeScript en Supabase voor performance en schaalbaarheid.',
    body: `BlitzWorx bouwt maatwerk websites en webapplicaties. Geen WordPress-templates, geen page builders. Alles op een moderne stack die schaalt.

## Tech stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, auth, storage), Node.js, Resend
- **Hosting**: Netlify, Vercel
- **Animatie**: GSAP, Framer Motion

## Wat we bouwen

- Marketing- en bedrijfswebsites
- Webapplicaties en SaaS-producten
- Dashboards en admin-panels
- API-integraties en custom backends
- E-commerce op maat

Resultaat: snel, veilig, onderhoudbaar en schaalbaar. Plan een [gesprek](${siteUrl}/contact.md).`,
  },
  {
    path: 'diensten/branding',
    title: 'Branding - Merkidentiteit & Huisstijl',
    description:
      'Branding en merkidentiteit voor ondernemers. Logo, kleurpalet, typografie en huisstijl die je bedrijf herkenbaar maken.',
    body: `Een sterk merk is meer dan een logo. BlitzWorx ontwikkelt complete merkidentiteiten die consistent zijn over alle touchpoints.

## Wat valt onder branding

- Logo-ontwerp en variaties
- Kleurpalet en typografie
- Huisstijl-elementen (visitekaartjes, briefpapier, social templates)
- Brand guidelines document
- Tone of voice en messaging

Branding wordt vaak gecombineerd met [webdesign](${siteUrl}/diensten/webdesign.md), zodat merk en website een eenheid vormen.`,
  },
  {
    path: 'diensten/ai-automatiseringen',
    title: 'AI Automatiseringen - Slimme Workflows voor Ondernemers',
    description:
      'AI-automatiseringen voor ondernemers: chatbots, content-pipelines en workflow-integraties die tijd besparen en processen versnellen.',
    body: `AI is geen gimmick meer. BlitzWorx bouwt praktische AI-oplossingen die direct tijd besparen of nieuwe omzet opleveren.

## Wat we bouwen

- **Chatbots** - klantenservice en lead-kwalificatie via WhatsApp, web of e-mail
- **Content-pipelines** - geautomatiseerde productie van blogs, social posts, nieuwsbrieven
- **Workflow-integraties** - koppelingen tussen je tools (Notion, Airtable, Slack, CRM)
- **Documentverwerking** - PDF's, contracten, facturen automatisch parsen
- **Custom agents** - taakspecifieke AI die met jouw data werkt

We werken met o.a. Claude (Anthropic), OpenAI, n8n en custom Next.js APIs. Plan een [gesprek](${siteUrl}/contact.md) om te bespreken waar AI in jouw bedrijf het meeste oplevert.`,
  },
  {
    path: 'cases',
    title: 'Cases - Recent werk van BlitzWorx',
    description:
      'Bekijk recente projecten van BlitzWorx: maatwerk websites, webapplicaties en branding voor ondernemers.',
    body: `Een selectie van recent werk. Elke case heeft een eigen pagina met de volledige aanpak en resultaten.

Volledige lijst staat in [llms.txt](${siteUrl}/llms.txt).`,
  },
  {
    path: 'blog',
    title: 'Blog - Tips over webdesign, development en branding',
    description:
      'Blog van BlitzWorx over webdesign, development, branding en AI-automatiseringen. Praktische tips en achtergronden voor ondernemers.',
    body: `Op de BlitzWorx blog delen we praktische tips, achtergronden en lessen uit het bouwen van websites en automatiseringen voor ondernemers.

Volledige lijst staat in [llms.txt](${siteUrl}/llms.txt).`,
  },
  {
    path: 'podcasts',
    title: 'Podcasts - BlitzWorx',
    description:
      'Podcast-afleveringen van BlitzWorx over ondernemen, technologie en bouwen.',
    body: `BlitzWorx maakt podcasts over ondernemen, design en technologie. Bekijk de losse afleveringen op [${siteUrl}/podcasts](${siteUrl}/podcasts).`,
  },
];

/* ------------------------------------------------------------------ */
/* Loaders                                                              */
/* ------------------------------------------------------------------ */

function postToMarkdown(post: Post): string {
  return buildMarkdownPage({
    title: post.title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}.md`,
    publishedAt: post.dateISO,
    updatedAt: post.dateModifiedISO,
    content: post.content,
  });
}

function caseToMarkdown(c: Case): string {
  return buildMarkdownPage({
    title: c.title,
    description: c.description,
    url: `${siteUrl}/cases/${c.slug}.md`,
    content: c.fullStory ?? c.description,
  });
}

function staticToMarkdown(p: StaticPage): string {
  return buildMarkdownPage({
    title: p.title,
    description: p.description,
    url: `${siteUrl}/${p.path}.md`.replace('//.md', '/index.md'),
    content: p.body,
  });
}

function landingToMarkdown(p: LandingPage): string {
  return buildMarkdownPage({
    title: p.title,
    description: undefined,
    url: `${siteUrl}/${p.slug}.md`,
    publishedAt: p.created_at,
    updatedAt: p.updated_at ?? undefined,
    content: p.body,
  });
}

interface PodcastRow {
  slug: string;
  title: string;
  description: string | null;
  topic: string | null;
  show_notes: string | null;
  transcript: string | null;
  published_at: string;
  updated_at: string | null;
}

async function fetchPodcast(slug: string): Promise<PodcastRow | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('podcasts')
    .select('slug, title, description, topic, show_notes, transcript, published_at, updated_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return (data as PodcastRow) ?? null;
}

async function fetchAllPodcasts(): Promise<PodcastRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('podcasts')
    .select('slug, title, description, topic, show_notes, transcript, published_at, updated_at')
    .eq('status', 'published');
  return (data as PodcastRow[]) ?? [];
}

function podcastToMarkdown(p: PodcastRow): string {
  const parts: string[] = [];
  if (p.description || p.topic) parts.push(p.description ?? p.topic ?? '');
  if (p.show_notes) parts.push('## Show notes\n\n' + p.show_notes);
  if (p.transcript) parts.push('## Transcript\n\n' + p.transcript);
  return buildMarkdownPage({
    title: p.title,
    description: p.description ?? p.topic ?? undefined,
    url: `${siteUrl}/podcasts/${p.slug}.md`,
    publishedAt: p.published_at,
    updatedAt: p.updated_at ?? undefined,
    content: parts.join('\n\n').trim() || p.title,
  });
}

/* ------------------------------------------------------------------ */
/* Public dispatcher                                                    */
/* ------------------------------------------------------------------ */

/**
 * Resolve a request path (without `.md` suffix) to a markdown response body.
 * Returns null when no mirror exists for that path.
 */
export async function renderMarkdownForPath(path: string): Promise<string | null> {
  const normalized = path.replace(/^\/+|\/+$/g, '');

  // Static pages
  const staticHit = STATIC_PAGES.find((p) => p.path === normalized);
  if (staticHit) return staticToMarkdown(staticHit);
  if (normalized === 'index') {
    const home = STATIC_PAGES.find((p) => p.path === '');
    if (home) return staticToMarkdown(home);
  }

  // Blog posts
  if (normalized.startsWith('blog/')) {
    const slug = normalized.slice('blog/'.length);
    const post = posts.find((p) => p.slug === slug);
    if (post) return postToMarkdown(post);
  }

  // Cases
  if (normalized.startsWith('cases/')) {
    const slug = normalized.slice('cases/'.length);
    const c = cases.find((x) => x.slug === slug);
    if (c) return caseToMarkdown(c);
  }

  // Podcasts
  if (normalized.startsWith('podcasts/')) {
    const slug = normalized.slice('podcasts/'.length);
    const podcast = await fetchPodcast(slug);
    if (podcast) return podcastToMarkdown(podcast);
  }

  // Landing pages (top-level slug from Supabase)
  if (!normalized.includes('/')) {
    const landing = await getLandingPageBySlug(normalized);
    if (landing) return landingToMarkdown(landing);
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* llms.txt + llms-full.txt                                             */
/* ------------------------------------------------------------------ */

export async function buildLlmsTxt(): Promise<string> {
  const lines: string[] = [];
  lines.push('# BlitzWorx');
  lines.push('');
  lines.push(
    '> Webdesign, development, branding en AI-automatiseringen voor ondernemers en MKB. Nederlandse studio die maatwerk websites en webapplicaties bouwt.',
  );
  lines.push('');

  lines.push('## Diensten');
  for (const path of [
    'diensten/webdesign',
    'diensten/development',
    'diensten/branding',
    'diensten/ai-automatiseringen',
  ]) {
    const sp = STATIC_PAGES.find((p) => p.path === path)!;
    lines.push(`- [${sp.title}](${siteUrl}/${path}.md): ${sp.description}`);
  }
  lines.push('');

  lines.push('## Cases');
  for (const c of cases) {
    lines.push(`- [${c.title}](${siteUrl}/cases/${c.slug}.md): ${c.description}`);
  }
  lines.push('');

  lines.push('## Blog');
  for (const p of posts) {
    lines.push(`- [${p.title}](${siteUrl}/blog/${p.slug}.md): ${p.description}`);
  }
  lines.push('');

  const podcasts = await fetchAllPodcasts();
  if (podcasts.length > 0) {
    lines.push('## Podcasts');
    for (const p of podcasts) {
      const desc = p.description ?? p.topic ?? '';
      lines.push(`- [${p.title}](${siteUrl}/podcasts/${p.slug}.md): ${desc}`);
    }
    lines.push('');
  }

  const landings = await getAllLandingPages();
  if (landings.length > 0) {
    lines.push('## Landingspagina\'s');
    for (const l of landings) {
      lines.push(`- [${l.title}](${siteUrl}/${l.slug}.md)`);
    }
    lines.push('');
  }

  lines.push('## Optional');
  lines.push(`- [Over BlitzWorx](${siteUrl}/about.md)`);
  lines.push(`- [Contact](${siteUrl}/contact.md)`);
  lines.push('');

  return lines.join('\n');
}

export async function buildLlmsFullTxt(): Promise<string> {
  const sections: string[] = [];

  for (const sp of STATIC_PAGES) {
    sections.push(staticToMarkdown(sp));
  }
  for (const c of cases) {
    sections.push(caseToMarkdown(c));
  }
  for (const post of posts) {
    sections.push(postToMarkdown(post));
  }
  const podcasts = await fetchAllPodcasts();
  for (const pod of podcasts) {
    sections.push(podcastToMarkdown(pod));
  }
  const landings = await getAllLandingPages();
  for (const l of landings) {
    sections.push(landingToMarkdown(l));
  }

  return sections.join('\n\n---\n\n');
}

/** All canonical .md mirror URLs (used by sitemap.ts) */
export async function listMirrorPaths(): Promise<string[]> {
  const paths: string[] = [];
  for (const sp of STATIC_PAGES) {
    paths.push(sp.path === '' ? '/index.md' : `/${sp.path}.md`);
  }
  for (const c of cases) paths.push(`/cases/${c.slug}.md`);
  for (const p of posts) paths.push(`/blog/${p.slug}.md`);
  const podcasts = await fetchAllPodcasts();
  for (const p of podcasts) paths.push(`/podcasts/${p.slug}.md`);
  const landings = await getAllLandingPages();
  for (const l of landings) paths.push(`/${l.slug}.md`);
  return paths;
}
