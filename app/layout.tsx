import type { Metadata } from 'next';
import { gilroy } from '@/app/fonts';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgressIndicator } from '@/components/ui/ScrollProgressIndicator';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Blitzworx | Webdesign That Worx!',
    template: '%s | Blitzworx',
  },
  description:
    'Blitzworx is een ambitieuze creative agency gefocust op het totaalpakket voor ondernemers die online willen groeien. Webdesign, development en branding.',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
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
  return (
    <html lang="nl" className={gilroy.variable}>
      <body className={`${gilroy.className} min-h-screen flex flex-col font-sans`}>
        <ScrollProgressIndicator />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
