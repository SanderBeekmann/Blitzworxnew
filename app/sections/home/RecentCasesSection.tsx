'use client';

import { cases } from '@/lib/cases';
import { CaseCard } from '@/components/cases/CaseCard';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { SectionTopBars } from '@/components/animations/SectionTopBars';
import { useEffect, useRef } from 'react';

const recentCases = cases.slice(0, 2);

export function RecentCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current?.querySelectorAll('.recent-case-card');
    if (!section || !cards?.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="section relative overflow-hidden" aria-labelledby="recent-cases-title">
      <SectionTopBars />
      <div className="container-narrow">
        <TitleReveal
          as="h2"
          id="recent-cases-title"
          className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-12 text-center"
        >
          Recent Cases
        </TitleReveal>
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {recentCases.map((caseItem) => (
            <div key={caseItem.slug} className="recent-case-card opacity-0 motion-reduce:opacity-100 h-full">
              <CaseCard caseItem={caseItem} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
