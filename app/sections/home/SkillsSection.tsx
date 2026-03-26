'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';


const skills = [
  {
    title: 'UI / UX',
    description:
      'Gebruiksvriendelijkheid staat centraal. Ik ontwerp voor dagelijkse gebruiksmomenten en logische interacties. Animaties ondersteunen de gebruikerservaring en ik test met prototypes voordat ik bouw.',
    href: '/diensten/webdesign',
  },
  {
    title: 'Development',
    description:
      'Een solide technische basis met focus op performance en schaalbaarheid. Toepasbaar op websites, webshops en maatwerkapplicaties. Schone code en toekomstbestendige oplossingen.',
    href: '/diensten/development',
  },
  {
    title: 'Branding',
    description:
      'Creativiteit en merkidentiteit. Samen vertalen we jouw identiteit naar communicatie en marktpositie. Van logo tot volledige huisstijl.',
    href: '/diensten/branding',
  },
  {
    title: 'AI Automatiseringen',
    description:
      'Bespaar tijd met slimme workflows, chatbots en integraties. AI neemt repetitieve taken over zodat jij je kunt focussen op groei.',
    href: '/diensten/ai-automatiseringen',
  },
];

export function SkillsSection() {
  return (
    <section className="section relative overflow-hidden" aria-labelledby="skills-title">
      <div className="container-narrow">
        <TitleReveal
          as="h2"
          id="skills-title"
          className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-16 text-center"
        >
          Skills
        </TitleReveal>
        {/* Bento grid: 3 kolommen, 2 rijen
             ┌──────┬──────┬──────────┐
             │UI/UX │Brand │          │
             │      │      │   Dev    │
             ├──────┴──────┤  (1x2)   │
             │  AI Auto    │          │
             │   (2x1)     │          │
             └─────────────┴──────────┘ */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-5">
          {/* UI/UX — top left */}
          <FadeIn delay={0} className="h-full">
            <Link href={skills[0].href} className="block h-full">
              <article className="group relative h-full p-6 lg:p-8 rounded-md bg-ink border border-ebony flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                  }}
                  aria-hidden
                />
                <h3 className="text-h2 md:text-h2-lg font-semibold text-cornsilk">{skills[0].title}</h3>
                <p className="mt-4 text-body text-dry-sage leading-relaxed flex-1">
                  {skills[0].description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-dry-sage group-hover:text-cornsilk transition-colors">
                  Lees meer
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </article>
            </Link>
          </FadeIn>

          {/* Branding — top middle */}
          <FadeIn delay={0.1} className="h-full">
            <Link href={skills[2].href} className="block h-full">
              <article className="group relative h-full p-6 lg:p-8 rounded-md bg-ink border border-ebony flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                  }}
                  aria-hidden
                />
                <h3 className="text-h2 md:text-h2-lg font-semibold text-cornsilk">{skills[2].title}</h3>
                <p className="mt-4 text-body text-dry-sage leading-relaxed flex-1">
                  {skills[2].description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-dry-sage group-hover:text-cornsilk transition-colors">
                  Lees meer
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </article>
            </Link>
          </FadeIn>

          {/* Development — right, full height */}
          <FadeIn delay={0.2} className="h-full md:row-span-2">
            <Link href={skills[1].href} className="block h-full">
              <article className="group relative h-full p-6 lg:p-8 rounded-md bg-ink border border-ebony flex flex-col items-center justify-center text-center overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 20%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                  }}
                  aria-hidden
                />
                {/* Code bracket icon */}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  className="mb-6 text-dry-sage/30 group-hover:text-dry-sage/50 transition-colors duration-300"
                  aria-hidden
                >
                  <path
                    d="M24 16L8 32L24 48"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 16L56 32L40 48"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M36 8L28 56"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <h3 className="text-h2 md:text-h2-lg font-semibold text-cornsilk">{skills[1].title}</h3>
                <p className="mt-4 text-body text-dry-sage leading-relaxed max-w-xs">
                  {skills[1].description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-dry-sage group-hover:text-cornsilk transition-colors">
                  Lees meer
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </article>
            </Link>
          </FadeIn>

          {/* AI Automatiseringen — bottom left, spans 2 cols */}
          <FadeIn delay={0.3} className="h-full md:col-span-2">
            <Link href={skills[3].href} className="block h-full">
              <article className="group relative h-full p-6 lg:p-8 rounded-md bg-ink border border-ebony flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                  }}
                  aria-hidden
                />
                <div className="flex items-stretch gap-6 flex-1">
                  <div className="flex-1">
                    <h3 className="text-h2 md:text-h2-lg font-semibold text-cornsilk">{skills[3].title}</h3>
                    <p className="mt-4 text-body text-dry-sage leading-relaxed max-w-sm">
                      {skills[3].description}
                    </p>
                  </div>
                  {/* AI circuit/node vector */}
                  <div className="hidden md:flex flex-1 items-center justify-center">
                    <svg
                      width="180"
                      height="180"
                      viewBox="0 0 120 120"
                      fill="none"
                      className="text-dry-sage/20 group-hover:text-dry-sage/40 transition-colors duration-300"
                      aria-hidden
                    >
                      {/* Pulse animation for lines */}
                      <style>{`
                        @keyframes pulse-line {
                          0%, 100% { stroke-opacity: 0.3; }
                          50% { stroke-opacity: 1; }
                        }
                        @keyframes pulse-node {
                          0%, 100% { opacity: 0.4; }
                          50% { opacity: 1; }
                        }
                        .ai-line-1 { animation: pulse-line 3s ease-in-out infinite; }
                        .ai-line-2 { animation: pulse-line 3s ease-in-out 0.5s infinite; }
                        .ai-line-3 { animation: pulse-line 3s ease-in-out 1s infinite; }
                        .ai-line-4 { animation: pulse-line 3s ease-in-out 1.5s infinite; }
                        .ai-line-5 { animation: pulse-line 3s ease-in-out 0.75s infinite; }
                        .ai-line-6 { animation: pulse-line 3s ease-in-out 1.25s infinite; }
                        .ai-node { animation: pulse-node 2s ease-in-out infinite; }
                      `}</style>
                      {/* Center hub */}
                      <circle cx="60" cy="60" r="16" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="60" cy="60" r="4" fill="currentColor" className="ai-node" />
                      {/* Lines — each with staggered pulse */}
                      <line x1="60" y1="44" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" className="ai-line-1" />
                      <line x1="60" y1="76" x2="60" y2="108" stroke="currentColor" strokeWidth="1.5" className="ai-line-2" />
                      <line x1="44" y1="60" x2="12" y2="60" stroke="currentColor" strokeWidth="1.5" className="ai-line-3" />
                      <line x1="76" y1="60" x2="108" y2="60" stroke="currentColor" strokeWidth="1.5" className="ai-line-4" />
                      <line x1="71" y1="49" x2="95" y2="25" stroke="currentColor" strokeWidth="1.5" className="ai-line-5" />
                      <line x1="49" y1="71" x2="25" y2="95" stroke="currentColor" strokeWidth="1.5" className="ai-line-6" />
                      {/* Outer nodes */}
                      <circle cx="60" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="60" cy="108" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="60" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="108" cy="60" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="98" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="22" cy="98" r="4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-dry-sage group-hover:text-cornsilk transition-colors">
                  Lees meer
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </article>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
