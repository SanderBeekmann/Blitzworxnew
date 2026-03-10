import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { WebdesignPageClient } from './WebdesignPageClient';

export const metadata: Metadata = {
  title: 'Webdesign — Professioneel Ontwerp voor Ondernemers',
  description:
    'Professioneel webdesign voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk. Blitzworx maakt websites die werken.',
  openGraph: {
    title: 'Webdesign — Blitzworx',
    description:
      'Van concept tot visueel ontwerp dat past bij jouw merk. Websites die werken.',
    url: '/diensten/webdesign',
  },
  alternates: { canonical: '/diensten/webdesign' },
};

export default function WebdesignPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Diensten', item: `${siteUrl}/diensten` },
      { '@type': 'ListItem', position: 3, name: 'Webdesign', item: `${siteUrl}/diensten/webdesign` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WebdesignPageClient />
    </>
  );
}
