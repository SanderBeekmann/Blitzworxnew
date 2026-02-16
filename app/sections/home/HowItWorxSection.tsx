'use client';

import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { useEffect, useRef } from 'react';

const SLIDE_OFFSET = '30vw';

interface ScrollTriggerRef {
  kill: () => void;
}

const steps = [
  {
    number: '01',
    title: 'Intake',
    description:
      'Kennismaking en het opstellen van een maatwerkplan. We bespreken je doelen, doelgroep en wensen.',
  },
  {
    number: '02',
    title: 'Design & Development',
    description:
      'Ontwerp op maat, feedbackmomenten en directe ontwikkeling. Samen bouwen we naar het beste resultaat.',
  },
  {
    number: '03',
    title: 'Feedback & Optimalisatie',
    description:
      'Evaluatie na oplevering en doorvoeren van verbeteringen. We perfectioneren tot alles klopt.',
  },
  {
    number: '04',
    title: 'Live!',
    description:
      'Website gaat live inclusief volledige ontzorging en mogelijkheid tot onderhoudsabonnement.',
  },
];

export function HowItWorxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<SVGPathElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef<HTMLDivElement>(null);
  const timelineCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = timelineRef.current;
    if (!section || !path) return;

    let isMounted = true;
    const initAnimation = (retryCount = 0) => {
      if (!isMounted) return;
      const dots = section.querySelectorAll('.timeline-dot');
      if (!dots.length && retryCount < 5) {
        setTimeout(() => initAnimation(retryCount + 1), 100);
        return;
      }
      if (!dots.length) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        path.style.strokeDashoffset = '0';
        dots.forEach((dot) => ((dot as HTMLElement).style.opacity = '1'));
        return;
      }

      const stepsWrapper = timelineContainerRef.current?.parentElement;
      if (!stepsWrapper) return;
      const stepsWrapperRect = stepsWrapper.getBoundingClientRect();
      const lastDot = dots[dots.length - 1] as HTMLElement;
      const lastDotRect = lastDot.getBoundingClientRect();
      const lastDotCenterY = lastDotRect.top + lastDotRect.height / 2;
      const lineStartY = stepsWrapperRect.top;
      const lineEndY = lastDotCenterY;
      const lineLength = lineEndY - lineStartY;

      const dotProgresses: number[] = [];
      dots.forEach((dot) => {
        const rect = (dot as HTMLElement).getBoundingClientRect();
        const dotCenterY = rect.top + rect.height / 2;
        const progress = lineLength > 0 ? (dotCenterY - lineStartY) / lineLength : 0;
        dotProgresses.push(Math.max(0, Math.min(1, progress)));
      });

      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = `${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;

      const timelineContainer = timelineContainerRef.current;
      if (!timelineContainer) return;

      const viewportCenterY = () => window.innerHeight / 2;

      const updateLine = () => {
        if (!isMounted || !path) return;
        const rect = timelineContainer.getBoundingClientRect();
        const lineHeight = rect.bottom - rect.top;
        const centerY = viewportCenterY();
        const progress = lineHeight > 0
          ? Math.max(0, Math.min(1, (centerY - rect.top) / lineHeight))
          : 0;
        path.style.strokeDashoffset = `${pathLength * (1 - progress)}`;

        dots.forEach((dot, i) => {
          const dotProgress = dotProgresses[i];
          (dot as HTMLElement).style.opacity = progress >= dotProgress ? '1' : '0';
        });
      };

      updateLine();
      window.addEventListener('scroll', updateLine, { passive: true });
      window.addEventListener('resize', updateLine);

      timelineCleanupRef.current = () => {
        window.removeEventListener('scroll', updateLine);
        window.removeEventListener('resize', updateLine);
      };
    };

    const timeoutId = setTimeout(() => initAnimation(0), 150);

    const handleRefresh = () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener('resize', handleRefresh);
    window.addEventListener('load', handleRefresh);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleRefresh);
      window.removeEventListener('load', handleRefresh);
      timelineCleanupRef.current?.();
    };
  }, []);

  useEffect(() => {
    const timelineContainer = timelineContainerRef.current;
    const lastStep = lastStepRef.current;
    if (!timelineContainer || !lastStep) return;

    const updateTimelineEnd = () => {
      const containerRect = timelineContainer.parentElement?.getBoundingClientRect();
      const lastStepRect = lastStep.getBoundingClientRect();
      if (!containerRect) return;

      const lastStepCenter = lastStepRect.top + lastStepRect.height / 2;
      const containerBottom = containerRect.bottom;
      const offset = containerBottom - lastStepCenter;
      timelineContainer.style.bottom = `${offset}px`;

      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    };

    updateTimelineEnd();
    const observer = new ResizeObserver(updateTimelineEnd);
    observer.observe(lastStep);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const stepContents = section.querySelectorAll<HTMLElement>('.step-content');
    if (!stepContents.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      stepContents.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const triggers: Array<ScrollTriggerRef> = [];

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        stepContents.forEach((el, i) => {
          const fromLeft = i % 2 === 0;
          gsap.set(el, {
            opacity: 0,
            x: fromLeft ? `-${SLIDE_OFFSET}` : SLIDE_OFFSET,
          });

          const tl = gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
        });

        ScrollTrigger.refresh();
      }
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className="section relative overflow-x-hidden" aria-labelledby="how-it-worx-title">
      <div className="container-narrow">
        <TitleReveal
          as="h2"
          id="how-it-worx-title"
          className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-16 text-center"
        >
          How It Worx
        </TitleReveal>

        <div className="relative">
          <div className="relative overflow-x-hidden">
            <div
              ref={timelineContainerRef}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            >
              <svg className="w-full h-full" viewBox="0 0 1 100" preserveAspectRatio="none">
                <path
                  ref={timelineRef}
                  d="M 0.5 0 L 0.5 100"
                  fill="none"
                  stroke="var(--cornsilk)"
                  strokeWidth="1"
                  className="timeline-path"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-12 md:gap-16">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  ref={index === steps.length - 1 ? lastStepRef : undefined}
                  className={`relative flex pl-12 md:pl-0 ${
                    index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                  } md:pr-0`}
                >
                  <div
                    className="timeline-dot absolute left-4 md:left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cornsilk border-2 border-ink z-10 opacity-0"
                    data-dot-index={index}
                    aria-hidden
                  />
                  <div
                    className={`step-content w-full max-w-[calc(100%-2rem)] md:max-w-[calc(50%-2rem)] opacity-0 ${
                      index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                    }`}
                  >
                    <div
                      className={`flex flex-col ${
                        index % 2 === 0 ? 'md:items-end' : 'md:items-start'
                      }`}
                    >
                      <span className="text-small font-mono text-dry-sage" aria-hidden>
                        {step.number}
                      </span>
                      <h3 className="mt-2 text-h3 font-semibold text-cornsilk">{step.title}</h3>
                      <p className="mt-2 text-body text-dry-sage max-w-prose">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <FadeIn delay={0.4}>
              <Button href="/contact">Lees meer</Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
