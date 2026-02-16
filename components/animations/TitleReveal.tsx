'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface TitleRevealProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
  triggerStart?: string;
  triggerOnMount?: boolean;
}

export function TitleReveal({
  children,
  as: Tag = 'h2',
  id,
  className = '',
  triggerStart = 'top 85%',
  triggerOnMount = false,
}: TitleRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const text = typeof children === 'string' ? children : String(children);
  const words = text.split(/\s+/);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.title-reveal-word').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const wordEls = container.querySelectorAll<HTMLElement>('.title-reveal-word');
    if (!wordEls.length) return;

    import('gsap').then(({ gsap }) => {
      const animProps = {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out' as const,
      };

      if (triggerOnMount) {
        gsap.fromTo(wordEls, { opacity: 0, y: 24 }, { ...animProps, delay: 0.15 });
      } else {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
          gsap.fromTo(
            wordEls,
            { opacity: 0, y: 24 },
            {
              ...animProps,
              scrollTrigger: {
                trigger: container,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    });
  }, [triggerStart, triggerOnMount]);

  return (
    <Tag id={id} className={className}>
      <span ref={containerRef} className="inline-block">
        {words.map((word, i) => (
          <span key={i} className="title-reveal-word inline-block opacity-0 motion-reduce:opacity-100">
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
