import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { BrandingPageClient } from './BrandingPageClient';

export const metadata: Metadata = {
  title: 'Branding',
  description:
    'Merkidentiteit en huisstijl voor ondernemers. Van logo tot complete visuele identiteit. Blitzworx helpt je merk herkenbaar en onderscheidend te maken.',
  alternates: { canonical: '/diensten/branding' },
};

export default function BrandingPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Diensten', item: `${siteUrl}/diensten` },
      { '@type': 'ListItem', position: 3, name: 'Branding', item: `${siteUrl}/diensten/branding` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BrandingPageClient />
    </>
  );
}
