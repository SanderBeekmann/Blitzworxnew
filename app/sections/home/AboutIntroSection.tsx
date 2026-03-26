'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MagicText } from '@/components/ui/MagicText';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { useEffect, useRef, useState } from 'react';

const disciplines = [
  {
    label: 'Design',
    mono: '01',
    description:
      'Van wireframe tot pixel-perfect ontwerp. Ik creëer visuele ervaringen die intuïtief aanvoelen, je merk versterken en bezoekers moeiteloos door je website leiden.',
  },
  {
    label: 'Development',
    mono: '02',
    description:
      'Snelle, schaalbare websites gebouwd met moderne technologie. Performance, toegankelijkheid en een solide technische basis staan bij elke build centraal.',
  },
  {
    label: 'Branding',
    mono: '03',
    description:
      'Een sterk merk begint bij een helder verhaal. Ik help je met een visuele identiteit, van logo tot kleurpalet, die blijft hangen en vertrouwen wekt.',
  },
];

export function AboutIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const disciplinesRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cleanupRef = useRef<(() => void)[]>([]);

  // ── All animations via IntersectionObserver — zero ScrollTrigger ──
  useEffect(() => {
    const section = sectionRef.current;
    const ruler = rulerRef.current;
    const disciplines = disciplinesRef.current;

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

      if (disciplines) {
        const items = disciplines.querySelectorAll('.discipline-item');
        onVisible(disciplines, () => {
          gsap.fromTo(items,
            { opacity: 0, x: -30, clipPath: 'inset(0 100% 0 0)' },
            { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.8, stagger: 0.15, ease: 'power3.out' },
          );
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

            {/* ── Disciplines ── */}
            <div ref={disciplinesRef} className="mt-10 md:mt-14 space-y-0">
              {disciplines.map((d, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={d.label}
                    className="discipline-item opacity-0 motion-reduce:opacity-100"
                    style={{
                      borderBottom:
                        i < disciplines.length - 1 ? '1px solid rgba(84,92,82,0.2)' : 'none',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex items-center gap-5 py-4 w-full text-left cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-caption font-mono text-grey-olive/40 w-6 shrink-0">
                        {d.mono}
                      </span>
                      <span className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors duration-300">
                        {d.label}
                      </span>
                      <div className="flex-1 h-px bg-ebony/0" aria-hidden />
                      <span
                        className="text-caption font-mono text-grey-olive/30 tracking-wider transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      >
                        →
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        maxHeight: isOpen ? '200px' : '0px',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p className="text-small text-dry-sage/70 leading-relaxed pl-11 pb-4 max-w-md">
                        {d.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <FadeIn delay={0.4}>
              <div className="mt-10 md:mt-14">
                <Button href="/about" variant="secondary">
                  Meer over Blitzworx
                </Button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="relative w-full max-w-sm mx-auto md:mx-0 md:ml-auto">
              <Image
                src="/assets/images/Sander.webp"
                alt="Sander, oprichter en creative developer bij Blitzworx"
                width={500}
                height={600}
                className="w-full h-auto rounded-sm"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
