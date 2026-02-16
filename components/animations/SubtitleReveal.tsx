'use client';

import { useEffect, useRef } from 'react';

interface SubtitleRevealProps {
  className?: string;
  triggerOnMount?: boolean;
  as?: 'p' | 'h2';
  id?: string;
}

const WORDS = ['Web', 'design', 'That', 'Worx!'];
const WORX_INDEX = 3;

export function SubtitleReveal({
  className = '',
  triggerOnMount = false,
  as: Tag = 'p',
  id,
}: SubtitleRevealProps) {
  const containerRef = useRef<HTMLParagraphElement | HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.querySelectorAll('.subtitle-word').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const wordEls = container.querySelectorAll<HTMLElement>('.subtitle-word');
    if (!wordEls.length) return;

    const runAnimations = (gsap: typeof import('gsap').gsap) => {
      const baseStagger = 0.4;
      const worxExtraDelay = 0.55;
      const mountDelay = 0.6;

      wordEls.forEach((el, i) => {
        const isWorx = i === WORX_INDEX;
        const delay = i * baseStagger + (isWorx ? worxExtraDelay : 0);

        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: isWorx ? 0 : 24,
            scale: isWorx ? 1.5 : 1,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isWorx ? 0.5 : 0.6,
            delay: triggerOnMount ? mountDelay + delay : delay,
            ease: isWorx ? 'back.out(1.3)' : 'power2.out',
            ...(triggerOnMount
              ? {}
              : {
                  scrollTrigger: {
                    trigger: container,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                  },
                }),
          }
        );
      });
    };

    import('gsap').then(({ gsap }) => {
      if (triggerOnMount) {
        runAnimations(gsap);
      } else {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
          runAnimations(gsap);
        });
      }
    });
  }, [triggerOnMount]);

  return (
    <Tag ref={containerRef as React.RefObject<HTMLParagraphElement>} id={id} className={className}>
      {WORDS.map((word, i) => (
        <span key={i} className="subtitle-word inline-block opacity-0 motion-reduce:opacity-100">
          {word}
          {i < WORDS.length - 1 && i !== 0 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
