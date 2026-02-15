'use client';

import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { HeroBars } from '@/components/animations/HeroBars';
import { useEffect, useRef } from 'react';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<{ kill: () => void } | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const spacer = spacerRef.current;
    if (!hero || !spacer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        scrollTriggerRef.current?.kill();

        const tl = gsap.fromTo(
          hero,
          { filter: 'blur(0px)', scale: 1 },
          {
            filter: 'blur(12px)',
            scale: 0.92,
            ease: 'none',
            scrollTrigger: {
              trigger: spacer,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );

        scrollTriggerRef.current = tl.scrollTrigger ?? null;
      }
    );

    return () => scrollTriggerRef.current?.kill();
  }, []);

  return (
    <>
      <div
        ref={heroRef}
        className="fixed inset-x-0 top-0 h-screen z-0 flex flex-col justify-center origin-center"
        aria-hidden
      >
        <HeroBars />
        <section
          className="absolute inset-0 flex flex-col justify-center"
          aria-labelledby="hero-title"
        >
          <div className="container-narrow flex flex-col items-center text-center">
            <FadeIn className="flex flex-col items-center text-center">
              <h1
                id="hero-title"
                className="text-hero md:text-hero-lg font-bold text-cornsilk tracking-tight"
              >
                BLITZWORX
              </h1>
              <p className="mt-4 text-h3 md:text-h3-lg text-dry-sage max-w-prose mx-auto">
                Webdesign That Worx!
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Button href="/contact" variant="primary">
                  Contact
                </Button>
                <Button href="/cases" variant="outline">
                  Cases
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
      <div ref={spacerRef} className="h-screen" aria-hidden />
    </>
  );
}
