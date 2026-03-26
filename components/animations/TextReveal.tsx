'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  triggerStart?: string;
  stagger?: number;
}

export function TextReveal({
  children,
  className = '',
  triggerStart = 'top 85%',
  stagger = 0.03,
}: TextRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef<{ kill: () => void } | null>(null);
  const text = typeof children === 'string' ? children : String(children);
  const words = text.split(/\s+/);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.text-reveal-word').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const wordEls = container.querySelectorAll<HTMLElement>('.text-reveal-word');
    if (!wordEls.length) return;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const tween = gsap.fromTo(
          wordEls,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: triggerStart,
              toggleActions: 'play none none none',
            },
          }
        );
        triggerRef.current = tween.scrollTrigger ?? null;
      });
    });

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [triggerStart, stagger]);

  return (
    <p className={className}>
      <span ref={containerRef} className="inline">
        {words.map((word, i) => (
          <span key={i} className="text-reveal-word inline-block opacity-0 motion-reduce:opacity-100">
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </span>
    </p>
  );
}
