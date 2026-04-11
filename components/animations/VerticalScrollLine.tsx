'use client';

import { useEffect, useRef } from 'react';

interface VerticalScrollLineProps {
  /** Height of the line container, e.g. "h-32 md:h-48" */
  className?: string;
}

export function VerticalScrollLine({
  className = 'h-32 md:h-48',
}: VerticalScrollLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    if (!container || !path) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = prefersReducedMotion ? '0' : `${pathLength}`;

    if (prefersReducedMotion) return;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.85;
      const end = viewportH * 0.15;
      const range = start - end;

      const progress =
        rect.top >= start
          ? 0
          : rect.top <= end
            ? 1
            : (start - rect.top) / range;

      path.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto w-px ${className}`}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 1 0 L 1 100"
          fill="none"
          stroke="var(--dry-sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            filter: 'drop-shadow(0 0 3px rgba(202, 202, 170, 0.4))',
          }}
        />
      </svg>
    </div>
  );
}
