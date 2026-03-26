'use client';

import { useEffect, useId, useRef } from 'react';

interface BlitzworxGraphicProps {
  className?: string;
}

export function BlitzworxGraphic({ className = '' }: BlitzworxGraphicProps) {
  const filterId = useId();
  const shadowId = `shape-shadow-${filterId.replace(/:/g, '')}`;
  const cornsilkRef = useRef<SVGPolygonElement>(null);
  const ebonyRef = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    const cornsilk = cornsilkRef.current;
    const ebony = ebonyRef.current;
    if (!cornsilk || !ebony) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ delay: 1.2 });

      tl.fromTo(
        cornsilk,
        { opacity: 0, x: -40, y: -40, rotation: -6, transformOrigin: 'center center' },
        { opacity: 1, x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'expo.out' }
      ).fromTo(
        ebony,
        { opacity: 0, x: 40, y: 40, rotation: 6, transformOrigin: 'center center' },
        { opacity: 1, x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'expo.out' },
        '-=0.5'
      );
    });
  }, []);

  return (
    <svg
      viewBox="-20 -20 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="6" stdDeviation="8" floodColor="#040711" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Achterste vorm — cornsilk, offset linksboven */}
      <polygon
        ref={cornsilkRef}
        points="70,0 160,0 160,90 90,160 0,160 0,70"
        fill="var(--cornsilk)"
        filter={`url(#${shadowId})`}
        style={{ opacity: 0 }}
      />
      {/* Voorste vorm — ebony, offset rechtsonder */}
      <polygon
        ref={ebonyRef}
        points="110,36 200,36 200,126 130,196 40,196 40,106"
        fill="var(--ebony)"
        filter={`url(#${shadowId})`}
        style={{ opacity: 0 }}
      />
    </svg>
  );
}
