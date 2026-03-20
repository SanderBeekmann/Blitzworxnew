import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { AiAutomatiseringenPageClient } from './AiAutomatiseringenPageClient';

export const metadata: Metadata = {
  title: 'AI Automatiseringen - Slimme Workflows voor Ondernemers',
  description:
    'AI-automatiseringen voor ondernemers. Van slimme workflows tot chatbots en integraties. Blitzworx bouwt automatiseringen die tijd besparen en je bedrijf laten groeien.',
  openGraph: {
    title: 'AI Automatiseringen - Blitzworx',
    description:
      'Slimme AI-workflows, chatbots en integraties voor ondernemers. Automatiseer en groei.',
    url: '/diensten/ai-automatiseringen',
  },
  alternates: { canonical: '/diensten/ai-automatiseringen' },
};

export default function AiAutomatiseringenPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Diensten', item: `${siteUrl}/diensten` },
      { '@type': 'ListItem', position: 3, name: 'AI Automatiseringen', item: `${siteUrl}/diensten/ai-automatiseringen` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AiAutomatiseringenPageClient />
    </>
  );
}
