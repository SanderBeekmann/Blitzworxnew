import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'Over Blitzworx - Ontmoet Sander, Creative Developer',
  description:
    'Maak kennis met Blitzworx en oprichter Sander. Ontdek onze visie, werkwijze en kernwaarden. Persoonlijke aanpak, geen tussenlagen.',
  openGraph: {
    title: 'Over Blitzworx - Ontmoet Sander',
    description:
      'Maak kennis met Blitzworx en oprichter Sander. Persoonlijke aanpak, geen tussenlagen.',
    url: '/about',
  },
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sander Beekman',
    jobTitle: 'Creative Developer & Oprichter',
    url: `${siteUrl}/about`,
    sameAs: [
      'https://www.linkedin.com/in/sander-beekman-38b054251/',
    ],
    worksFor: { '@id': `${siteUrl}/#organization` },
    knowsAbout: [
      'Webdesign',
      'Web Development',
      'UI/UX Design',
      'Branding',
      'Next.js',
      'React',
      'TypeScript',
      'Supabase',
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Over Blitzworx', item: `${siteUrl}/about` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutPageClient />
    </>
  );
}
