import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteUrl } from '@/lib/site';
import { getAllLandingPages, getLandingPageBySlug } from '@/lib/landing-pages';
import { FadeIn } from '@/components/animations/FadeIn';
import { MarkdownContent } from '@/components/blog/MarkdownContent';

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
    title: `${page.title} | BlitzWorx`,
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

  const jsonLdLocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'BlitzWorx',
    description: 'Webdesign, development en AI-automatiseringen voor ondernemers',
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

  // Extract FAQ sections from markdown (## Veelgestelde vragen ... ### Question\n\nAnswer)
  const faqItems = extractFaqs(page.body);
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

      <main className="section min-h-screen">
        <div className="container-narrow">
          {/* Breadcrumb */}
          <FadeIn>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-small text-grey-olive">
              <Link href="/" className="hover:text-dry-sage transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/diensten" className="hover:text-dry-sage transition-colors">
                Diensten
              </Link>
              <span>/</span>
              <span className="text-dry-sage">{page.title}</span>
            </nav>
          </FadeIn>

          <article className="mt-12 md:mt-16 max-w-prose">
            <MarkdownContent content={page.body} />

            {/* CTA */}
            <section className="mt-16 p-8 md:p-12 border border-ebony rounded-sm bg-ink/50">
              <h2 className="text-h2 font-bold text-cornsilk">
                Klaar om te beginnen?
              </h2>
              <p className="mt-4 text-body text-dry-sage max-w-prose">
                Plan een vrijblijvend gesprek en ontdek wat BlitzWorx voor jouw bedrijf kan betekenen.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-cornsilk text-ink font-bold text-body rounded-sm hover:bg-dry-sage transition-colors"
                >
                  Plan een gesprek
                </Link>
                <Link
                  href="/diensten"
                  className="inline-flex items-center px-6 py-3 border border-cornsilk text-cornsilk font-bold text-body rounded-sm hover:bg-cornsilk hover:text-ink transition-colors"
                >
                  Bekijk alle diensten
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
    </>
  );
}

/**
 * Extracts FAQ items from markdown content.
 * Looks for h3 headings (###) after a "Veelgestelde vragen" h2 section.
 */
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
