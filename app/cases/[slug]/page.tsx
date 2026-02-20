import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cases } from '@/lib/cases';
import { CaseDetailContent } from '@/components/cases/CaseDetailContent';
import { siteUrl } from '@/lib/site';

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

function absoluteImageUrl(image: string): string {
  return image.startsWith('http') ? image : `${siteUrl}${image}`;
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = cases.find((c) => c.slug === slug);
  if (!caseItem) return { title: 'Case niet gevonden' };
  const canonical = `/cases/${slug}`;
  const hasImage = !caseItem.imagePlaceholder && caseItem.image;
  const ogImage = hasImage ? absoluteImageUrl(caseItem.image) : undefined;
  return {
    title: caseItem.title,
    description: caseItem.description,
    alternates: { canonical },
    openGraph: {
      title: caseItem.title,
      description: caseItem.description,
      url: `${siteUrl}${canonical}`,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: caseItem.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: caseItem.title,
      description: caseItem.description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function CaseDetailPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseItem = cases.find((c) => c.slug === slug);

  if (!caseItem) {
    notFound();
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Cases', item: `${siteUrl}/cases` },
      { '@type': 'ListItem', position: 3, name: caseItem.title, item: `${siteUrl}/cases/${slug}` },
    ],
  };

  const hasImage = !caseItem.imagePlaceholder && caseItem.image;
  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseItem.title,
    description: caseItem.description,
    author: { '@id': `${siteUrl}/#organization` },
    datePublished: caseItem.year,
    url: `${siteUrl}/cases/${slug}`,
    ...(hasImage && { image: absoluteImageUrl(caseItem.image) }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <CaseDetailContent caseItem={caseItem} />
    </>
  );
}
