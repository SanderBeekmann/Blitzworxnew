'use client';

import { cases } from '@/lib/cases';
import { CaseCard } from '@/components/cases/CaseCard';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { useEffect, useRef, useCallback } from 'react';

const SPEED = 1;
const loopedCases = [...cases, ...cases, ...cases];

export function RecentCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);
  const directionRef = useRef<1 | -1>(1);
  const pausedRef = useRef(false);
  const lastScrollLeftRef = useRef(0);
  const userScrollingRef = useRef(false);
  const subPixelRef = useRef(0);
  const boostRef = useRef(0);
  const inViewRef = useRef(false);

  const getOneSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const cardEl = track.querySelector('.case-slide');
    if (!cardEl) return 0;
    const cardWidth = cardEl.clientWidth;
    const gap = 32;
    return cases.length * (cardWidth + gap);
  }, []);

  const resetToCenter = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const oneSet = getOneSetWidth();
    if (oneSet === 0) return;

    if (track.scrollLeft >= oneSet * 2) {
      track.scrollLeft -= oneSet;
    } else if (track.scrollLeft <= 0) {
      track.scrollLeft += oneSet;
    }
  }, [getOneSetWidth]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wait for layout so card widths are available
    requestAnimationFrame(() => {
      const oneSet = getOneSetWidth();
      if (oneSet > 0) {
        track.scrollLeft = oneSet;
        lastScrollLeftRef.current = oneSet;
      }
    });

    const handleScroll = () => {
      if (!userScrollingRef.current) return;
      const currentScroll = track.scrollLeft;
      const delta = currentScroll - lastScrollLeftRef.current;
      if (Math.abs(delta) > 2) {
        directionRef.current = delta > 0 ? 1 : -1;
      }
      lastScrollLeftRef.current = currentScroll;
      resetToCenter();
    };

    const handlePointerDown = () => {
      userScrollingRef.current = true;
      pausedRef.current = true;
    };

    const handlePointerUp = () => {
      userScrollingRef.current = false;
      pausedRef.current = false;
    };

    const handleMouseEnter = () => {};

    const handleMouseLeave = () => {
      userScrollingRef.current = false;
    };

    const sectionObserver = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    sectionObserver.observe(section);

    let lastWindowScroll = window.scrollY;
    const handleWindowScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastWindowScroll;
      lastWindowScroll = currentY;
      if (!inViewRef.current) return;

      if (Math.abs(delta) > 1) {
        directionRef.current = delta > 0 ? 1 : -1;
        boostRef.current = Math.min(Math.abs(delta) * 0.3, 8);
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    track.addEventListener('pointerdown', handlePointerDown);
    track.addEventListener('pointerup', handlePointerUp);
    track.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    track.addEventListener('mouseleave', handleMouseLeave);

    if (prefersReducedMotion) {
      track.querySelectorAll('.case-slide').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return () => {
        track.removeEventListener('scroll', handleScroll);
        track.removeEventListener('pointerdown', handlePointerDown);
        track.removeEventListener('pointerup', handlePointerUp);
        track.removeEventListener('mouseenter', handleMouseEnter);
        track.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const visibleCards = Array.from(track.querySelectorAll('.case-slide')).slice(
          cases.length,
          cases.length + Math.ceil(track.clientWidth / 370) + 1
        );
        const tween = gsap.fromTo(
          visibleCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            onComplete: () => {
              track.querySelectorAll('.case-slide').forEach((el) => {
                (el as HTMLElement).style.opacity = '1';
              });
            },
          }
        );

        if (tween.scrollTrigger) {
          cleanupRef.current.push(() => tween.scrollTrigger?.kill());
        }

        const tickerFn = () => {
          if (pausedRef.current) return;
          const speed = SPEED + boostRef.current;
          boostRef.current *= 0.95; // decay boost
          if (boostRef.current < 0.01) boostRef.current = 0;
          subPixelRef.current += speed * directionRef.current;
          const px = Math.trunc(subPixelRef.current);
          if (px !== 0) {
            track.scrollLeft += px;
            subPixelRef.current -= px;
            lastScrollLeftRef.current = track.scrollLeft;
            resetToCenter();
          }
        };

        gsap.ticker.add(tickerFn);
        cleanupRef.current.push(() => gsap.ticker.remove(tickerFn));
      }
    );

    return () => {
      track.removeEventListener('scroll', handleScroll);
      track.removeEventListener('pointerdown', handlePointerDown);
      track.removeEventListener('pointerup', handlePointerUp);
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleWindowScroll);
      sectionObserver.disconnect();
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, [getOneSetWidth, resetToCenter]);

  return (
    <section
      ref={sectionRef}
      className="section relative overflow-hidden"
      aria-labelledby="recent-cases-title"
    >
      <div className="container-narrow mb-12">
        <TitleReveal
          as="h2"
          id="recent-cases-title"
          className="text-h2 md:text-h2-lg font-bold text-cornsilk"
        >
          Recent Cases
        </TitleReveal>
      </div>

      <div className="relative">
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--ink-black), transparent)' }}
          aria-hidden
        />
        <div
          className="hidden md:block absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--ink-black), transparent)' }}
          aria-hidden
        />

        <div
          ref={trackRef}
          className="flex gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {loopedCases.map((caseItem, i) => {
            const isOriginal = i >= cases.length && i < cases.length * 2;
            return (
              <div
                key={`${caseItem.slug}-${i}`}
                className="case-slide shrink-0 w-[85vw] sm:w-[70vw] md:w-[350px] lg:w-[380px] opacity-0 motion-reduce:opacity-100"
                {...(!isOriginal && { 'aria-hidden': true })}
              >
                <CaseCard caseItem={caseItem} headingAs={isOriginal ? 'h3' : 'span'} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
