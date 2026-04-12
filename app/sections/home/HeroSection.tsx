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
  const navRef = useRef<HTMLElement>(null);
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
      // Trapezium slides up from below
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 1.8, ease: 'power3.out' }
        );
      }

      // Diensten stagger after trapezium lands
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
        {/* Glassmorphism border frame + trapezium as one seamless layer */}
        <div className="hidden md:block absolute inset-0 z-20 pointer-events-none" aria-hidden>
          {/* Left */}
          <div
            className="absolute top-0 left-0 bottom-0 w-3 lg:w-4 backdrop-blur-md"
            style={{ background: 'linear-gradient(180deg, rgba(4,7,17,0.75) 0%, rgba(4,7,17,0.55) 50%, rgba(4,7,17,0.75) 100%)' }}
          />
          {/* Right */}
          <div
            className="absolute top-0 right-0 bottom-0 w-3 lg:w-4 backdrop-blur-md"
            style={{ background: 'linear-gradient(180deg, rgba(4,7,17,0.75) 0%, rgba(4,7,17,0.55) 50%, rgba(4,7,17,0.75) 100%)' }}
          />
          {/* Top */}
          <div
            className="absolute top-0 left-0 right-0 h-3 lg:h-4 backdrop-blur-md"
            style={{ background: 'linear-gradient(90deg, rgba(4,7,17,0.75) 0%, rgba(4,7,17,0.55) 50%, rgba(4,7,17,0.75) 100%)' }}
          />
          {/* Bottom - fades to full opacity */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3 lg:h-4 backdrop-blur-md"
            style={{ background: 'rgba(4,7,17,0.85)' }}
          />
          {/* Bottom fade band - transitions to 100% ink below the border */}
          <div
            className="absolute -bottom-12 left-0 right-0 h-12"
            style={{ background: 'linear-gradient(180deg, rgba(4,7,17,0.85) 0%, rgb(4,7,17) 100%)' }}
          />
          {/* Inner edge glow - single continuous line */}
          <div
            className="absolute inset-3 lg:inset-4 rounded-sm"
            style={{ boxShadow: '0 0 8px rgba(255,255,255,0.03), inset 0 0 1px rgba(255,255,255,0.06)' }}
          />
          {/* Top trapezium - same opacity, flows into top border */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] lg:w-[36%] xl:w-[32%] h-14 md:h-16 lg:h-[4.5rem] backdrop-blur-xl"
            style={{
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 30px) 100%, 30px 100%)',
              background: 'linear-gradient(180deg, rgba(4,7,17,0.75) 0%, rgba(4,7,17,0.6) 100%)',
            }}
          />
        </div>
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(4,7,17,0.98) 0%, rgba(4,7,17,0.85) 40%, rgba(4,7,17,0.6) 70%, rgba(4,7,17,0.4) 100%)' }}
          aria-hidden
        />
        <section
          className="absolute inset-0 z-10 grid grid-cols-1 md:grid-cols-2 items-center"
          aria-labelledby="hero-title"
        >
          <div className="px-6 sm:px-10 md:px-6 lg:px-[3.5vw] xl:px-[7vw] 2xl:px-[11vw] text-center md:text-left">
            <TitleReveal
              as="h1"
              id="hero-title"
              className="text-[2.5rem] sm:text-[3.5rem] md:text-[3.2rem] lg:text-[4.4rem] xl:text-[5rem] 2xl:text-[7rem] leading-[1.05] font-bold text-cornsilk tracking-tight hero-title-depth"
              triggerOnMount
            >
              Development That Worx!
            </TitleReveal>
            <FadeIn delay={0.5}>
              <p className="mt-2 text-body md:text-small lg:text-h3 xl:text-body 2xl:text-h3 text-dry-sage opacity-80">
                Websites, apps en automatiseringen op maat, voor bedrijven die vooruit kijken.
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
                  <p className="mt-2 text-body leading-snug" style={{ color: 'rgba(254,250,220,0.70)' }}>
                    Vul je website link (URL) in en laat onze AI agent je website onderzoeken!
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-caption" style={{ color: 'rgba(254,250,220,0.45)' }}>
                    <li className="flex items-center gap-1.5">
                      <span className="text-dry-sage">&#10003;</span> Snelheid
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-dry-sage">&#10003;</span> SEO
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-dry-sage">&#10003;</span> Design
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-dry-sage">&#10003;</span> Content
                    </li>
                  </ul>

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
                  <p className="-mb-4 lg:-mb-5 mt-3 lg:mt-4 text-center text-caption text-grey-olive/60 tracking-wide">
                    <span className="text-dry-sage/90">Gratis</span> - 30 seconden
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <div ref={dienstenRef} className="absolute -bottom-1 inset-x-0 flex justify-center z-20">
          <nav
            ref={navRef}
            className="relative inline-flex justify-center gap-x-8 gap-y-3 flex-wrap px-16 lg:px-20 xl:px-24 h-14 md:h-16 lg:h-[4.5rem] items-center opacity-0 backdrop-blur-xl"
            style={{
              clipPath: 'polygon(30px 0, calc(100% - 30px) 0, 100% 100%, 0 100%)',
              background: 'linear-gradient(180deg, rgba(4,7,17,0.6) 0%, rgb(4,7,17) 100%)',
            }}
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
