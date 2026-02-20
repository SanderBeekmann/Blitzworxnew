'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { SubtitleReveal } from '@/components/animations/SubtitleReveal';
import { AboutScrollLine } from '@/components/animations/AboutScrollLine';
import { Button } from '@/components/ui/Button';

const SCROLL_HIDE_THRESHOLD = 60;

export function AboutPageClient() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const creatorImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = creatorImageRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set(el, { x: '100%' });
        gsap.to(el, {
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'bottom bottom',
            toggleActions: 'play none none none',
          },
        });
      }
    );
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
          <TitleReveal
            as="h1"
            id="about-hero-title"
            className="text-hero md:text-hero-lg font-bold text-cornsilk tracking-tight block"
            triggerOnMount
          >
            Introducing Blitzworx!
          </TitleReveal>
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

      <section className="section relative z-20 bg-transparent min-h-screen h-screen flex flex-col justify-center py-0" aria-labelledby="vision-title">
        <div className="container-narrow relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="hidden md:block" aria-hidden />
            <div className="max-w-prose text-center md:text-left">
              <SubtitleReveal
                as="h2"
                id="vision-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk text-center md:text-left"
              />
              <FadeIn delay={0.2}>
                <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed text-center md:text-left">
                <p>
                  Blitzworx gelooft in kwaliteit, creativiteit en resultaat. Onze visie is simpel:
                  ondernemers helpen groeien met een online omgeving die past bij hun ambities.
                </p>
                <p>
                  We werken nauw samen, denken mee en leveren maatwerk. Geen standaard templates,
                  maar oplossingen die echt werken. Van eerste idee tot live website, en daarna.
                </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="section relative z-20 bg-transparent min-h-screen h-screen flex flex-col justify-center py-0" aria-labelledby="selling-solutions-title">
        <div className="container-narrow relative z-20">
          <TitleReveal
            as="h2"
            id="selling-solutions-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk text-left mb-12"
          >
            Selling solutions
          </TitleReveal>
          <FadeIn delay={0.2}>
            <div className="max-w-prose space-y-6 text-body text-dry-sage leading-relaxed text-left">
              <p>
                Bij Blitzworx kijken we verder dan alleen de voorkant van een website. We ontwerpen en bouwen complete digitale oplossingen die jouw bedrijf echt ondersteunen. Denk aan compacte CRM systemen, overzichtelijke dashboards en maatwerk backends die processen vereenvoudigen en inzicht geven.
              </p>
              <p>
                Alles wat we bouwen is afgestemd op jouw manier van werken. Geen overbodige complexiteit, maar slimme functies die tijd besparen en meegroeien met je onderneming. Zo ontstaat een solide technische basis achter een sterke, overtuigende online uitstraling.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section relative z-20 bg-transparent overflow-visible min-h-screen h-screen flex flex-col justify-center py-0" aria-labelledby="creator-title">
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_1fr] gap-8 md:gap-12 lg:gap-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-container mx-auto w-full md:mx-0 md:max-w-none md:pr-12 lg:pr-16 order-2 md:order-1">
            <div>
              <TitleReveal
                as="h2"
                id="creator-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk text-center md:text-left"
              >
                Meet the Creator
              </TitleReveal>
              <FadeIn delay={0.2}>
                <p className="mt-4 text-h3 text-dry-sage text-center md:text-left">Sander</p>
                <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed text-center md:text-left">
                <p>
                  Als oprichter van Blitzworx combineer ik creativiteit met technische kennis. Mijn
                  motivatie? Ondernemers helpen hun online doelen te bereiken met websites die
                  echt werken.
                </p>
                <p>
                  Van concept tot code. Ik begeleid het hele traject en zorg ervoor dat het
                  resultaat past bij jouw visie en je doelgroep.
                </p>
                </div>
              </FadeIn>
            </div>
          </div>
          <div className="flex justify-center md:contents order-1 md:order-2">
            <div
              ref={creatorImageRef}
              className="creator-image group relative w-full max-w-[320px] sm:max-w-[360px] aspect-[4/3] overflow-hidden bg-ebony mx-auto md:mx-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:w-[38vw] md:max-w-[480px] md:min-w-[280px] flex items-center justify-center isolate"
            >
              <Image
                src="/assets/images/sander.webp"
                alt="Sander, oprichter van Blitzworx"
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                sizes="(max-width: 768px) 360px, 38vw"
              />
              <div
                className="absolute inset-0 pointer-events-none origin-center scale-100 opacity-100 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-150 group-hover:opacity-0 motion-reduce:transition-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 0%, rgba(4,7,17,0.35) 45%, rgba(4,7,17,0.85) 100%)',
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section relative z-20 bg-transparent min-h-screen h-screen flex flex-col justify-center py-0" aria-labelledby="about-cta-title">
        <div className="container-narrow relative z-20 flex flex-col items-center text-center gap-8">
          <TitleReveal
            as="h2"
            id="about-cta-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk"
          >
            Klaar om te starten?
          </TitleReveal>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-body text-dry-sage max-w-prose mx-auto">
              Laten we kennismaken en samen ontdekken hoe we jouw online doelen kunnen bereiken.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Button href="/contact" variant="primary">
              Neem contact op
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
