import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { WebdesignPageClient } from './WebdesignPageClient';
import { FaqSection, buildFaqJsonLd } from '@/components/sections/FaqSection';
import type { FaqItem } from '@/components/sections/FaqSection';

export const metadata: Metadata = {
  title: 'Webdesign - Professioneel Ontwerp voor Ondernemers',
  description:
    'Professioneel webdesign voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk. Blitzworx maakt websites die werken.',
  openGraph: {
    title: 'Webdesign - Blitzworx',
    description:
      'Van concept tot visueel ontwerp dat past bij jouw merk. Websites die werken.',
    url: '/diensten/webdesign',
  },
  alternates: { canonical: '/diensten/webdesign' },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Wat kost een website laten maken bij BlitzWorx?',
    answer:
      'Een maatwerk website start vanaf EUR 1.500. De exacte prijs hangt af van het aantal pagina\'s, de complexiteit van het ontwerp en eventuele extra functionaliteit zoals een contactformulier of koppeling met externe systemen. Je ontvangt altijd vooraf een transparante offerte.',
  },
  {
    question: 'Hoe lang duurt het om een website te laten maken?',
    answer:
      'Een gemiddelde website is binnen 2 tot 4 weken klaar. Het proces bestaat uit vier fases: kennismaking en analyse, prototype en richting, bouw en voortgang, en oplevering. De doorlooptijd hangt af van hoe snel feedback wordt aangeleverd.',
  },
  {
    question: 'Kan ik mijn website zelf aanpassen na oplevering?',
    answer:
      'Ja. Elke website wordt opgeleverd met een gebruiksvriendelijk beheersysteem. Daarnaast kun je met het Digitaal Beheer pakket (vanaf EUR 59/maand) terecht voor kleine aanpassingen, updates en technisch onderhoud.',
  },
  {
    question: 'Is de website geschikt voor mobiel?',
    answer:
      'Absoluut. Meer dan 60% van het webverkeer komt via mobiel. Elk ontwerp wordt mobile-first ontwikkeld: eerst ontworpen voor telefoon, daarna opgeschaald naar tablet en desktop. Zo ziet je website er op elk scherm goed uit.',
  },
  {
    question: 'Wordt mijn website vindbaar in Google?',
    answer:
      'Elke website wordt gebouwd met technische SEO als basis: snelle laadtijden, schone code, correcte heading-structuur, meta-tags en geoptimaliseerde afbeeldingen. Voor uitgebreidere SEO-strategieen kun je aanvullend een vindbaarheids-traject afnemen.',
  },
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />
      <WebdesignPageClient />
      <FaqSection items={FAQ_ITEMS} />
    </>
  );
}
