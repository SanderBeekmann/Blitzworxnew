import type { Metadata } from 'next';
import { gilroy } from '@/app/fonts';
import './globals.css';
import { SiteShell } from '@/components/layout/SiteShell';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Blitzworx | Webdesign That Worx!',
    template: '%s | Blitzworx',
  },
  description:
    'Blitzworx is een ambitieuze creative agency gefocust op het totaalpakket voor ondernemers die online willen groeien. Webdesign, development en branding.',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Blitzworx',
    images: [
      {
        url: '/assets/images/blueshipmentmockup.png',
        width: 1200,
        height: 630,
        alt: 'Blitzworx - Webdesign That Worx!',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/images/blueshipmentmockup.png'],
  },
  robots: {
    index: true,
    follow: true,
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
        description: 'Creative agency voor webdesign, development en branding. Webdesign That Worx!',
        logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/images/blueshipmentmockup.png` },
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
        description: 'Blitzworx is een ambitieuze creative agency gefocust op het totaalpakket voor ondernemers die online willen groeien.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'nl-NL',
      },
      {
        '@type': 'Service',
        serviceType: 'Webdesign',
        name: 'Webdesign',
        description: 'Professioneel webdesign voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk.',
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed: 'NL',
      },
      {
        '@type': 'Service',
        serviceType: 'Web Development',
        name: 'Webdevelopment',
        description: 'Op maat gemaakte websites en webapplicaties. Van eenvoudige sites tot complexe dashboards en backends.',
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed: 'NL',
      },
      {
        '@type': 'Service',
        serviceType: 'Branding',
        name: 'Branding',
        description: 'Merkidentiteit en huisstijl. Van logo tot complete visuele identiteit voor jouw onderneming.',
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed: 'NL',
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
