'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagicText } from '@/components/ui/MagicText';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { Button } from '@/components/ui/Button';
import { PackageCard } from './maintenance/PackageCard';
import { CompareModal } from './maintenance/CompareModal';
import { AddonsModal } from './maintenance/AddonsModal';
import { packages } from './maintenance/packages';

const AUTO_ADVANCE_MS = 5000;
const SLIDE_DURATION = 0.7;

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
      <div className="maintenance-animate opacity-0 motion-reduce:opacity-100">
        <PackageSlideshow />
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

function PackageSlideshow() {
  const [index, setIndex] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const directionRef = useRef<1 | -1>(1);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gsapRef = useRef<typeof import('gsap').gsap | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const computePosition = useCallback((i: number, current: number) => {
    const n = packages.length;
    let offset = i - current;
    if (Math.abs(offset) > n / 2) {
      offset = offset > 0 ? offset - n : offset + n;
    }

    if (offset === 0) {
      return {
        xPercent: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 30,
        pointerEvents: 'auto' as const,
      };
    }
    if (offset === -1 || offset === 1) {
      return {
        xPercent: offset * 46,
        scale: 0.78,
        opacity: 0.45,
        filter: 'blur(6px)',
        zIndex: 20,
        pointerEvents: 'none' as const,
      };
    }
    return {
      xPercent: offset * 70,
      scale: 0.55,
      opacity: 0,
      filter: 'blur(10px)',
      zIndex: 10,
      pointerEvents: 'none' as const,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const apply = (gsap: typeof import('gsap').gsap, animated: boolean) => {
      if (cancelled) return;
      const dir = directionRef.current;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const props = computePosition(i, index);
        if (!animated) {
          gsap.set(el, props);
          return;
        }
        gsap.killTweensOf(el);
        const currentX = Number(gsap.getProperty(el, 'xPercent')) || 0;
        const wraps =
          (dir === 1 && currentX < 0 && props.xPercent > 0) ||
          (dir === -1 && currentX > 0 && props.xPercent < 0);
        if (wraps) {
          const exitSide = currentX < 0 ? -120 : 120;
          const half = SLIDE_DURATION / 2;
          const tl = gsap.timeline();
          tl.to(el, {
            xPercent: exitSide,
            opacity: 0,
            scale: 0.55,
            filter: 'blur(10px)',
            duration: half,
            ease: 'power2.in',
          });
          tl.set(el, { xPercent: -exitSide });
          tl.to(el, { ...props, duration: half, ease: 'power2.out' });
        } else {
          gsap.to(el, { ...props, duration: SLIDE_DURATION, ease: 'power3.inOut' });
        }
      });
    };

    if (gsapRef.current) {
      apply(gsapRef.current, !prefersReduced && initializedRef.current);
      initializedRef.current = true;
    } else {
      import('gsap').then(({ gsap }) => {
        if (cancelled) return;
        gsapRef.current = gsap;
        apply(gsap, false);
        initializedRef.current = true;
      });
    }

    return () => {
      cancelled = true;
    };
  }, [index, prefersReduced, computePosition]);

  const go = useCallback((dir: 1 | -1) => {
    directionRef.current = dir;
    setIndex((prev) => (prev + dir + packages.length) % packages.length);
  }, []);

  const jumpTo = useCallback((target: number) => {
    setIndex((prev) => {
      if (prev === target) return prev;
      directionRef.current = target > prev ? 1 : -1;
      return target;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      directionRef.current = 1;
      setIndex((prev) => (prev + 1) % packages.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [index]);

  return (
    <div className="relative mx-auto max-w-5xl" aria-roledescription="carousel">
      <div
        className="mb-8 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Pakket selectie"
      >
        {packages.map((pkg, i) => {
          const active = i === index;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => jumpTo(i)}
              role="tab"
              aria-selected={active}
              aria-label={`Toon pakket ${pkg.name}`}
              className={`rounded-full transition-all duration-500 ${
                active
                  ? 'w-5 h-1.5 bg-cornsilk shadow-[0_0_8px_rgba(254,250,220,0.35)]'
                  : 'w-1.5 h-1.5 bg-[rgba(254,250,220,0.35)] hover:bg-[rgba(254,250,220,0.7)]'
              }`}
            />
          );
        })}
        <span className="sr-only" aria-live="polite">
          Pakket {index + 1} van {packages.length}
        </span>
      </div>

      <div className="relative grid grid-cols-1 py-10 md:py-12">
        {packages.map((pkg, i) => {
          const isActive = i === index;
          return (
            <div
              key={pkg.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="col-start-1 row-start-1 flex justify-center will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} van ${packages.length}: ${pkg.name}`}
            >
              <PackageCard pkg={pkg} />
            </div>
          );
        })}
      </div>

      <SlideArrow direction="prev" onClick={() => go(-1)} />
      <SlideArrow direction="next" onClick={() => go(1)} />
    </div>
  );
}

function SlideArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Vorig pakket' : 'Volgend pakket'}
      className={`absolute top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-white/15 bg-ink/60 backdrop-blur-md text-cornsilk/80 hover:text-cornsilk hover:border-cornsilk/40 hover:bg-ink/80 transition-colors duration-300 ${
        isPrev ? 'left-2 md:left-6' : 'right-2 md:right-6'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={isPrev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
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
