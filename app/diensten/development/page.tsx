import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { DevelopmentPageClient } from './DevelopmentPageClient';

export const metadata: Metadata = {
  title: 'Webdevelopment — Maatwerk Websites & Webapplicaties',
  description:
    'Op maat gemaakte websites en webapplicaties. Van eenvoudige sites tot complexe dashboards en backends. Blitzworx bouwt oplossingen die meegroeien met je bedrijf.',
  openGraph: {
    title: 'Webdevelopment — Blitzworx',
    description:
      'Maatwerk websites en webapplicaties die meegroeien met je bedrijf.',
    url: '/diensten/development',
  },
  alternates: { canonical: '/diensten/development' },
};

export default function DevelopmentPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Diensten', item: `${siteUrl}/diensten` },
      { '@type': 'ListItem', position: 3, name: 'Development', item: `${siteUrl}/diensten/development` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <DevelopmentPageClient />
    </>
  );
}
