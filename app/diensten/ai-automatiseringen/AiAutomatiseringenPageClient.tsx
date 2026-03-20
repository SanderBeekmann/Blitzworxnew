'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { SectionBottomBars } from '@/components/animations/SectionBottomBars';
import { Button } from '@/components/ui/Button';
import { MaintenanceSection } from '@/components/sections/MaintenanceSection';

const capabilities = [
  {
    label: 'Workflows',
    title: 'Slimme workflows',
    description:
      'Automatiseer repetitieve taken zoals data-invoer, e-mailafhandeling en rapportages. AI analyseert, sorteert en verwerkt zodat jij je kunt focussen op wat ertoe doet.',
    tags: ['n8n', 'Make', 'Zapier'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12h4l3-9 4 18 3-9h4" />
      </svg>
    ),
  },
  {
    label: 'Chatbots',
    title: 'AI chatbots & assistenten',
    description:
      'Intelligente chatbots die klantvragen beantwoorden, leads kwalificeren en 24/7 beschikbaar zijn. Getraind op jouw bedrijfsdata voor relevante antwoorden.',
    tags: ['OpenAI', 'RAG', 'Custom LLM'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
  },
  {
    label: 'Integraties',
    title: 'Systeem-integraties',
    description:
      'Koppel je bestaande tools aan AI. Van CRM tot boekhouding: laat systemen met elkaar praten en data automatisch synchroniseren.',
    tags: ['API', 'Webhooks', 'Supabase'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M8.6 8.6L15.4 15.4" />
        <path d="M18 6a3 3 0 00-3 3v6a3 3 0 003 3" />
        <path d="M6 18a3 3 0 003-3V9a3 3 0 00-3-3" />
      </svg>
    ),
  },
  {
    label: 'Content',
    title: 'Content & data-analyse',
    description:
      'Genereer content op basis van je huisstijl, analyseer klantdata voor inzichten of automatiseer je social media planning met AI-gestuurde pipelines.',
    tags: ['GPT', 'Claude', 'Automation'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3v18M3 12h18" />
        <path d="M8 8l8 8M16 8l-8 8" />
      </svg>
    ),
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Inventarisatie',
    description:
      'Ik breng je huidige processen in kaart en identificeer waar AI het meeste impact heeft. Welke taken kosten de meeste tijd? Waar zitten de bottlenecks?',
  },
  {
    number: '02',
    title: 'Ontwerp & prototype',
    description:
      'Ik ontwerp de automatisering en bouw een werkend prototype dat je direct kunt testen. Snel zichtbaar resultaat, zonder maanden wachten.',
  },
  {
    number: '03',
    title: 'Implementatie',
    description:
      'De automatisering wordt geintegreerd in je bestaande workflow. Alles wordt gekoppeld, getest en gedocumenteerd zodat je team ermee kan werken.',
  },
  {
    number: '04',
    title: 'Optimalisatie',
    description:
      'Na livegang monitor ik de resultaten en optimaliseer waar nodig. AI wordt slimmer naarmate er meer data beschikbaar is.',
  },
];

const useCases = [
  {
    title: 'Automatische lead-opvolging',
    description:
      'Nieuwe leads krijgen direct een gepersonaliseerd bericht, worden gescoord en toegewezen aan de juiste medewerker.',
  },
  {
    title: 'Slimme klantenservice',
    description:
      'Een AI-assistent beantwoordt veelgestelde vragen, escaleert complexe cases en leert van elke interactie.',
  },
  {
    title: 'Rapportage op autopilot',
    description:
      'Dagelijkse, wekelijkse of maandelijkse rapportages automatisch gegenereerd uit je bestaande data en tools.',
  },
];

// ── Node flow diagram: animated SVG showing data flowing between nodes ──
function NodeFlowDiagram() {
  return (
    <div className="relative w-full max-w-lg mx-auto md:mx-0 md:ml-auto" aria-hidden>
      <svg viewBox="0 0 400 320" fill="none" className="w-full h-auto">
        {/* Connection lines */}
        <path d="M80 80 L200 160" stroke="rgba(202,202,170,0.15)" strokeWidth="1" />
        <path d="M320 80 L200 160" stroke="rgba(202,202,170,0.15)" strokeWidth="1" />
        <path d="M200 160 L120 260" stroke="rgba(202,202,170,0.15)" strokeWidth="1" />
        <path d="M200 160 L280 260" stroke="rgba(202,202,170,0.15)" strokeWidth="1" />

        {/* Animated data pulses along paths */}
        <circle r="3" fill="rgba(202,202,170,0.6)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M80 80 L200 160" />
        </circle>
        <circle r="3" fill="rgba(202,202,170,0.6)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M320 80 L200 160" />
        </circle>
        <circle r="3" fill="rgba(202,202,170,0.4)">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M200 160 L120 260" />
        </circle>
        <circle r="3" fill="rgba(202,202,170,0.4)">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M200 160 L280 260" />
        </circle>

        {/* Input nodes */}
        <g>
          <rect x="52" y="56" width="56" height="48" rx="4" fill="rgba(84,92,82,0.15)" stroke="rgba(84,92,82,0.4)" strokeWidth="1" />
          <text x="80" y="76" textAnchor="middle" fill="rgba(202,202,170,0.7)" fontSize="8" fontFamily="monospace">CRM</text>
          <text x="80" y="90" textAnchor="middle" fill="rgba(139,129,116,0.5)" fontSize="7" fontFamily="monospace">input</text>
        </g>
        <g>
          <rect x="292" y="56" width="56" height="48" rx="4" fill="rgba(84,92,82,0.15)" stroke="rgba(84,92,82,0.4)" strokeWidth="1" />
          <text x="320" y="76" textAnchor="middle" fill="rgba(202,202,170,0.7)" fontSize="8" fontFamily="monospace">Email</text>
          <text x="320" y="90" textAnchor="middle" fill="rgba(139,129,116,0.5)" fontSize="7" fontFamily="monospace">input</text>
        </g>

        {/* AI processing node - center, larger, with pulse */}
        <circle cx="200" cy="160" r="32" fill="rgba(84,92,82,0.1)" stroke="rgba(202,202,170,0.3)" strokeWidth="1">
          <animate attributeName="r" values="32;35;32" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="160" r="32" fill="none" stroke="rgba(202,202,170,0.08)" strokeWidth="1">
          <animate attributeName="r" values="32;48;32" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="200" y="157" textAnchor="middle" fill="rgba(254,250,220,0.9)" fontSize="9" fontFamily="monospace" fontWeight="600">AI</text>
        <text x="200" y="170" textAnchor="middle" fill="rgba(139,129,116,0.6)" fontSize="7" fontFamily="monospace">processing</text>

        {/* Output nodes */}
        <g>
          <rect x="92" y="236" width="56" height="48" rx="4" fill="rgba(84,92,82,0.15)" stroke="rgba(202,202,170,0.25)" strokeWidth="1" />
          <text x="120" y="256" textAnchor="middle" fill="rgba(202,202,170,0.7)" fontSize="8" fontFamily="monospace">Actie</text>
          <text x="120" y="270" textAnchor="middle" fill="rgba(139,129,116,0.5)" fontSize="7" fontFamily="monospace">output</text>
        </g>
        <g>
          <rect x="252" y="236" width="56" height="48" rx="4" fill="rgba(84,92,82,0.15)" stroke="rgba(202,202,170,0.25)" strokeWidth="1" />
          <text x="280" y="256" textAnchor="middle" fill="rgba(202,202,170,0.7)" fontSize="8" fontFamily="monospace">Report</text>
          <text x="280" y="270" textAnchor="middle" fill="rgba(139,129,116,0.5)" fontSize="7" fontFamily="monospace">output</text>
        </g>
      </svg>
    </div>
  );
}

// ── Streaming text: simulates AI processing log ──
function StreamingLog() {
  const lines = [
    { prefix: '>', text: 'Verbinding met CRM...', delay: 0 },
    { prefix: '  ', text: '142 leads opgehaald', delay: 800 },
    { prefix: '>', text: 'AI-analyse gestart...', delay: 1600 },
    { prefix: '  ', text: 'Leads gescoord en gecategoriseerd', delay: 2800 },
    { prefix: '>', text: 'Acties uitgevoerd:', delay: 3800 },
    { prefix: '  ', text: '23 follow-ups gepland', delay: 4600 },
    { prefix: '  ', text: '8 high-priority leads gemarkeerd', delay: 5200 },
    { prefix: '  ', text: '3 rapportages gegenereerd', delay: 5800 },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCount(lines.length);
      return;
    }

    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleCount(i + 1), line.delay + 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative bg-[#0a0d12] border border-ebony/60 overflow-hidden font-mono text-[13px] leading-relaxed">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-ebony/40 bg-[#0d1016]">
        <span className="w-2 h-2 rounded-full bg-grey-olive/40" />
        <span className="w-2 h-2 rounded-full bg-grey-olive/40" />
        <span className="w-2 h-2 rounded-full bg-grey-olive/40" />
        <span className="ml-3 text-[11px] text-grey-olive/50 tracking-wider">workflow.log</span>
      </div>
      <div className="p-5 space-y-1.5 min-h-[220px]">
        {lines.slice(0, visibleCount).map((line, i) => (
          <p key={i} className={line.prefix === '>' ? 'text-dry-sage' : 'text-grey-olive/70'}>
            <span className="text-grey-olive/40 select-none">{line.prefix} </span>
            {line.text}
          </p>
        ))}
        {visibleCount < lines.length && (
          <p className="text-dry-sage">
            <span className="text-grey-olive/40 select-none">{'> '}</span>
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-dry-sage/60 animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-dry-sage/60 animate-pulse" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-dry-sage/60 animate-pulse" style={{ animationDelay: '400ms' }} />
            </span>
          </p>
        )}
        {visibleCount >= lines.length && (
          <p className="mt-3 text-cornsilk/80">
            <span className="text-dry-sage select-none">{'>'} </span>
            Workflow compleet
            <span className="ml-1 animate-pulse">_</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Dot grid background for hero ──
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(202,202,170,1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
      aria-hidden
    />
  );
}

export function AiAutomatiseringenPageClient() {
  const processRef = useRef<HTMLElement>(null);

  // Animate process connector line on scroll
  useEffect(() => {
    const section = processRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cleanup: (() => void) | null = null;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const line = section.querySelector('.process-line-fill');
        if (!line) return;

        const tl = gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'bottom 50%',
              scrub: 0.8,
            },
          }
        );
        cleanup = () => tl.scrollTrigger?.kill();
      }
    );

    return () => cleanup?.();
  }, []);

  return (
    <main className="relative">
      {/* ── Hero ── */}
      <section className="section relative min-h-screen flex flex-col justify-center overflow-hidden">
        <DotGrid />

        {/* Ambient glow */}
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(202,202,170,0.04) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          aria-hidden
        />

        <div className="container-narrow relative z-10">
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
                <span className="inline-flex items-center gap-2 px-3 py-1 text-caption font-mono text-dry-sage border border-ebony mb-6 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-dry-sage/60 animate-pulse" />
                  AI Automatiseringen
                </span>
              </FadeIn>
              <TitleReveal
                as="h1"
                className="text-hero md:text-hero-lg font-bold text-cornsilk"
                triggerOnMount
              >
                Laat AI het werk doen
              </TitleReveal>
              <FadeIn delay={0.3}>
                <p className="mt-6 text-body text-dry-sage max-w-prose leading-relaxed">
                  Bespaar tijd, verlaag kosten en schaal sneller met slimme AI-automatiseringen.
                  Ik bouw workflows die repetitieve taken overnemen zodat jij je kunt focussen
                  op groei.
                </p>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/contact" variant="primary">
                    Plan een gesprek
                  </Button>
                  <Button href="/cases" variant="outline">
                    Bekijk mijn werk
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* Node flow diagram */}
            <FadeIn delay={0.4}>
              <NodeFlowDiagram />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Live demo: streaming log ── */}
      <section className="section relative overflow-hidden border-t border-ebony">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <TitleReveal
                as="h2"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Zo werkt het
              </TitleReveal>
              <FadeIn delay={0.1}>
                <p className="text-body text-dry-sage leading-relaxed max-w-prose">
                  Een AI-workflow draait op de achtergrond. Data wordt opgehaald, geanalyseerd
                  en omgezet in acties - automatisch, 24/7, zonder tussenkomst.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <StreamingLog />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section
        className="section relative overflow-hidden bg-ink"
        aria-labelledby="ai-capabilities-title"
      >
        <DotGrid />
        <div className="container-narrow relative z-10">
          <TitleReveal
            as="h2"
            id="ai-capabilities-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Wat kan ik automatiseren?
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
              Van simpele workflows tot complexe AI-pipelines: ik bouw wat jouw bedrijf nodig heeft.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {capabilities.map((cap) => (
              <article
                key={cap.label}
                className="group relative h-full p-6 md:p-8 bg-[#0a0d12] border border-ebony/60 flex flex-col overflow-hidden transition-all duration-500 hover:border-grey-olive/60 hover:shadow-[0_0_24px_rgba(202,202,170,0.08)]"
              >
                {/* Subtle corner accent */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(225deg, rgba(202,202,170,0.06) 0%, transparent 60%)',
                  }}
                  aria-hidden
                />

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-grey-olive/50 group-hover:text-dry-sage/70 transition-colors">
                    {cap.icon}
                  </span>
                  <span className="text-caption font-mono text-grey-olive tracking-wider uppercase">
                    {cap.label}
                  </span>
                </div>
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
                      className="px-2.5 py-1 text-caption font-mono text-grey-olive border border-ebony/60 group-hover:border-grey-olive/40 group-hover:text-dry-sage transition-colors"
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
        aria-labelledby="ai-process-title"
      >
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="ai-process-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Mijn aanpak
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-6">
              Van inventarisatie tot werkende automatisering in weken, niet maanden.
            </p>
          </FadeIn>

          {/* Animated progress line */}
          <div className="relative h-px bg-ebony/40 mb-16 overflow-hidden">
            <div
              className="process-line-fill absolute inset-y-0 left-0 w-full bg-dry-sage/60 origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.12}>
                <div className="relative">
                  {/* Step number with subtle node indicator */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-ebony/60 text-[13px] font-mono text-grey-olive">
                      {step.number}
                    </span>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block flex-1 h-px bg-ebony/30" aria-hidden />
                    )}
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

      {/* ── Use cases ── */}
      <section className="section relative overflow-hidden" aria-labelledby="ai-usecases-title">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <TitleReveal
                as="h2"
                id="ai-usecases-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
              >
                Voorbeelden
              </TitleReveal>
              <FadeIn delay={0.1}>
                <p className="text-body text-dry-sage leading-relaxed max-w-prose">
                  AI-automatiseringen zijn breed inzetbaar. Hier een paar voorbeelden van
                  wat ik voor ondernemers kan bouwen.
                </p>
              </FadeIn>
            </div>
            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <FadeIn key={useCase.title} delay={index * 0.15}>
                  <div className="border-l border-ebony/60 pl-6 hover:border-dry-sage/40 transition-colors">
                    <h3 className="text-h3 font-semibold text-cornsilk">{useCase.title}</h3>
                    <p className="mt-2 text-body text-dry-sage leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
        <SectionBottomBars />
      </section>

      {/* ── How I work: agents, pipeline, vault ── */}
      <section className="section relative overflow-hidden bg-ink" aria-labelledby="ai-stack-title">
        <DotGrid />
        <div className="container-narrow relative z-10">
          <TitleReveal
            as="h2"
            id="ai-stack-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6 text-center"
          >
            Hoe ik zelf werk met AI
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
              Ik gebruik AI niet alleen voor klanten. Mijn eigen workflow draait op een volledig
              geautomatiseerde pipeline met agents, kennisbanken en slimme koppelingen.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* AI Agents */}
            <FadeIn delay={0.1}>
              <div className="relative p-6 md:p-8 bg-[#0a0d12] border border-ebony/60 h-full overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.04) 0%, transparent 60%)',
                  }}
                  aria-hidden
                />
                <div className="flex items-center gap-3 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-olive/60" aria-hidden>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                  <span className="text-caption font-mono text-grey-olive tracking-wider uppercase">
                    AI Agents
                  </span>
                </div>
                <h3 className="text-h3 font-semibold text-cornsilk mb-3">
                  5 gespecialiseerde agents
                </h3>
                <p className="text-body text-dry-sage leading-relaxed">
                  Vijf AI-agents runnen de dagelijkse operatie: een Planner voor mijn
                  schema, een Content agent voor marketing, een Strategist voor
                  beslissingen, een Leads agent die prospects vindt en een Builder die
                  automatisch demo-websites genereert en deployt.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Planner', 'Content', 'Leads', 'Builder', 'Strategist'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-caption font-mono text-grey-olive border border-ebony/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Pipeline */}
            <FadeIn delay={0.2}>
              <div className="relative p-6 md:p-8 bg-[#0a0d12] border border-ebony/60 h-full overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(202,202,170,0.04) 0%, transparent 60%)',
                  }}
                  aria-hidden
                />
                <div className="flex items-center gap-3 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-olive/60" aria-hidden>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                    <circle cx="8" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                  <span className="text-caption font-mono text-grey-olive tracking-wider uppercase">
                    Pipeline
                  </span>
                </div>
                <h3 className="text-h3 font-semibold text-cornsilk mb-3">
                  Lead-generatie op autopilot
                </h3>
                <p className="text-body text-dry-sage leading-relaxed">
                  Planning, outreach en lead-generatie draaien volledig geautomatiseerd.
                  De pipeline scrapet potentiele klanten, analyseert hun huidige website,
                  bouwt een demo en bereidt een persoonlijke outreach voor. Zo heb ik
                  alle tijd om me te focussen op wat ertoe doet: jouw project.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Scraping', 'Auto-deploy', 'Outreach'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-caption font-mono text-grey-olive border border-ebony/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Obsidian Vault */}
            <FadeIn delay={0.3}>
              <div className="relative p-6 md:p-8 bg-[#0a0d12] border border-ebony/60 h-full overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 70% 0%, rgba(202,202,170,0.04) 0%, transparent 60%)',
                  }}
                  aria-hidden
                />
                <div className="flex items-center gap-3 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-olive/60" aria-hidden>
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    <path d="M8 7h8M8 11h6" />
                  </svg>
                  <span className="text-caption font-mono text-grey-olive tracking-wider uppercase">
                    Knowledge base
                  </span>
                </div>
                <h3 className="text-h3 font-semibold text-cornsilk mb-3">
                  Obsidian vault als brein
                </h3>
                <p className="text-body text-dry-sage leading-relaxed">
                  Alle kennis, strategieen, klantprofielen en schrijfstijlen leven in een
                  Obsidian vault. Elke agent leest en schrijft hier, leert van vorige
                  sessies en houdt zijn eigen learnings bij. Zo wordt elke output
                  consistenter en slimmer naarmate we langer samenwerken.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Obsidian', 'RAG', 'Vector search'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-caption font-mono text-grey-olive border border-ebony/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Pipeline flow visualization */}
          <FadeIn delay={0.4}>
            <div className="mt-16 flex items-center justify-center gap-3 md:gap-4 text-[11px] font-mono text-grey-olive/50 tracking-wider" aria-hidden>
              <span className="px-3 py-1.5 border border-ebony/40">Discover</span>
              <span className="text-dry-sage/30">-{'>'}</span>
              <span className="px-3 py-1.5 border border-ebony/40">Scrape</span>
              <span className="text-dry-sage/30">-{'>'}</span>
              <span className="px-3 py-1.5 border border-ebony/40">Build demo</span>
              <span className="text-dry-sage/30">-{'>'}</span>
              <span className="px-3 py-1.5 border border-ebony/40">Deploy</span>
              <span className="text-dry-sage/30">-{'>'}</span>
              <span className="px-3 py-1.5 border border-dry-sage/30 text-dry-sage/70">Outreach</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <MaintenanceSection />

      {/* ── CTA ── */}
      <section
        className="section relative min-h-[60vh] flex flex-col justify-center items-center text-center border-t border-ebony"
        aria-labelledby="ai-cta-title"
      >
        <DotGrid />
        <div className="container-narrow relative z-10 flex flex-col items-center gap-8">
          <TitleReveal
            as="h2"
            id="ai-cta-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk"
          >
            Klaar om te automatiseren?
          </TitleReveal>
          <FadeIn delay={0.2}>
            <p className="text-body text-dry-sage max-w-prose mx-auto">
              Laten we samen ontdekken welke processen je kunt automatiseren.
              Geen verplichtingen, gewoon een goed gesprek over de mogelijkheden.
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
