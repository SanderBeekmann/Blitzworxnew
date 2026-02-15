'use client';

import { useEffect, useRef } from 'react';

const BAR_GROUPS = [
  {
    position: 'fixed -left-8 z-10 flex gap-0 origin-bottom-right',
    style: { transform: 'rotate(-28deg)', top: 'calc(-30% - 360px)' },
    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)',
    colors: ['var(--ebony)', 'var(--grey-olive)', 'var(--dry-sage)', 'var(--cornsilk)'],
  },
  {
    position: 'fixed -right-8 z-10 flex gap-0 origin-bottom-left',
    style: { transform: 'rotate(26deg)', top: 'calc(-30% - 360px)' },
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 92%)',
    colors: ['var(--grey-olive)', 'var(--ebony)', 'var(--dry-sage)', 'var(--cornsilk)'],
  },
  {
    position: 'fixed left-0 md:left-4 z-10 flex gap-0 origin-top-right',
    style: { transform: 'rotate(24deg)', bottom: 'calc(-30% - 360px)' },
    clipPath: 'polygon(0 8%, 100% 0, 100% 100%, 0 100%)',
    colors: ['var(--dry-sage)', 'var(--ebony)', 'var(--grey-olive)', 'var(--cornsilk)'],
  },
  {
    position: 'fixed right-0 md:right-4 z-10 flex gap-0 origin-top-left',
    style: { transform: 'rotate(-26deg)', bottom: 'calc(-30% - 360px)' },
    clipPath: 'polygon(0 0, 100% 8%, 100% 100%, 0 100%)',
    colors: ['var(--grey-olive)', 'var(--dry-sage)', 'var(--ebony)', 'var(--cornsilk)'],
  },
] as const;

export function HeroBars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.hero-bar').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    import('gsap').then(({ gsap }) => {
      const bars = container.querySelectorAll('.hero-bar');
      gsap.fromTo(
        bars,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          delay: 0.15,
        }
      );
    });
  }, []);

  return (
    <div ref={containerRef} aria-hidden>
      {BAR_GROUPS.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={group.position}
          style={group.style}
        >
          {group.colors.map((color, i) => (
            <div
              key={i}
              className="hero-bar w-14 md:w-24 h-[55vh] md:h-[75vh] opacity-0 motion-reduce:opacity-100"
              style={{
                clipPath: group.clipPath,
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
