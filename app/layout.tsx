
import type { Metadata } from 'next';
import { gilroy } from '@/app/fonts';
import './globals.css';
import { Suspense } from 'react';
import { SiteShell } from '@/components/layout/SiteShell';
import { TrackingBeacon } from '@/components/tracking/TrackingBeacon';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon1.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  title: {
    default: 'Blitzworx | Development That Worx!',
    template: '%s | Blitzworx',
  },
  description:
    'Blitzworx bouwt websites, webapplicaties en bedrijfstools op maat. Webdesign, development en branding vanuit Zwolle.',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Blitzworx',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blitzworx - Development That Worx!',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'geo.region': 'NL',
    'geo.placename': 'Nederland',
    'content-language': 'nl',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Blitzworx',
        url: siteUrl,
        description: 'Webdesign, development en branding op maat voor ondernemers die online willen groeien.',
        foundingDate: '2025',
        logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/images/og-image.png` },
        sameAs: [
          'https://www.linkedin.com/company/blitzworx/',
          'https://www.instagram.com/blitzworx.nl/',
        ],
        founder: {
          '@type': 'Person',
          name: 'Sander Beekman',
          url: `${siteUrl}/about`,
          sameAs: 'https://www.linkedin.com/in/sander-beekman-38b054251/',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'sander@blitzworx.nl',
          contactType: 'customer service',
          availableLanguage: 'Dutch',
          areaServed: 'NL',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Blitzworx',
        description: 'Blitzworx bouwt websites, webapplicaties en bedrijfstools op maat voor ondernemers die online willen groeien.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'nl-NL',
      },
      {
        '@type': 'Service',
        serviceType: 'UI/UX Design',
        name: 'UI/UX Design',
        description: 'Professioneel UI/UX design voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk.',
        provider: { '@id': `${siteUrl}/#organization` },
        url: `${siteUrl}/diensten/webdesign`,
        areaServed: 'NL',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: '1500',
          description: 'Maatwerk website vanaf EUR 1.500',
        },
      },
      {
        '@type': 'Service',
        serviceType: 'Web Development',
        name: 'Development',
        description: 'Op maat gemaakte websites en webapplicaties. Van eenvoudige sites tot complexe dashboards en backends.',
        provider: { '@id': `${siteUrl}/#organization` },
        url: `${siteUrl}/diensten/development`,
        areaServed: 'NL',
      },
      {
        '@type': 'Service',
        serviceType: 'Branding',
        name: 'Branding',
        description: 'Merkidentiteit en huisstijl. Van logo tot complete visuele identiteit voor jouw onderneming.',
        provider: { '@id': `${siteUrl}/#organization` },
        url: `${siteUrl}/diensten/branding`,
        areaServed: 'NL',
      },
      {
        '@type': 'Service',
        serviceType: 'AI Automation',
        name: 'AI Automatiseringen',
        description: 'Slimme AI-workflows, chatbots en integraties voor ondernemers. Automatiseer repetitieve taken en bespaar tijd.',
        provider: { '@id': `${siteUrl}/#organization` },
        url: `${siteUrl}/diensten/ai-automatiseringen`,
        areaServed: 'NL',
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#localbusiness`,
        name: 'Blitzworx',
        url: siteUrl,
        description: 'Webdesign, development, branding, fotografie en automatiseringen op maat voor ondernemers in Nederland.',
        logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/images/og-image.png` },
        image: `${siteUrl}/assets/images/og-image.png`,
        email: 'sander@blitzworx.nl',
        priceRange: '$$',
        areaServed: {
          '@type': 'Country',
          name: 'Nederland',
          sameAs: 'https://en.wikipedia.org/wiki/Netherlands',
        },
        serviceArea: {
          '@type': 'GeoShape',
          addressCountry: 'NL',
        },
        availableLanguage: [
          { '@type': 'Language', name: 'Dutch', alternateName: 'nl' },
          { '@type': 'Language', name: 'English', alternateName: 'en' },
        ],
        parentOrganization: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="nl" className={gilroy.variable}>
      <body className={`${gilroy.className} min-h-screen flex flex-col font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>
          <TrackingBeacon />
        </Suspense>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
