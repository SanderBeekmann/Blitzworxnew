'use client';

import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { useEffect, useRef, useState } from 'react';

const skills = [
  { name: 'Webdesign', direction: 'left' as const },
  { name: 'Development', direction: 'bottom' as const },
  { name: 'Branding', direction: 'right' as const },
];

export function AboutIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const skillsWrapperRef = useRef<HTMLDivElement>(null);
  const fixThresholdRef = useRef<number>(0);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const skillsWrapper = skillsWrapperRef.current;
    if (!skillsWrapper) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      skillsWrapper.querySelectorAll('[data-skill-direction]').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    const skillCards = skillsWrapper.querySelectorAll<HTMLElement>('[data-skill-direction]');
    if (!skillCards.length) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        skillCards.forEach((el) => {
          const direction = el.dataset.skillDirection;
          const from: Record<string, number> = { opacity: 0 };
          if (direction === 'left') from.x = -80;
          else if (direction === 'right') from.x = 80;
          else if (direction === 'bottom') from.y = 60;

          gsap.fromTo(
            el,
            from,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    );
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const placeholder = placeholderRef.current;

    const checkPosition = () => {
      if (isFixed && placeholder) {
        const rect = placeholder.getBoundingClientRect();
        if (rect.top > 0) {
          setIsFixed(false);
        }
      } else if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom > 0) {
          fixThresholdRef.current = window.scrollY;
          setIsFixed(true);
        }
      }
    };

    checkPosition();
    window.addEventListener('scroll', checkPosition, { passive: true });
    window.addEventListener('resize', checkPosition);
    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [isFixed]);

  useEffect(() => {
    if (!isFixed) return;

    const handleScroll = () => {
      if (window.scrollY < fixThresholdRef.current) {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFixed]);

  return (
    <>
      {isFixed && (
        <div ref={placeholderRef} className="h-screen min-h-screen" aria-hidden />
      )}
      <section
        ref={sectionRef}
        className={`section h-screen min-h-screen flex flex-col justify-center items-center border-t border-ebony overflow-hidden transition-none ${
          isFixed ? 'fixed inset-x-0 top-0 z-20' : 'relative'
        }`}
        aria-labelledby="about-intro-title"
      >
        <div className="container-narrow w-full max-w-4xl flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex flex-col items-center w-full">
            <FadeIn className="flex flex-col items-center w-full">
              <div className="space-y-6 max-w-prose text-center w-full">
                <h2 id="about-intro-title" className="text-h2 md:text-h2-lg font-bold text-cornsilk">
                  Hey, Nice To Meet You!
                </h2>
                <p className="text-body text-dry-sage leading-relaxed">
                  Blitzworx is een ambitieuze creative agency gefocust op het totaalpakket voor
                  ondernemers die online willen groeien. Vol passie staan we klaar om een op maat
                  gemaakte online omgeving te creëren.
                  <br />
                  Let&apos;s create stuff that worx!
                </p>
              </div>
            </FadeIn>
          </div>
          <div ref={skillsWrapperRef} className="flex flex-row flex-wrap justify-center gap-4 md:gap-6">
            {skills.map((skill) => (
              <div
                key={skill.name}
                data-skill-direction={skill.direction}
                className="skill-card flex items-center gap-3 p-4 rounded-md bg-ink/0 w-fit opacity-0"
              >
                <span className="w-2 h-8 bg-dry-sage rounded-full shrink-0" aria-hidden />
                <span className="text-h3 font-medium text-cornsilk">{skill.name}</span>
              </div>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <Button href="/contact" variant="secondary">
              Kennismaken?
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
