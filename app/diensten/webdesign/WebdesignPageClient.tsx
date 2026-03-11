'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { SectionTopBars } from '@/components/animations/SectionTopBars';
import { SectionBottomBars } from '@/components/animations/SectionBottomBars';
import { Button } from '@/components/ui/Button';
import { MaintenanceSection } from '@/components/sections/MaintenanceSection';

interface ScrollTriggerRef {
  kill: () => void;
}

interface GsapTimelineRef {
  kill: () => void;
}

const benefits = [
  {
    title: 'Eerste indruk die blijft',
    description:
      'Bezoekers vormen in 0,05 seconde een mening over je website. Professioneel design wekt direct vertrouwen en houdt bezoekers langer vast.',
  },
  {
    title: 'Meer conversies',
    description:
      'Doordacht ontwerp stuurt bezoekers naar de juiste actie. Elke pagina is gebouwd om resultaat te leveren.',
  },
  {
    title: 'Herkenbaar en consistent',
    description:
      'Jouw merkidentiteit komt terug in elk detail: van kleuren en typografie tot de kleinste interacties.',
  },
  {
    title: 'Mobiel-eerst ontwerp',
    description:
      'Meer dan 60% van het verkeer komt via mobiel. Elk ontwerp begint op het kleinste scherm en schaalt naadloos op.',
  },
];

const processPhases = [
  {
    label: 'Briefing',
    description:
      'Ik start met jouw verhaal. Wie ben je, wie is je doelgroep, en wat wil je bereiken? Op basis hiervan stel ik een creatieve briefing op.',
  },
  {
    label: 'Wireframes',
    description:
      'Ik ontwerp de blauwdruk van je website. Logische navigatie, duidelijke hiërarchie en een structuur die werkt voor jouw bezoekers.',
  },
  {
    label: 'Visueel ontwerp',
    description:
      'Je huisstijl wordt vertaald naar een prachtig design. Kleuren, typografie, beelden en animaties komen samen in een ontwerp dat past bij jouw merk.',
  },
  {
    label: 'Oplevering',
    description:
      'Je geeft feedback, ik perfectioneer. Het definitieve ontwerp wordt development-ready opgeleverd, klaar om gebouwd te worden.',
  },
];

const usps = [
  {
    title: 'Geen templates, altijd maatwerk',
    description:
      'Elk ontwerp wordt vanaf nul opgebouwd. Geen standaard thema\'s, maar een uniek design dat past bij jouw merk en doelen.',
  },
  {
    title: 'Ontwerp + techniek onder één dak',
    description:
      'Ik ontwerp niet alleen, ik bouw ook. Dat betekent designs die technisch haalbaar zijn en naadloos worden omgezet naar code.',
  },
  {
    title: 'Persoonlijke samenwerking',
    description:
      'Je werkt direct met de ontwerper, zonder tussenlagen. Korte lijnen, snelle feedback en een resultaat waar je écht achter staat.',
  },
];

const devices = [
  { key: 'phone' as const, label: 'Mobiel', width: 'w-[100px]', height: 'h-[180px]', radius: 'rounded-xl' },
  { key: 'tablet' as const, label: 'Tablet', width: 'w-[160px]', height: 'h-[200px]', radius: 'rounded-lg' },
  { key: 'desktop' as const, label: 'Desktop', width: 'w-[240px]', height: 'h-[160px]', radius: 'rounded-sm' },
];

