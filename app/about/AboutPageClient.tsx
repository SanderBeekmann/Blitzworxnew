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
  const creatorParallaxRef = useRef<HTMLDivElement>(null);
  const solutionsSectionRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const dashboardParallaxRef = useRef<HTMLDivElement>(null);
  const desktopMockupRef = useRef<HTMLDivElement>(null);
  const desktopParallaxRef = useRef<HTMLDivElement>(null);
  const phoneMockupRef = useRef<HTMLDivElement>(null);
  const phoneParallaxRef = useRef<HTMLDivElement>(null);
  const visionNumberRef = useRef<HTMLSpanElement>(null);
  const solutionsNumberRef = useRef<HTMLSpanElement>(null);
  const creatorNumberRef = useRef<HTMLSpanElement>(null);
  const visionRuleRef = useRef<HTMLDivElement>(null);
  const solutionsRuleRef = useRef<HTMLDivElement>(null);
  const creatorRuleRef = useRef<HTMLDivElement>(null);
  const ctaRuleRef = useRef<HTMLDivElement>(null);
  const visionItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // ── Creator image clip-path reveal + desaturation ──
  useEffect(() => {
    const el = creatorImageRef.current;
    const parallaxWrap = creatorParallaxRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        // Clip-path wipe reveal (right to left)
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

        // Grayscale → color on the photo
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

        // Subtle parallax on the image wrapper
        if (parallaxWrap) {
          gsap.to(parallaxWrap, {
            y: -60,
            scrollTrigger: {
              trigger: parallaxWrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
      }
    );
  }, []);

  // ── Selling Solutions parallax composition ──
  useEffect(() => {
    const section = solutionsSectionRef.current;
    const dashboard = dashboardRef.current;
    const desktop = desktopMockupRef.current;
    const phone = phoneMockupRef.current;
    const dashPx = dashboardParallaxRef.current;
    const deskPx = desktopParallaxRef.current;
    const phonePx = phoneParallaxRef.current;
    if (!section || !dashboard || !desktop || !phone || !dashPx || !deskPx || !phonePx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        // ── Entrance animations (on inner elements) ──

        // Dashboard: 3D tilt entrance
        gsap.set(dashboard, {
          rotateX: 30,
          rotateY: -6,
          scale: 0.88,
          opacity: 0,
          transformPerspective: 1400,
          transformOrigin: 'center 70%',
        });
        gsap.to(dashboard, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: dashPx,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Desktop mockup: slide in from left
        gsap.set(desktop, {
          x: -80,
          opacity: 0,
          rotateY: 6,
          transformPerspective: 1000,
          transformOrigin: 'right center',
        });
        gsap.to(desktop, {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: deskPx,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Phone mockup: slide in from right
        gsap.set(phone, {
          x: 60,
          opacity: 0,
          rotateY: -4,
          transformPerspective: 1000,
          transformOrigin: 'left center',
        });
        gsap.to(phone, {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1.2,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: phonePx,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // ── Parallax (on outer wrapper elements — no property conflicts) ──
        gsap.to(dashPx, {
          y: -80,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to(deskPx, {
          y: -200,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to(phonePx, {
          y: -300,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    );
  }, []);

  // ── Section numbers: count up on scroll ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const refs = [
      { ref: visionNumberRef, target: '01' },
      { ref: solutionsNumberRef, target: '02' },
      { ref: creatorNumberRef, target: '03' },
    ];

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        refs.forEach(({ ref, target }) => {
          const el = ref.current;
          if (!el) return;

          gsap.fromTo(
            el,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              onStart: () => {
                el.textContent = target;
              },
            }
          );
        });
      }
    );
  }, []);

  // ── Horizontal rules: draw on scroll ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ruleRefs = [visionRuleRef, solutionsRuleRef, creatorRuleRef, ctaRuleRef];

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

  // ── Vision items: stagger in ──
  useEffect(() => {
    const container = visionItemsRef.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const items = container.querySelectorAll('.vision-item');

        gsap.fromTo(
          items,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
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
      <AboutScrollLine />

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
              Blitzworx &mdash; Creative Agency
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

      {/* ── VISION — 01 ── */}
      <section
        className="section relative z-20 bg-transparent min-h-screen flex flex-col justify-center"
        aria-labelledby="vision-title"
      >
        <div className="container-narrow relative z-20">
          {/* Section number + rule */}
          <div className="flex items-end gap-6 mb-12 md:mb-16">
            <span
              ref={visionNumberRef}
              className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-bold leading-none select-none motion-reduce:opacity-100"
              style={{ color: 'rgba(139,129,116,0.08)', opacity: 0 }}
              aria-hidden
            >
              01
            </span>
            <div
              ref={visionRuleRef}
              className="flex-1 h-px bg-ebony origin-left"
              style={{ transform: 'scaleX(0)' }}
              aria-hidden
            />
          </div>

          {/* Asymmetric grid: wide left for title, narrow right for content */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 md:gap-16 items-start">
            <div>
              <TitleReveal
                as="h2"
                id="vision-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk"
              >
                Mijn visie
              </TitleReveal>
              <FadeIn delay={0.2}>
                <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed">
                  <p>
                    Blitzworx gelooft in kwaliteit, creativiteit en resultaat. Mijn visie is simpel:
                    ondernemers helpen groeien met een online omgeving die past bij hun ambities.
                  </p>
                  <p>
                    Ik werk nauw samen, denk mee en lever maatwerk. Geen standaard templates,
                    maar oplossingen die echt werken. Van eerste idee tot live website, en daarna.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Right: three pillars */}
            <div ref={visionItemsRef} className="space-y-6 md:mt-2">
              {[
                { label: 'Kwaliteit', desc: 'Elk detail telt — van typografie tot performance.' },
                { label: 'Creativiteit', desc: 'Onderscheidend ontwerp dat opvalt en beklijft.' },
                { label: 'Resultaat', desc: 'Websites die converteren en meetbaar groeien.' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="vision-item border-l-2 border-ebony pl-6 opacity-0 motion-reduce:opacity-100"
                >
                  <span className="text-caption font-mono tracking-wider uppercase text-grey-olive">
                    {item.label}
                  </span>
                  <p className="mt-1 text-small text-dry-sage leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SELLING SOLUTIONS — 02 ── */}
      <section
        ref={solutionsSectionRef}
        className="section relative z-20 bg-transparent py-24 md:py-32"
        aria-labelledby="selling-solutions-title"
      >
        <div className="container-narrow relative z-20">
          {/* Section number + rule — right-aligned */}
          <div className="flex items-end gap-6 mb-12 md:mb-16 flex-row-reverse">
            <span
              ref={solutionsNumberRef}
              className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-bold leading-none select-none motion-reduce:opacity-100"
              style={{ color: 'rgba(139,129,116,0.08)', opacity: 0 }}
              aria-hidden
            >
              02
            </span>
            <div
              ref={solutionsRuleRef}
              className="flex-1 h-px bg-ebony origin-right"
              style={{ transform: 'scaleX(0)' }}
              aria-hidden
            />
          </div>

          {/* Text content */}
          <div className="max-w-2xl mb-20 md:mb-28">
            <TitleReveal
              as="h2"
              id="selling-solutions-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
            >
              Selling solutions
            </TitleReveal>
            <FadeIn delay={0.2}>
              <div className="space-y-4 text-body text-dry-sage leading-relaxed">
                <p>
                  Bij Blitzworx kijk ik verder dan alleen de voorkant van een website. Ik ontwerp en bouw complete digitale oplossingen die jouw bedrijf echt ondersteunen. Denk aan compacte CRM systemen, overzichtelijke dashboards en maatwerk backends die processen vereenvoudigen en inzicht geven.
                </p>
                <p>
                  Alles wat ik bouw is afgestemd op jouw manier van werken. Geen overbodige complexiteit, maar slimme functies die tijd besparen en meegroeien met je onderneming.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── Parallax image composition ── */}
        <div className="relative w-full" style={{ perspective: '1400px' }}>
          {/* Ambient glow behind the composition */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(202,202,170,0.06) 0%, rgba(84,92,82,0.03) 40%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            aria-hidden
          />

          {/* Composition container */}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">

            {/* ─ LAYER 1 (back): Dashboard — centered, largest ─ */}
            <div ref={dashboardParallaxRef} className="relative z-10 mx-auto w-full max-w-4xl will-change-transform">
            <div
              ref={dashboardRef}
              className="motion-reduce:!transform-none motion-reduce:!opacity-100"
            >
              <div className="group rounded-lg border border-ebony/40 overflow-hidden bg-[#0d0f14] shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                {/* Browser chrome */}
                <div className="bg-[#1a1d23] px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-[#0d0f14] rounded-md px-4 py-1 text-[11px] text-grey-olive/60 font-mono tracking-wide max-w-xs w-full text-center">
                      app.blitzworx.nl/dashboard
                    </div>
                  </div>
                  <div className="w-[52px]" />
                </div>
                {/* Screen */}
                <div className="relative">
                  <Image
                    src="/assets/images/agencyos-dashboard.webp"
                    alt="AgencyOS dashboard — maatwerk CRM en projectbeheer"
                    width={1200}
                    height={675}
                    className="w-full h-auto block"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 900px"
                    priority
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 80px rgba(4,7,17,0.4)' }}
                    aria-hidden
                  />
                </div>
              </div>
              {/* Label */}
              <div className="mt-4 flex items-center gap-3 justify-end">
                <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-grey-olive/50">
                  Dashboard
                </span>
                <div className="w-8 h-px bg-dry-sage/20" aria-hidden />
              </div>
            </div>
            </div>

            {/* ─ LAYER 2 (mid): Desktop mockup — overlaps bottom-left ─ */}
            <div ref={desktopParallaxRef} className="relative z-20 -mt-24 md:-mt-40 lg:-mt-52 ml-0 md:-ml-8 lg:-ml-12 w-[85%] md:w-[55%] max-w-xl will-change-transform">
            <div
              ref={desktopMockupRef}
              className="motion-reduce:!transform-none motion-reduce:!opacity-100"
            >
              <div className="group rounded-lg border border-ebony/30 overflow-hidden bg-[#0d0f14] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                {/* Browser chrome */}
                <div className="bg-[#1a1d23] px-3 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]/80" />
                    <span className="w-2 h-2 rounded-full bg-[#febc2e]/80" />
                    <span className="w-2 h-2 rounded-full bg-[#28c840]/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-[#0d0f14] rounded px-3 py-0.5 text-[10px] text-grey-olive/50 font-mono tracking-wide max-w-[180px] w-full text-center">
                      blueshipment.nl
                    </div>
                  </div>
                  <div className="w-[36px]" />
                </div>
                {/* Screen */}
                <div className="relative">
                  <Image
                    src="/assets/images/blueshipmentmockup.webp"
                    alt="Blue Shipment — maatwerk website voor logistiek"
                    width={900}
                    height={560}
                    className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 85vw, 45vw"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 50px rgba(4,7,17,0.3)' }}
                    aria-hidden
                  />
                </div>
              </div>
              {/* Label */}
              <div className="mt-3 flex items-center gap-3">
                <div className="w-6 h-px bg-dry-sage/20" aria-hidden />
                <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-grey-olive/50">
                  Webdesign
                </span>
              </div>
            </div>
            </div>

            {/* ─ LAYER 3 (front): Phone mockup — overlaps right side, same browser frame style ─ */}
            <div ref={phoneParallaxRef} className="absolute z-30 right-4 sm:right-8 md:right-12 lg:right-16 bottom-0 md:bottom-8 w-[140px] sm:w-[180px] md:w-[220px] lg:w-[250px] will-change-transform">
            <div
              ref={phoneMockupRef}
              className="motion-reduce:!transform-none motion-reduce:!opacity-100"
            >
              <div className="group rounded-lg border border-ebony/30 overflow-hidden bg-[#0d0f14] shadow-[0_12px_50px_rgba(0,0,0,0.5)]">
                {/* Browser chrome */}
                <div className="bg-[#1a1d23] px-2.5 py-2 flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e]/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-[#0d0f14] rounded px-2 py-0.5 text-[8px] text-grey-olive/50 font-mono tracking-wide w-full text-center truncate">
                      blueshipment.nl
                    </div>
                  </div>
                </div>
                {/* Screen */}
                <div className="relative">
                  <Image
                    src="/assets/images/iphonemockupblueship.webp"
                    alt="Blue Shipment — mobiele weergave"
                    width={560}
                    height={1120}
                    className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 140px, (max-width: 1024px) 220px, 250px"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 40px rgba(4,7,17,0.3)' }}
                    aria-hidden
                  />
                </div>
              </div>
              {/* Label */}
              <div className="mt-3 flex items-center gap-2 justify-center">
                <div className="w-4 h-px bg-dry-sage/20" aria-hidden />
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-grey-olive/50">
                  Responsive
                </span>
              </div>
            </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MEET THE CREATOR — 03 ── */}
      <section
        className="section relative z-20 bg-transparent min-h-screen flex flex-col justify-center"
        aria-labelledby="creator-title"
      >
        <div className="container-narrow relative z-20">
          {/* Section number + rule */}
          <div className="flex items-end gap-6 mb-12 md:mb-16">
            <span
              ref={creatorNumberRef}
              className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-bold leading-none select-none motion-reduce:opacity-100"
              style={{ color: 'rgba(139,129,116,0.08)', opacity: 0 }}
              aria-hidden
            >
              03
            </span>
            <div
              ref={creatorRuleRef}
              className="flex-1 h-px bg-ebony origin-left"
              style={{ transform: 'scaleX(0)' }}
              aria-hidden
            />
          </div>

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
                  Oprichter &amp; Creative Director
                </span>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-h3 md:text-h3-lg font-bold text-cornsilk">Sander</h3>
                  <div className="flex-1 h-px bg-ebony/50" aria-hidden />
                </div>
              </FadeIn>
              <FadeIn delay={0.35}>
                <div className="space-y-4 text-body text-dry-sage leading-relaxed">
                  <p>
                    Als oprichter van Blitzworx combineer ik creativiteit met technische kennis.
                    Mijn motivatie? Ondernemers helpen hun online doelen te bereiken met websites
                    die echt werken.
                  </p>
                  <p>
                    Van concept tot code. Ik begeleid het hele traject en zorg ervoor dat het
                    resultaat past bij jouw visie en je doelgroep.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Right: Portrait photo with editorial treatment */}
            <div className="relative order-1 md:order-2 will-change-transform" ref={creatorParallaxRef}>
              {/* Rotated vertical label */}
              <span
                className="hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono tracking-[0.3em] uppercase text-grey-olive/30 whitespace-nowrap select-none"
                aria-hidden
              >
                Blitzworx — Est. 2024
              </span>

              <div
                ref={creatorImageRef}
                className="group relative motion-reduce:!clip-path-none"
              >
                {/* Image container — portrait ratio with thin border */}
                <div className="relative aspect-[3/4] w-full max-w-[440px] mx-auto md:mx-0 overflow-hidden border border-ebony/30">
                  <Image
                    src="/assets/images/sander.webp"
                    alt="Sander, oprichter van Blitzworx"
                    fill
                    className="creator-photo object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 motion-reduce:!filter-none"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  {/* Cinematic vignette — bottom-heavy */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(4,7,17,0.5) 0%, rgba(4,7,17,0.08) 35%, transparent 55%, rgba(4,7,17,0.04) 100%)',
                    }}
                    aria-hidden
                  />
                </div>

                {/* Caption below image — right-aligned */}
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
