'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

import { Button } from '@/components/ui/Button';

interface ScrollTriggerRef {
  kill: () => void;
}

interface GsapTimelineRef {
  kill: () => void;
}

const brandingLayers = [
  {
    label: 'Logo & woordmerk',
    description:
      'Een herkenbaar symbool dat past bij jouw merk en doelgroep. Uniek, tijdloos en veelzijdig inzetbaar, van visitekaartje tot billboard.',
  },
  {
    label: 'Kleurenpalet',
    description:
      'Kleuren die de juiste emotie oproepen en je merk onderscheiden. Primaire en secundaire kleuren met duidelijke toepassing voor elk medium.',
  },
  {
    label: 'Typografie',
    description:
      'Lettertypen die karakter geven aan je communicatie. Van koppen tot bodytekst: consistent en leesbaar op elk formaat.',
  },
  {
    label: 'Beeldtaal',
    description:
      'Fotografie, illustraties en grafische elementen die je verhaal versterken. Een visuele taal die direct herkenbaar is als jouw merk.',
  },
  {
    label: 'Huisstijlgids',
    description:
      'Alle richtlijnen gebundeld in een duidelijk handboek. Zodat je merk consistent blijft, ook als anderen ermee werken.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Ontdekking',
    description:
      'Ik duik in jouw wereld: wie ben je, waar sta je voor, en wie wil je bereiken? Door gesprekken en onderzoek leg ik de basis voor een merkidentiteit die klopt.',
  },
  {
    number: '02',
    title: 'Strategie',
    description:
      'Op basis van de ontdekking bepaal ik je merkpositie, kernwaarden en visuele richting. Een stevig fundament voordat ik ga ontwerpen.',
  },
  {
    number: '03',
    title: 'Creatie',
    description:
      'Ik ontwerp logo, kleuren, typografie en beeldtaal. Je ziet concepten, geeft feedback en samen komen we tot een identiteit die onderscheidt.',
  },
  {
    number: '04',
    title: 'Oplevering',
    description:
      'Je ontvangt alle bestanden, een huisstijlgids en de tools om je merk consistent te voeren. Klaar om de wereld in te gaan.',
  },
];

const processPhases = [
  {
    label: 'Ontdekking',
    description:
      'Ik duik in jouw wereld: wie ben je, waar sta je voor, en wie wil je bereiken? Door gesprekken en onderzoek leg ik de basis voor een merkidentiteit die klopt.',
  },
  {
    label: 'Strategie',
    description:
      'Op basis van de ontdekking bepaal ik je merkpositie, kernwaarden en visuele richting. Een stevig fundament voordat ik ga ontwerpen.',
  },
  {
    label: 'Creatie',
    description:
      'Ik ontwerp logo, kleuren, typografie en beeldtaal. Je ziet concepten, geeft feedback en samen komen we tot een identiteit die onderscheidt.',
  },
  {
    label: 'Oplevering',
    description:
      'Je ontvangt alle bestanden, een huisstijlgids en de tools om je merk consistent te voeren. Klaar om de wereld in te gaan.',
  },
];

const whyPoints = [
  {
    title: 'Meer dan een logo',
    description:
      'Een sterk merk gaat verder dan een mooi plaatje. Ik bouw een complete identiteit die je bedrijf positioneert en je doelgroep aanspreekt.',
  },
  {
    title: 'Ontwerp + techniek',
    description:
      'Omdat ik ook websites bouw, weet ik hoe branding in de praktijk werkt. Elk ontwerp is geoptimaliseerd voor digitale toepassing.',
  },
  {
    title: 'Jouw verhaal centraal',
    description:
      'Ik begin niet met kleuren of fonts, maar met jouw verhaal. Alles wat ik ontwerp komt voort uit wie je bent en waar je naartoe wilt.',
  },
];

