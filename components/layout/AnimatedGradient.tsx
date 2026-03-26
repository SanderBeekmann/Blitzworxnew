'use client';

import { useEffect, useRef } from 'react';

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradient({ children, className = '' }: AnimatedGradientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    import('gsap').then(({ gsap }) => {
      gsap.to(el, {
        '--gx': '130%',
        '--gy': '25%',
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        '--gx': '120%',
        '--gy': '35%',
        background:
          'radial-gradient(ellipse at var(--gx) var(--gy), var(--ebony) 0%, var(--ink-black) 55%)',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
