'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const LOGO_TEXT = 'BLITZWORX';

export function FooterLogo() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.footer-logo-letter').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const letterEls = container.querySelectorAll<HTMLElement>('.footer-logo-letter');
    if (!letterEls.length) return;

    const footer = container.closest('footer');
    const trigger = footer ?? container;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === trigger) st.kill();
        });
        gsap.set(letterEls, { opacity: 0, y: 24 });

        const animProps = {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out' as const,
        };

        const isInView = () => {
          const rect = trigger.getBoundingClientRect();
          return rect.top < window.innerHeight * 0.9;
        };

        if (isInView()) {
          gsap.fromTo(letterEls, { opacity: 0, y: 24 }, animProps);
        } else {
          gsap.fromTo(letterEls, { opacity: 0, y: 24 }, {
            ...animProps,
            scrollTrigger: {
              trigger,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
        }

        ScrollTrigger.refresh();
      });
    });
  }, [pathname]);

  return (
    <Link
      href="/"
      className="inline-block text-[clamp(2.5rem,18vw,6rem)] md:text-[6rem] font-semibold text-cornsilk tracking-tight hover:text-dry-sage transition-colors leading-tight"
    >
      <span ref={containerRef} className="inline-flex">
        {LOGO_TEXT.split('').map((letter, i) => (
          <span
            key={i}
            className="footer-logo-letter inline-block opacity-0 motion-reduce:opacity-100"
          >
            {letter}
          </span>
        ))}
      </span>
    </Link>
  );
}
