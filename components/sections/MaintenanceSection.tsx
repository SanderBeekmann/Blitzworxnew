'use client';

import { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagicText } from '@/components/ui/MagicText';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { Button } from '@/components/ui/Button';

const plans = [
  {
    mono: '01',
    label: 'Onderhoud',
    price: '40',
    unit: '/maand',
    description:
      'Tot 2 uur onderhoud per maand. Kleine aanpassingen, content updates en technische support wanneer je het nodig hebt.',
    features: ['Kleine aanpassingen & fixes', 'Content updates', 'Technische support', 'Tot 2 uur per maand'],
  },
  {
    mono: '02',
    label: 'Hosting ontzorging',
    price: '10',
    unit: '/maand',
    description:
      'Volledig beheerde hosting zodat jij je kunt focussen op ondernemen. Monitoring, backups en optimale uptime.',
    features: ['Beheerde hosting', 'Dagelijkse backups', 'Uptime monitoring', 'SSL & beveiliging'],
  },
  {
    mono: '03',
    label: 'Op uurbasis',
    price: '50',
    unit: '/uur',
    description:
      'Zonder abonnement werk ik op uurbasis. Ideaal voor losse aanpassingen of nieuwe functionaliteiten. Flexibel inzetbaar wanneer je het nodig hebt.',
    features: ['Nieuwe features', 'Design aanpassingen', 'Functie-uitbreidingen', 'Geen vaste verplichting'],
    note: 'Grote nieuwe projecten vallen buiten deze bedragen.',
  },
];

export function MaintenanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        // Card stagger
        if (cards) {
          const items = cards.querySelectorAll('.maintenance-card');
          gsap.fromTo(
            items,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cards,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section relative overflow-hidden"
      aria-labelledby="maintenance-title"
    >
      <div className="container-narrow relative z-10">
        {/* Title + intro */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeIn>
            <span className="block text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50 mb-4">
              Na oplevering
            </span>
          </FadeIn>
          <TitleReveal
            as="h2"
            id="maintenance-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
          >
            Jouw website blijft in topvorm
          </TitleReveal>
          <MagicText
            text={"Je site staat live, maar dan begint het pas. Updates, beveiligingspatches, snelheidsoptimalisatie: het hoort erbij.\n\nMet een onderhoudsabonnement neem ik dat uit handen. Zo wordt je site als maar beter en blijft het presteren zonder dat jij er tijd aan kwijt bent.\nKom je met nieuwe inzichten of ideeën? Neem even contact op met BlitzWorx, dan wordt het geregeld zonder extra prijsafspraken of offertes."}
            className="text-body text-dry-sage leading-relaxed max-w-2xl"
          />
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.mono}
              className="maintenance-card group relative opacity-0 motion-reduce:opacity-100"
            >
              {/* Card */}
              <div className="relative h-full border border-ebony/60 p-6 md:p-8 transition-colors duration-500 hover:border-dry-sage/30 flex flex-col">
                {/* Mono number */}
                <span
                  className="block text-[4rem] md:text-[5rem] font-bold leading-none select-none mb-6"
                  style={{ color: 'rgba(139,129,116,0.07)' }}
                  aria-hidden
                >
                  {plan.mono}
                </span>

                {/* Label */}
                <span className="block text-caption font-mono tracking-[0.2em] uppercase text-grey-olive/60 mb-3">
                  {plan.label}
                </span>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-[0.9rem] text-grey-olive/50">€</span>
                  <span className="text-h2 md:text-h2-lg font-bold text-cornsilk leading-none">
                    {plan.price}
                  </span>
                  <span className="text-small text-grey-olive/50">{plan.unit}</span>
                </div>

                {/* Thin rule */}
                <div className="w-full h-px bg-ebony/40 mb-5" aria-hidden />

                {/* Description */}
                <p className="text-small text-dry-sage/70 leading-relaxed flex-1">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-dry-sage/40 shrink-0 leading-none">•</span>
                      <span className="text-small text-dry-sage/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Note */}
                {'note' in plan && plan.note && (
                  <p className="mt-5 text-caption text-grey-olive/40 italic">
                    {plan.note}
                  </p>
                )}

                {/* Corner accent — top right */}
                <div
                  className="absolute top-0 right-0 w-8 h-8 border-t border-r border-dry-sage/0 group-hover:border-dry-sage/20 transition-colors duration-500"
                  aria-hidden
                />
                {/* Corner accent — bottom left */}
                <div
                  className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-dry-sage/0 group-hover:border-dry-sage/20 transition-colors duration-500"
                  aria-hidden
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.4}>
          <div className="mt-14 md:mt-20 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Button href="/contact" variant="primary">
              Vraag een abonnement aan
            </Button>
            <span className="text-small text-grey-olive/50">
              Combineer onderhoud + hosting voor €45/maand
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
