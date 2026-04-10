import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { DevelopmentPageClient } from './DevelopmentPageClient';
import { FaqSection, buildFaqJsonLd } from '@/components/sections/FaqSection';
import type { FaqItem } from '@/components/sections/FaqSection';

export const metadata: Metadata = {
  title: 'Development - Maatwerk Websites & Webapplicaties',
  description:
    'Op maat gemaakte websites en webapplicaties. Van eenvoudige sites tot complexe dashboards en backends. Blitzworx bouwt oplossingen die meegroeien met je bedrijf.',
  openGraph: {
    title: 'Development - Blitzworx',
    description:
      'Maatwerk websites en webapplicaties die meegroeien met je bedrijf.',
    url: '/diensten/development',
  },
  alternates: { canonical: '/diensten/development' },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Wat is het verschil tussen een website en een webapplicatie?',
    answer:
      'Een website toont informatie en is vooral bedoeld om bezoekers te informeren of te overtuigen. Een webapplicatie is interactief: gebruikers kunnen inloggen, gegevens invoeren, taken uitvoeren of data beheren. Denk aan een planningssysteem, klantenportaal of dashboard.',
  },
  {
    question: 'Welke technologieen gebruikt BlitzWorx?',
    answer:
      'BlitzWorx bouwt met Next.js, React en TypeScript voor de frontend, en Supabase (PostgreSQL) voor de backend. Dit zijn moderne, bewezen technologieen die snel, veilig en schaalbaar zijn. Geen WordPress, geen templates.',
  },
  {
    question: 'Kan mijn applicatie later uitgebreid worden?',
    answer:
      'Ja. Elke applicatie wordt modulair gebouwd met schone, gedocumenteerde code. Nieuwe functionaliteit, koppelingen met externe systemen of extra gebruikersrollen kunnen altijd worden toegevoegd zonder het fundament te hoeven herbouwen.',
  },
  {
    question: 'Hoe werkt het maandelijks abonnement voor applicaties?',
    answer:
      'Maatwerk applicaties werken op een maandelijks abonnement plus eenmalige installatieprijs. Het abonnement dekt hosting, onderhoud, updates en support. De prijs wordt per project bepaald op basis van complexiteit en scope, met een minimale afname van 2 jaar.',
  },
  {
    question: 'Hoe zit het met beveiliging en privacy?',
    answer:
      'Beveiliging is ingebouwd, niet achteraf toegevoegd. Elke applicatie gebruikt versleutelde verbindingen (HTTPS), Row Level Security in de database, en veilige authenticatie. Persoonsgegevens worden verwerkt conform de AVG.',
  },
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />
      <DevelopmentPageClient />
      <FaqSection items={FAQ_ITEMS} />
    </>
  );
}
