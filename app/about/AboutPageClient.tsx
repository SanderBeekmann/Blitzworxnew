'use client';

import { GradientBlob } from '@/components/ui/GradientBlob';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { MagicText } from '@/components/ui/MagicText';
import { SubtitleReveal } from '@/components/animations/SubtitleReveal';
import { Button } from '@/components/ui/Button';

const services = [
  {
    title: 'Webdesign',
    description: 'Websites die niet alleen mooi zijn, maar bezoekers ook aanzetten tot actie. Elk ontwerp is gebouwd om te converteren.',
    href: '/diensten/webdesign',
    span: '',
  },
  {
    title: 'Fotografie',
    description: 'Professionele beelden via mijn vaste partnerfotograaf. Authentieke foto\'s die jouw merk tot leven brengen.',
    href: '/contact',
    span: '',
  },
  {
    title: 'Branding',
    description: 'Een visuele identiteit die blijft hangen. Van logo tot huisstijl, consistent en herkenbaar op elk kanaal.',
    href: '/diensten/branding',
    span: '',
  },
  {
    title: 'Development',
    description: 'Schaalbare applicaties gebouwd met moderne technologie. Performance, veiligheid en een solide technische basis staan centraal.',
    href: '/diensten/development',
    span: 'md:row-span-2',
  },
  {
    title: 'AI Automatiseringen',
    description: 'Slimme workflows, chatbots en integraties die repetitieve taken overnemen. Meer focus op groei, minder op handwerk.',
    href: '/diensten/ai-automatiseringen',
    span: 'md:col-span-2',
  },
  {
    title: 'Vindbaarheid',
    description: 'Gevonden worden door de juiste mensen op het juiste moment. SEO, snelheid en technische optimalisatie die samen zorgen voor organische groei.',
    href: '/contact',
    span: '',
  },
];

const SCROLL_HIDE_THRESHOLD = 60;

const SLIDES = [
  {
    src: '/assets/images/mc-dashboard.webp',
    alt: 'Michelangelo dashboard - AI-gestuurd projectbeheer',
    label: 'SaaS applicatie',
    description: 'Maatwerk platform met AI-agents die dagelijkse taken automatiseren.',
  },
  {
    src: '/assets/images/agencyos-dashboard.webp',
    alt: 'AgencyOS dashboard - maatwerk CRM en projectbeheer',
    label: 'Dashboard',
    description: 'Intern CRM-systeem voor projectbeheer, leads en klantcommunicatie.',
  },
  {
    src: '/assets/images/cases/gastvrijmoed-1.png',
    alt: 'GastVrijmoed - website voor ambachtelijk meubelmaker',
    label: 'E-commerce',
    description: 'Webshop en portfolio voor een ambachtelijk meubelmaker.',
  },
];

function WorkSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <FadeIn>
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-md"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(4,7,17,0.3) 0%, rgba(4,7,17,0.15) 50%, rgba(4,7,17,0.6) 100%)',
          }}
          aria-hidden
        />

        {/* Arrow left */}
        <button
          onClick={() => setActive((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-cornsilk/10 text-cornsilk/80 hover:bg-black/60 hover:text-cornsilk transition-all duration-200"
          aria-label="Vorige slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Arrow right */}
        <button
          onClick={() => setActive((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-cornsilk/10 text-cornsilk/80 hover:bg-black/60 hover:text-cornsilk transition-all duration-200"
          aria-label="Volgende slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-20">
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-cornsilk/80">
            {SLIDES[active].label}
          </span>
        </div>

        {/* Dots */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-cornsilk/30 ${
                i === active ? 'bg-cornsilk scale-125' : 'bg-cornsilk/20'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Timer bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cornsilk/10 z-20">
          <div
            className={`h-full bg-cornsilk/40 ${paused ? '' : 'animate-slide-timer'}`}
            style={{
              animation: paused ? 'none' : 'slide-timer 4s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-small text-dry-sage/60 leading-relaxed transition-opacity duration-500">
        {SLIDES[active].description}
      </p>
    </FadeIn>
  );
}

export function AboutPageClient() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const creatorImageRef = useRef<HTMLDivElement>(null);
  const ctaRuleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // ── Creator image clip-path reveal + desaturation ──
  useEffect(() => {
    const el = creatorImageRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(el, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        const photo = el.querySelector('.creator-photo') as HTMLElement;
        if (photo) {
          gsap.set(photo, { filter: 'grayscale(100%)' });
          gsap.to(photo, {
            filter: 'grayscale(0%)',
            duration: 1.6,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }
      }
    );
  }, []);

  // ── Horizontal rules: draw on scroll ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ruleRefs = [ctaRuleRef];

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        ruleRefs.forEach((ref) => {
          const el = ref.current;
          if (!el) return;

          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    );
  }, []);



  // ── Scroll indicator ──
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
      <GradientBlob className="top-[60vh] right-[-5%] w-[350px] h-[280px] opacity-30" duration={24} delay={2} />
      <GradientBlob className="top-[220vh] left-[-8%] w-[400px] h-[350px] opacity-35" duration={19} delay={6} />

      {/* ── HERO ── */}
      <section
        className="section relative z-20 min-h-screen h-screen flex flex-col justify-center text-center pt-0 bg-transparent"
        aria-labelledby="about-hero-title"
      >
        <div className="container-narrow relative z-20">
          {/* Architectural corner accents */}
          <div className="hidden md:block absolute -top-16 left-0 w-12 h-12 border-t border-l border-ebony/40" aria-hidden />
          <div className="hidden md:block absolute -top-16 right-0 w-12 h-12 border-t border-r border-ebony/40" aria-hidden />

          <FadeIn delay={0.1}>
            <span className="block text-caption font-mono tracking-[0.3em] uppercase text-grey-olive mb-6">
              Blitzworx - AI-Driven Development
            </span>
          </FadeIn>

          <TitleReveal
            as="h1"
            id="about-hero-title"
            className="text-hero md:text-hero-lg lg:text-hero-xl font-bold text-cornsilk tracking-tight block hero-title-depth"
            triggerOnMount
          >
            Introducing Blitzworx!
          </TitleReveal>

          <FadeIn delay={0.6}>
            <SubtitleReveal
              as="p"
              className="text-h3 md:text-h3-lg text-dry-sage mt-4"
            />
          </FadeIn>
        </div>

        <FadeIn delay={0.8} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className={`flex flex-col items-center gap-2 ${!prefersReducedMotion ? 'transition-all duration-500 ease-out' : ''}`}
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

      {/* ── MISSIE & VISIE ── */}
      <section
        className="section relative z-20 bg-transparent py-24 md:py-32"
        aria-labelledby="missie-visie-title"
      >
        <div className="container-narrow relative z-20">
          <div className="flex flex-col items-center gap-28 md:gap-36">
            {/* Missie */}
            <div className="text-center max-w-2xl">
              <FadeIn>
                <span className="block text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50 mb-4">
                  Missie
                </span>
              </FadeIn>
              <TitleReveal
                as="h2"
                id="missie-visie-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Waarom Blitzworx?
              </TitleReveal>
              <MagicText
                text="Ondernemers verdienen een online aanwezigheid die werkt. Ik bouw websites, systemen en automatiseringen die precies doen wat ze moeten doen, zodat jij je kunt richten op waar je goed in bent. Alles komt van een partij, want ik geloof dat design, techniek en strategie pas resultaat opleveren als ze op elkaar zijn afgestemd."
                className="text-body text-dry-sage leading-relaxed justify-center"
              />
            </div>

            {/* Visie */}
            <div className="text-center max-w-2xl">
              <FadeIn delay={0.15}>
                <span className="block text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50 mb-4">
                  Visie
                </span>
              </FadeIn>
              <TitleReveal
                as="h3"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Waar we naartoe werken
              </TitleReveal>
              <MagicText
                text="AI verandert hoe bedrijven werken, en dat gaat alleen nog versnellen. Blitzworx wil daar voorop lopen. Ik streef ernaar een bedrijf te bouwen dat bedrijven helpt om AI concreet in te zetten in hun dagelijkse processen. Ik zie een toekomst voor me waar alleen bedrijven met een sterke online aanwezigheid overleven en help bedrijven graag om dit te verwezenlijken."
                className="text-body text-dry-sage leading-relaxed justify-center"
                scrollOffset={['start 0.75', 'start 0.1']}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── HET COMPLETE PLAATJE — 01 ── */}
      <section
        className="section relative z-20 bg-transparent"
        aria-labelledby="complete-plaatje-title"
      >
        <div className="container-narrow relative z-20">
          <div className="max-w-2xl mb-16">
            <TitleReveal
              as="h2"
              id="complete-plaatje-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
            >
              Het complete online plaatje
            </TitleReveal>
            <MagicText
              text="Een sterke online aanwezigheid vraagt meer dan alleen een mooie website. Het vraagt om beelden die je verhaal vertellen, een merk dat herkenbaar is en systemen die voor je werken. Bij Blitzworx krijg je dat allemaal van één partij, zodat alles naadloos op elkaar aansluit."
              className="text-body text-dry-sage leading-relaxed"
            />
          </div>

          {/* Bento grid: 4 cols, 2 rows */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 lg:gap-5">
            {services.map((service, index) => {
              const isDev = service.title === 'Development';
              const isAI = service.title === 'AI Automatiseringen';

              return (
                <FadeIn
                  key={service.title}
                  delay={index * 0.08}
                  className={`h-full ${service.span}`}
                >
                  <Link href={service.href} className="block h-full">
                    <article className={`group relative h-full p-6 lg:p-8 rounded-md bg-ink border border-ebony flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)] ${isDev ? 'items-center justify-center text-center min-h-[280px]' : ''}`}>
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: isDev
                            ? 'radial-gradient(ellipse at 50% 20%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(84,92,82,0.08) 0%, transparent 50%)'
                            : 'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                        }}
                        aria-hidden
                      />

                      {/* Development: code bracket icon */}
                      {isDev && (
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          fill="none"
                          className="mb-6 text-dry-sage/30 group-hover:text-dry-sage/50 transition-colors duration-300"
                          aria-hidden
                        >
                          <path d="M24 16L8 32L24 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M40 16L56 32L40 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M36 8L28 56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      )}

                      {isAI ? (
                        <div className="flex items-stretch gap-6 flex-1">
                          <div className="flex-1">
                            <h3 className="text-h3 md:text-h2 font-semibold text-cornsilk">{service.title}</h3>
                            <p className="mt-3 text-small text-dry-sage leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                          {/* AI circuit/node vector */}
                          <div className="hidden md:flex flex-1 items-center justify-center">
                            <svg
                              width="140"
                              height="140"
                              viewBox="0 0 120 120"
                              fill="none"
                              className="text-dry-sage/20 group-hover:text-dry-sage/40 transition-colors duration-300"
                              aria-hidden
                            >
                              <style>{`
                                @keyframes about-pulse-line {
                                  0%, 100% { stroke-opacity: 0.3; }
                                  50% { stroke-opacity: 1; }
                                }
                                @keyframes about-pulse-node {
                                  0%, 100% { opacity: 0.4; }
                                  50% { opacity: 1; }
                                }
                                .about-ai-line-1 { animation: about-pulse-line 3s ease-in-out infinite; }
                                .about-ai-line-2 { animation: about-pulse-line 3s ease-in-out 0.5s infinite; }
                                .about-ai-line-3 { animation: about-pulse-line 3s ease-in-out 1s infinite; }
                                .about-ai-line-4 { animation: about-pulse-line 3s ease-in-out 1.5s infinite; }
                                .about-ai-line-5 { animation: about-pulse-line 3s ease-in-out 0.75s infinite; }
                                .about-ai-line-6 { animation: about-pulse-line 3s ease-in-out 1.25s infinite; }
                                .about-ai-node { animation: about-pulse-node 2s ease-in-out infinite; }
                              `}</style>
                              <circle cx="60" cy="60" r="16" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="60" cy="60" r="4" fill="currentColor" className="about-ai-node" />
                              <line x1="60" y1="44" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" className="about-ai-line-1" />
                              <line x1="60" y1="76" x2="60" y2="108" stroke="currentColor" strokeWidth="1.5" className="about-ai-line-2" />
                              <line x1="44" y1="60" x2="12" y2="60" stroke="currentColor" strokeWidth="1.5" className="about-ai-line-3" />
                              <line x1="76" y1="60" x2="108" y2="60" stroke="currentColor" strokeWidth="1.5" className="about-ai-line-4" />
                              <line x1="71" y1="49" x2="95" y2="25" stroke="currentColor" strokeWidth="1.5" className="about-ai-line-5" />
                              <line x1="49" y1="71" x2="25" y2="95" stroke="currentColor" strokeWidth="1.5" className="about-ai-line-6" />
                              <circle cx="60" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="60" cy="108" r="5" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="12" cy="60" r="5" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="108" cy="60" r="5" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="98" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="22" cy="98" r="4" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className={`text-h3 md:text-h2 font-semibold text-cornsilk ${isDev ? '' : ''}`}>{service.title}</h3>
                          <p className={`mt-3 text-small text-dry-sage leading-relaxed flex-1 ${isDev ? 'max-w-xs' : ''}`}>
                            {service.description}
                          </p>
                        </>
                      )}

                      <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-dry-sage group-hover:text-cornsilk transition-colors">
                        Lees meer
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
                      </span>
                    </article>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SELLING SOLUTIONS — 02 ── */}
      <section
        className="section relative z-20 bg-transparent py-24 md:py-32"
        aria-labelledby="selling-solutions-title"
      >
        <div className="container-narrow relative z-20">
          {/* Two-column layout: text left, slideshow right */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-14 lg:gap-20 items-start">
            {/* Left: text */}
            <div className="flex flex-col justify-center">
              <TitleReveal
                as="h2"
                id="selling-solutions-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Selling solutions
              </TitleReveal>
              <MagicText
                text="Bij Blitzworx kijk ik verder dan alleen de voorkant van een website. Ik ontwerp en bouw complete digitale oplossingen die jouw bedrijf echt ondersteunen. Denk aan compacte CRM systemen, overzichtelijke dashboards, geautomatiseerde workflows en maatwerk backends die processen vereenvoudigen en inzicht geven.
Van professionele fotografie tot technische SEO, van AI-integraties tot een converterende website. Alles wat ik bouw is afgestemd op jouw manier van werken. Geen overbodige complexiteit, maar slimme functies die tijd besparen en meegroeien met je onderneming."
                className="text-body text-dry-sage leading-relaxed"
              />
            </div>

            {/* Right: slideshow */}
            <WorkSlideshow />
          </div>
        </div>
      </section>

      {/* ── MEET THE CREATOR — 03 ── */}
      <section
        className="section relative z-20 bg-transparent min-h-screen flex flex-col justify-center"
        aria-labelledby="creator-title"
      >
        <div className="container-narrow relative z-20">
          {/* Title — full width */}
          <TitleReveal
            as="h2"
            id="creator-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-12 md:mb-16"
          >
            Meet the Creator
          </TitleReveal>

          {/* Editorial asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-10 md:gap-14 lg:gap-20 items-start">
            {/* Left: Text content — offset down on desktop for Z-pattern */}
            <div className="md:pt-20 lg:pt-28 order-2 md:order-1">
              <FadeIn delay={0.2}>
                <span className="text-caption font-mono tracking-[0.25em] uppercase text-grey-olive block mb-3">
                  Oprichter &amp; Creative Developer
                </span>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-h3 md:text-h3-lg font-bold text-cornsilk">Sander</h3>
                  <div className="flex-1 h-px bg-ebony/50" aria-hidden />
                </div>
              </FadeIn>
              <MagicText
                text="Als oprichter van Blitzworx combineer ik creativiteit met technische kennis. Mijn motivatie? Ondernemers helpen hun online doelen te bereiken met een complete aanpak die echt werkt.
Van concept tot code, van fotoshoot tot vindbaarheid. Ik begeleid het hele traject en zorg ervoor dat elk onderdeel past bij jouw visie en je doelgroep."
                className="text-body text-dry-sage leading-relaxed"
              />
            </div>

            {/* Right: Portrait photo with editorial treatment */}
            <div className="relative order-1 md:order-2">
              <span
                className="hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono tracking-[0.3em] uppercase text-grey-olive/30 whitespace-nowrap select-none"
                aria-hidden
              >
                Blitzworx - Est. 2025
              </span>

              <div
                ref={creatorImageRef}
                className="group relative motion-reduce:!clip-path-none"
              >
                <div className="relative aspect-[3/4] w-full max-w-[440px] mx-auto md:mx-0 overflow-hidden border border-ebony/30">
                  <Image
                    src="/assets/images/fotoshoot/image00004.webp"
                    alt="Sander, oprichter van Blitzworx"
                    fill
                    className="creator-photo object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 motion-reduce:!filter-none"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(4,7,17,0.5) 0%, rgba(4,7,17,0.08) 35%, transparent 55%, rgba(4,7,17,0.04) 100%)',
                    }}
                    aria-hidden
                  />
                </div>

                <div className="mt-4 flex items-center gap-3 justify-end max-w-[440px] mx-auto md:mx-0">
                  <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-grey-olive/50">
                    Zwolle, NL
                  </span>
                  <div className="w-8 h-px bg-dry-sage/20" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="section relative z-20 bg-transparent min-h-screen flex flex-col justify-center"
        aria-labelledby="about-cta-title"
      >
        <div className="container-narrow relative z-20">
          {/* Centered rule */}
          <div className="flex justify-center mb-12">
            <div
              ref={ctaRuleRef}
              className="w-24 h-px bg-dry-sage/30 origin-center"
              style={{ transform: 'scaleX(0)' }}
              aria-hidden
            />
          </div>

          <div className="flex flex-col items-center text-center gap-8">
            <TitleReveal
              as="h2"
              id="about-cta-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk"
            >
              Klaar om te starten?
            </TitleReveal>
            <FadeIn delay={0.2}>
              <p className="text-body text-dry-sage max-w-prose mx-auto">
                Laten we kennismaken en samen ontdekken hoe ik jouw online doelen kan bereiken.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <Button href="/contact" variant="primary">
                Neem contact op
              </Button>
            </FadeIn>
          </div>

          {/* Bottom corner accents */}
          <div className="hidden md:block absolute -bottom-8 left-0 w-12 h-12 border-b border-l border-ebony/40" aria-hidden />
          <div className="hidden md:block absolute -bottom-8 right-0 w-12 h-12 border-b border-r border-ebony/40" aria-hidden />
        </div>
      </section>
    </div>
  );
}
