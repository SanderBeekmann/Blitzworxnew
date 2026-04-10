import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { AiAutomatiseringenPageClient } from './AiAutomatiseringenPageClient';
import { FaqSection, buildFaqJsonLd } from '@/components/sections/FaqSection';
import type { FaqItem } from '@/components/sections/FaqSection';

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

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Wat is een AI-automatisering precies?',
    answer:
      'Een AI-automatisering is software die taken overneemt die nu handmatig worden uitgevoerd. Denk aan het automatisch verwerken van inkomende e-mails, het genereren van rapportages, of een chatbot die klantvragen beantwoordt. Het doel: minder handwerk, minder fouten, meer tijd voor je kernactiviteiten.',
  },
  {
    question: 'Welke taken kunnen geautomatiseerd worden?',
    answer:
      'Vrijwel elke repetitieve taak is te automatiseren: leadopvolging, facturatie, contentcreatie, klantvragen beantwoorden, data uit verschillende systemen samenvoegen, rapportages maken en afspraken inplannen. Als je iets elke week hetzelfde doet, is het waarschijnlijk te automatiseren.',
  },
  {
    question: 'Moet ik technische kennis hebben om het te gebruiken?',
    answer:
      'Nee. Elke automatisering wordt zo gebouwd dat jij en je team het zonder technische kennis kunnen gebruiken. Je krijgt een duidelijke uitleg en waar nodig een eenvoudige interface. Het draait op de achtergrond, jij ziet alleen het resultaat.',
  },
  {
    question: 'Is mijn bedrijfsdata veilig bij AI-automatiseringen?',
    answer:
      'Ja. Alle automatiseringen draaien op beveiligde servers met versleutelde verbindingen. Bedrijfsdata wordt niet gedeeld met derden en niet gebruikt voor training van AI-modellen. Waar nodig wordt data lokaal verwerkt in plaats van via externe API\'s.',
  },
  {
    question: 'Wat kost een AI-automatisering?',
    answer:
      'De kosten hangen af van de complexiteit. Een eenvoudige workflow-automatisering begint bij een paar honderd euro. Complexere systemen met meerdere koppelingen en een chatbot vragen meer investering. Je ontvangt altijd vooraf een helder voorstel met vaste prijs.',
  },
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />
      <AiAutomatiseringenPageClient />
      <FaqSection items={FAQ_ITEMS} />
    </>
  );
}
