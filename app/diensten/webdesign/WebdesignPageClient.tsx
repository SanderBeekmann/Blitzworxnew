'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { SectionTopBars } from '@/components/animations/SectionTopBars';
import { SectionBottomBars } from '@/components/animations/SectionBottomBars';
import { Button } from '@/components/ui/Button';

const SLIDE_OFFSET = '30vw';

interface ScrollTriggerRef {
  kill: () => void;
}

const benefits = [
  {
    number: '01',
    title: 'Eerste indruk die blijft',
    description:
      'Bezoekers vormen in 0,05 seconde een mening over je website. Professioneel design wekt direct vertrouwen en houdt bezoekers langer vast.',
  },
  {
    number: '02',
    title: 'Meer conversies',
    description:
      'Doordacht ontwerp stuurt bezoekers naar de juiste actie. Elke pagina is gebouwd om resultaat te leveren.',
  },
  {
    number: '03',
    title: 'Herkenbaar en consistent',
    description:
      'Jouw merkidentiteit komt terug in elk detail: van kleuren en typografie tot de kleinste interacties.',
  },
  {
    number: '04',
    title: 'Mobiel-eerst ontwerp',
    description:
      'Meer dan 60% van het verkeer komt via mobiel. Elk ontwerp begint op het kleinste scherm en schaalt naadloos op.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Kennismaking & Briefing',
    description:
      'We starten met jouw verhaal. Wie ben je, wie is je doelgroep, en wat wil je bereiken? Op basis hiervan stellen we een creatieve briefing op.',
    imagePlaceholder: 'Afbeelding: Briefing',
  },
  {
    number: '02',
    title: 'Wireframes & Structuur',
    description:
      'We ontwerpen de blauwdruk van je website. Logische navigatie, duidelijke hiërarchie en een structuur die werkt voor jouw bezoekers.',
    imagePlaceholder: 'Afbeelding: Wireframe',
  },
  {
    number: '03',
    title: 'Visueel Ontwerp',
    description:
      'Je huisstijl wordt vertaald naar een prachtig design. Kleuren, typografie, beelden en animaties komen samen in een ontwerp dat past bij jouw merk.',
    imagePlaceholder: 'Afbeelding: Design',
  },
  {
    number: '04',
    title: 'Feedback & Oplevering',
    description:
      'Je geeft feedback, wij perfectioneren. Het definitieve ontwerp wordt development-ready opgeleverd, klaar om gebouwd te worden.',
    imagePlaceholder: 'Afbeelding: Oplevering',
  },
];

const usps = [
  {
    title: 'Geen templates, altijd maatwerk',
    description:
      'Elk ontwerp wordt vanaf nul opgebouwd. Geen standaard thema\'s, maar een uniek design dat past bij jouw merk en doelen.',
  },
  {
    title: 'Ontwerp + techniek onder één dak',
    description:
      'We ontwerpen niet alleen, we bouwen ook. Dat betekent designs die technisch haalbaar zijn en naadloos worden omgezet naar code.',
  },
  {
    title: 'Persoonlijke samenwerking',
    description:
      'Je werkt direct met de ontwerper, zonder tussenlagen. Korte lijnen, snelle feedback en een resultaat waar je écht achter staat.',
  },
];

const portfolioItems = [
  { title: 'BlueShipment', description: 'Website voor fulfilment center' },
  { title: 'Project 2', description: 'Binnenkort beschikbaar' },
  { title: 'Project 3', description: 'Binnenkort beschikbaar' },
];

