'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/* Inline keyframes for step illustrations */
const stepAnimationStyles = `
  @keyframes hiw-typing-dot { 0%,80% { opacity:0.2 } 40% { opacity:1 } }
  @keyframes hiw-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
  @keyframes hiw-pulse-line { 0%,100% { opacity:0.15 } 50% { opacity:0.6 } }
  @keyframes hiw-flash { 0%,100% { opacity:0 } 2% { opacity:1 } 6% { opacity:0.8 } 15% { opacity:0 } }
  @keyframes hiw-exhaust { 0% { opacity:0.5; transform:scaleY(1) } 50% { opacity:0.2; transform:scaleY(1.3) } 100% { opacity:0.5; transform:scaleY(1) } }
  @keyframes hiw-cursor-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
  @keyframes hiw-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-4px) } }
`;

/* Step illustration SVGs - animated lineart matching site palette */
const stepIllustrations: ReactNode[] = [
  // 01 - Kennismaking & Analyse: refined speech bubbles with typing dots + magnifying glass
  <svg key="ill-01" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{stepAnimationStyles}</style>
    {/* Left bubble - larger, primary */}
    <rect x="20" y="45" width="90" height="60" rx="8" stroke="var(--cornsilk)" strokeWidth="1.5" />
    <path d="M50 105l-8 16 20-16" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Typing dots in left bubble */}
    <circle cx="48" cy="75" r="3.5" fill="var(--dry-sage)" style={{ animation: 'hiw-typing-dot 1.4s ease-in-out infinite' }} />
    <circle cx="65" cy="75" r="3.5" fill="var(--dry-sage)" style={{ animation: 'hiw-typing-dot 1.4s ease-in-out 0.2s infinite' }} />
    <circle cx="82" cy="75" r="3.5" fill="var(--dry-sage)" style={{ animation: 'hiw-typing-dot 1.4s ease-in-out 0.4s infinite' }} />
    {/* Right bubble - smaller, reply */}
    <rect x="95" y="80" width="76" height="48" rx="8" stroke="var(--dry-sage)" strokeWidth="1.2" opacity="0.6" />
    <path d="M145 128l12 12-6-12" stroke="var(--dry-sage)" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
    {/* Text lines in right bubble */}
    <line x1="107" y1="97" x2="155" y2="97" stroke="var(--dry-sage)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <line x1="107" y1="109" x2="143" y2="109" stroke="var(--dry-sage)" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    {/* Magnifying glass */}
    <circle cx="52" cy="162" r="16" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.45" />
    <line x1="63" y1="173" x2="78" y2="188" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    {/* Sparkle dots around magnifier */}
    <circle cx="36" cy="148" r="1.5" fill="var(--dry-sage)" opacity="0.4" style={{ animation: 'hiw-typing-dot 2s ease-in-out 0.5s infinite' }} />
    <circle cx="70" cy="152" r="1" fill="var(--dry-sage)" opacity="0.3" style={{ animation: 'hiw-typing-dot 2s ease-in-out 1s infinite' }} />
  </svg>,

  // 02 - Prototype & Richting: wireframe + camera with flash
  <svg key="ill-02" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{stepAnimationStyles}</style>
    {/* Wireframe screen */}
    <rect x="10" y="30" width="110" height="125" rx="4" stroke="var(--cornsilk)" strokeWidth="1.5" />
    {/* Nav bar */}
    <rect x="18" y="40" width="94" height="14" rx="2" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.5" />
    {/* Hero block */}
    <rect x="18" y="62" width="94" height="28" rx="2" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.4" pathLength="1" style={{ strokeDasharray: 1, animation: 'hiw-draw 2s ease forwards' }} />
    {/* Two column blocks */}
    <rect x="18" y="98" width="44" height="20" rx="2" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.35" pathLength="1" style={{ strokeDasharray: 1, animation: 'hiw-draw 2s ease 0.3s forwards' }} />
    <rect x="68" y="98" width="44" height="20" rx="2" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.35" pathLength="1" style={{ strokeDasharray: 1, animation: 'hiw-draw 2s ease 0.5s forwards' }} />
    {/* Footer line */}
    <rect x="18" y="126" width="94" height="10" rx="2" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.25" pathLength="1" style={{ strokeDasharray: 1, animation: 'hiw-draw 2s ease 0.7s forwards' }} />
    {/* Pencil */}
    <g transform="translate(108, 120) rotate(-45)" opacity="0.55">
      <rect x="0" y="0" width="7" height="42" rx="1.5" stroke="var(--cornsilk)" strokeWidth="1.2" />
      <path d="M0 42l3.5 8 3.5-8" stroke="var(--cornsilk)" strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="0" y1="6" x2="7" y2="6" stroke="var(--cornsilk)" strokeWidth="0.8" opacity="0.5" />
    </g>
    {/* Camera body - 3D perspective */}
    <g>
      {/* Shadow/depth layer */}
      <rect x="143" y="73" width="64" height="48" rx="6" fill="var(--ebony)" opacity="0.3" />
      {/* Side face (3D depth) */}
      <path d="M204 76l6-4v44l-6 4" fill="var(--ebony)" stroke="var(--cornsilk)" strokeWidth="0.5" opacity="0.15" />
      {/* Top face (3D depth) */}
      <path d="M140 70l6-4h64l-6 4" fill="var(--ebony)" stroke="var(--cornsilk)" strokeWidth="0.5" opacity="0.12" />
      {/* Main body */}
      <rect x="140" y="70" width="64" height="48" rx="6" stroke="var(--cornsilk)" strokeWidth="1.5" fill="var(--ink-black)" fillOpacity="0.5" />
      {/* Top bump with depth */}
      <path d="M156 70v-8h20v8" stroke="var(--cornsilk)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M176 62l4-3v8l-4 3" fill="var(--ebony)" stroke="var(--cornsilk)" strokeWidth="0.4" opacity="0.15" />
      {/* Lens outer ring */}
      <circle cx="172" cy="94" r="15" stroke="var(--cornsilk)" strokeWidth="1.5" />
      {/* Lens glass with gradient feel */}
      <circle cx="172" cy="94" r="10" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.6" />
      <circle cx="172" cy="94" r="5" fill="var(--ebony)" opacity="0.4" />
      {/* Lens reflection */}
      <circle cx="169" cy="91" r="2.5" fill="var(--cornsilk)" opacity="0.15" />
      {/* Flash unit */}
      <rect x="148" y="78" width="8" height="6" rx="1.5" stroke="var(--dry-sage)" strokeWidth="0.8" opacity="0.5" />
      {/* Grip texture lines */}
      <line x1="142" y1="80" x2="142" y2="110" stroke="var(--dry-sage)" strokeWidth="0.5" opacity="0.2" />
      <line x1="144" y1="80" x2="144" y2="110" stroke="var(--dry-sage)" strokeWidth="0.5" opacity="0.15" />
    </g>
    {/* Flash - radial burst from flash unit */}
    <g style={{ animation: 'hiw-flash 3.5s ease-out 1s infinite' }}>
      <ellipse cx="152" cy="81" rx="40" ry="36" fill="var(--cornsilk)" opacity="0.85" />
      <ellipse cx="152" cy="81" rx="24" ry="20" fill="var(--cornsilk)" opacity="0.5" />
    </g>
    {/* Photo output */}
    <rect x="148" y="130" width="48" height="38" rx="2" stroke="var(--dry-sage)" strokeWidth="1" opacity="0.4" style={{ animation: 'hiw-float 3s ease-in-out 2s infinite' }} />
    <path d="M154 156l10-10 8 6 8-10 12 14" stroke="var(--dry-sage)" strokeWidth="0.8" strokeLinejoin="round" opacity="0.3" />
  </svg>,

  // 03 - Bouw & Voortgang: browser window building itself block by block
  <svg key="ill-03" viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{stepAnimationStyles}{`
      @keyframes hiw-block-in { 0% { opacity:0; transform:translateY(6px) } 100% { opacity:1; transform:translateY(0) } }
    `}</style>
    {/* Browser chrome */}
    <rect x="10" y="10" width="180" height="150" rx="6" stroke="var(--cornsilk)" strokeWidth="1.5" />
    <line x1="10" y1="32" x2="190" y2="32" stroke="var(--ebony)" strokeWidth="1" opacity="0.5" />
    <circle cx="24" cy="21" r="3" stroke="var(--grey-olive)" strokeWidth="1" opacity="0.5" />
    <circle cx="36" cy="21" r="3" stroke="var(--grey-olive)" strokeWidth="1" opacity="0.5" />
    <circle cx="48" cy="21" r="3" stroke="var(--grey-olive)" strokeWidth="1" opacity="0.5" />
    {/* URL bar */}
    <rect x="60" y="16" width="80" height="10" rx="3" stroke="var(--ebony)" strokeWidth="0.8" opacity="0.3" />
    {/* Nav block */}
    <rect x="20" y="40" width="160" height="12" rx="2" fill="var(--dry-sage)" opacity="0.15" style={{ animation: 'hiw-block-in 0.6s ease both' }} />
    {/* Hero block */}
    <rect x="20" y="58" width="160" height="36" rx="2" fill="var(--dry-sage)" opacity="0.12" style={{ animation: 'hiw-block-in 0.6s ease 0.4s both' }} />
    {/* Hero text lines inside */}
    <line x1="32" y1="70" x2="100" y2="70" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" style={{ animation: 'hiw-block-in 0.5s ease 0.7s both' }} />
    <line x1="32" y1="80" x2="76" y2="80" stroke="var(--dry-sage)" strokeWidth="1" strokeLinecap="round" opacity="0.15" style={{ animation: 'hiw-block-in 0.5s ease 0.9s both' }} />
    {/* Two column cards */}
    <rect x="20" y="100" width="75" height="28" rx="2" fill="var(--dry-sage)" opacity="0.1" style={{ animation: 'hiw-block-in 0.6s ease 1.2s both' }} />
    <rect x="105" y="100" width="75" height="28" rx="2" fill="var(--dry-sage)" opacity="0.1" style={{ animation: 'hiw-block-in 0.6s ease 1.5s both' }} />
    {/* Footer */}
    <rect x="20" y="134" width="160" height="16" rx="2" fill="var(--dry-sage)" opacity="0.08" style={{ animation: 'hiw-block-in 0.6s ease 1.8s both' }} />
    {/* Loading cursor */}
    <circle cx="170" cy="146" r="3" stroke="var(--cornsilk)" strokeWidth="1" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.2s" repeatCount="indefinite" />
    </circle>
  </svg>,

  // 04 - Oplevering & Livegang: rocket with animated exhaust + pulsing checkmark
  <svg key="ill-04" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{stepAnimationStyles}</style>
    {/* Rocket body */}
    <path d="M100 24c-14 22-20 54-20 86h40c0-32-6-64-20-86z" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Nose highlight */}
    <path d="M100 32c-6 12-10 28-13 48" stroke="var(--dry-sage)" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    {/* Rocket fins */}
    <path d="M80 100l-18 26h18" stroke="var(--dry-sage)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
    <path d="M120 100l18 26h-18" stroke="var(--dry-sage)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
    {/* Window */}
    <circle cx="100" cy="70" r="9" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.6" />
    <circle cx="100" cy="70" r="5" stroke="var(--dry-sage)" strokeWidth="0.8" opacity="0.3" />
    {/* Animated exhaust flames - stronger, wider */}
    <g style={{ transformOrigin: '100px 126px' }}>
      {/* Outer flame */}
      <path d="M86 126c-8 18-4 32 14 44 18-12 22-26 14-44" stroke="var(--dry-sage)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="d" values="M86 126c-8 18-4 32 14 44 18-12 22-26 14-44;M88 126c-10 22-4 36 12 48 16-12 20-28 12-48;M86 126c-8 18-4 32 14 44 18-12 22-26 14-44" dur="1s" repeatCount="indefinite" />
      </path>
      {/* Middle flame */}
      <path d="M90 126c-5 14-3 26 10 36 13-10 15-22 10-36" stroke="var(--cornsilk)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M90 126c-5 14-3 26 10 36 13-10 15-22 10-36;M92 126c-7 18-2 30 8 40 12-10 14-24 8-40;M90 126c-5 14-3 26 10 36 13-10 15-22 10-36" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Inner flame */}
      <path d="M94 126c-3 10-1 18 6 24 7-6 9-14 6-24" stroke="var(--cornsilk)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7">
        <animate attributeName="d" values="M94 126c-3 10-1 18 6 24 7-6 9-14 6-24;M95 126c-4 12-1 20 5 28 6-8 8-16 5-28;M94 126c-3 10-1 18 6 24 7-6 9-14 6-24" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Glow */}
      <ellipse cx="100" cy="136" rx="12" ry="6" fill="var(--cornsilk)" opacity="0.08">
        <animate attributeName="ry" values="6;10;6" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.15;0.08" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
    </g>
    {/* Smoke clouds drifting down and outward */}
    <ellipse cx="92" cy="170" rx="8" ry="5" fill="var(--grey-olive)" opacity="0.25">
      <animate attributeName="cy" values="170;192" dur="2s" repeatCount="indefinite" />
      <animate attributeName="cx" values="92;80" dur="2s" repeatCount="indefinite" />
      <animate attributeName="rx" values="8;14" dur="2s" repeatCount="indefinite" />
      <animate attributeName="ry" values="5;8" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.25;0" dur="2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="108" cy="172" rx="7" ry="4" fill="var(--grey-olive)" opacity="0.2">
      <animate attributeName="cy" values="172;196" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="cx" values="108;122" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="rx" values="7;13" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="ry" values="4;7" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.2;0" dur="2.2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="100" cy="174" rx="10" ry="6" fill="var(--grey-olive)" opacity="0.18">
      <animate attributeName="cy" values="174;200" dur="2.6s" repeatCount="indefinite" />
      <animate attributeName="rx" values="10;18" dur="2.6s" repeatCount="indefinite" />
      <animate attributeName="ry" values="6;10" dur="2.6s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.18;0" dur="2.6s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="96" cy="168" rx="6" ry="4" fill="var(--dry-sage)" opacity="0.15">
      <animate attributeName="cy" values="168;188" dur="1.8s" repeatCount="indefinite" />
      <animate attributeName="cx" values="96;86" dur="1.8s" repeatCount="indefinite" />
      <animate attributeName="rx" values="6;11" dur="1.8s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.15;0" dur="1.8s" repeatCount="indefinite" />
    </ellipse>
    {/* Checkmark circle with pulse */}
    <circle cx="158" cy="164" r="20" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.5">
      <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.3;0.5" dur="2s" repeatCount="indefinite" />
    </circle>
    <path d="M148 164l7 7 14-14" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>,
];

