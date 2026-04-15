'use client';

import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagicText } from '@/components/ui/MagicText';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { Button } from '@/components/ui/Button';
import { PackageCard } from './maintenance/PackageCard';
import { CompareModal } from './maintenance/CompareModal';
import { AddonsModal } from './maintenance/AddonsModal';
import { packages } from './maintenance/packages';

type Variant = 'homepage' | 'full';

interface MaintenanceSectionProps {
  title?: string;
  variant?: Variant;
}

export function MaintenanceSection({
  title = 'Jouw website blijft in topvorm',
  variant = 'full',
}: MaintenanceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !content) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const animTargets = content.querySelectorAll('.maintenance-animate');
        gsap.fromTo(
          animTargets,
          { opacity: 0, y: 60, scale: 0.94, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: content,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
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
        <div className="max-w-3xl mb-12 md:mb-16">
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
            text={
              'Je site staat live. En dan begint het pas. Updates, beveiligingspatches, trage pagina\u2019s, formulieren die stiekem niet meer werken. Precies waar je als ondernemer geen tijd voor hebt.\n\nDat neem ik uit handen.\nDrie pakketten, van alleen online houden tot een vaste partner die meedenkt, bouwt en schrijft.'
            }
            className="text-body text-dry-sage leading-relaxed max-w-2xl"
          />
        </div>

        <div ref={contentRef} className="space-y-12 md:space-y-16">
          {variant === 'full' ? (
            <FullVariant
              onOpenCompare={() => setCompareOpen(true)}
              onOpenAddons={() => setAddonsOpen(true)}
            />
          ) : (
            <HomepageVariant
              onOpenCompare={() => setCompareOpen(true)}
              onOpenAddons={() => setAddonsOpen(true)}
            />
          )}
        </div>
      </div>

      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
      <AddonsModal open={addonsOpen} onClose={() => setAddonsOpen(false)} />
    </section>
  );
}

interface VariantProps {
  onOpenCompare: () => void;
  onOpenAddons: () => void;
}

function FullVariant({ onOpenCompare, onOpenAddons }: VariantProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="secondary" onClick={onOpenCompare}>
            Vergelijk pakketten
          </Button>
          <Button variant="secondary" onClick={onOpenAddons}>
            Bekijk add-ons
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="text-center">
          <span className="text-small text-grey-olive/50">
            Liever geen abonnement? Ik werk ook op uurbasis voor
          </span>
          <span className="text-small text-cornsilk/80 font-medium"> &euro; 50/uur</span>
          <span className="text-small text-grey-olive/50">
            , perfect voor losse klussen of een nieuwe feature.{' '}
          </span>
          <a
            href="/contact"
            className="text-small text-dry-sage/70 underline underline-offset-4 decoration-dry-sage/30 hover:text-cornsilk hover:decoration-cornsilk/40 transition-colors duration-300"
          >
            Stuur me een bericht
          </a>
        </div>
      </FadeIn>
    </>
  );
}

function HomepageVariant({ onOpenCompare, onOpenAddons }: VariantProps) {
  return (
    <>
      <div className="maintenance-animate opacity-0 motion-reduce:opacity-100">
        <ul className="flex flex-col sm:flex-row sm:items-stretch gap-px bg-ebony/40 border border-ebony/60">
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className={`flex-1 p-6 md:p-7 bg-ink ${
                pkg.highlighted ? 'relative' : ''
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute top-3 right-3 text-caption font-mono tracking-[0.15em] uppercase text-cornsilk/80">
                  {pkg.badge}
                </span>
              )}
              <span className="block text-caption font-mono tracking-[0.25em] uppercase text-grey-olive/60 mb-3">
                {pkg.name}
              </span>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-caption text-grey-olive/50">&euro;</span>
                <span className="text-h2 font-bold text-cornsilk leading-none">{pkg.price}</span>
                <span className="text-caption text-grey-olive/50">/mnd</span>
              </div>
              <p className="text-small text-dry-sage/60 leading-snug">{pkg.pitch}</p>
            </li>
          ))}
        </ul>
      </div>

      <FadeIn delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="secondary" onClick={onOpenCompare}>
            Vergelijk pakketten
          </Button>
          <Button variant="secondary" onClick={onOpenAddons}>
            Bekijk add-ons
          </Button>
          <Button href="/diensten/development" variant="primary">
            Meer weten
          </Button>
        </div>
      </FadeIn>
    </>
  );
}
