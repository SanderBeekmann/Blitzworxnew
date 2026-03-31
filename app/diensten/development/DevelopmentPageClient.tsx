'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

import { Button } from '@/components/ui/Button';
import { MaintenanceSection } from '@/components/sections/MaintenanceSection';
import { TypingTerminal } from '@/components/animations/TypingTerminal';

interface ScrollTriggerRef {
  kill: () => void;
}

const capabilities = [
  {
    label: 'Websites',
    title: 'Websites op maat',
    description:
      'Geen templates, maar een oplossing die precies past bij jouw wensen en doelgroep. Snelle, schaalbare websites gebouwd met moderne technieken.',
    tags: ['Next.js', 'React', 'Tailwind CSS'],
  },
  {
    label: 'Dashboards',
    title: 'Dashboards & CRM',
    description:
      'Overzichtelijke systemen voor je bedrijfsvoering, afgestemd op jouw werkwijze. Realtime data, slimme filters en een intuïtieve interface.',
    tags: ['Supabase', 'TypeScript', 'REST API'],
  },
  {
    label: 'Backends',
    title: 'Backends & API\'s',
    description:
      'Technische basis die processen vereenvoudigt en integreert met bestaande systemen. Betrouwbaar, schaalbaar en goed gedocumenteerd.',
    tags: ['Node.js', 'PostgreSQL', 'Webhooks'],
  },
  {
    label: 'Onderhoud',
    title: 'Onderhoud & groei',
    description:
      'Na oplevering blijf ik meegroeien met je onderneming. Updates, optimalisaties en nieuwe features wanneer je ze nodig hebt.',
    tags: ['Monitoring', 'CI/CD', 'Netlify'],
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Analyse & Architectuur',
    description:
      'Ik breng je wensen, gebruikers en technische vereisten in kaart. Op basis hiervan ontwerp ik de architectuur: welke systemen, welke data, welke integraties.',
  },
  {
    number: '02',
    title: 'Prototype & Fundament',
    description:
      'Ik bouw een werkend prototype dat je direct kunt testen. Het fundament staat: database, authenticatie, kernfunctionaliteit. Vroeg testen, snel bijsturen.',
  },
  {
    number: '03',
    title: 'Iteratief bouwen',
    description:
      'Feature voor feature wordt het product compleet. Je ziet elke week voortgang en kunt direct feedback geven. Per project zijn 3 revisierondes inbegrepen. Geen verrassingen bij oplevering.',
  },
  {
    number: '04',
    title: 'Launch & Optimalisatie',
    description:
      'Ik lanceer met vertrouwen: getest, geoptimaliseerd en klaar voor de echte wereld. Daarna monitor ik performance en bouw ik door waar nodig.',
  },
];

const principles = [
  {
    title: 'Code die je kunt lezen',
    description:
      'Schone, gedocumenteerde code die ook door andere developers begrepen wordt. Geen vendor lock-in, geen black boxes.',
  },
  {
    title: 'Performance als prioriteit',
    description:
      'Elke milliseconde telt. Ik optimaliseer voor snelheid: server-side rendering, lazy loading, efficiënte queries en slim caching.',
  },
  {
    title: 'Schaalbaar vanaf dag één',
    description:
      'Of je nu 10 of 10.000 gebruikers hebt: de architectuur groeit mee. Geen herbouw nodig als je bedrijf groeit.',
  },
];

