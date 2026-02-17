'use client';

import { useState, useEffect, useRef } from 'react';
import { projectsInProgress } from '@/lib/announcements';

const ROTATE_INTERVAL_MS = 4000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

    const mq = window.matchMedia('(max-width: 767px)');

    const handleScroll = () => {
      if (mq.matches) return;
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

  useEffect(() => {
    const handler = (e: CustomEvent<{ visible: boolean }>) => {
      setNavbarVisible(e.detail.visible);
    };
    window.addEventListener('navbar-visibility-change', handler as EventListener);
    return () => window.removeEventListener('navbar-visibility-change', handler as EventListener);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) setIsFixed(false);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const shouldHideForNavbar = isMobile && navbarVisible;
  const effectiveVisible = shouldHideForNavbar ? false : isVisible;
  const isFixedOnDesktop = isFixed && !isMobile;

  if (projectsInProgress.length === 0) return null;

  return (
    <div ref={spacerRef} className="relative w-full min-h-[2.75rem]">
      <div
        ref={containerRef}
        className={`w-full overflow-hidden transition-transform duration-300 ease-out border-y-2 border-cornsilk ${
          isFixedOnDesktop ? 'fixed top-0 left-0 right-0 z-[60] bg-ink' : 'relative bg-ink'
        } ${(!effectiveVisible && isFixedOnDesktop) ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div
          ref={barRef}
          className="w-full px-4 sm:px-6 lg:px-8 py-2.5 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4 flex flex-row justify-between items-center gap-3 text-small bg-ink text-cornsilk origin-left"
          style={{ transform: 'scaleX(0)' }}
        >
          <span className="shrink-0">Lopende projecten</span>
          <div className="relative min-h-[1.25rem] flex items-center justify-end md:justify-center min-w-0 min-h-0 flex-1 md:flex-none overflow-visible md:overflow-hidden">
            {projectsInProgress.map((project, i) => (
              <p
                key={`${project.company}-${project.type}`}
                ref={(el) => {
                  if (el) projectsRef.current[i] = el;
                }}
                className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-end md:justify-center text-right md:text-center px-2 md:px-2 py-0.5 ${
                  i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                title={`${project.type}: ${project.company}`}
              >
                {project.type}:{' '}
                <span className="font-semibold text-cornsilk break-words">{project.company}</span>
              </p>
            ))}
          </div>
          <span className="hidden md:inline shrink-0 invisible" aria-hidden>Lopende projecten</span>
        </div>
      </div>
    </div>
  );
}
