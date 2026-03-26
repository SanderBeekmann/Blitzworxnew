'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Kennismaking & Analyse',
    description:
      'Elk project begint met een goed gesprek. Ik breng je huidige situatie in kaart, stel de juiste vragen en luister naar wat je wilt bereiken. Samen kijken we naar je doelgroep, wat er al staat en waar de kansen liggen. Op basis daarvan ontvang je een helder voorstel met aanpak, planning en kosten. Pas als het plan voor jou klopt, gaan we van start.',
  },
  {
    number: '02',
    title: 'Prototype & Richting',
    description:
      'Voordat ik ga bouwen, werk ik eerst een prototype, schets of implementatieplan uit. Wat dat precies is hangt af van het project: wireframes bij webdesign, een technisch plan bij development, een processchets bij automatiseringen. Je ziet vroeg welke kant het opgaat en kunt bijsturen voordat er tijd verloren gaat. Zo zitten we op één lijn voordat de eerste regel code geschreven wordt.',
  },
  {
    number: '03',
    title: 'Bouw & Voortgang',
    description:
      'Hier ontstaat het resultaat. Ik werk in korte cycli en deel tussentijds de voortgang, zodat je altijd weet waar het project staat. Aanpassingen verwerk ik direct in de volgende cyclus. Zodra de eerste versie klaar is kun je zelf testen, en ik licht elke keuze toe zodat je begrijpt wat er gebouwd wordt.',
  },
  {
    number: '04',
    title: 'Oplevering & Livegang',
    description:
      'Alles wordt grondig getest op werking, snelheid en weergave op elk apparaat. Je doorloopt het eindresultaat en geeft akkoord op de laatste details. De livegang plannen we samen in op een moment dat voor jou werkt, en na de launch controleer ik of alles correct draait.',
  },
];

const PANEL_COUNT = steps.length;