const techGroups = [
  { label: 'Design', tools: ['Figma', 'Adobe Creative Suite'] },
  { label: 'Development', tools: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'] },
  { label: 'Platform', tools: ['Netlify', 'Supabase'] },
];

export function WebdesignPageClient() {
  const timelineSectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<SVGPathElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef<HTMLDivElement>(null);
  const timelineCleanupRef = useRef<(() => void) | null>(null);
  const uspImageRef = useRef<HTMLDivElement>(null);

  // Timeline line + dot animation (HowItWorxSection pattern)
  useEffect(() => {
    const section = timelineSectionRef.current;
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

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      timelineCleanupRef.current?.();
    };
  }, []);

  // Timeline container bottom alignment
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
    };

    updateTimelineEnd();
    const observer = new ResizeObserver(updateTimelineEnd);
    observer.observe(lastStep);
    return () => observer.disconnect();
  }, []);

  // Step content slide-in animation
  useEffect(() => {
    const section = timelineSectionRef.current;
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

  // USP image slide-in from right (AboutPageClient pattern)
  useEffect(() => {
    const el = uspImageRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set(el, { x: '100%' });
        gsap.to(el, {
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    );
  }, []);

  return (
    <main className="relative">
      {/* ── Section 1: Hero ── */}
      <section className="section relative min-h-screen flex flex-col justify-center">
        <div className="container-narrow">
          <FadeIn>
            <Link
              href="/diensten"
              className="text-small text-grey-olive hover:text-dry-sage transition-colors"
            >
              ← Terug naar diensten
            </Link>
          </FadeIn>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <TitleReveal
                as="h1"
                className="text-hero md:text-hero-lg font-bold text-cornsilk"
                triggerOnMount
              >
                Webdesign dat werkt
              </TitleReveal>
              <FadeIn delay={0.3}>
                <p className="mt-6 text-body text-dry-sage max-w-prose leading-relaxed">
                  Professioneel ontwerp dat jouw merk versterkt, bezoekers overtuigt en
                  resultaat oplevert. Geen standaard templates, maar maatwerk dat past bij
                  jouw visie.
                </p>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/contact" variant="primary">
                    Start jouw project
                  </Button>
                  <Button href="/cases" variant="outline">
                    Bekijk ons werk
                  </Button>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.4}>
              <div className="aspect-[16/10] bg-ebony flex items-center justify-center">
                <span className="text-grey-olive text-small">Afbeelding</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Section 2: Voordelen ── */}
      <section className="section relative overflow-hidden" aria-labelledby="benefits-title">
        <SectionTopBars />
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="benefits-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-16 text-center"
          >
            Waarom professioneel webdesign?
          </TitleReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <FadeIn key={benefit.number} delay={index * 0.1} className="h-full">
                <article className="group h-full p-6 bg-ink border border-ebony flex flex-col transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                  <div className="w-10 h-10 bg-ebony/50 flex items-center justify-center mb-4">
                    <span className="text-cornsilk font-mono text-small">{benefit.number}</span>
                  </div>
                  <h3 className="text-h3 font-semibold text-cornsilk">{benefit.title}</h3>
                  <p className="mt-3 text-body text-dry-sage leading-relaxed flex-1">
                    {benefit.description}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Proces / Tijdlijn ── */}
      <section
        ref={timelineSectionRef}
        className="section relative overflow-x-hidden"
        aria-labelledby="process-title"
      >
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="process-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Van idee tot ontwerp
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
              Ons bewezen webdesign proces in vier stappen.
            </p>
          </FadeIn>

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

              <div className="flex flex-col gap-16 md:gap-24">
                {processSteps.map((step, index) => (
                  <div
                    key={step.number}
                    ref={index === processSteps.length - 1 ? lastStepRef : undefined}
                    className={`relative flex pl-12 md:pl-0 ${
                      index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                    }`}
                  >
                    <div
                      className="timeline-dot absolute left-4 md:left-1/2 top-8 w-3 h-3 -translate-x-1/2 rounded-full bg-cornsilk border-2 border-ink z-10 opacity-0"
                      data-dot-index={index}
                      aria-hidden
                    />
                    <div
                      className={`step-content w-full max-w-[calc(100%-2rem)] md:max-w-[calc(50%-2rem)] opacity-0 ${
                        index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                      }`}
                    >
                      <div
                        className={`flex flex-col gap-4 ${
                          index % 2 === 0 ? 'md:items-end' : 'md:items-start'
                        }`}
                      >
                        <div>
                          <span className="text-small font-mono text-dry-sage" aria-hidden>
                            {step.number}
                          </span>
                          <h3 className="mt-2 text-h3 font-semibold text-cornsilk">{step.title}</h3>
                          <p className="mt-2 text-body text-dry-sage max-w-prose">
                            {step.description}
                          </p>
                        </div>
                        <div className="aspect-[4/3] w-full max-w-[280px] bg-ebony flex items-center justify-center">
                          <span className="text-grey-olive text-small">{step.imagePlaceholder}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Waarom Blitzworx (USPs) ── */}
      <section className="section relative overflow-hidden" aria-labelledby="usp-title">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <TitleReveal
                as="h2"
                id="usp-title"
                className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-12"
              >
                Waarom Blitzworx?
              </TitleReveal>
              <div className="space-y-8">
                {usps.map((usp, index) => (
                  <FadeIn key={usp.title} delay={index * 0.15}>
                    <div className="border-l-2 border-dry-sage pl-6">
                      <h3 className="text-h3 font-semibold text-cornsilk">{usp.title}</h3>
                      <p className="mt-2 text-body text-dry-sage leading-relaxed">
                        {usp.description}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
            <div
              ref={uspImageRef}
              className="aspect-[3/4] bg-ebony flex items-center justify-center overflow-hidden"
            >
              <span className="text-grey-olive text-small">Afbeelding</span>
            </div>
          </div>
        </div>
        <SectionBottomBars />
      </section>

      {/* ── Section 5: Portfolio Preview ── */}
      <section className="section relative overflow-hidden" aria-labelledby="portfolio-title">
        <SectionTopBars />
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="portfolio-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Ontwerp in actie
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-16">
              Een selectie van onze recente webdesign projecten.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {portfolioItems.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.15} className="h-full">
                <article className="group h-full bg-ink border border-ebony overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)]">
                  <div className="relative aspect-[4/3] bg-ebony flex items-center justify-center">
                    <span className="text-grey-olive text-small">Afbeelding</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-h3 font-semibold text-cornsilk">{item.title}</h3>
                    <p className="mt-2 text-small text-grey-olive">{item.description}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <FadeIn delay={0.4}>
              <Button href="/cases" variant="outline">
                Bekijk alle cases
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Section 6: Tools & Technologieen ── */}
      <section className="section relative" aria-labelledby="tech-title">
        <div className="container-narrow">
          <TitleReveal
            as="h2"
            id="tech-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-4 text-center"
          >
            Tools &amp; Technologieën
          </TitleReveal>
          <FadeIn>
            <p className="text-body text-dry-sage text-center max-w-prose mx-auto mb-12">
              We werken met de beste tools voor design en ontwikkeling.
            </p>
          </FadeIn>

          <div className="space-y-8">
            {techGroups.map((group, groupIndex) => (
              <FadeIn key={group.label} delay={groupIndex * 0.15}>
                <div className="text-center">
                  <h3 className="text-small font-semibold text-grey-olive uppercase tracking-widest mb-4">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {group.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center px-4 py-2 bg-ink border border-ebony text-small text-dry-sage hover:border-grey-olive hover:text-cornsilk transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: CTA ── */}
      <section
        className="section relative min-h-[60vh] flex flex-col justify-center items-center text-center border-t border-ebony"
        aria-labelledby="cta-title"
      >
        <div className="container-narrow flex flex-col items-center gap-8">
          <TitleReveal
            as="h2"
            id="cta-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk"
          >
            Klaar voor een website die indruk maakt?
          </TitleReveal>
          <FadeIn delay={0.2}>
            <p className="text-body text-dry-sage max-w-prose mx-auto">
              Laten we kennismaken en ontdekken hoe we jouw online doelen kunnen bereiken.
              Geen verplichtingen, gewoon een goed gesprek.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Button href="/contact" variant="primary">
              Plan een gesprek
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
