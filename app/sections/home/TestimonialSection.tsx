'use client';

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
      'Professioneel, creatief en altijd bereikbaar. Blitzworx denkt mee en levert maatwerk dat precies aansluit bij wat we nodig hebben. Een echte aanrader.',
    author: 'Maria van Berg',
    role: 'Directeur',
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
          className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-16"
        >
          Wat anderen zeggen
        </TitleReveal>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.author} delay={index * 0.1}>
              <blockquote className="p-6 rounded-md bg-dry-sage border border-ebony flex flex-col h-full">
                <p className="text-body text-ink leading-relaxed flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
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
      </div>
    </section>
  );
}
