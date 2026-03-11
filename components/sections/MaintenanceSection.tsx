'use client';

import { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
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
      'Grotere aanpassingen of nieuwe functionaliteiten buiten het abonnement. Flexibel inzetbaar wanneer je wilt groeien.',
    features: ['Nieuwe features', 'Design aanpassingen', 'Functie-uitbreidingen', 'Geen vaste verplichting'],
  },
];

export function MaintenanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rule = ruleRef.current;
    const cards = cardsRef.current;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        // Rule draw
        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: rule,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

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
      className="section relative border-t border-ebony overflow-hidden"
      aria-labelledby="maintenance-title"
    >
      <div className="container-narrow relative z-10">
        {/* Section label + rule */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-16 md:mb-24">
            <span className="text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50">
              Na oplevering
            </span>
            <div
              ref={ruleRef}
              className="flex-1 h-px bg-ebony origin-left motion-reduce:!transform-none"
              style={{ transform: 'scaleX(0)' }}
              aria-hidden
            />
          </div>
        </FadeIn>

        {/* Title + intro */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <TitleReveal
            as="h2"
            id="maintenance-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
          >
            Jouw website blijft in topvorm
          </TitleReveal>
          <FadeIn delay={0.15}>
            <p className="text-body text-dry-sage leading-relaxed max-w-2xl">
              Een website is nooit helemaal &lsquo;af&rsquo;. Met een onderhoudsabonnement blijft je
              site veilig, snel en up-to-date, zonder dat je er zelf naar om hoeft te kijken.
            </p>
          </FadeIn>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.mono}
              className="maintenance-card group relative opacity-0 motion-reduce:opacity-100"
            >
              {/* Card */}
              <div className="relative h-full border border-ebony/60 p-6 md:p-8 transition-colors duration-500 hover:border-dry-sage/30">
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
                <p className="text-small text-dry-sage/70 leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-dry-sage/40 shrink-0" />
                      <span className="text-small text-dry-sage/60">{feature}</span>
                    </li>
                  ))}
                </ul>

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
