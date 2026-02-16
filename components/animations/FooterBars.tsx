'use client';

import { useEffect, useRef } from 'react';

const FOOTER_BAR_GROUPS = [
  {
    position: 'absolute left-0 -left-4 md:-left-2 lg:-left-8 flex gap-0 origin-top-right',
    style: { transform: 'rotate(24deg)' },
    clipPath: 'polygon(0 22%, 100% 0, 100% 100%, 0 100%)',
    colors: ['var(--dry-sage)', 'var(--ebony)', 'var(--grey-olive)', 'var(--dry-sage)', 'var(--cornsilk)'],
    barClass: 'w-8 md:w-14 h-36 md:h-48',
    bottomOffset: '-bottom-20 md:-bottom-28',
  },
  {
    position: 'absolute right-0 -right-4 md:-right-2 lg:-right-8 flex gap-0 origin-top-left',
    style: { transform: 'rotate(-26deg)' },
    clipPath: 'polygon(0 0, 100% 22%, 100% 100%, 0 100%)',
    colors: ['var(--grey-olive)', 'var(--dry-sage)', 'var(--ebony)', 'var(--grey-olive)', 'var(--cornsilk)'],
    barClass: 'w-8 md:w-14 h-36 md:h-48',
    bottomOffset: '-bottom-20 md:-bottom-28',
  },
] as const;

const BAR_COUNT = 5;

export function FooterBars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const RETREAT_OFFSET = 80;
    const baseRetreat = { x: -RETREAT_OFFSET, y: RETREAT_OFFSET };

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const groups = container.querySelectorAll('.footer-bar-group');
        const barsOrdered: { el: Element; from: { x: number; y: number }; barIdx: number; groupIdx: number }[] = [];
        for (let barIdx = 0; barIdx < BAR_COUNT; barIdx++) {
          groups.forEach((group, groupIdx) => {
            const bars = group.querySelectorAll('.footer-bar');
            const bar = bars[barIdx];
            if (bar) {
              const from = groupIdx === 1 ? { x: -baseRetreat.x, y: baseRetreat.y } : baseRetreat;
              barsOrdered.push({ el: bar, from, barIdx, groupIdx });
            }
          });
        }
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 95%',
            end: 'top 40%',
            scrub: 1.2,
          },
        });
        barsOrdered.forEach(({ el, from, barIdx, groupIdx }) => {
          const stagger = groupIdx === 1 ? (BAR_COUNT - 1 - barIdx) * 0.15 : barIdx * 0.15;
          tl.fromTo(
            el,
            { x: from.x, y: from.y },
            { x: 0, y: 0, duration: 0.4, ease: 'none' },
            stagger
          );
        });
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 h-32 md:h-40 overflow-hidden pointer-events-none z-0"
      aria-hidden
    >
      {FOOTER_BAR_GROUPS.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`footer-bar-group ${group.position} ${group.bottomOffset}`}
          style={group.style}
        >
          {group.colors.map((color, i) => (
            <div
              key={i}
              className={`footer-bar motion-reduce:opacity-100 ${group.barClass}`}
              style={{
                clipPath: group.clipPath,
                backgroundColor: color,
                ...(groupIndex === 1 && { position: 'relative' as const, zIndex: BAR_COUNT - i }),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
