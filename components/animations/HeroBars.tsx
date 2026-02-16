'use client';

import { useEffect, useRef } from 'react';

const RETREAT_OFFSET = 80;

const BAR_GROUPS = [
  {
    position:
      'fixed -left-8 md:-left-4 lg:-left-14 2xl:-left-8 z-10 flex gap-0 origin-bottom-right top-[calc(-22%-244px)] md:top-[calc(-18%-220px)] lg:top-[calc(-26%-310px)] 2xl:top-[calc(-30%-360px)]',
    style: { transform: 'rotate(-28deg)' },
    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)',
    colors: ['var(--ebony)', 'var(--grey-olive)', 'var(--dry-sage)', 'var(--cornsilk)'],
  },
  {
    position:
      'fixed -right-8 md:-right-4 lg:-right-14 2xl:-right-8 z-10 flex gap-0 origin-bottom-left top-[calc(-22%-244px)] md:top-[calc(-18%-220px)] lg:top-[calc(-26%-310px)] 2xl:top-[calc(-30%-360px)]',
    style: { transform: 'rotate(26deg)' },
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 92%)',
    colors: ['var(--grey-olive)', 'var(--ebony)', 'var(--dry-sage)', 'var(--cornsilk)'],
  },
  {
    position:
      'fixed -left-8 md:left-0 lg:-left-6 2xl:left-4 z-10 flex gap-0 origin-top-right bottom-[calc(-22%-244px)] md:bottom-[calc(-18%-220px)] lg:bottom-[calc(-26%-310px)] 2xl:bottom-[calc(-30%-360px)]',
    style: { transform: 'rotate(24deg)' },
    clipPath: 'polygon(0 8%, 100% 0, 100% 100%, 0 100%)',
    colors: ['var(--dry-sage)', 'var(--ebony)', 'var(--grey-olive)', 'var(--cornsilk)'],
  },
  {
    position:
      'fixed -right-8 md:right-0 lg:-right-6 2xl:right-4 z-10 flex gap-0 origin-top-left bottom-[calc(-22%-244px)] md:bottom-[calc(-18%-220px)] lg:bottom-[calc(-26%-310px)] 2xl:bottom-[calc(-30%-360px)]',
    style: { transform: 'rotate(-26deg)' },
    clipPath: 'polygon(0 0, 100% 8%, 100% 100%, 0 100%)',
    colors: ['var(--grey-olive)', 'var(--dry-sage)', 'var(--ebony)', 'var(--cornsilk)'],
  },
] as const;

export function HeroBars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<{ kill: () => void }[]>([]);

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
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

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

        const groups = container.querySelectorAll('.hero-bar-group');
        const spacer = container.parentElement?.nextElementSibling;

        const retreatDirections: { x: number; y: number }[] = [
          { x: -RETREAT_OFFSET, y: -RETREAT_OFFSET },
          { x: RETREAT_OFFSET, y: -RETREAT_OFFSET },
          { x: -RETREAT_OFFSET, y: RETREAT_OFFSET },
          { x: RETREAT_OFFSET, y: RETREAT_OFFSET },
        ];

        if (groups.length && spacer) {
          groups.forEach((group, i) => {
            const dir = retreatDirections[i];
            if (!dir) return;
            const tl = gsap.fromTo(
              group,
              { x: 0, y: 0 },
              {
                x: dir.x,
                y: dir.y,
                ease: 'none',
                scrollTrigger: {
                  trigger: spacer,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 1.2,
                },
              }
            );
            if (tl.scrollTrigger) scrollTriggerRef.current.push(tl.scrollTrigger);
          });
        }
      });
    });

    return () => {
      scrollTriggerRef.current.forEach((st) => st.kill());
      scrollTriggerRef.current = [];
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden>
      {BAR_GROUPS.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`hero-bar-group ${group.position}`}
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