export function HowItWorxSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<SVGLineElement>(null);
  const dotsRef = useRef<(SVGCircleElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const timelineLine = timelineRef.current;
    if (!wrapper || !section || !track || !progress) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize timeline stroke
    if (timelineLine) {
      const lineLength = timelineLine.getTotalLength();
      timelineLine.style.strokeDasharray = `${lineLength}`;
      timelineLine.style.strokeDashoffset = reduced ? '0' : `${lineLength}`;
    }

    // Show all dots immediately if reduced motion
    if (reduced) {
      dotsRef.current.forEach((dot) => {
        if (dot) dot.style.opacity = '1';
      });
    }

    let rafId: number | null = null;
    const totalScroll = track.scrollWidth - window.innerWidth;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!wrapper || !section || !track || !progress) return;

        const rect = wrapper.getBoundingClientRect();
        const scrollableHeight = rect.height - window.innerHeight;
        if (scrollableHeight <= 0) return;

        // Pin logic: fixed while wrapper is in scroll range
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          section.style.position = 'fixed';
          section.style.top = '0';
          section.style.left = '0';
          section.style.width = '100%';
        } else if (rect.bottom < window.innerHeight) {
          // Scrolled past: park at bottom of wrapper
          section.style.position = 'absolute';
          section.style.top = 'auto';
          section.style.bottom = '0';
          section.style.left = '0';
          section.style.width = '100%';
        } else {
          // Not yet reached: stay at top of wrapper
          section.style.position = 'absolute';
          section.style.top = '0';
          section.style.bottom = 'auto';
          section.style.left = '0';
          section.style.width = '100%';
        }

        const rawProgress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
        track.style.transform = `translateX(${-rawProgress * totalScroll}px)`;
        progress.style.transform = `scaleX(${rawProgress})`;

        // Timeline draw
        if (timelineLine && !reduced) {
          const lineLength = timelineLine.getTotalLength();
          timelineLine.style.strokeDashoffset = `${lineLength * (1 - rawProgress)}`;
        }

        // Dot visibility
        if (!reduced) {
          const dotPositions = [0, 1 / 3, 2 / 3, 1];
          dotsRef.current.forEach((dot, i) => {
            if (dot) {
              dot.style.opacity = rawProgress >= dotPositions[i] ? '1' : '0';
            }
          });
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      // Reset styles on cleanup
      section.style.position = '';
      section.style.top = '';
      section.style.bottom = '';
      section.style.left = '';
      section.style.width = '';
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className="section relative" aria-labelledby="how-it-worx-title">
        <div className="container-narrow">
          <span className="block text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50 mb-4">
            Wat we doen
          </span>
          <h2
            id="how-it-worx-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-12"
          >
            How It Worx
          </h2>

          <div className="flex flex-col gap-10">
            {steps.map((step) => (
              <div key={step.number} className="relative border border-ebony/60 p-6">
                <span
                  className="block text-[3rem] font-bold leading-none select-none mb-4"
                  style={{ color: 'rgba(139,129,116,0.07)' }}
                  aria-hidden
                >
                  {step.number}
                </span>

                <span className="block text-caption font-mono tracking-[0.2em] uppercase text-grey-olive/50 mb-2">
                  {step.number}
                </span>
                <h3 className="text-h3 font-semibold text-cornsilk mb-3">{step.title}</h3>
                <p className="text-small text-dry-sage/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${PANEL_COUNT * 100}vh` }}
    >
      <section
        ref={sectionRef}
        className="absolute top-0 left-0 w-full h-screen overflow-hidden"
        aria-labelledby="how-it-worx-title"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-ebony/30 z-20">
          <div
            ref={progressRef}
            className="h-full bg-dry-sage/50 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Section header pinned top-left */}
        <div className="absolute top-12 left-8 lg:left-16 z-20 pointer-events-none">
          <span className="block text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50 mb-2">
            Wat we doen
          </span>
          <h2
            id="how-it-worx-title"
            className="text-h2 lg:text-h2-lg font-bold text-cornsilk"
          >
            How It Worx
          </h2>
        </div>

        {/* Step indicators */}
        <div className="absolute bottom-10 left-8 lg:left-16 z-20 flex items-center gap-3 pointer-events-none">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center gap-3">
              <span className="text-caption font-mono text-grey-olive/60">{step.number}</span>
              {i < PANEL_COUNT - 1 && <span className="w-6 h-px bg-ebony/40" />}
            </div>
          ))}
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="relative flex h-full will-change-transform"
          style={{ width: `${PANEL_COUNT * 100}vw` }}
        >
          {/* Timeline SVG */}
          <svg
            className="absolute bottom-28 left-0 pointer-events-none z-10"
            style={{ width: '100%', height: '3px', overflow: 'visible' }}
            aria-hidden
          >
            {/* Background line */}
            <line
              x1="0"
              y1="1.5"
              x2="100%"
              y2="1.5"
              stroke="rgba(202,202,170,0.15)"
              strokeWidth="1"
            />
            {/* Animated draw line */}
            <line
              ref={timelineRef}
              x1="0"
              y1="1.5"
              x2="100%"
              y2="1.5"
              stroke="var(--cornsilk)"
              strokeWidth="1"
              className="motion-reduce:![stroke-dashoffset:0]"
            />
            {/* Dots at each step */}
            {steps.map((_, i) => {
              const cx = PANEL_COUNT > 1
                ? `${(i / (PANEL_COUNT - 1)) * 100}%`
                : '50%';
              return (
                <circle
                  key={i}
                  ref={(el) => { dotsRef.current[i] = el; }}
                  cx={cx}
                  cy="1.5"
                  r="4"
                  fill="var(--ink-black)"
                  stroke="var(--cornsilk)"
                  strokeWidth="1.5"
                  className="transition-opacity duration-300 opacity-0 motion-reduce:opacity-100"
                />
              );
            })}
          </svg>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex items-center w-screen h-full shrink-0"
            >
              {/* Large decorative number */}
              <span
                className="absolute right-8 lg:right-20 top-1/2 -translate-y-1/2 text-[clamp(12rem,20vw,22rem)] font-bold leading-none select-none pointer-events-none"
                style={{ color: 'rgba(139,129,116,0.04)' }}
                aria-hidden
              >
                {step.number}
              </span>

              {/* Subtle vertical divider between panels */}
              {index > 0 && (
                <div className="absolute left-0 top-[15%] bottom-[15%] w-px bg-ebony/20" aria-hidden />
              )}

              {/* Panel content */}
              <div className="relative z-10 ml-8 lg:ml-16 max-w-xl xl:max-w-2xl mt-16">
                <span className="block text-caption font-mono tracking-[0.2em] uppercase text-grey-olive/50 mb-3">
                  {step.number}
                </span>

                <h3 className="text-h3 lg:text-h3-lg font-semibold text-cornsilk mb-4">
                  {step.title}
                </h3>

                <p className="text-body text-dry-sage/80 leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
