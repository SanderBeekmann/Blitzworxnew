'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MagicText } from '@/components/ui/MagicText';
import { FadeIn } from '@/components/animations/FadeIn';
import { LetterReveal } from '@/components/animations/LetterReveal';
import { useEffect, useRef } from 'react';

export function AboutIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const strokeRef = useRef<SVGRectElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    import('gsap').then(({ gsap }) => {
      const stroke = strokeRef.current;
      if (stroke) {
        const length = stroke.getTotalLength();
        stroke.style.strokeDasharray = String(length);
        stroke.style.strokeDashoffset = String(length);

        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              gsap.to(stroke, {
                strokeDashoffset: 0,
                duration: 2,
                ease: 'power2.inOut',
              });
              io.disconnect();
            }
          },
          { threshold: 0.15 },
        );
        io.observe(stroke.parentElement || stroke);

        cleanupRef.current = [() => io.disconnect()];
      }
    });

    return () => {
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section relative min-h-screen flex flex-col justify-center overflow-hidden bg-ink"
      style={{ overflowAnchor: 'none' }}
      aria-labelledby="about-intro-title"
    >
      <div className="container-narrow relative z-10 w-full">
        {/* Centered text block */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          <h2
            id="about-intro-title"
            className="text-hero md:text-hero-lg lg:text-hero-xl xl:text-hero-2xl font-bold text-cornsilk mb-8 md:mb-10"
          >
            <LetterReveal as="span" className="block">
              Hey,
            </LetterReveal>
            <LetterReveal as="span" className="block" staggerDelay={0.04}>
              Nice To Meet You!
            </LetterReveal>
          </h2>

          <FadeIn delay={0.6}>
            <MagicText
              text={"Ik ben Sander, oprichter van Blitzworx. Als developer combineer ik AI-gedreven tools met technische expertise om websites en applicaties te bouwen die er niet alleen goed uitzien, maar ook echt resultaat opleveren.\nEen vast aanspreekpunt, directe communicatie en volledige betrokkenheid bij elk detail. Ik kan niet alleen de website ontwikkelen, maar ook alle achterliggende processen. Van geautomatiseerde e-mails in huisstijl tot complete systemen die je bedrijfsvoering optimaliseren."}
              className="text-body text-dry-sage leading-relaxed max-w-prose mx-auto justify-center text-center"
            />
          </FadeIn>

        </div>

        {/* Image */}
        <div className="relative max-w-[27.6rem] mx-auto">
          <Image
            src="/assets/images/fotoshoot/image00001.webp"
            alt="Sander, oprichter en creative developer bij Blitzworx"
            width={1000}
            height={1200}
            quality={95}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 27.6rem"
          />
          <svg
            className="pointer-events-none absolute -inset-[1.5px] h-[calc(100%+3px)] w-[calc(100%+3px)] overflow-visible"
            aria-hidden
          >
            <rect
              ref={strokeRef}
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              fill="none"
              stroke="rgb(202 202 170 / 0.9)"
              strokeWidth="3"
              style={{ strokeDasharray: 9999, strokeDashoffset: 9999 }}
            />
          </svg>
          <a
            href="/contact"
            className="absolute -bottom-4 -right-4 md:-bottom-5 md:-right-5 z-10 inline-flex items-center gap-2 bg-cornsilk px-5 py-2.5 text-small font-medium !text-ink-black shadow-card transition-transform duration-300 hover:-translate-y-0.5"
            style={{ color: '#040711' }}
          >
            Kennismaken?
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
        </div>

        <FadeIn delay={0.8}>
          <div className="mt-10 md:mt-14 text-center">
            <Button href="/about" variant="secondary">
              Meer over Blitzworx
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
