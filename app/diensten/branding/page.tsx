import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { BrandingPageClient } from './BrandingPageClient';
import { FaqSection, buildFaqJsonLd } from '@/components/sections/FaqSection';
import type { FaqItem } from '@/components/sections/FaqSection';

export const metadata: Metadata = {
  title: 'Branding - Merkidentiteit & Huisstijl',
  description:
    'Merkidentiteit en huisstijl voor ondernemers. Van logo tot complete visuele identiteit. Blitzworx helpt je merk herkenbaar en onderscheidend te maken.',
  openGraph: {
    title: 'Branding - Blitzworx',
    description:
      'Van logo tot complete visuele identiteit. Herkenbaar en onderscheidend.',
    url: '/diensten/branding',
  },
  alternates: { canonical: '/diensten/branding' },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Wat zit er in een huisstijl pakket?',
    answer:
      'Een complete huisstijl bevat een logo (primair + varianten), kleurenpalet, typografie, beeldrichting en een merkhandboek (brand guide). Het merkhandboek beschrijft precies hoe alle elementen worden toegepast, zodat je merk op elk kanaal consistent overkomt.',
  },
  {
    question: 'Kan ik alleen een logo laten ontwerpen?',
    answer:
      'Ja, een los logo-ontwerp is mogelijk. Maar een logo zonder huisstijl is als een gezicht zonder persoonlijkheid. Voor de sterkste resultaten adviseer ik altijd een volledige merkidentiteit, zodat je logo, kleuren, lettertype en beeldtaal samen een herkenbaar geheel vormen.',
  },
  {
    question: 'Hoeveel revisierondes zijn inbegrepen?',
    answer:
      'Bij elk branding-traject zijn maximaal 3 revisierondes inbegrepen. In de praktijk is het ontwerp na 1 tot 2 rondes definitief, omdat we vooraf in de ontdekkingsfase goed afstemmen wat je wilt en nodig hebt.',
  },
  {
    question: 'Krijg ik de bronbestanden van mijn logo?',
    answer:
      'Ja. Na oplevering ontvang je alle bronbestanden: vectorformaat (SVG), hoge resolutie (PNG), en drukklare bestanden (PDF). Je hebt volledige eigendomsrechten op het eindresultaat en kunt het overal inzetten.',
  },
  {
    question: 'Kan BlitzWorx ook de website bij de huisstijl bouwen?',
    answer:
      'Absoluut, dat is juist de kracht van alles onder een dak. Als dezelfde persoon je branding en website maakt, zijn ze vanaf het begin op elkaar afgestemd. Geen miscommunicatie tussen een designer en een developer.',
  },
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />
      <BrandingPageClient />
      <FaqSection items={FAQ_ITEMS} />
    </>
  );
}
