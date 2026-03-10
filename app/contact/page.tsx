import type { Metadata } from 'next';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { ContactOnboarding } from '@/components/contact/ContactOnboarding';
import { PhoneLink } from '@/components/contact/PhoneLink';

export const metadata: Metadata = {
  title: 'Contact — Plan een Vrijblijvend Gesprek',
  description:
    'Neem contact op met Blitzworx. E-mail, telefoon of vul het formulier in voor een vrijblijvend gesprek over je website of merk.',
  openGraph: {
    title: 'Contact Blitzworx',
    description:
      'Neem contact op voor een vrijblijvend gesprek over je website of merk.',
    url: '/contact',
  },
  alternates: { canonical: '/contact' },
};

const FAQ_ITEMS = [
  {
    question: 'Hoe neem ik contact op met Blitzworx?',
    answer:
      'Je kunt contact opnemen via e-mail (sander@blitzworx.nl), telefoon of het contactformulier op deze pagina. Vul het formulier in voor een vrijblijvend intakegesprek.',
  },
  {
    question: 'Wat kost een website laten maken?',
    answer:
      'De kosten hangen af van de omvang en complexiteit van je project. Tijdens een vrijblijvend intakegesprek bespreken we je wensen en maken we een passende offerte op maat.',
  },
  {
    question: 'Hoe werkt het intakegesprek?',
    answer:
      'In een kort gesprek (online of telefonisch) bespreken we je doelen, doelgroep en wensen. Daarna ontvang je een offerte. Er zijn geen kosten of verplichtingen aan het gesprek verbonden.',
  },
  {
    question: 'In welke regio werkt Blitzworx?',
    answer:
      'Blitzworx werkt landelijk. We communiceren online en kunnen projecten overal in Nederland en daarbuiten uitvoeren.',
  },
] as const;

const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <section className="section min-h-screen flex flex-col justify-center py-20 md:py-32" aria-labelledby="contact-title">
        <div className="container-narrow">
          <TitleReveal
            as="h1"
            id="contact-title"
            className="text-hero md:text-hero-lg font-bold text-cornsilk mb-16"
          >
            Contact
          </TitleReveal>
          <div className="grid md:grid-cols-[1.4fr_0.6fr] gap-12 md:gap-16 lg:gap-20">
            <FadeIn delay={0.1}>
              <ContactOnboarding />
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="md:flex md:justify-end">
                <div className="text-left max-w-xs">
                  <h2 className="text-h3 font-semibold text-cornsilk">Contactgegevens</h2>
                  <address className="mt-6 not-italic space-y-4">
                    <p className="text-body text-dry-sage">
                      <strong className="text-cornsilk">E-mail</strong>
                      <br />
                      <a
                        href="mailto:sander@blitzworx.nl"
                        className="text-dry-sage hover:text-cornsilk hover:underline"
                      >
                        sander@blitzworx.nl
                      </a>
                    </p>
                    <PhoneLink />
                  </address>
                </div>
              </div>
            </FadeIn>
          </div>

          <section className="mt-24 md:mt-32" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-h2 font-bold text-cornsilk mb-12">
              Veelgestelde vragen
            </h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group border border-ebony rounded-sm"
                >
                  <summary className="cursor-pointer p-5 text-body font-bold text-cornsilk flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="text-grey-olive group-open:rotate-45 transition-transform duration-300 text-h3 shrink-0 ml-4">
                      +
                    </span>
                  </summary>
                  <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-body text-dry-sage leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
