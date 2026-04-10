import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteUrl } from '@/lib/site';
import { getAllLandingPages, getLandingPageBySlug } from '@/lib/landing-pages';
import { LandingPageContent } from './LandingPageContent';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllLandingPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page) return { title: 'Pagina niet gevonden' };

  const description = page.body
    .replace(/[#*\[\]()>_`]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 155);

  return {
    title: page.title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: page.title,
      description,
      url: `${siteUrl}/${slug}`,
      type: 'article',
      locale: 'nl_NL',
      siteName: 'BlitzWorx',
      images: [{ url: '/assets/images/og-image.png', width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description,
    },
    other: {
      'geo.region': 'NL',
      'geo.placename': 'Nederland',
      'content-language': 'nl',
    },
  };
}

export default async function LandingPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const sections = parseMarkdownSections(page.body);
  const faqItems = extractFaqs(page.body);

  const jsonLdLocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'BlitzWorx',
    description: 'Webdesign, development, branding, fotografie en automatiseringen op maat voor ondernemers',
    url: siteUrl,
    telephone: '+31612345678',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wapenveld',
      addressRegion: 'Gelderland',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.4309,
      longitude: 6.0752,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 52.4309, longitude: 6.0752 },
      geoRadius: '50000',
    },
    priceRange: 'EUR 750-2000',
    sameAs: ['https://www.linkedin.com/in/sander-beekman-38b054251/'],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Diensten', item: `${siteUrl}/diensten` },
      { '@type': 'ListItem', position: 3, name: page.title, item: `${siteUrl}/${slug}` },
    ],
  };

  const jsonLdFaq =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      <LandingPageContent
        title={page.title}
        sections={sections}
        faqItems={faqItems}
      />
    </>
  );
}

// --- Content parsing ---

export interface ContentSection {
  type: 'hero' | 'problem' | 'solution' | 'services' | 'testimonial' | 'faq' | 'cta' | 'generic';
  title: string;
  body: string;
  items?: Array<{ title: string; body: string }>;
}

function parseMarkdownSections(markdown: string): ContentSection[] {
  const sections: ContentSection[] = [];

  // Split on h2 headings
  const parts = markdown.split(/^## /m);

  // First part is the intro/hero (h1 + opening paragraphs)
  const intro = parts[0].trim();
  if (intro) {
    const lines = intro.split('\n');
    const h1Match = lines[0].match(/^# (.+)/);
    const title = h1Match ? h1Match[1] : '';
    const body = (h1Match ? lines.slice(1) : lines).join('\n').trim();
    sections.push({ type: 'hero', title, body });
  }

  // Process each h2 section
  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    const titleLower = title.toLowerCase();

    // Classify section by content
    if (titleLower.includes('waarom') && titleLower.includes('vastlopen') || titleLower.includes('probleem')) {
      sections.push({ type: 'problem', title, body });
    } else if (titleLower.includes('blitzworx') || titleLower.includes('oplossing') || titleLower.includes('resultaat')) {
      sections.push({ type: 'solution', title, body });
    } else if (titleLower.includes('diensten') || titleLower.includes('services')) {
      const items = parseSubsections(body);
      sections.push({ type: 'services', title, body, items });
    } else if (titleLower.includes('klanten zeggen') || titleLower.includes('testimonial') || titleLower.includes('reviews')) {
      sections.push({ type: 'testimonial', title, body });
    } else if (titleLower.includes('veelgestelde vragen') || titleLower.includes('faq')) {
      const items = parseSubsections(body);
      sections.push({ type: 'faq', title, body, items });
    } else if (titleLower.includes('klaar') || titleLower.includes('beginnen') || titleLower.includes('contact') || titleLower.includes('gesprek')) {
      sections.push({ type: 'cta', title, body });
    } else {
      // Check if it has h3 subsections
      const items = parseSubsections(body);
      if (items.length > 0) {
        sections.push({ type: 'generic', title, body, items });
      } else {
        sections.push({ type: 'generic', title, body });
      }
    }
  }

  return sections;
}

function parseSubsections(body: string): Array<{ title: string; body: string }> {
  const parts = body.split(/^### /m);
  if (parts.length <= 1) return [];

  return parts.slice(1).map((part) => {
    const lines = part.split('\n');
    return {
      title: lines[0].trim(),
      body: lines.slice(1).join('\n').trim(),
    };
  });
}

function extractFaqs(markdown: string): Array<{ question: string; answer: string }> {
  const faqSectionMatch = markdown.match(/## Veelgestelde vragen[\s\S]*/i);
  if (!faqSectionMatch) return [];

  const faqSection = faqSectionMatch[0];
  const items: Array<{ question: string; answer: string }> = [];
  const questionBlocks = faqSection.split(/^### /m).slice(1);

  for (const block of questionBlocks) {
    const lines = block.trim().split('\n');
    const question = lines[0].trim();
    const answer = lines
      .slice(1)
      .join('\n')
      .trim()
      .replace(/^#+\s.*/m, '')
      .trim();
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}
