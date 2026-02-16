'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

const skills = [
  {
    title: 'UI / UX',
    description:
      'Gebruiksvriendelijkheid staat centraal. We ontwerpen voor dagelijkse gebruiksmomenten en logische interacties. Animaties ondersteunen de gebruikerservaring en we testen met prototypes voordat we bouwen.',
  },
  {
    title: 'Development',
    description:
      'Een solide technische basis met focus op performance en schaalbaarheid. Toepasbaar op websites, webshops en maatwerkapplicaties. Schone code en toekomstbestendige oplossingen.',
  },
  {
    title: 'Branding',
    description:
      'Creativiteit en merkidentiteit. Samen vertalen we je identiteit naar communicatie en marktpositie. Van logo tot volledige huisstijl.',
  },
];

export function SkillsSection() {
  return (
    <section className="section" aria-labelledby="skills-title">
      <div className="container-narrow">
        <TitleReveal
          as="h2"
          id="skills-title"
          className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-16"
        >
          Skills
        </TitleReveal>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 md:items-stretch">
          {skills.map((skill, index) => (
            <FadeIn key={skill.title} delay={index * 0.1} className="h-full">
              <article className="h-full p-6 rounded-md bg-ink border border-ebony flex flex-col">
                <h3 className="text-h3 font-semibold text-cornsilk">{skill.title}</h3>
                <p className="mt-4 text-body text-dry-sage max-w-prose leading-relaxed">
                  {skill.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
