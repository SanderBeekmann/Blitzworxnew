'use client';

import { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagicText } from '@/components/ui/MagicText';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { Button } from '@/components/ui/Button';

const bundleFeatures = [
  'Tot 2 uur aanpassingen per maand',
  'Beheerde hosting met dagelijkse backups',
  'SSL-certificaat & uptime monitoring',
  'Domeinregistratie & DNS-beheer',
  'Jaarlijkse domeinverlenging geregeld',
  'Technische support',
];

export function MaintenanceSection({ title = 'Jouw website blijft in topvorm' }: { title?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        if (content) {
          const animTargets = content.querySelectorAll('.maintenance-animate');
          gsap.fromTo(
            animTargets,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: content,
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
            {title}
          </TitleReveal>
          <MagicText
            text={"Je site staat live, maar dan begint het pas. Updates, beveiligingspatches, snelheidsoptimalisatie: het hoort erbij.\n\nMet een onderhoudsabonnement neem ik dat uit handen. Zo wordt je site steeds beter en blijft het presteren zonder dat jij er tijd aan kwijt bent."}
            className="text-body text-dry-sage leading-relaxed max-w-2xl"
          />
        </div>

        {/* Layout: bundle (left) + email add-on (right) */}
        <div ref={contentRef} className="space-y-14 md:space-y-20">

          {/* === Main row: Bundle + E-mail === */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* Bundle card */}
            <div className="maintenance-animate opacity-0 motion-reduce:opacity-100 group relative">
              <div
                className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(254,250,220,0.05) 0%, transparent 70%)' }}
                aria-hidden
              />

              <div className="relative h-full border border-ebony/60 group-hover:border-dry-sage/25 transition-colors duration-500 p-8 md:p-10 lg:p-12">
                {/* Top accent line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-dry-sage/20 to-transparent" aria-hidden />

                {/* Label */}
                <span className="inline-flex items-center gap-2 text-caption font-mono tracking-[0.3em] uppercase text-cornsilk/70 mb-6">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-cornsilk/50" aria-hidden>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Compleet ontzorgd
                </span>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-body text-grey-olive/50">€</span>
                  <span className="text-[3rem] md:text-[3.5rem] font-bold text-cornsilk leading-none tracking-tight">50</span>
                  <span className="text-body text-grey-olive/50">/maand</span>
                </div>

                {/* Subtitle */}
                <p className="text-small text-dry-sage/60 leading-relaxed mb-8 max-w-md">
                  Onderhoud, hosting en domeinbeheer gebundeld. Terwijl jij je focust op de bedrijfsvoering, zorg ik ervoor dat je website draaiend blijft.
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-ebony/40 mb-8" aria-hidden />

                {/* Features grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                  {bundleFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-dry-sage/60 shrink-0 mt-0.5" aria-hidden>
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-small text-dry-sage/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price breakdown + savings */}
                <div className="border border-ebony/40 p-5 md:p-6 mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Breakdown */}
                    <div className="space-y-1.5">
                      <span className="block text-caption font-mono tracking-[0.15em] uppercase text-grey-olive/40 mb-2">
                        Losse prijzen
                      </span>
                      <div className="flex items-center gap-3 text-small text-grey-olive/50">
                        <span>Onderhoud</span>
                        <span className="flex-1 border-b border-dotted border-ebony/30" aria-hidden />
                        <span>€40</span>
                      </div>
                      <div className="flex items-center gap-3 text-small text-grey-olive/50">
                        <span>Hosting</span>
                        <span className="flex-1 border-b border-dotted border-ebony/30" aria-hidden />
                        <span>€10</span>
                      </div>
                      <div className="flex items-center gap-3 text-small text-grey-olive/50">
                        <span>Domeinbeheer</span>
                        <span className="flex-1 border-b border-dotted border-ebony/30" aria-hidden />
                        <span>€5</span>
                      </div>
                      <div className="w-full h-px bg-ebony/40 my-1" aria-hidden />
                      <div className="flex items-center gap-3 text-small text-grey-olive/60">
                        <span>Totaal los</span>
                        <span className="flex-1 border-b border-dotted border-ebony/30" aria-hidden />
                        <span className="line-through">€55/maand</span>
                      </div>
                    </div>

                    {/* Savings highlight */}
                    <div className="sm:text-right shrink-0">
                      <span className="block text-caption font-mono tracking-[0.15em] uppercase text-dry-sage/60 mb-1">
                        Jij betaalt
                      </span>
                      <span className="block text-h3 md:text-h3-lg font-bold text-cornsilk leading-none mb-2">
                        €50/maand
                      </span>
                      <span className="inline-block px-3 py-1.5 text-caption font-mono tracking-[0.1em] uppercase text-cornsilk font-medium">
                        Bespaar €60 per jaar
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button href="/contact?pakket=compleet" variant="primary">
                    Start met het combipakket
                  </Button>
                  <span className="text-caption text-grey-olive/40">
                    Maandelijks opzegbaar
                  </span>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-dry-sage/0 group-hover:border-dry-sage/15 transition-colors duration-500" aria-hidden />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-dry-sage/0 group-hover:border-dry-sage/15 transition-colors duration-500" aria-hidden />
              </div>
            </div>

            {/* E-mail add-on card */}
            <div className="maintenance-animate opacity-0 motion-reduce:opacity-100 group relative border border-ebony/60 p-6 md:p-8 transition-colors duration-500 hover:border-dry-sage/20 h-full flex flex-col">
              <span className="block text-caption font-mono tracking-[0.2em] uppercase text-grey-olive/50 mb-4">
                Add-on
              </span>

              {/* E-mail icon */}
              <div className="flex items-center gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cornsilk/60" aria-hidden>
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M22 4L12 13 2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-body font-medium text-cornsilk">E-mail op eigen domein</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[0.85rem] text-grey-olive/50">€</span>
                <span className="text-h3 font-bold text-cornsilk leading-none">15</span>
                <span className="text-small text-grey-olive/50">/user/maand</span>
              </div>

              <p className="text-small text-dry-sage/50 leading-relaxed mb-5">
                Professionele e-mail via Outlook of Gmail op jouw domeinnaam. Setup, DNS-configuratie en support inbegrepen.
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {['Outlook of Gmail', 'Volledige setup & configuratie', 'SPF & DKIM records geregeld'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-dry-sage/50 shrink-0 mt-0.5" aria-hidden>
                      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-caption text-dry-sage/50">{f}</span>
                  </li>
                ))}
              </ul>

              <Button href="/contact?pakket=email" variant="secondary" className="w-full text-small">
                Voeg e-mail toe
              </Button>
            </div>
          </div>

          {/* === Flexibel / uurbasis === */}
          <FadeIn delay={0.3}>
            <div className="text-center">
              <span className="text-small text-grey-olive/50">
                Liever geen abonnement? Ik werk ook op uurbasis voor
              </span>
              <span className="text-small text-cornsilk/80 font-medium"> €50/uur</span>
              <span className="text-small text-grey-olive/50">
                {' '}- ideaal voor losse aanpassingen of nieuwe features.{' '}
              </span>
              <a href="/contact" className="text-small text-dry-sage/70 underline underline-offset-4 decoration-dry-sage/30 hover:text-cornsilk hover:decoration-cornsilk/40 transition-colors duration-300">
                Neem contact op
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
