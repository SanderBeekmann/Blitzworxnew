'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MagicText } from '@/components/ui/MagicText';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { useEffect, useRef } from 'react';

export function AboutIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<SVGRectElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  // ── All animations via IntersectionObserver — zero ScrollTrigger ──
  useEffect(() => {
    const section = sectionRef.current;
    const ruler = rulerRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    import('gsap').then(({ gsap }) => {
      const observers: IntersectionObserver[] = [];

      const onVisible = (
        el: Element,
        callback: () => void,
        threshold = 0.2,
      ) => {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              callback();
              io.disconnect();
            }
          },
          { threshold },
        );
        io.observe(el);
        observers.push(io);
      };

      if (ruler) {
        onVisible(ruler, () => {
          gsap.fromTo(ruler, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out' });
        }, 0.1);
      }

      const stroke = strokeRef.current;
      if (stroke) {
        const length = stroke.getTotalLength();
        stroke.style.strokeDasharray = String(length);
        stroke.style.strokeDashoffset = String(length);
        onVisible(stroke.parentElement || stroke, () => {
          gsap.to(stroke, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut',
          });
        }, 0.15);
      }

      cleanupRef.current = [() => observers.forEach((io) => io.disconnect())];
    });

    return () => {
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, []);


  return (
    <section
      ref={sectionRef}
      className="section relative min-h-screen flex flex-col justify-center  overflow-x-hidden bg-transparent"
      style={{ overflowAnchor: 'none' }}
      aria-labelledby="about-intro-title"
    >
<div className="container-narrow relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-16 items-center">
          <div>
            <TitleReveal
              as="h2"
              id="about-intro-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-8"
            >
              Hey, Nice To Meet You!
            </TitleReveal>

            <MagicText
              text={"Ik ben Sander, oprichter van Blitzworx. Als developer combineer ik AI-gedreven tools met technische expertise om websites en applicaties te bouwen die er niet alleen goed uitzien, maar ook écht resultaat opleveren.\nEén vast aanspreekpunt, directe communicatie en volledige betrokkenheid bij elk detail. Ik kan niet alleen de website ontwikkelen, maar ook alle achterliggende processen. Van geautomatiseerde e-mails in huisstijl tot complete systemen die je bedrijfsvoering optimaliseren."}
              className="text-body text-dry-sage leading-relaxed max-w-prose"
            />

            <FadeIn delay={0.4}>
              <div className="mt-10 md:mt-14">
                <Button href="/about" variant="secondary">
                  Meer over Blitzworx
                </Button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="relative w-full max-w-[27.6rem] mx-auto md:mx-0 md:ml-auto">
              <Image
                src="/assets/images/fotoshoot/image00001.webp"
                alt="Sander, oprichter en creative developer bij Blitzworx"
                width={1000}
                height={1200}
                quality={95}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 45vw"
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
                className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-10 inline-flex items-center gap-2 bg-cornsilk px-5 py-2.5 text-small font-medium !text-ink-black shadow-card transition-transform duration-300 hover:-translate-y-0.5"
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