const techStack = [
  { category: 'Frontend', tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend', tools: ['Node.js', 'Supabase', 'PostgreSQL', 'REST/GraphQL'] },
  { category: 'Infrastructure', tools: ['Netlify', 'Vercel', 'GitHub Actions', 'Docker'] },
  { category: 'Tooling', tools: ['Figma → Code', 'ESLint', 'Prettier', 'Vitest'] },
];

// TypingTerminal is imported from shared component

// Falling binary columns with glitchy switching
function BinaryRain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cleanups: (() => void)[] = [];
    const colCount = 12;
    const fontSize = 13;
    const lineHeight = 20;
    const containerHeight = window.innerHeight;
    const digitsPerCol = Math.ceil(containerHeight / lineHeight) + 4;

    for (let col = 0; col < colCount; col++) {
      const colEl = document.createElement('div');
      const leftPos = (col / colCount) * 100 + Math.random() * (100 / colCount / 2);
      const speed = 18 + Math.random() * 14; // seconds per full cycle
      const delay = Math.random() * -speed; // stagger start
      const baseOpacity = 0.06 + Math.random() * 0.08;

      colEl.style.cssText = `
        position: absolute;
        top: -${digitsPerCol * lineHeight}px;
        left: ${leftPos}%;
        font-family: monospace;
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        color: rgba(139, 129, 116, ${baseOpacity});
        pointer-events: none;
        user-select: none;
        animation: binaryFall ${speed}s linear ${delay}s infinite;
        white-space: pre;
      `;

      // Create column of digits
      const spans: HTMLSpanElement[] = [];
      for (let d = 0; d < digitsPerCol; d++) {
        const span = document.createElement('span');
        span.textContent = Math.random() > 0.5 ? '1' : '0';
        span.style.display = 'block';
        colEl.appendChild(span);
        spans.push(span);
      }

      container.appendChild(colEl);

      // Glitchy switching per digit
      const interval = setInterval(() => {
        const idx = Math.floor(Math.random() * spans.length);
        const span = spans[idx];
        if (Math.random() < 0.4) {
          span.textContent = span.textContent === '1' ? '0' : '1';
          span.style.color = `rgba(202, 202, 170, ${0.25 + Math.random() * 0.15})`;
          setTimeout(() => { span.style.color = 'inherit'; }, 100);
        }
      }, 200 + Math.random() * 300);

      cleanups.push(() => {
        clearInterval(interval);
        colEl.remove();
      });
    }

    // Inject keyframes if not already present
    if (!document.getElementById('binary-fall-style')) {
      const style = document.createElement('style');
      style.id = 'binary-fall-style';
      style.textContent = `
        @keyframes binaryFall {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(100vh + ${digitsPerCol * lineHeight}px)); }
        }
      `;
      document.head.appendChild(style);
      cleanups.push(() => style.remove());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden
    />
  );
}