const techGroups = [
  { label: 'Design', tools: ['Figma', 'Adobe Creative Suite'] },
  { label: 'Development', tools: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'] },
  { label: 'Platform', tools: ['Netlify', 'Supabase'] },
];

export function WebdesignPageClient() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState(0);

  // ── 1. Hero: Mouse parallax on canvas layers ──
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const layers = canvas.querySelectorAll<HTMLElement>('[data-depth]');

    import('gsap').then(({ gsap }) => {
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || '0');
        gsap.to(layer, {
          x: x * depth * 40,
          y: y * depth * 40,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }, []);

  // Mobile: ambient floating animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (window.innerWidth >= 768) return;

    let timeline: GsapTimelineRef | null = null;

    import('gsap').then(({ gsap }) => {
      const layers = canvas.querySelectorAll<HTMLElement>('[data-depth]');
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      layers.forEach((layer, i) => {
        const depth = parseFloat(layer.dataset.depth || '0');
        tl.to(
          layer,
          {
            y: depth * 6 * (i % 2 === 0 ? 1 : -1),
            x: depth * 3 * (i % 2 === 0 ? -1 : 1),
            duration: 2.5 + i * 0.3,
            ease: 'sine.inOut',
          },
          0
        );
      });
      timeline = tl;
    });

    return () => timeline?.kill();
  }, []);

  // ── 2. Process: Pinned scroll layer build-up ──
  useEffect(() => {
    const section = processRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;

    let killed = false;
    const triggers: Array<ScrollTriggerRef> = [];
    let timeline: GsapTimelineRef | null = null;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (killed) return;
        gsap.registerPlugin(ScrollTrigger);

        const pinWrapper = section.querySelector<HTMLElement>('.process-pin-wrapper');
        const phaseEls = section.querySelectorAll<HTMLElement>('.process-phase');
        const descEls = section.querySelectorAll<HTMLElement>('.process-desc');
        if (!pinWrapper || !phaseEls.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapper,
            start: 'center center',
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase 0 (Briefing) visible by default — fade it out when phase 1 enters
        // Phase 1: Wireframes
        tl.to(phaseEls[0], { opacity: 0, duration: 0.5 }, 0.3);
        tl.to(descEls[0], { opacity: 0, y: -20, duration: 0.3 }, 0.3);
        tl.to(phaseEls[1], { opacity: 1, duration: 0.5 }, 0.5);
        tl.to(descEls[1], { opacity: 1, y: 0, duration: 0.5 }, 0.5);

        // Phase 2: Visual design
        tl.to(phaseEls[1], { opacity: 0, duration: 0.5 }, 1.3);
        tl.to(descEls[1], { opacity: 0, y: -20, duration: 0.3 }, 1.3);
        tl.to(phaseEls[2], { opacity: 1, duration: 0.5 }, 1.5);
        tl.to(descEls[2], { opacity: 1, y: 0, duration: 0.5 }, 1.5);

        // Phase 3: Oplevering
        tl.to(phaseEls[2], { opacity: 0, duration: 0.5 }, 2.3);
        tl.to(descEls[2], { opacity: 0, y: -20, duration: 0.3 }, 2.3);
        tl.to(phaseEls[3], { opacity: 1, duration: 0.5 }, 2.5);
        tl.to(descEls[3], { opacity: 1, y: 0, duration: 0.5 }, 2.5);

        timeline = tl;
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

        // Refresh after a short delay to ensure layout is settled
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    );

    return () => {
      killed = true;
      timeline?.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // ── 3. USPs: Device morph cycling ──
  useEffect(() => {
    const el = deviceRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveDevice((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate device frame on activeDevice change
  useEffect(() => {
    const el = deviceRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    import('gsap').then(({ gsap }) => {
      const frame = el.querySelector('.device-frame');
      const inner = el.querySelector('.device-inner');
      if (!frame || !inner) return;

      const device = devices[activeDevice];
      // Get computed pixel values from Tailwind classes
      const widths = [100, 160, 240];
      const heights = [180, 200, 160];
      const radii = [12, 8, 2];

      gsap.to(frame, {
        width: widths[activeDevice],
        height: heights[activeDevice],
        borderRadius: radii[activeDevice],
        duration: 0.6,
        ease: 'power2.inOut',
      });

      // Animate inner layout
      const cols = activeDevice === 2 ? 3 : activeDevice === 1 ? 2 : 1;
      gsap.to(inner, {
        duration: 0.4,
        ease: 'power2.inOut',
      });
    });
  }, [activeDevice]);

  return (
    <main className="relative">
      {/* ── Hero — Interactive Browser Canvas ── */}
      <section className="section relative min-h-screen flex flex-col justify-center">
        <div className="container-narrow">
          <FadeIn>
            <Link
              href="/diensten"
              className="text-small text-grey-olive hover:text-dry-sage transition-colors"
            >
              &larr; Terug naar diensten
            </Link>
          </FadeIn>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <FadeIn delay={0.1}>
                <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-6">
                  Design &middot; Interactie &middot; Ervaring
                </span>
              </FadeIn>
              <TitleReveal
                as="h1"
                className="text-hero md:text-hero-lg font-bold text-cornsilk"
                triggerOnMount
              >
                Webdesign dat werkt
              </TitleReveal>
              <FadeIn delay={0.3}>
                <p className="mt-6 text-body text-dry-sage max-w-prose leading-relaxed">
                  Professioneel ontwerp dat jouw merk versterkt, bezoekers overtuigt en
                  resultaat oplevert. Geen standaard templates, maar maatwerk dat past bij
                  jouw visie.
                </p>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/contact" variant="primary">
                    Start jouw project
                  </Button>
                  <Button href="/cases" variant="outline">
                    Bekijk mijn werk
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* Browser canvas with parallax layers */}
            <FadeIn delay={0.4}>
              <div
                ref={canvasRef}
                className="relative bg-ink border border-ebony overflow-hidden select-none"
                onMouseMove={handleMouseMove}
                aria-hidden
              >
                {/* Browser chrome bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-ebony bg-ink">
                  <span className="w-2.5 h-2.5 rounded-full bg-grey-olive/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-grey-olive/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-grey-olive/50" />
                  <span className="ml-3 text-caption text-grey-olive font-mono">jouwmerk.nl</span>
                </div>

                {/* Canvas area with design elements */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Grid pattern background */}
                  <div
                    data-depth="0.5"
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        'linear-gradient(var(--grey-olive) 1px, transparent 1px), linear-gradient(90deg, var(--grey-olive) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Typography specimen */}
                  <div
                    data-depth="2"
                    className="absolute top-[12%] left-[8%]"
                  >
                    <span className="block text-[2.5rem] md:text-[3.5rem] font-bold text-cornsilk/15 leading-none">
                      Aa
                    </span>
                    <span className="block text-caption text-grey-olive/40 mt-1 font-mono">
                      Sans · 700
                    </span>
                  </div>

                  {/* Color strip */}
                  <div
                    data-depth="3"
                    className="absolute top-[18%] right-[10%] flex gap-1.5"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-cornsilk/20" />
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-dry-sage/30" />
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-grey-olive/25" />
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-ebony/40" />
                  </div>

                  {/* Geometric shape — circle */}
                  <div
                    data-depth="4"
                    className="absolute bottom-[20%] left-[15%] w-16 h-16 md:w-20 md:h-20 rounded-full border border-dry-sage/20"
                  />

                  {/* Rectangle block */}
                  <div
                    data-depth="1.5"
                    className="absolute top-[45%] left-[35%] w-24 h-12 md:w-32 md:h-16 bg-cornsilk/5 border border-ebony"
                  />

                  {/* Small grid of dots */}
                  <div
                    data-depth="2.5"
                    className="absolute bottom-[15%] right-[12%] grid grid-cols-4 gap-2"
                  >
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-grey-olive/20" />
                    ))}
                  </div>

                  {/* Diagonal line */}
                  <div
                    data-depth="3.5"
                    className="absolute top-[30%] left-[55%] w-24 h-px bg-dry-sage/15 rotate-45 origin-left"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Voordelen — Grid Overlay Hover Cards ── */}
      <section className="section relative overflow-hidden" aria-labelledby="benefits-title">
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="benefits-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Waarom professioneel webdesign?
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
              Goed design is geen luxe, het is de basis van elk succesvol online platform.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <FadeIn key={benefit.title} delay={index * 0.1} className="h-full">
                <article className="group relative h-full p-6 md:p-8 bg-ink border border-ebony overflow-hidden transition-all duration-500 hover:border-grey-olive hover:shadow-[0_0_24px_rgba(254,250,220,0.12)]">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                    }}
                    aria-hidden
                  />
                  {/* Hover fill overlay */}
                  <div
                    className="absolute inset-0 bg-ink opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    aria-hidden
                  />
                  <div className="relative z-10">
                    <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-4">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-body text-dry-sage leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proces — Scroll-driven Layer Build-up ── */}
      <section
        ref={processRef}
        className="section relative"
        aria-labelledby="process-title"
      >
        {/* Pinned scroll wrapper — title is INSIDE so pin doesn't cause layout jumps */}
        <div className="process-pin-wrapper">
          <div className="container-narrow">
            <TitleReveal
              as="h2"
              id="process-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
            >
              Van idee tot ontwerp
            </TitleReveal>
            <FadeIn>
              <p className="hidden md:block text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
                Scroll door mijn ontwerpproces en zie hoe een website tot leven komt.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Monitor frame */}
              <div className="hidden md:block relative">
                <div className="process-monitor bg-ink border border-ebony overflow-hidden">
                  {/* Monitor top bar */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-ebony">
                    <span className="w-2 h-2 rounded-full bg-grey-olive/40" />
                    <span className="w-2 h-2 rounded-full bg-grey-olive/40" />
                    <span className="w-2 h-2 rounded-full bg-grey-olive/40" />
                  </div>

                  {/* Monitor content area */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Phase 0: Briefing — text lines (grey) */}
                    <div className="process-phase absolute inset-0 p-6 flex flex-col justify-center gap-3 opacity-100">
                      <div className="w-3/4 h-3 bg-grey-olive/20" />
                      <div className="w-1/2 h-3 bg-grey-olive/15" />
                      <div className="w-2/3 h-3 bg-grey-olive/20" />
                      <div className="w-1/3 h-3 bg-grey-olive/10" />
                      <div className="mt-4 w-full h-2 bg-grey-olive/10" />
                      <div className="w-5/6 h-2 bg-grey-olive/10" />
                      <div className="w-4/6 h-2 bg-grey-olive/10" />
                    </div>

                    {/* Phase 1: Wireframes — geometric blocks with dashed borders */}
                    <div className="process-phase absolute inset-0 p-6 opacity-0 md:opacity-0">
                      <div className="grid grid-cols-3 gap-3 h-full">
                        <div className="col-span-3 h-8 border border-dashed border-grey-olive/40" />
                        <div className="col-span-2 flex-1 border border-dashed border-grey-olive/40 min-h-[60px]" />
                        <div className="col-span-1 flex-1 border border-dashed border-grey-olive/40 min-h-[60px]" />
                        <div className="col-span-1 h-10 border border-dashed border-grey-olive/40" />
                        <div className="col-span-1 h-10 border border-dashed border-grey-olive/40" />
                        <div className="col-span-1 h-10 border border-dashed border-grey-olive/40" />
                        <div className="col-span-3 h-6 border border-dashed border-grey-olive/40" />
                      </div>
                    </div>

                    {/* Phase 2: Visual design — blocks filled with color */}
                    <div className="process-phase absolute inset-0 p-6 opacity-0 md:opacity-0">
                      <div className="grid grid-cols-3 gap-3 h-full">
                        <div className="col-span-3 h-8 bg-ebony border border-ebony flex items-center px-3">
                          <div className="flex gap-2">
                            <div className="w-8 h-2 bg-cornsilk/30" />
                            <div className="w-6 h-2 bg-cornsilk/20" />
                            <div className="w-7 h-2 bg-cornsilk/20" />
                          </div>
                        </div>
                        <div className="col-span-2 flex-1 bg-dry-sage/10 border border-dry-sage/20 min-h-[60px]" />
                        <div className="col-span-1 flex-1 bg-cornsilk/5 border border-ebony min-h-[60px]" />
                        <div className="col-span-1 h-10 bg-cornsilk/8 border border-ebony" />
                        <div className="col-span-1 h-10 bg-dry-sage/8 border border-ebony" />
                        <div className="col-span-1 h-10 bg-cornsilk/8 border border-ebony" />
                        <div className="col-span-3 h-6 bg-ebony/60 border border-ebony" />
                      </div>
                    </div>

                    {/* Phase 3: Oplevering — polished with shadows + gradients */}
                    <div className="process-phase absolute inset-0 p-6 opacity-0 md:opacity-0">
                      <div className="grid grid-cols-3 gap-3 h-full">
                        <div className="col-span-3 h-8 bg-ebony border border-ebony shadow-sm flex items-center justify-between px-3">
                          <div className="flex gap-2">
                            <div className="w-8 h-2 bg-cornsilk/40 rounded-sm" />
                            <div className="w-6 h-2 bg-cornsilk/25 rounded-sm" />
                            <div className="w-7 h-2 bg-cornsilk/25 rounded-sm" />
                          </div>
                          <div className="w-12 h-4 bg-dry-sage/30 rounded-sm" />
                        </div>
                        <div className="col-span-2 flex-1 bg-gradient-to-br from-dry-sage/15 to-cornsilk/5 border border-dry-sage/30 shadow-[0_2px_8px_rgba(0,0,0,0.3)] min-h-[60px]" />
                        <div className="col-span-1 flex-1 bg-gradient-to-b from-cornsilk/10 to-transparent border border-ebony shadow-[0_2px_8px_rgba(0,0,0,0.2)] min-h-[60px]" />
                        <div className="col-span-1 h-10 bg-cornsilk/10 border border-ebony shadow-sm" />
                        <div className="col-span-1 h-10 bg-dry-sage/10 border border-ebony shadow-sm" />
                        <div className="col-span-1 h-10 bg-cornsilk/10 border border-ebony shadow-sm" />
                        <div className="col-span-3 h-6 bg-gradient-to-r from-ebony to-ebony/80 border border-ebony shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monitor stand */}
                <div className="hidden md:flex flex-col items-center" aria-hidden>
                  <div className="w-16 h-6 bg-ebony/60 border-x border-ebony" />
                  <div className="w-24 h-2 bg-ebony/40 border border-ebony rounded-b-sm" />
                </div>
              </div>

              {/* Phase descriptions */}
              <div className="relative min-h-[120px]">
                {/* Desktop: stacked, animated by GSAP */}
                <div className="hidden md:block relative">
                  {processPhases.map((phase, index) => (
                    <div
                      key={phase.label}
                      className={`process-desc ${index === 0 ? 'relative' : 'absolute inset-0'}`}
                      style={{ opacity: index === 0 ? 1 : 0, transform: index === 0 ? 'none' : 'translateY(20px)' }}
                    >
                      <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-3">
                        Stap {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-h3 font-semibold text-cornsilk mb-3">
                        {phase.label}
                      </h3>
                      <p className="text-body text-dry-sage leading-relaxed max-w-prose">
                        {phase.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mobile: stacked layout */}
                <div className="md:hidden space-y-8">
                  {processPhases.map((phase, index) => (
                    <FadeIn key={phase.label} delay={index * 0.1}>
                      <div className="border-l-2 border-ebony pl-6">
                        <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-2">
                          Stap {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-h3 font-semibold text-cornsilk mb-2">
                          {phase.label}
                        </h3>
                        <p className="text-body text-dry-sage leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USPs — Responsive Device Morph ── */}
      <section className="section relative overflow-hidden md:min-h-screen md:flex md:items-center" aria-labelledby="usp-title">
        <div className="container-narrow w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left: Title + Device showcase */}
            <div>
              <TitleReveal
                as="h2"
                id="usp-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Waarom Blitzworx?
              </TitleReveal>
              <FadeIn delay={0.1}>
                <p className="text-body text-dry-sage leading-relaxed mb-10">
                  Ik ontwerp niet alleen, ik bouw ook. Dat betekent designs die technisch
                  haalbaar zijn en er op elk scherm perfect uitzien.
                </p>
              </FadeIn>

              {/* Device morph showcase */}
              <FadeIn delay={0.3}>
                <div className="flex flex-col items-center">
                  <div
                    ref={deviceRef}
                    className="flex items-center justify-center mb-6"
                    style={{ minHeight: 220 }}
                    aria-hidden
                  >
                    <div
                      className="device-frame bg-ink border border-ebony overflow-hidden transition-all duration-600"
                      style={{
                        width: devices[activeDevice === undefined ? 2 : activeDevice]?.width
                          ? undefined
                          : 240,
                        height: devices[activeDevice === undefined ? 2 : activeDevice]?.height
                          ? undefined
                          : 160,
                      }}
                    >
                      {/* Device top bar */}
                      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-ebony bg-ebony/30">
                        {activeDevice === 0 ? (
                          /* Phone: centered notch */
                          <div className="mx-auto w-8 h-1 bg-grey-olive/20 rounded-full" />
                        ) : (
                          /* Tablet/Desktop: dots */
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-grey-olive/30" />
                            <span className="w-1.5 h-1.5 rounded-full bg-grey-olive/30" />
                            <span className="w-1.5 h-1.5 rounded-full bg-grey-olive/30" />
                          </>
                        )}
                      </div>

                      {/* Device content */}
                      <div className="device-inner p-2 flex-1">
                        {activeDevice === 0 && (
                          /* Phone layout: single column */
                          <div className="space-y-1.5">
                            <div className="w-full h-2 bg-grey-olive/15" />
                            <div className="w-3/4 h-2 bg-grey-olive/10" />
                            <div className="w-full h-8 bg-cornsilk/5 mt-2" />
                            <div className="w-full h-6 bg-dry-sage/5" />
                            <div className="w-full h-6 bg-dry-sage/5" />
                          </div>
                        )}
                        {activeDevice === 1 && (
                          /* Tablet layout: 2 columns */
                          <div className="space-y-1.5">
                            <div className="w-2/3 h-2 bg-grey-olive/15" />
                            <div className="grid grid-cols-2 gap-1.5 mt-2">
                              <div className="h-10 bg-cornsilk/5" />
                              <div className="h-10 bg-cornsilk/5" />
                              <div className="h-8 bg-dry-sage/5" />
                              <div className="h-8 bg-dry-sage/5" />
                            </div>
                          </div>
                        )}
                        {activeDevice === 2 && (
                          /* Desktop layout: 3 columns with sidebar */
                          <div className="space-y-1.5">
                            <div className="flex gap-1.5">
                              <div className="w-8 h-2 bg-cornsilk/15" />
                              <div className="w-6 h-2 bg-grey-olive/10" />
                              <div className="w-6 h-2 bg-grey-olive/10" />
                              <div className="flex-1" />
                              <div className="w-10 h-2 bg-dry-sage/15" />
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 mt-2">
                              <div className="col-span-2 h-12 bg-cornsilk/5" />
                              <div className="h-12 bg-dry-sage/5" />
                              <div className="h-8 bg-cornsilk/5" />
                              <div className="h-8 bg-cornsilk/5" />
                              <div className="h-8 bg-dry-sage/5" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Device indicators */}
                  <div className="flex gap-6 relative">
                    {devices.map((device, i) => (
                      <button
                        key={device.key}
                        onClick={() => setActiveDevice(i)}
                        className={`text-caption font-mono tracking-wider pb-2 transition-colors duration-300 ${
                          activeDevice === i ? 'text-cornsilk' : 'text-grey-olive hover:text-dry-sage'
                        }`}
                        aria-label={`Toon ${device.label} weergave`}
                      >
                        {device.label}
                      </button>
                    ))}
                    {/* Sliding underline */}
                    <div
                      className="absolute bottom-0 h-px bg-cornsilk transition-all duration-300"
                      style={{
                        width: '33.333%',
                        left: `${activeDevice * 33.333}%`,
                      }}
                      aria-hidden
                    />
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right: USP cards with left border */}
            <div className="space-y-8 md:mt-8">
              {usps.map((usp, index) => (
                <FadeIn key={usp.title} delay={index * 0.15}>
                  <div className="border-l-2 border-dry-sage pl-6">
                    <h3 className="text-h3 font-semibold text-cornsilk">{usp.title}</h3>
                    <p className="mt-2 text-body text-dry-sage leading-relaxed">
                      {usp.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block"><SectionBottomBars /></div>
      </section>

      {/* ── Tools & Technologieen ── */}
      <section className="section relative" aria-labelledby="tech-title">
        <div className="hidden md:block"><SectionTopBars /></div>
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="tech-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Tools &amp; Technologieën
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-12">
              Ik werk met de beste tools voor design en ontwikkeling.
            </p>
          </FadeIn>

          <div className="space-y-8">
            {techGroups.map((group, groupIndex) => (
              <FadeIn key={group.label} delay={groupIndex * 0.15}>
                <div className="text-center">
                  <h3 className="text-small font-semibold text-grey-olive uppercase tracking-widest mb-4">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {group.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center px-4 py-2 bg-ink border border-ebony text-small text-dry-sage hover:border-grey-olive hover:text-cornsilk transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <MaintenanceSection />

      {/* ── CTA ── */}
      <section
        className="section relative min-h-[60vh] flex flex-col justify-center items-center text-center border-t border-ebony"
        aria-labelledby="cta-title"
      >
        <div className="container-narrow flex flex-col items-center gap-8">
          <TitleReveal
            as="h2"
            id="cta-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk"
          >
            Klaar voor een website die indruk maakt?
          </TitleReveal>
          <FadeIn delay={0.2}>
            <p className="text-body text-dry-sage max-w-prose mx-auto">
              Laten we kennismaken en ontdekken hoe ik jouw online doelen kan bereiken.
              Geen verplichtingen, gewoon een goed gesprek.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Button href="/contact" variant="primary">
              Plan een gesprek
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
