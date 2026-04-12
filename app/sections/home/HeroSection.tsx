'use client';

import { BlitzworxGraphic } from '@/components/ui/BlitzworxGraphic';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import Link from 'next/link';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const DIENSTEN = [
  { label: 'Development', href: '/diensten/development' },
  { label: 'AI automatiseringen', href: '/diensten/ai-automatiseringen' },
  { label: 'Branding', href: '/diensten/branding' },
  { label: 'Webdesign', href: '/diensten/webdesign' },
  { label: 'Fotografie', href: '#photoshoot-title' },
];

export function HeroSection() {
  const dienstenRef = useRef<HTMLDivElement>(null);
  const [heroUrl, setHeroUrl] = useState('');
  const router = useRouter();

  function handleUrlSubmit(e: FormEvent) {
    e.preventDefault();
    const params = heroUrl.trim()
      ? `?url=${encodeURIComponent(heroUrl.trim())}`
      : '';
    router.push(`/website-score${params}`);
  }

  useEffect(() => {
    const container = dienstenRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.dienst-link').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    import('gsap').then(({ gsap }) => {
      const links = container.querySelectorAll('.dienst-link');
      gsap.fromTo(
        links,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: 2.3, ease: 'power3.out' }
      );
    });
  }, []);

  return (
      <div
        className="relative h-[100dvh] md:h-screen z-0 flex flex-col justify-center"
        aria-hidden
      >
        <section
          className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center"
          aria-labelledby="hero-title"
        >
          <div className="px-6 sm:px-10 md:px-6 lg:px-[4vw] xl:px-[8vw] 2xl:px-[12vw] text-center md:text-left">
            <TitleReveal
              as="h1"
              id="hero-title"
              className="text-[2.5rem] sm:text-[3.5rem] md:text-[3.2rem] lg:text-[4.4rem] xl:text-[5rem] 2xl:text-[7rem] leading-[1.05] font-bold text-cornsilk tracking-tight hero-title-depth"
              triggerOnMount
            >
              Development That Worx!
            </TitleReveal>
            <FadeIn delay={0.5}>
              <p className="mt-2 text-body md:text-small lg:text-h3 xl:text-body 2xl:text-h3 text-dry-sage/80 whitespace-nowrap">
                Websites & Applicaties op maat
              </p>
            </FadeIn>
            <FadeIn delay={0.9}>
              <div className="mt-16 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button href="/contact" variant="primary">
                  Contact
                </Button>
                <Button href="/cases" variant="outline">
                  Cases
                </Button>
              </div>
            </FadeIn>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center px-4 lg:px-6 overflow-visible min-h-[200px]">
            <FadeIn delay={1.2} className="w-full max-w-xl">
              <div className="relative w-full">
                {/* Ambient glow */}
                <div
                  className="relative overflow-hidden rounded-lg p-8 lg:p-10 border border-white/[0.08] shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.25),0_24px_48px_rgba(0,0,0,0.3),0_48px_96px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(202,202,170,0.04) 100%)' }}
                >
                  <BlitzworxGraphic className="absolute top-5 right-5 lg:top-6 lg:right-6 w-8 lg:w-10 h-auto" />
                  <h2 className="text-[1.4rem] lg:text-[1.6rem] font-bold text-cornsilk leading-tight pr-12">
                    Hoe scoort jouw website?
                  </h2>
                  <p className="mt-2 text-body text-cornsilk leading-snug">
                    Gratis analyse en advies op basis van je URL
                  </p>

                  {/* Form */}
                  <form onSubmit={handleUrlSubmit} className="mt-6 flex flex-col gap-3">
                    <input
                      type="text"
                      value={heroUrl}
                      onChange={(e) => setHeroUrl(e.target.value)}
                      placeholder="bijv. jouwbedrijf.nl"
                      className="w-full min-h-[52px] px-5 py-4 text-body rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none transition-colors"
                    />
                    <Button type="submit" variant="primary" className="w-full min-h-[52px] text-body">
                      Start de test
                    </Button>
                  </form>

                  {/* Trust line */}
                  <p className="mt-4 text-center text-caption text-grey-olive/60 tracking-wide">
                    <span className="text-dry-sage/90">Gratis</span> - 30 seconden
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <div ref={dienstenRef} className="absolute bottom-0 inset-x-0 py-6 md:py-8">
          <nav
            className="flex justify-center gap-x-12 gap-y-3 flex-wrap px-6"
            aria-label="Diensten"
          >
            {DIENSTEN.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="dienst-link relative group text-small md:text-body text-dry-sage/60 hover:text-cornsilk transition-colors opacity-0 motion-reduce:opacity-100"
              >
                {label}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-caption text-ink bg-cornsilk rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Ontdek dienst
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
  );
}
