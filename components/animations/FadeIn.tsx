'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.6, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.classList.remove('opacity-0');
      return;
    }

    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out',
        }
      );
    });
  }, [delay, duration]);

  return (
    <div ref={ref} className={['opacity-0 motion-reduce:opacity-100', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
