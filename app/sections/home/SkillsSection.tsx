'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { SectionBottomBars } from '@/components/animations/SectionBottomBars';

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
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 md:items-stretch">
          {skills.map((skill, index) => (
            <FadeIn key={skill.title} delay={index * 0.1} className="h-full">
              <Link href={skill.href} className="block h-full">
                <article className="group relative h-full p-6 rounded-md bg-ink border border-ebony flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
                    }}
                    aria-hidden
                  />
                  <h3 className="text-h3 font-semibold text-cornsilk">{skill.title}</h3>
                  <p className="mt-4 text-body text-dry-sage max-w-prose leading-relaxed flex-1">
                    {skill.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-dry-sage group-hover:text-cornsilk transition-colors">
                    Lees meer
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
      <SectionBottomBars />
    </section>
  );
}
