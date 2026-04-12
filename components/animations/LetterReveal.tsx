'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface LetterRevealProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  id?: string;
  className?: string;
  triggerStart?: string;
  staggerDelay?: number;
}

export function LetterReveal({
  children,
  as: Tag = 'h2',
  id,
  className = '',
  triggerStart = 'top 80%',
  staggerDelay = 0.03,
}: LetterRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const cleanupRef = useRef<{ kill: () => void } | null>(null);
  const text = typeof children === 'string' ? children : String(children);
  const words = text.split(/\s+/);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      container.querySelectorAll('.letter-reveal-char').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.filter = 'none';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const chars = container.querySelectorAll<HTMLElement>('.letter-reveal-char');
    if (!chars.length) return;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 40,
          filter: 'blur(12px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: staggerDelay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        },
      );

      cleanupRef.current = tween.scrollTrigger ?? null;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cleanupRef.current?.kill();
      cleanupRef.current = null;
    };
  }, [triggerStart, staggerDelay]);

  return (
    <Tag id={id} className={className}>
      <span ref={containerRef} className="inline">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char, ci) => (
              <span
                key={ci}
                className="letter-reveal-char inline-block opacity-0 motion-reduce:opacity-100"
                style={{ willChange: 'opacity, transform, filter' }}
              >
                {char}
              </span>
            ))}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    </Tag>
  );
}