export function BrandingPageClient() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersPinRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const brandMarkRef = useRef<HTMLDivElement>(null);

  // ── 1. Hero: Mouse parallax on brand canvas (desktop) ──
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
          x: x * depth * 25,
          y: y * depth * 25,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    });
  }, []);

  // Mobile: ambient floating animation for hero canvas
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

  // ── 2. Branding layers: pinned section, cards slide over each other from bottom ──
  useEffect(() => {
    const wrapper = layersPinRef.current;
    if (!wrapper) return;

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

        const pinTarget = wrapper.querySelector<HTMLElement>('.layers-pin-target');
        const cards = wrapper.querySelectorAll<HTMLElement>('.layer-card');
        if (!pinTarget || cards.length < 2) return;

        // Card 0 is already visible. Cards 1-4 start below viewport and slide up over the previous.
        for (let i = 1; i < cards.length; i++) {
          gsap.set(cards[i], { yPercent: 100 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTarget,
            start: 'top top',
            end: () => `+=${window.innerHeight * (cards.length - 1)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Set initial state for all icon elements
        cards.forEach((card, i) => {
          const icon = card.querySelector('.layer-icon');
          if (!icon) return;

          if (i === 0) {
            // Card 0 is already visible — don't hide, animate later via ScrollTrigger.create
          } else if (i === 1) {
            // Kleurenpalet: swatches scale in staggered
            const swatches = card.querySelectorAll('.icon-swatch');
            gsap.set(swatches, { scale: 0, opacity: 0 });
          } else if (i === 2) {
            // Typografie: letter scales up, label fades
            const letter = card.querySelector('.icon-letter');
            const label = card.querySelector('.icon-label');
            if (letter) gsap.set(letter, { scale: 0.3, opacity: 0 });
            if (label) gsap.set(label, { opacity: 0, y: 8 });
          } else if (i === 3) {
            // Beeldtaal: frame slides in, circle scales, grid fades
            const frame = card.querySelector('.icon-frame');
            const circle = card.querySelector('.icon-circle');
            const grid = card.querySelector('.icon-grid');
            if (frame) gsap.set(frame, { x: -30, opacity: 0 });
            if (circle) gsap.set(circle, { scale: 0, opacity: 0 });
            if (grid) gsap.set(grid, { opacity: 0, y: 10 });
          } else if (i === 4) {
            // Huisstijlgids: whole icon scales up
            gsap.set(icon, { scale: 0.7, opacity: 0 });
          }
        });

        // Set initial hidden state for card 0 icon
        const ring0 = cards[0].querySelector('.icon-ring');
        const diamond0 = cards[0].querySelector('.icon-diamond');
        const dot0 = cards[0].querySelector('.icon-dot');
        const label0 = cards[0].querySelector('.icon-label');
        if (ring0) gsap.set(ring0, { scale: 0, opacity: 0 });
        if (diamond0) gsap.set(diamond0, { scale: 0, rotation: 0, opacity: 0 });
        if (dot0) gsap.set(dot0, { scale: 0, opacity: 0 });
        if (label0) gsap.set(label0, { opacity: 0, y: 10 });

        // Each card slides up from yPercent:100 to yPercent:0, covering the previous
        const step = 1 / (cards.length - 1);
        const animated = new Set<number>();

        const playIconAnim = (idx: number) => {
          if (animated.has(idx)) return;
          animated.add(idx);
          const card = cards[idx];

          if (idx === 0) {
            const ring = card.querySelector('.icon-ring');
            const diamond = card.querySelector('.icon-diamond');
            const dot = card.querySelector('.icon-dot');
            const label = card.querySelector('.icon-label');
            const tl2 = gsap.timeline();
            if (ring) tl2.to(ring, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0);
            if (diamond) tl2.to(diamond, { scale: 1, rotation: 45, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.15);
            if (dot) tl2.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, 0.35);
            if (label) tl2.to(label, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.4);
          } else if (idx === 1) {
            const swatches = card.querySelectorAll('.icon-swatch');
            swatches.forEach((swatch, s) => {
              gsap.to(swatch, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)', delay: s * 0.08 });
            });
          } else if (idx === 2) {
            const letter = card.querySelector('.icon-letter');
            const label = card.querySelector('.icon-label');
            if (letter) gsap.to(letter, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' });
            if (label) gsap.to(label, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.2 });
          } else if (idx === 3) {
            const frame = card.querySelector('.icon-frame');
            const circle = card.querySelector('.icon-circle');
            const grid = card.querySelector('.icon-grid');
            if (frame) gsap.to(frame, { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
            if (circle) gsap.to(circle, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.15 });
            if (grid) gsap.to(grid, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: 0.3 });
          } else if (idx === 4) {
            const icon = card.querySelector('.layer-icon');
            if (icon) gsap.to(icon, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' });
          }
        };

        // Card 0: trigger icon anim when pin starts (position 0)
        tl.call(() => playIconAnim(0), [], 0);

        for (let i = 1; i < cards.length; i++) {
          tl.to(cards[i], {
            yPercent: 0,
            duration: step,
            ease: 'power2.inOut',
          }, (i - 1) * step);

          // Fire icon anim at the exact moment yPercent hits 0 (card is fixed)
          tl.call(() => playIconAnim(i), [], i * step);
        }

        timeline = tl;
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    );

    return () => {
      killed = true;
      timeline?.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // ── 3. Process: Pinned brand genesis (desktop) ──
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
        const progressDots = section.querySelectorAll<HTMLElement>('.progress-dot');
        if (!pinWrapper || !phaseEls.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapper,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self: { progress: number }) => {
              const p = self.progress;
              const totalPhases = 4;
              // Each phase occupies a segment; calculate blend within transition zone
              const segmentSize = 1 / totalPhases;
              const transitionZone = 0.15; // 15% of total for crossfade

              phaseEls.forEach((el, idx) => {
                const segStart = idx * segmentSize;
                const segEnd = (idx + 1) * segmentSize;
                let opacity = 0;

                if (p >= segStart && p < segEnd) {
                  // Active phase
                  if (p < segStart + transitionZone && idx > 0) {
                    // Fading in
                    opacity = (p - segStart) / transitionZone;
                  } else if (p > segEnd - transitionZone && idx < totalPhases - 1) {
                    // Fading out
                    opacity = (segEnd - p) / transitionZone;
                  } else {
                    opacity = 1;
                  }
                }

                gsap.to(el, { opacity, duration: 0.15, overwrite: true });
              });

              descEls.forEach((el, idx) => {
                const segStart = idx * segmentSize;
                const segEnd = (idx + 1) * segmentSize;
                let opacity = 0;
                let y = 20;

                if (p >= segStart && p < segEnd) {
                  if (p < segStart + transitionZone && idx > 0) {
                    const blend = (p - segStart) / transitionZone;
                    opacity = blend;
                    y = 20 * (1 - blend);
                  } else if (p > segEnd - transitionZone && idx < totalPhases - 1) {
                    const blend = (segEnd - p) / transitionZone;
                    opacity = blend;
                    y = -15 * (1 - blend);
                  } else {
                    opacity = 1;
                    y = 0;
                  }
                }

                gsap.to(el, { opacity, y, duration: 0.15, overwrite: true });
              });

              progressDots.forEach((dot, idx) => {
                const isActive = idx === Math.min(Math.floor(p * totalPhases), totalPhases - 1);
                gsap.to(dot, {
                  scale: isActive ? 1.5 : 1,
                  backgroundColor: idx <= Math.floor(p * totalPhases)
                    ? 'rgba(254,250,220,0.5)'
                    : 'rgba(139,129,116,0.2)',
                  duration: 0.3,
                  overwrite: true,
                });
              });
            },
          },
        });

        // Add a dummy tween so the timeline has duration
        tl.to({}, { duration: 1 });

        timeline = tl;
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

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

  // ── 4. Brand mark construction: scroll-scrubbed draw (all viewports) ──
  useEffect(() => {
    const container = brandMarkRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let killed = false;
    const triggers: Array<ScrollTriggerRef> = [];
    let timeline: GsapTimelineRef | null = null;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (killed) return;
        gsap.registerPlugin(ScrollTrigger);

        const circle = container.querySelector<HTMLElement>('.mark-circle');
        const diagonal = container.querySelector<HTMLElement>('.mark-diagonal');
        const bar = container.querySelector<HTMLElement>('.mark-bar');
        const text = container.querySelector<HTMLElement>('.mark-text');
        if (!circle || !diagonal || !bar || !text) return;

        gsap.set(circle, { scale: 0, opacity: 0 });
        gsap.set(diagonal, { scaleX: 0, opacity: 0 });
        gsap.set(bar, { scaleX: 0, opacity: 0 });
        gsap.set(text, { opacity: 0, y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
        });

        tl.to(circle, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0);
        tl.to(diagonal, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.3);
        tl.to(bar, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.6);
        tl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.9);

        timeline = tl;
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      }
    );

    return () => {
      killed = true;
      timeline?.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <main className="relative">
      {/* ── Hero — Brand Specimen Board ── */}
      <section className="section relative min-h-screen flex flex-col justify-center overflow-hidden" onMouseMove={handleMouseMove}>
        {/* Full-width background brand canvas with parallax */}
        <div
          ref={canvasRef}
          className="absolute inset-0 select-none pointer-events-none"
          aria-hidden
        >
          {/* Subtle grid */}
          <div
            data-depth="0.3"
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(var(--grey-olive) 1px, transparent 1px), linear-gradient(90deg, var(--grey-olive) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Giant typography specimen — background watermark */}
          <div
            data-depth="1"
            className="absolute top-[8%] right-[-5%] md:right-[2%] opacity-[0.06]"
          >
            <span className="block text-[12rem] md:text-[20rem] lg:text-[26rem] font-bold leading-[0.8] tracking-tighter text-cornsilk">
              Aa
            </span>
          </div>

          {/* Type scale — stacked on right */}
          <div
            data-depth="2.5"
            className="hidden md:flex absolute top-[18%] right-[8%] flex-col gap-3"
          >
            <span className="text-[2.5rem] font-bold text-cornsilk/10 leading-none">Display</span>
            <span className="text-[1.5rem] font-bold text-cornsilk/8 leading-none">Heading</span>
            <span className="text-body text-cornsilk/6 leading-none">Body text</span>
            <span className="text-small text-cornsilk/5 leading-none">Caption</span>
          </div>

          {/* Color system — large swatches diagonal */}
          <div
            data-depth="3"
            className="hidden md:block absolute top-[55%] right-[6%]"
          >
            <div className="flex gap-3 -rotate-6">
              {[
                { color: '#fefadc', label: 'Cornsilk' },
                { color: '#cacaaa', label: 'Dry Sage' },
                { color: '#8b8174', label: 'Grey Olive' },
                { color: '#545c52', label: 'Ebony' },
                { color: '#040711', label: 'Ink Black', border: true },
              ].map((swatch) => (
                <div key={swatch.label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 lg:w-14 lg:h-14"
                    style={{
                      backgroundColor: swatch.color,
                      border: swatch.border ? '1px solid #8b8174' : 'none',
                    }}
                  />
                  <span className="text-[9px] font-mono tracking-wider text-grey-olive/30 uppercase">
                    {swatch.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logo construction — circle + golden ratio lines */}
          <div
            data-depth="4"
            className="hidden md:block absolute bottom-[15%] left-[52%]"
          >
            <div className="relative w-32 h-32 lg:w-44 lg:h-44">
              {/* Outer circle */}
              <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(202,202,170,0.12)' }} />
              {/* Inner circle */}
              <div className="absolute top-[18%] left-[18%] w-[64%] h-[64%] rounded-full" style={{ border: '1px solid rgba(254,250,220,0.08)' }} />
              {/* Cross guides */}
              <div className="absolute top-0 left-1/2 w-px h-full" style={{ backgroundColor: 'rgba(139,129,116,0.1)' }} />
              <div className="absolute top-1/2 left-0 w-full h-px" style={{ backgroundColor: 'rgba(139,129,116,0.1)' }} />
              {/* Diagonal */}
              <div className="absolute top-0 left-0 w-full h-full" style={{ borderTop: '1px solid rgba(139,129,116,0.06)', transformOrigin: 'top left', transform: 'rotate(45deg) scaleX(1.414)' }} />
              {/* Logo mark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-10 h-10 lg:w-14 lg:h-14">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(202,202,170,0.08)', border: '1px solid rgba(202,202,170,0.15)' }} />
                  <div className="absolute top-[30%] left-[30%] w-[50%] h-[35%]" style={{ border: '1px solid rgba(254,250,220,0.12)' }} />
                </div>
              </div>
            </div>
            <span className="block text-[9px] font-mono text-grey-olive/20 mt-2 text-center tracking-widest">LOGO CONSTRUCTION</span>
          </div>

          {/* Alignment guides — horizontal */}
          <div data-depth="1" className="hidden md:block">
            <div className="absolute top-[30%] left-0 w-full h-px" style={{ backgroundColor: 'rgba(139,129,116,0.04)' }} />
            <div className="absolute top-[70%] left-0 w-full h-px" style={{ backgroundColor: 'rgba(139,129,116,0.04)' }} />
          </div>

          {/* Scattered brand keywords */}
          <div data-depth="2" className="hidden md:block">
            <span className="absolute top-[42%] right-[22%] text-[10px] font-mono text-grey-olive/15 tracking-[0.3em] uppercase rotate-90">Identiteit</span>
            <span className="absolute bottom-[28%] right-[38%] text-[10px] font-mono text-grey-olive/12 tracking-[0.3em] uppercase">Merkstrategie</span>
          </div>

          {/* Dot grid cluster */}
          <div
            data-depth="3.5"
            className="hidden md:block absolute top-[65%] left-[60%]"
          >
            <div className="grid grid-cols-5 gap-2 opacity-20">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-grey-olive" />
              ))}
            </div>
          </div>
        </div>

        {/* Foreground content */}
        <div className="container-narrow relative z-10">
          <FadeIn>
            <Link
              href="/diensten"
              className="text-small text-grey-olive hover:text-dry-sage transition-colors"
            >
              &larr; Terug naar diensten
            </Link>
          </FadeIn>

          <div className="mt-16 md:mt-24 max-w-2xl">
            <FadeIn delay={0.1}>
              <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-6">
                Identiteit &middot; Huisstijl &middot; Merkstrategie
              </span>
            </FadeIn>
            <TitleReveal
              as="h1"
              className="text-hero md:text-hero-xl lg:text-hero-2xl font-bold text-cornsilk"
              triggerOnMount
            >
              Een merk dat blijft hangen
            </TitleReveal>
            <FadeIn delay={0.3}>
              <p className="mt-6 md:mt-8 text-body md:text-[1.125rem] text-dry-sage max-w-[48ch] leading-relaxed">
                Een sterk merk begint met een duidelijke identiteit. Blitzworx ontwikkelt
                logo&apos;s, huisstijlen en visuele richtlijnen die jouw onderneming herkenbaar
                maken, offline en online.
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/contact" variant="primary">
                  Start jouw branding
                </Button>
                <Button href="/cases" variant="outline">
                  Bekijk mijn werk
                </Button>
              </div>
            </FadeIn>

            {/* Inline brand elements strip — mobile visible */}
            <FadeIn delay={0.6}>
              <div className="mt-16 md:mt-20 flex items-center gap-6 md:gap-8">
                {/* Mini color strip */}
                <div className="flex gap-1">
                  {['#fefadc', '#cacaaa', '#8b8174', '#545c52', '#040711'].map((c) => (
                    <div
                      key={c}
                      className="w-5 h-5 md:w-6 md:h-6"
                      style={{
                        backgroundColor: c,
                        border: c === '#040711' ? '1px solid #8b8174' : 'none',
                      }}
                    />
                  ))}
                </div>
                <div className="w-px h-6 bg-ebony" />
                {/* Font specimen */}
                <span className="text-[1.75rem] font-bold text-cornsilk/15 leading-none select-none">Aa</span>
                <div className="w-px h-6 bg-ebony" />
                {/* Mini logo mark */}
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(202,202,170,0.25)' }} />
                  <div className="absolute top-[30%] left-[30%] w-[45%] h-[35%]" style={{ border: '1px solid rgba(254,250,220,0.15)' }} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Branding Layers — Pinned Sliding Cards ── */}
      <section
        ref={layersPinRef}
        className="relative overflow-hidden"
        aria-labelledby="layers-title"
      >
        {/* Title above pinned area */}
        <div className="container-narrow py-16 md:py-24">
          <TitleReveal
            as="h2"
            id="layers-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            De lagen van jouw merk
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto">
              Een sterke merkidentiteit bestaat uit meerdere lagen die samen een herkenbaar
              geheel vormen.
            </p>
          </FadeIn>
        </div>

        {/* Desktop: pinned viewport with stacked sliding cards */}
        <div className="layers-pin-target hidden md:block">
          <div className="relative w-full h-screen overflow-hidden">
            {brandingLayers.map((layer, index) => (
              <div
                key={layer.label}
                className="layer-card absolute inset-0 w-full h-full"
                style={{ zIndex: index + 1 }}
              >
                {/* Full-viewport card with centered content */}
                <div className="w-full h-full bg-ink border-t border-ebony flex items-center justify-center">
                  <div className="container-narrow">
                    <div className="grid grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
                      {/* Left: icon + number */}
                      <div className="flex flex-col items-center">
                        {/* Giant number */}
                        <span
                          className="block font-bold font-mono leading-none text-ebony/20 select-none mb-8"
                          style={{ fontSize: '8rem' }}
                          aria-hidden
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Large decorative icon */}
                        <div aria-hidden>
                          {index === 0 && (
                            <div className="flex flex-col items-center layer-icon">
                              <div className="relative w-28 h-28">
                                <div className="icon-ring absolute inset-0 rounded-full border-2 border-dry-sage/30" />
                                <div className="icon-diamond absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rotate-45 border-2 border-cornsilk/20" />
                                <div className="icon-dot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-dry-sage/50 rounded-full" />
                              </div>
                              <span className="icon-label text-body font-bold text-grey-olive/40 mt-3 tracking-widest select-none">merknaam</span>
                            </div>
                          )}
                          {index === 1 && (
                            <div className="grid grid-cols-3 gap-2.5 w-28 layer-icon">
                              <div className="icon-swatch aspect-square" style={{ backgroundColor: '#fefadc' }} />
                              <div className="icon-swatch aspect-square" style={{ backgroundColor: '#cacaaa' }} />
                              <div className="icon-swatch aspect-square" style={{ backgroundColor: '#8b8174' }} />
                              <div className="icon-swatch aspect-square" style={{ backgroundColor: '#545c52' }} />
                              <div className="icon-swatch aspect-square" style={{ backgroundColor: '#040711', border: '1px solid #8b8174' }} />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="flex flex-col items-center layer-icon">
                              <span className="icon-letter text-[4.5rem] font-bold text-cornsilk/15 leading-[0.85] select-none">
                                Aa
                              </span>
                              <span className="icon-label text-small font-mono text-grey-olive/40 mt-2 select-none">
                                Gilroy &middot; 700
                              </span>
                            </div>
                          )}
                          {index === 3 && (
                            <div className="relative w-32 h-32 layer-icon">
                              {/* Photo frame placeholder */}
                              <div className="icon-frame absolute top-0 left-0 w-20 h-16" style={{ border: '1px solid #8b8174', backgroundColor: 'rgba(202,202,170,0.08)' }}>
                                {/* Mountain silhouette */}
                                <svg viewBox="0 0 80 48" className="icon-mountain absolute bottom-0 left-0 w-full" style={{ opacity: 0.4 }}>
                                  <polygon points="0,48 20,18 35,32 50,12 80,48" fill="#8b8174" />
                                  <circle cx="62" cy="12" r="5" fill="#cacaaa" />
                                </svg>
                              </div>
                              {/* Overlapping graphic element */}
                              <div className="icon-circle absolute bottom-2 right-0 w-16 h-16 rounded-full" style={{ border: '2px solid rgba(254,250,220,0.2)', backgroundColor: 'rgba(202,202,170,0.06)' }} />
                              {/* Pattern grid */}
                              <div className="icon-grid absolute bottom-0 left-8 grid grid-cols-3 gap-1" style={{ opacity: 0.3 }}>
                                {[...Array(9)].map((_, i) => (
                                  <div key={i} className="w-2 h-2" style={{ backgroundColor: i % 2 === 0 ? '#cacaaa' : '#8b8174' }} />
                                ))}
                              </div>
                            </div>
                          )}
                          {index === 4 && (
                            <div className="relative w-28 layer-icon" style={{ border: '1px solid #8b8174', padding: '14px', backgroundColor: 'rgba(84,92,82,0.5)' }}>
                              {/* Title bar */}
                              <div style={{ width: '75%', height: '8px', backgroundColor: 'rgba(254,250,220,0.7)', marginBottom: '14px' }} />
                              {/* Text lines */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                                <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(254,250,220,0.45)' }} />
                                <div style={{ width: '80%', height: '3px', backgroundColor: 'rgba(254,250,220,0.35)' }} />
                                <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(254,250,220,0.45)' }} />
                                <div style={{ width: '60%', height: '3px', backgroundColor: 'rgba(254,250,220,0.3)' }} />
                                <div style={{ width: '85%', height: '3px', backgroundColor: 'rgba(254,250,220,0.4)' }} />
                                <div style={{ width: '66%', height: '3px', backgroundColor: 'rgba(254,250,220,0.35)' }} />
                              </div>
                              {/* Color swatches row */}
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                                <div style={{ width: '14px', height: '14px', backgroundColor: '#fefadc' }} />
                                <div style={{ width: '14px', height: '14px', backgroundColor: '#cacaaa' }} />
                                <div style={{ width: '14px', height: '14px', backgroundColor: '#8b8174' }} />
                                <div style={{ width: '14px', height: '14px', backgroundColor: '#545c52', border: '1px solid #8b8174' }} />
                              </div>
                              {/* More text lines */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(254,250,220,0.4)' }} />
                                <div style={{ width: '66%', height: '3px', backgroundColor: 'rgba(254,250,220,0.3)' }} />
                                <div style={{ width: '80%', height: '3px', backgroundColor: 'rgba(254,250,220,0.35)' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: text content */}
                      <div>
                        <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-4">
                          Laag {String(index + 1).padStart(2, '0')} / 05
                        </span>
                        <h3 className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4">
                          {layer.label}
                        </h3>
                        <p className="text-body text-dry-sage leading-relaxed max-w-md">
                          {layer.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical card list */}
        <div className="md:hidden container-narrow pb-16 space-y-6">
          {brandingLayers.map((layer, index) => (
            <FadeIn key={layer.label} delay={index * 0.1}>
              <div className="relative p-6 bg-ink border border-ebony overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                  }}
                  aria-hidden
                />
                <span className="text-caption font-mono text-grey-olive tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-h3 font-semibold text-cornsilk mt-1 mb-2">{layer.label}</h3>
                <p className="text-body text-dry-sage leading-relaxed">{layer.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Process — Brand Genesis ── */}
      <section
        ref={processRef}
        className="section relative"
        aria-labelledby="process-title"
      >
        <div className="process-pin-wrapper flex items-center" style={{ height: '100vh' }}>
          <div className="container-narrow w-full">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16 items-center">
              {/* Left: Brand artboard — visual evolution */}
              <div className="relative hidden md:block">
                <div className="relative aspect-square w-full max-w-[420px] mx-auto">
                  {/* Artboard frame */}
                  <div className="absolute inset-0 border border-ebony" />
                  {/* Corner crop marks */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-grey-olive/30" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-grey-olive/30" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-grey-olive/30" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-grey-olive/30" />

                  {/* Phase 0: Ontdekking — magnifying glass over scattered notes */}
                  <div className="process-phase absolute inset-0 opacity-100">
                    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                      {/* Scattered note cards */}
                      <rect x="40" y="60" width="100" height="65" rx="4" fill="rgba(139,129,116,0.06)" stroke="rgba(139,129,116,0.12)" strokeWidth="1" transform="rotate(-6 90 92)" />
                      <line x1="55" y1="78" x2="115" y2="78" stroke="rgba(139,129,116,0.12)" strokeWidth="2" transform="rotate(-6 85 78)" />
                      <line x1="55" y1="90" x2="100" y2="90" stroke="rgba(139,129,116,0.08)" strokeWidth="2" transform="rotate(-6 77 90)" />
                      <line x1="55" y1="102" x2="110" y2="102" stroke="rgba(139,129,116,0.1)" strokeWidth="2" transform="rotate(-6 82 102)" />

                      <rect x="240" y="45" width="110" height="70" rx="4" fill="rgba(139,129,116,0.05)" stroke="rgba(139,129,116,0.1)" strokeWidth="1" transform="rotate(4 295 80)" />
                      <line x1="255" y1="65" x2="325" y2="65" stroke="rgba(139,129,116,0.1)" strokeWidth="2" transform="rotate(4 290 65)" />
                      <line x1="255" y1="78" x2="310" y2="78" stroke="rgba(139,129,116,0.07)" strokeWidth="2" transform="rotate(4 282 78)" />
                      <line x1="255" y1="91" x2="320" y2="91" stroke="rgba(139,129,116,0.09)" strokeWidth="2" transform="rotate(4 287 91)" />

                      <rect x="60" y="240" width="95" height="60" rx="4" fill="rgba(139,129,116,0.04)" stroke="rgba(139,129,116,0.1)" strokeWidth="1" transform="rotate(3 107 270)" />
                      <line x1="75" y1="258" x2="130" y2="258" stroke="rgba(139,129,116,0.09)" strokeWidth="2" transform="rotate(3 102 258)" />
                      <line x1="75" y1="270" x2="120" y2="270" stroke="rgba(139,129,116,0.06)" strokeWidth="2" transform="rotate(3 97 270)" />

                      <rect x="260" y="260" width="100" height="55" rx="4" fill="rgba(139,129,116,0.05)" stroke="rgba(139,129,116,0.08)" strokeWidth="1" transform="rotate(-3 310 287)" />
                      <line x1="275" y1="278" x2="335" y2="278" stroke="rgba(139,129,116,0.08)" strokeWidth="2" transform="rotate(-3 305 278)" />
                      <line x1="275" y1="290" x2="320" y2="290" stroke="rgba(139,129,116,0.06)" strokeWidth="2" transform="rotate(-3 297 290)" />

                      {/* Scattered data points */}
                      <circle cx="190" cy="140" r="3" fill="rgba(139,129,116,0.12)" />
                      <circle cx="220" cy="170" r="2.5" fill="rgba(139,129,116,0.09)" />
                      <circle cx="170" cy="260" r="2" fill="rgba(139,129,116,0.08)" />
                      <circle cx="210" cy="230" r="3" fill="rgba(139,129,116,0.1)" />

                      {/* Magnifying glass — center focus */}
                      <circle cx="200" cy="195" r="42" stroke="rgba(202,202,170,0.2)" strokeWidth="2.5" fill="none" />
                      <line x1="230" y1="225" x2="258" y2="253" stroke="rgba(202,202,170,0.2)" strokeWidth="3" strokeLinecap="round" />
                      {/* Lens highlight */}
                      <path d="M175 178 Q185 168 198 172" stroke="rgba(254,250,220,0.08)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                      {/* Connecting thought lines */}
                      <line x1="140" y1="125" x2="165" y2="165" stroke="rgba(139,129,116,0.06)" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="295" y1="115" x2="240" y2="170" stroke="rgba(139,129,116,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="155" y1="270" x2="175" y2="230" stroke="rgba(139,129,116,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                  </div>

                  {/* Phase 1: Strategie — structure emerges, blueprint grid + golden ratio */}
                  <div className="process-phase absolute inset-0 opacity-0">
                    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                      {/* Background grid — subtle blueprint feel */}
                      {[80, 120, 160, 200, 240, 280, 320].map((v) => (
                        <line key={`vg-${v}`} x1={v} y1="40" x2={v} y2="360" stroke="rgba(202,202,170,0.05)" strokeWidth="1" />
                      ))}
                      {[80, 120, 160, 200, 240, 280, 320].map((v) => (
                        <line key={`hg-${v}`} x1="40" y1={v} x2="360" y2={v} stroke="rgba(202,202,170,0.05)" strokeWidth="1" />
                      ))}

                      {/* Main axis lines — dashed */}
                      <line x1="200" y1="50" x2="200" y2="350" stroke="rgba(202,202,170,0.15)" strokeWidth="1" strokeDasharray="6 4" />
                      <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(202,202,170,0.15)" strokeWidth="1" strokeDasharray="6 4" />

                      {/* Golden ratio spiral hint */}
                      <path d="M200 120 A80 80 0 0 1 280 200" stroke="rgba(202,202,170,0.12)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                      <path d="M280 200 A80 80 0 0 1 200 280" stroke="rgba(202,202,170,0.08)" strokeWidth="1" fill="none" strokeDasharray="4 3" />

                      {/* Logo placeholder — positioned on grid */}
                      <circle cx="200" cy="140" r="32" stroke="rgba(202,202,170,0.22)" strokeWidth="1.5" fill="none" strokeDasharray="5 3" />
                      {/* Crosshair in logo center */}
                      <line x1="192" y1="140" x2="208" y2="140" stroke="rgba(202,202,170,0.15)" strokeWidth="1" />
                      <line x1="200" y1="132" x2="200" y2="148" stroke="rgba(202,202,170,0.15)" strokeWidth="1" />

                      {/* Text alignment blocks */}
                      <rect x="130" y="220" width="140" height="6" rx="1" fill="rgba(202,202,170,0.12)" />
                      <rect x="150" y="234" width="100" height="4" rx="1" fill="rgba(202,202,170,0.08)" />

                      {/* Color palette slots */}
                      <rect x="120" y="280" width="24" height="24" rx="2" stroke="rgba(139,129,116,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                      <rect x="152" y="280" width="24" height="24" rx="2" stroke="rgba(139,129,116,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                      <rect x="184" y="280" width="24" height="24" rx="2" stroke="rgba(139,129,116,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                      <rect x="216" y="280" width="24" height="24" rx="2" stroke="rgba(139,129,116,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                      <rect x="248" y="280" width="24" height="24" rx="2" stroke="rgba(139,129,116,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 2" />

                      {/* Measurement arrows */}
                      <line x1="80" y1="108" x2="80" y2="172" stroke="rgba(139,129,116,0.15)" strokeWidth="0.75" />
                      <line x1="76" y1="108" x2="84" y2="108" stroke="rgba(139,129,116,0.15)" strokeWidth="0.75" />
                      <line x1="76" y1="172" x2="84" y2="172" stroke="rgba(139,129,116,0.15)" strokeWidth="0.75" />

                      {/* Annotations */}
                      <text x="345" y="55" fill="rgba(139,129,116,0.2)" fontSize="9" fontFamily="monospace" textAnchor="end">GRID 12</text>
                      <text x="55" y="355" fill="rgba(139,129,116,0.2)" fontSize="9" fontFamily="monospace">φ 1.618</text>
                    </svg>
                  </div>

                  {/* Phase 2: Creatie — forms solidify, colors fill, identity takes shape */}
                  <div className="process-phase absolute inset-0 opacity-0">
                    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                      {/* Faint construction line — remnant of strategy phase */}
                      <line x1="200" y1="50" x2="200" y2="350" stroke="rgba(202,202,170,0.05)" strokeWidth="1" strokeDasharray="6 4" />

                      {/* Logo solidifies — circle + inner mark */}
                      <circle cx="200" cy="120" r="40" stroke="rgba(202,202,170,0.35)" strokeWidth="2" fill="none" />
                      <circle cx="200" cy="120" r="38" fill="rgba(84,92,82,0.08)" />
                      {/* Abstract mark inside */}
                      <path d="M182 108 L200 95 L218 108 L212 128 L188 128 Z" stroke="rgba(254,250,220,0.25)" strokeWidth="1.5" fill="rgba(254,250,220,0.06)" strokeLinejoin="round" />
                      {/* Inner dot */}
                      <circle cx="200" cy="114" r="3" fill="rgba(254,250,220,0.15)" />

                      {/* Typography specimen — brand name */}
                      <text x="200" y="205" fill="rgba(254,250,220,0.22)" fontSize="28" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Merknaam</text>
                      <text x="200" y="222" fill="rgba(139,129,116,0.25)" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="3">TAGLINE HIER</text>

                      {/* Color palette — filled in */}
                      <rect x="112" y="265" width="28" height="28" rx="2" fill="#fefadc" />
                      <rect x="148" y="265" width="28" height="28" rx="2" fill="#cacaaa" />
                      <rect x="184" y="265" width="28" height="28" rx="2" fill="#8b8174" />
                      <rect x="220" y="265" width="28" height="28" rx="2" fill="#545c52" />
                      <rect x="256" y="265" width="28" height="28" rx="2" fill="#040711" stroke="#8b8174" strokeWidth="1" />
                      {/* Palette labels */}
                      <text x="126" y="306" fill="rgba(139,129,116,0.2)" fontSize="6" fontFamily="monospace" textAnchor="middle">Primary</text>
                      <text x="162" y="306" fill="rgba(139,129,116,0.2)" fontSize="6" fontFamily="monospace" textAnchor="middle">Secondary</text>
                      <text x="198" y="306" fill="rgba(139,129,116,0.2)" fontSize="6" fontFamily="monospace" textAnchor="middle">Accent</text>
                      <text x="234" y="306" fill="rgba(139,129,116,0.2)" fontSize="6" fontFamily="monospace" textAnchor="middle">Dark</text>
                      <text x="270" y="306" fill="rgba(139,129,116,0.2)" fontSize="6" fontFamily="monospace" textAnchor="middle">Base</text>

                      {/* Type specimen — Aa */}
                      <text x="90" y="355" fill="rgba(254,250,220,0.1)" fontSize="22" fontWeight="bold" fontFamily="sans-serif">Aa</text>
                      <text x="118" y="350" fill="rgba(139,129,116,0.15)" fontSize="8" fontFamily="monospace">Gilroy · 700</text>

                      {/* Brush stroke accent — creativity */}
                      <path d="M60 185 Q130 178 200 182 Q270 186 340 180" stroke="rgba(202,202,170,0.06)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Phase 3: Oplevering — polished brand board */}
                  <div className="process-phase absolute inset-0 opacity-0">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,7,17,0) 0%, rgba(84,92,82,0.08) 100%)' }} />
                    <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%]">
                      {/* Refined logo */}
                      <div className="absolute top-[8%] left-1/2 -translate-x-1/2">
                        <div className="relative w-24 h-24">
                          <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(202,202,170,0.5)', boxShadow: '0 0 30px rgba(202,202,170,0.08)' }} />
                          <div className="absolute top-[26%] left-[26%] w-[50%] h-[36%]" style={{ backgroundColor: 'rgba(254,250,220,0.18)', border: '1px solid rgba(254,250,220,0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                        </div>
                      </div>
                      {/* Brand name — refined */}
                      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 text-center w-full">
                        <span className="block text-[2rem] font-bold leading-none select-none" style={{ color: 'rgba(254,250,220,0.3)' }}>Merknaam</span>
                        <span className="block text-[0.6rem] font-mono mt-2 tracking-[0.35em] uppercase" style={{ color: 'rgba(139,129,116,0.35)' }}>Jouw tagline</span>
                      </div>
                      {/* Polished color strip */}
                      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex gap-1.5">
                        {[
                          { bg: '#fefadc', label: 'Primary' },
                          { bg: '#cacaaa', label: 'Secondary' },
                          { bg: '#8b8174', label: 'Accent' },
                          { bg: '#545c52', label: 'Dark' },
                          { bg: '#040711', label: 'Base', border: true },
                        ].map((c) => (
                          <div key={c.label} className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 lg:w-10 lg:h-10" style={{ backgroundColor: c.bg, border: c.border ? '1px solid #8b8174' : 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
                            <span className="text-[6px] font-mono tracking-wider uppercase" style={{ color: 'rgba(139,129,116,0.3)' }}>{c.label}</span>
                          </div>
                        ))}
                      </div>
                      {/* Typography specimen */}
                      <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 flex items-baseline gap-3">
                        <span className="text-[1.5rem] font-bold select-none" style={{ color: 'rgba(254,250,220,0.12)' }}>Aa</span>
                        <span className="text-[0.6rem] font-mono tracking-wider" style={{ color: 'rgba(139,129,116,0.2)' }}>Gilroy &middot; 700</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Title + phase descriptions + progress */}
              <div>
                <TitleReveal
                  as="h2"
                  id="process-title"
                  className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4"
                >
                  Van verhaal naar merk
                </TitleReveal>
                <FadeIn>
                  <p className="text-body text-dry-sage max-w-prose mb-12">
                    Scroll door mijn brandingproces en zie hoe een merkidentiteit tot leven komt.
                  </p>
                </FadeIn>

                {/* Progress indicator */}
                <div className="hidden md:flex gap-2 mb-10">
                  {[0,1,2,3].map((i) => (
                    <div
                      key={i}
                      className="progress-dot w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: i === 0 ? 'rgba(254,250,220,0.5)' : 'rgba(139,129,116,0.2)' }}
                    />
                  ))}
                </div>

                {/* Desktop: stacked descriptions */}
                <div className="hidden md:block relative min-h-[160px]">
                  {processPhases.map((phase, index) => (
                    <div
                      key={phase.label}
                      className={`process-desc ${index === 0 ? 'relative' : 'absolute inset-0'}`}
                      style={{ opacity: index === 0 ? 1 : 0, transform: index === 0 ? 'none' : 'translateY(20px)' }}
                    >
                      <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-3">
                        Stap {String(index + 1).padStart(2, '0')} / 04
                      </span>
                      <h3 className="text-h3 md:text-h3-lg font-semibold text-cornsilk mb-3">
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
                  {processSteps.map((step, index) => (
                    <FadeIn key={step.number} delay={index * 0.1}>
                      <div className="border-l-2 border-ebony pl-6">
                        <span className="inline-block text-caption font-mono text-grey-olive tracking-wider mb-2">
                          Stap {step.number}
                        </span>
                        <h3 className="text-h3 font-semibold text-cornsilk mb-2">
                          {step.title}
                        </h3>
                        <p className="text-body text-dry-sage leading-relaxed">
                          {step.description}
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

      {/* ── Why Blitzworx — Animated Brand Mark Construction ── */}
      <section className="section relative overflow-hidden" aria-labelledby="why-title">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left: title + animated brand mark */}
            <div>
              <TitleReveal
                as="h2"
                id="why-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Waarom Blitzworx?
              </TitleReveal>
              <FadeIn delay={0.1}>
                <p className="text-body text-dry-sage leading-relaxed mb-8">
                  Ik start met jouw verhaal, doelgroep en concurrentie. Op basis daarvan
                  ontwikkel ik een merkidentiteit die onderscheidend is en aansluit bij wat je
                  wilt uitstralen.
                </p>
              </FadeIn>

              {/* Animated brand mark that draws on scroll */}
              <div
                ref={brandMarkRef}
                className="relative aspect-[4/3] bg-ink border border-ebony overflow-hidden flex items-center justify-center"
              >
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-ebony" aria-hidden />
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-ebony" aria-hidden />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-ebony" aria-hidden />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-ebony" aria-hidden />

                {/* Geometric elements that appear sequentially */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                  {/* 1. Circle outline */}
                  <div
                    className="mark-circle absolute inset-0 rounded-full border-2 border-dry-sage/30"
                    style={{ transformOrigin: 'center center' }}
                  />
                  {/* 2. Diagonal line */}
                  <div
                    className="mark-diagonal absolute top-[15%] left-[15%] w-[70%] h-px bg-grey-olive/40 rotate-45"
                    style={{ transformOrigin: 'left center' }}
                  />
                  {/* 3. Horizontal bar */}
                  <div
                    className="mark-bar absolute top-[60%] left-[10%] w-[80%] h-0.5 bg-cornsilk/25"
                    style={{ transformOrigin: 'left center' }}
                  />
                  {/* 4. Text + caption */}
                  <div className="mark-text text-center relative z-10">
                    <span className="block text-hero-2xl font-bold text-cornsilk/20 select-none leading-none">
                      Bw
                    </span>
                    <span className="block mt-2 text-caption text-grey-olive tracking-widest uppercase">
                      Jouw merk hier
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: USP cards */}
            <div className="space-y-8 md:mt-8">
              {whyPoints.map((point, index) => (
                <FadeIn key={point.title} delay={index * 0.15}>
                  <div className="border-l-2 border-dry-sage pl-6">
                    <h3 className="text-h3 font-semibold text-cornsilk">{point.title}</h3>
                    <p className="mt-2 text-body text-dry-sage leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

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
            Klaar om je merk te versterken?
          </TitleReveal>
          <FadeIn delay={0.2}>
            <p className="text-body text-dry-sage max-w-prose mx-auto">
              Laten we kennismaken en samen ontdekken hoe ik jouw merk kan laten opvallen.
              Geen verplichtingen, gewoon een goed gesprek over jouw ambities.
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
