'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

const testimonials = [
  {
    quote:
      'Blitzworx heeft onze visie perfect vertaald naar een website die zowel functioneel als visueel sterk is. De samenwerking verliep soepel en het resultaat overtreft onze verwachtingen.',
    author: 'Jan de Vries',
    role: 'Ondernemer',
    company: 'FleetCare Connect',
  },
  {
    quote:
      'Sander van Blitzworx heeft voor ons fulfilment center een hele mooie website gebouwd (blueshipment.nl). We zijn erg tevreden met het eindresultaat. Naast het bouwen van de website dacht Sander ook actief mee over de opzet en uitstraling, wat voor ons echt meerwaarde had. De samenwerking verliep prettig en duidelijk. Al met al zeer tevreden en we zullen in de toekomst zeker weer bij Blitzworx aankloppen.',
    author: 'Reitze Douma',
    role: 'Co-founder',
    company: 'BlueShipment',
  },
];

export function TestimonialSection() {
  return (
    <section className="section border-t border-ebony !pb-32 md:!pb-40" aria-labelledby="testimonials-title">
      <div className="container-narrow">
        <TitleReveal
          as="h2"
          id="testimonials-title"
          className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-16 text-center"
        >
          Wat anderen zeggen
        </TitleReveal>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.author} delay={index * 0.1}>
              <blockquote className="p-6 rounded-md bg-dry-sage border border-ebony flex flex-col h-full transition-all duration-500 ease-out hover:border-dry-sage/80 hover:shadow-[0_0_48px_rgba(254,250,220,0.08),0_0_24px_rgba(202,202,170,0.12)] hover:-translate-y-0.5">
                <p className="text-body text-ink leading-relaxed flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex gap-1 mt-4" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-ink shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <footer className="mt-6 pt-4 border-t border-[rgba(4,7,17,0.8)]">
                  <cite className="not-italic">
                    <span className="font-semibold text-ink block">{testimonial.author}</span>
                    <span className="text-small text-[rgba(4,7,17,0.8)]">
                      {testimonial.role}
                      {testimonial.company && ` · ${testimonial.company}`}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <Link
            href="https://nl.trustpilot.com/review/blitzworx.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body text-dry-sage hover:text-cornsilk underline underline-offset-4 transition-colors"
            aria-label="Laat een review achter op Trustpilot (opent in nieuw tabblad)"
          >
            Laat een review achter
          </Link>
        </div>
      </div>
    </section>
  );
}
