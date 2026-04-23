import type { Metadata } from 'next';
import { Suspense } from 'react';
import { siteUrl } from '@/lib/site';
import { GradientBlob } from '@/components/ui/GradientBlob';
import { WebsiteScoreClient } from './WebsiteScoreClient';
import { FaqSection, buildFaqJsonLd } from '@/components/sections/FaqSection';
import type { FaqItem } from '@/components/sections/FaqSection';

export const metadata: Metadata = {
  title: 'Gratis Website Score - Test Jouw Website',
  description:
    'Controleer gratis hoe goed jouw website scoort op snelheid, SEO, beveiliging en toegankelijkheid. Ontvang direct een visueel rapport met verbeterpunten.',
  openGraph: {
    title: 'Gratis Website Score - BlitzWorx',
    description:
      'Test je website op snelheid, SEO, beveiliging en toegankelijkheid. Direct resultaat, gratis.',
    url: '/website-score',
  },
  alternates: { canonical: '/website-score' },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Wat controleert de website score check precies?',
    answer:
      'De check analyseert je website op vier punten: laadsnelheid, technische SEO (vindbaarheid), beveiliging (HTTPS en headers) en toegankelijkheid. Je krijgt per categorie een score van 0 tot 10 met concreet advies.',
  },
  {
    question: 'Is deze website check echt gratis?',
    answer:
      'Ja, volledig gratis en zonder verplichtingen. Je ziet je resultaten direct op het scherm. Optioneel kun je je e-mailadres achterlaten om het rapport per mail te ontvangen.',
  },
  {
    question: 'Hoe wordt de score berekend?',
    answer:
      'De scores zijn gebaseerd op Google PageSpeed Insights, dezelfde technologie die Google zelf gebruikt om websites te beoordelen. Elke categorie wordt gewogen: snelheid (40%), SEO (30%), beveiliging (20%) en toegankelijkheid (10%).',
  },
  {
    question: 'Wat kan ik doen als mijn score laag is?',
    answer:
      'Bij elke categorie krijg je concreet advies over wat je kunt verbeteren. Wil je hulp bij het doorvoeren van de verbeteringen? Plan een vrijblijvend gesprek met BlitzWorx - we denken graag mee.',
  },
  {
    question: 'Hoe vaak kan ik mijn website testen?',
    answer:
      'Resultaten per website worden 30 dagen gecached zodat je altijd dezelfde score ziet. Na die periode wordt een verse analyse gedraaid. Heb je net wijzigingen doorgevoerd? Neem contact op, dan vernieuwen we de scan handmatig.',
  },
];

export default function WebsiteScorePage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Website Score', item: `${siteUrl}/website-score` },
    ],
  };

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BlitzWorx Website Score',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    description: 'Gratis website analyse tool die je website scoort op snelheid, SEO, beveiliging en toegankelijkheid.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    creator: { '@id': `${siteUrl}/#organization` },
  };

  return (
    <div className="relative">
      <GradientBlob className="top-[10vh] right-[-8%] w-[350px] h-[300px] opacity-30" duration={22} />
      <GradientBlob className="top-[80vh] left-[-10%] w-[300px] h-[250px] opacity-25" duration={18} delay={6} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />
      <Suspense>
        <WebsiteScoreClient />
      </Suspense>
      <FaqSection items={FAQ_ITEMS} />
    </div>
  );
}
