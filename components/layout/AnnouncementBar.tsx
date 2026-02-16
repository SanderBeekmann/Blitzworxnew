'use client';

import { useState, useEffect, useRef } from 'react';
import { projectsInProgress } from '@/lib/announcements';

const ROTATE_INTERVAL_MS = 4000;
const SCROLL_THRESHOLD = 10;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLParagraphElement[]>([]);
  const lastScrollY = useRef(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    if (projectsInProgress.length <= 1) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % projectsInProgress.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (projectsInProgress.length <= 1) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const prevIndex = prevIndexRef.current;
    if (prevIndex === index) return;
    const outgoing = projectsRef.current[prevIndex];
    const incoming = projectsRef.current[index];
    if (!outgoing || !incoming) {
      prevIndexRef.current = index;
      return;
    }
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        outgoing,
        { x: 0, opacity: 1 },
        {
          x: '100%',
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(outgoing, { x: 0, opacity: 0 });
          },
        }
      );
      gsap.fromTo(
        incoming,
        { x: '-100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    });
    prevIndexRef.current = index;
  }, [index]);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    if (!container || !bar) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      bar.style.transform = 'scaleX(1)';
      return;
    }

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          bar,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });
  }, []);

  useEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const spacerRect = spacer.getBoundingClientRect();
      const hasReachedTop = spacerRect.top <= 0;

      setIsFixed(hasReachedTop);

      if (hasReachedTop) {
        const scrollingDown = currentScrollY > lastScrollY.current;
        setIsVisible(scrollingDown);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (projectsInProgress.length === 0) return null;

  return (
    <div ref={spacerRef} className="relative w-full min-h-[2.75rem]">
      <div
        ref={containerRef}
        className={`w-full overflow-hidden transition-transform duration-300 ease-out border-y-2 border-cornsilk ${
          isFixed ? 'fixed top-0 left-0 right-0 z-[60] bg-ink' : 'relative bg-ink'
        } ${!isVisible && isFixed ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div
          ref={barRef}
          className="w-full px-4 sm:px-6 lg:px-8 py-2.5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 text-small bg-ink text-cornsilk origin-left"
          style={{ transform: 'scaleX(0)' }}
        >
          <span className="shrink-0">Lopende projecten</span>
          <div className="relative min-h-[1.25rem] flex items-center justify-center min-w-0 overflow-hidden">
            {projectsInProgress.map((project, i) => (
              <p
                key={`${project.company}-${project.type}`}
                ref={(el) => {
                  if (el) projectsRef.current[i] = el;
                }}
                className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-center truncate px-2 ${
                  i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                title={`${project.type}: ${project.company}`}
              >
                {project.type}:{' '}
                <span className="font-semibold text-cornsilk">{project.company}</span>
              </p>
            ))}
          </div>
          <span className="shrink-0 invisible" aria-hidden>Lopende projecten</span>
        </div>
      </div>
    </div>
  );
}
