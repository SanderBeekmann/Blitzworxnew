'use client';

import { BlitzworxGraphic } from '@/components/ui/BlitzworxGraphic';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const DIENSTEN = [
  { label: 'Development', href: '/diensten/development' },
  { label: 'AI automatiseringen', href: '/diensten/ai-automatiseringen' },
  { label: 'Branding', href: '/diensten/branding' },
  { label: 'Webdesign', href: '/diensten/webdesign' },
];

export function HeroSection() {
  const dienstenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = dienstenRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.dienst-link').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    import('gsap').then(({ gsap }) => {
      const links = container.querySelectorAll('.dienst-link');
      gsap.fromTo(
        links,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: 2.8, ease: 'power3.out' }
      );
    });
  }, []);

  return (
      <div
        className="relative h-[100dvh] md:h-screen z-0 flex flex-col justify-center"
        aria-hidden
      >
        <section
          className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center"
          aria-labelledby="hero-title"
        >
          <div className="px-6 sm:px-10 md:px-6 lg:px-[4vw] xl:px-[8vw] 2xl:px-[12vw] text-center md:text-left">
            <TitleReveal
              as="h1"
              id="hero-title"
              className="text-[2.5rem] sm:text-[3.5rem] md:text-[3.2rem] lg:text-[4.4rem] xl:text-[5rem] 2xl:text-[7rem] leading-[1.05] font-bold text-cornsilk tracking-tight hero-title-depth"
              triggerOnMount
            >
              Development That Worx!
            </TitleReveal>
            <FadeIn delay={0.5}>
              <p className="mt-2 text-body md:text-small lg:text-h3 xl:text-body 2xl:text-h3 text-dry-sage/80 whitespace-nowrap">
                Applicaties & Automatiseringen op maat
              </p>
            </FadeIn>
            <FadeIn delay={0.9}>
              <div className="mt-16 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button href="/contact" variant="primary">
                  Contact
                </Button>
                <Button href="/cases" variant="outline">
                  Cases
                </Button>
              </div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="mt-10 flex justify-center md:hidden">
                <BlitzworxGraphic className="w-full max-w-[10rem] h-auto opacity-40" />
              </div>
            </FadeIn>
          </div>
          <div className="hidden md:flex items-center justify-center px-8 overflow-visible min-h-[200px]">
            <BlitzworxGraphic className="w-full max-w-[10rem] md:max-w-[12rem] lg:max-w-[16rem] xl:max-w-[14rem] 2xl:max-w-[18rem] h-auto" />
          </div>
        </section>

        <div ref={dienstenRef} className="absolute bottom-0 inset-x-0 py-6 md:py-8">
          <nav
            className="flex justify-center gap-x-12 gap-y-3 flex-wrap px-6"
            aria-label="Diensten"
          >
            {DIENSTEN.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="dienst-link relative group text-small md:text-body text-dry-sage/60 hover:text-cornsilk transition-colors opacity-0 motion-reduce:opacity-100"
              >
                {label}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-caption text-ink bg-cornsilk rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Ontdek dienst
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
  );
}