export function DevelopmentPageClient() {
  const processRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLElement>(null);

  // Scroll-driven progress bar for process section
  useEffect(() => {
    const section = processRef.current;
    const bar = progressBarRef.current;
    if (!section || !bar) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      bar.style.width = '100%';
      return;
    }

    let cleanup: (() => void) | null = null;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 0.8,
            },
          }
        );

        cleanup = () => tl.scrollTrigger?.kill();
      }
    );

    return () => cleanup?.();
  }, []);

  // Capability cards stagger reveal
  useEffect(() => {
    const section = capabilitiesRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const triggers: Array<ScrollTriggerRef> = [];

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const cards = section.querySelectorAll<HTMLElement>('.capability-card');
        cards.forEach((card, i) => {
          gsap.set(card, { opacity: 0, y: 40, scale: 0.97 });
          const tl = gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });
          if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
        });
      }
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <main className="relative">
      {/* Binary rain over entire page */}
      <BinaryRain />

      {/* ── Hero ── */}
      <section className="section relative min-h-screen flex flex-col justify-center overflow-hidden">

        <div className="container-narrow relative z-10">
          <FadeIn>
            <Link
              href="/diensten"
              className="text-small text-grey-olive hover:text-dry-sage transition-colors"
            >
              ← Terug naar diensten
            </Link>
          </FadeIn>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <FadeIn delay={0.1}>
                <span className="inline-block px-3 py-1 text-caption font-mono text-dry-sage border border-ebony mb-6 tracking-wider">
                  {'<development />'}
                </span>
              </FadeIn>
              <TitleReveal
                as="h1"
                className="text-hero md:text-hero-lg font-bold text-cornsilk"
                triggerOnMount
              >
                Code die werkt voor jou
              </TitleReveal>
              <FadeIn delay={0.3}>
                <p className="mt-6 text-body text-dry-sage max-w-prose leading-relaxed">
                  Van ontwerp naar werkende website of applicatie. Op maat gemaakte oplossingen:
                  van eenvoudige websites tot dashboards, CRM-systemen en backends die
                  meegroeien met je bedrijf.
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

            {/* Terminal with typing animation */}
            <FadeIn delay={0.4}>
              <TypingTerminal />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section
        ref={capabilitiesRef}
        className="section relative overflow-hidden bg-ink"
        aria-labelledby="capabilities-title"
      >
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="capabilities-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Wat kan ik bouwen?
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
              Van website tot volledig platform: ik bouw wat jouw bedrijf nodig heeft.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {capabilities.map((cap) => (
              <article
                key={cap.label}
                className="capability-card group relative h-full p-6 md:p-8 bg-ink border border-ebony flex flex-col overflow-hidden transition-all duration-500 hover:border-grey-olive hover:shadow-[0_0_24px_rgba(254,250,220,0.12),0_0_48px_rgba(254,250,220,0.06)]"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                  }}
                  aria-hidden
                />
                <span className="text-caption font-mono text-grey-olive tracking-wider uppercase mb-3">
                  {cap.label}
                </span>
                <h3 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors">
                  {cap.title}
                </h3>
                <p className="mt-3 text-body text-dry-sage leading-relaxed flex-1">
                  {cap.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-caption font-mono text-grey-olive border border-ebony group-hover:border-grey-olive/60 group-hover:text-dry-sage transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section
        ref={processRef}
        className="section relative"
        aria-labelledby="process-title"
      >
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="process-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Mijn aanpak
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-6">
              Vier fasen van idee tot live product.
            </p>
          </FadeIn>

          {/* Horizontal progress bar */}
          <div className="relative h-px bg-ebony mb-16 overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 bg-cornsilk"
              style={{ width: '0%' }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.12}>
                <div className="relative">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-hero font-bold text-ebony/60 font-mono leading-none">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-h3 font-semibold text-cornsilk mb-3">
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
      </section>

      {/* ── Principles ── */}
      <section className="section relative overflow-hidden" aria-labelledby="principles-title">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <TitleReveal
                as="h2"
                id="principles-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Hoe ik bouw
              </TitleReveal>
              <FadeIn delay={0.1}>
                <p className="text-body text-dry-sage leading-relaxed max-w-prose">
                  Ik bouw met moderne technieken en houd de code schoon en onderhoudbaar.
                  Alles wat ik maak is afgestemd op jouw manier van werken: geen overbodige
                  complexiteit, maar slimme functies die tijd besparen.
                </p>
              </FadeIn>
            </div>
            <div className="space-y-8">
              {principles.map((principle, index) => (
                <FadeIn key={principle.title} delay={index * 0.15}>
                  <div className="border-l-2 border-dry-sage pl-6">
                    <h3 className="text-h3 font-semibold text-cornsilk">{principle.title}</h3>
                    <p className="mt-2 text-body text-dry-sage leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="section relative overflow-hidden" aria-labelledby="tech-title">
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="tech-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Mijn tech stack
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-12">
              Bewezen technologieën voor betrouwbare, snelle en schaalbare oplossingen.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((group, groupIndex) => (
              <FadeIn key={group.category} delay={groupIndex * 0.1}>
                <div className="relative p-6 bg-ink border border-ebony h-full overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                    }}
                    aria-hidden
                  />
                  <h3 className="text-small font-semibold text-grey-olive uppercase tracking-widest mb-4">
                    {group.category}
                  </h3>
                  <ul className="space-y-2">
                    {group.tools.map((tool) => (
                      <li key={tool} className="flex items-center gap-2 text-body text-dry-sage">
                        <span className="w-1 h-1 bg-dry-sage flex-shrink-0" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <MaintenanceSection title="Jouw project blijft in topvorm" />

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
            Klaar om te bouwen?
          </TitleReveal>
          <FadeIn delay={0.2}>
            <p className="text-body text-dry-sage max-w-prose mx-auto">
              Van eerste idee tot werkend product. Laten we samen ontdekken wat
              er mogelijk is. Geen verplichtingen, gewoon een goed gesprek over jouw project.
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