const steps = [
  {
    number: '01',
    title: 'Kennismaking & Analyse',
    description:
      'Elk project begint met een goed gesprek. Ik breng je huidige situatie in kaart, stel de juiste vragen en luister naar wat je wilt bereiken. Samen kijken we naar je doelgroep, wat er al staat en waar de kansen liggen. Ook bespreken we of professionele fotografie een rol speelt in jouw project. Op basis daarvan ontvang je een helder voorstel met aanpak, planning en kosten. Pas als het plan voor jou klopt, gaan we van start.',
  },
  {
    number: '02',
    title: 'Prototype & Richting',
    description:
      'Voordat ik ga bouwen, werk ik eerst een prototype, schets of implementatieplan uit. Wat dat precies is hangt af van het project: wireframes bij webdesign, een technisch plan bij development, een processchets bij automatiseringen. Inclusief fotoshoot? Dan wordt die parallel gepland zodat de beelden klaar zijn wanneer het ontwerp ze nodig heeft. Je ziet vroeg welke kant het opgaat en kunt bijsturen voordat er tijd verloren gaat.',
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
            {steps.map((step, index) => (
              <div key={step.number} className="relative border border-ebony/60 p-6 overflow-hidden">
                <span
                  className="block text-[3rem] font-bold leading-none select-none mb-4"
                  style={{ color: 'rgba(139,129,116,0.07)' }}
                  aria-hidden
                >
                  {step.number}
                </span>

                <div className="absolute right-4 top-4 w-20 opacity-[0.25] pointer-events-none" aria-hidden>
                  {stepIllustrations[index]}
                </div>

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

              {/* Step illustration */}
              <div className="absolute right-[12%] top-1/2 -translate-y-1/2 w-[clamp(140px,14vw,200px)] opacity-[0.35] pointer-events-none z-0" aria-hidden>
                {stepIllustrations[index]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
