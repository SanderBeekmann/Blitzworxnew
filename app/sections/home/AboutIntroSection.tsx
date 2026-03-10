'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
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
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const disciplinesRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dotGridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const nameTagRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const archLinesRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ── Master animation timeline ──
  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    const photoInner = photoInnerRef.current;
    const ruler = rulerRef.current;
    const disciplines = disciplinesRef.current;
    const backdrop = backdropRef.current;
    const dotGrid = dotGridRef.current;
    const glow = glowRef.current;
    const nameTag = nameTagRef.current;
    const quote = quoteRef.current;
    const archLines = archLinesRef.current;

    if (!section || !photo || !photoInner) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        // ── Architectural background lines: grow from center ──
        if (archLines) {
          const lines = archLines.querySelectorAll('.arch-line');
          gsap.fromTo(
            lines,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 1.8,
              stagger: 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Ruler draw ──
        if (ruler) {
          gsap.fromTo(
            ruler,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ruler,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Step 1: Backdrop rectangle appears first ──
        if (backdrop) {
          gsap.fromTo(
            backdrop,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Step 2: Person rises out of the rectangle ──
        // Image starts fully below the rectangle, slides up and grows
        // Rectangle's overflow-hidden clips at the bottom edge
        gsap.set(photoInner, {
          opacity: 1,
          y: '100%',
          scale: 0.8,
          filter: 'grayscale(100%) brightness(0.6)',
        });

        // Rise up inside the clipped rectangle
        gsap.to(photoInner, {
          y: '0%',
          scale: 1,
          filter: 'grayscale(0%) brightness(1)',
          duration: 2,
          delay: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: photo,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Smoothly expand the clip to reveal the full figure beyond the rectangle
        if (backdrop) {
          gsap.to(backdrop, {
            clipPath: 'inset(-40% -25% 0 -25%)',
            duration: 1.2,
            delay: 0.4,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: photo,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── Dot grid: typewriter-style reveal ──
        if (dotGrid) {
          gsap.fromTo(
            dotGrid,
            { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0 0% 0)',
              opacity: 0.15,
              duration: 1.2,
              delay: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Radial glow: pulse in ──
        if (glow) {
          gsap.fromTo(
            glow,
            { opacity: 0, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 2,
              delay: 0.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Name tag: slide up with staggered children ──
        if (nameTag) {
          const children = nameTag.querySelectorAll('.name-tag-item');
          gsap.fromTo(
            children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              delay: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Quote: fade in with letter-spacing tighten ──
        if (quote) {
          gsap.fromTo(
            quote,
            { opacity: 0, letterSpacing: '0.15em', y: 10 },
            {
              opacity: 1,
              letterSpacing: '0em',
              y: 0,
              duration: 1,
              delay: 1.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ── Parallax: photo floats up, backdrop drifts slower (desktop only) ──
        if (window.matchMedia('(min-width: 768px)').matches) {
          gsap.to(photo, {
            y: -50,
            willChange: 'transform',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });

          if (backdrop) {
            gsap.to(backdrop, {
              y: -25,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            });
          }

          if (dotGrid) {
            gsap.to(dotGrid, {
              y: -15,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
              },
            });
          }
        }

        // ── Disciplines: stagger reveal with border draw ──
        if (disciplines) {
          const items = disciplines.querySelectorAll('.discipline-item');
          gsap.fromTo(
            items,
            { opacity: 0, x: -30, clipPath: 'inset(0 100% 0 0)' },
            {
              opacity: 1,
              x: 0,
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: disciplines,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }
    );
  }, []);


  return (
    <section
      ref={sectionRef}
      className="section relative min-h-screen flex flex-col justify-center border-t border-ebony overflow-hidden"
      aria-labelledby="about-intro-title"
    >
      {/* Background architectural lines */}
      <div ref={archLinesRef} className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="arch-line absolute top-0 left-[15%] md:left-[20%] w-px h-full origin-top"
          style={{ backgroundColor: 'rgba(84,92,82,0.08)', transform: 'scaleY(0)' }}
        />
        <div
          className="arch-line absolute top-0 right-[15%] md:right-[20%] w-px h-full origin-top"
          style={{ backgroundColor: 'rgba(84,92,82,0.06)', transform: 'scaleY(0)' }}
        />
      </div>

      <div className="container-narrow relative z-10 w-full">
        {/* ── Top: Section label ── */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-16 md:mb-24">
            <span className="text-caption font-mono tracking-[0.3em] uppercase text-grey-olive/50">
              Over Blitzworx
            </span>
            <div
              ref={rulerRef}
              className="flex-1 h-px bg-ebony origin-left motion-reduce:!transform-none"
              style={{ transform: 'scaleX(0)' }}
              aria-hidden
            />
          </div>
        </FadeIn>

        {/* ── Main grid: asymmetric editorial layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.9fr] gap-12 md:gap-8 lg:gap-0 items-start">
          {/* LEFT COLUMN: Text content */}
          <div className="relative md:pr-12 lg:pr-20 order-2 md:order-1">

            <TitleReveal
              as="h2"
              id="about-intro-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-8"
            >
              Hey, Nice To Meet You!
            </TitleReveal>

            <FadeIn delay={0.15}>
              <div className="space-y-5 text-body text-dry-sage leading-relaxed max-w-prose">
                <p>
                  Ik ben Sander, oprichter van Blitzworx. Als creative developer combineer ik
                  visueel ontwerp met technische expertise om websites te bouwen die er niet alleen
                  goed uitzien, maar ook écht resultaat opleveren.
                </p>
                <p className="text-grey-olive">
                  Eén vast aanspreekpunt, directe communicatie en volledige betrokkenheid bij elk
                  detail. Zo ontstaat er een website die past bij jouw merk én doet wat-ie moet doen.
                </p>
              </div>
            </FadeIn>

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

          {/* RIGHT COLUMN: Creator portrait */}
          <div className="relative order-1 md:order-2 md:mt-8 lg:mt-0">
            <div
              ref={photoRef}
              className="relative w-full max-w-[500px] mx-auto md:mx-0 md:ml-auto"
            >
              {/* Subtle dot grid accent */}
              <div
                ref={dotGridRef}
                className="absolute top-[5%] -right-2 md:-right-4 w-20 h-32 pointer-events-none opacity-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(202,202,170,0.6) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                }}
                aria-hidden
              />

              {/* Radial glow behind figure */}
              <div
                ref={glowRef}
                className="absolute inset-0 pointer-events-none opacity-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(202,202,170,0.15) 0%, transparent 70%)',
                }}
                aria-hidden
              />

              {/* Backdrop rectangle as portal — image emerges from it */}
              <div className="relative aspect-[3/4]">
                <div
                  ref={backdropRef}
                  className="absolute top-[25%] left-[15%] right-[15%] bottom-[5%] rounded-[2px] opacity-0"
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(84,92,82,0.12) 0%, rgba(84,92,82,0.04) 100%)',
                    border: '1px solid rgba(202,202,170,0.08)',
                    clipPath: 'inset(0 0 0 0)',
                  }}
                >
                  {/* Image inside rectangle — overflows left/right/top but clipped at bottom */}
                  <div
                    ref={photoInnerRef}
                    className="absolute"
                    style={{
                      top: '-36%',
                      left: '-22%',
                      right: '-22%',
                      bottom: '0%',
                      opacity: 0,
                    }}
                  >
                    <Image
                      src="/assets/images/sander1.png"
                      alt="Sander, oprichter en creative developer bij Blitzworx"
                      fill
                      className="object-contain object-bottom drop-shadow-[0_8px_32px_rgba(4,7,17,0.5)] brightness-[0.85]"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  </div>
                </div>
              </div>

              {/* Name tag beneath the figure */}
              <div ref={nameTagRef} className="mt-4 flex items-end justify-between px-2">
                <div>
                  <span className="name-tag-item block text-[10px] font-mono tracking-[0.25em] uppercase text-dry-sage/60 mb-1 opacity-0">
                    Oprichter &amp; Creative Developer
                  </span>
                  <span className="name-tag-item block text-h3 md:text-h3-lg font-bold text-cornsilk opacity-0">
                    Sander
                  </span>
                </div>
                <span className="name-tag-item text-[10px] font-mono tracking-[0.15em] uppercase text-grey-olive/40 opacity-0">
                  Zwolle, NL
                </span>
              </div>
            </div>

            {/* Quote centered below name tag */}
            <div ref={quoteRef} className="mt-6 md:mt-8 text-center opacity-0">
              <blockquote className="inline-block relative pl-5 border-l-2 border-dry-sage/30">
                <p className="text-small text-dry-sage/80 italic leading-relaxed">
                  &ldquo;Let&apos;s create stuff that worx!&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
