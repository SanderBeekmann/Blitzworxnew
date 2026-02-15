'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';
import { AboutScrollLine } from '@/components/animations/AboutScrollLine';

const SCROLL_HIDE_THRESHOLD = 60;

export function AboutPageClient() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < SCROLL_HIDE_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div id="about-page" className="relative">
      <AboutScrollLine />
      <section
        className="section relative z-20 min-h-screen h-screen flex flex-col justify-center text-center pt-0 bg-transparent"
        aria-labelledby="about-hero-title"
      >
        <div className="container-narrow relative z-20">
          <FadeIn>
            <h1
              id="about-hero-title"
              className="text-hero md:text-hero-lg font-bold text-cornsilk tracking-tight"
            >
              Introducing
              <br />
              Blitzworx!
            </h1>
          </FadeIn>
        </div>
        <FadeIn delay={0.5} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className={`flex flex-col items-center gap-2 aria-hidden ${!prefersReducedMotion ? 'transition-all duration-500 ease-out' : ''}`}
            aria-hidden
            style={{
              opacity: showScrollIndicator ? 1 : 0,
              transform: showScrollIndicator ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: showScrollIndicator ? 'auto' : 'none',
            }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-dry-sage/70 font-medium">
              Scroll
            </span>
            <div className="w-px h-8 bg-dry-sage/40 rounded-full overflow-hidden">
              <div
                className="w-full h-2 bg-dry-sage/80 rounded-full"
                style={{
                  animation: showScrollIndicator ? 'scroll-indicator 2s ease-in-out infinite' : 'none',
                }}
              />
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="section relative z-20 bg-transparent" aria-labelledby="vision-title">
        <div className="container-narrow relative z-20">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div />
            <FadeIn className="max-w-prose">
              <h2 id="vision-title" className="text-h2 md:text-h2-lg font-bold text-cornsilk text-left">
                Webdesign That Worx!
              </h2>
              <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed text-left">
                <p>
                  Blitzworx gelooft in kwaliteit, creativiteit en resultaat. Onze visie is simpel:
                  ondernemers helpen groeien met een online omgeving die past bij hun ambities.
                </p>
                <p>
                  We werken nauw samen, denken mee en leveren maatwerk. Geen standaard templates,
                  maar oplossingen die echt werken. Van eerste idee tot live website – en daarna.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section relative z-20 bg-transparent" aria-labelledby="creator-title">
        <div className="container-narrow relative z-20">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <h2 id="creator-title" className="text-h2 md:text-h2-lg font-bold text-cornsilk">
                Meet the Creator
              </h2>
              <p className="mt-4 text-h3 text-dry-sage">Sander</p>
              <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed">
                <p>
                  Als oprichter van Blitzworx combineer ik creativiteit met technische kennis. Mijn
                  motivatie? Ondernemers helpen hun online doelen te bereiken met websites die
                  echt werken.
                </p>
                <p>
                  Van concept tot code – ik begeleid het hele traject en zorg ervoor dat het
                  resultaat past bij jouw visie en je doelgroep.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative aspect-square rounded-md overflow-hidden bg-ebony">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                  alt="Sander - Oprichter Blitzworx"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
