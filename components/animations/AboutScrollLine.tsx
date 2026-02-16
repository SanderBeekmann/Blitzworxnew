'use client';

import { useEffect, useRef, useId } from 'react';

const SVG_PATH =
  'M 500,0 C 500,400 100,600 150,1000 C 200,1400 850,1300 850,1800 C 850,2000 700,2000 700,1850 C 700,1700 850,1700 850,2000 C 850,2500 150,2800 150,3300 C 150,3800 800,3800 500,4000';

const DRY_SAGE = 'var(--dry-sage)';
const INK = 'var(--ink-black)';
const GRADIENT_SAMPLES = 80;
const TEXT_PADDING = 6;

function getTextRects(): DOMRect[] {
  const aboutPage = document.getElementById('about-page');
  if (!aboutPage) return [];
  const elements = aboutPage.querySelectorAll('h1, h2, h3, p');
  return Array.from(elements)
    .map((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      return new DOMRect(
        rect.left - TEXT_PADDING,
        rect.top - TEXT_PADDING,
        rect.width + TEXT_PADDING * 2,
        rect.height + TEXT_PADDING * 2
      );
    })
    .filter((r): r is DOMRect => r !== null);
}

function isPointInRects(x: number, y: number, rects: DOMRect[]): boolean {
  return rects.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function AboutScrollLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const gradientId = useId().replace(/:/g, '-');

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const gradient = gradientRef.current;
    if (!container || !path || !gradient) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      path.style.strokeDashoffset = '0';
      return;
    }

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const updateGradient = () => {
      const containerRect = container.getBoundingClientRect();
      if (containerRect.width <= 0 || containerRect.height <= 0) return;

      const textRects = getTextRects();

      const stops: { offset: number; overText: boolean }[] = [];
      for (let i = 0; i <= GRADIENT_SAMPLES; i++) {
        const t = i / GRADIENT_SAMPLES;
        const pt = path.getPointAtLength(t * pathLength);
        const viewportX = containerRect.left + (pt.x / 1000) * containerRect.width;
        const viewportY = containerRect.top + (pt.y / 4000) * containerRect.height;
        const overText = isPointInRects(viewportX, viewportY, textRects);
        const offset = Math.round((pt.y / 4000) * 1000) / 1000;
        stops.push({ offset: Math.max(0, Math.min(1, offset)), overText });
      }
      stops.sort((a, b) => a.offset - b.offset);
      const merged = new Map<number, boolean>();
      stops.forEach(({ offset, overText }) => {
        merged.set(offset, (merged.get(offset) ?? false) || overText);
      });
      gradient.innerHTML = '';
      const entries = Array.from(merged.entries()).sort(([a], [b]) => a - b);
      if (entries.length === 0) {
        const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop.setAttribute('offset', '0');
        stop.setAttribute('stop-color', DRY_SAGE);
        gradient.appendChild(stop);
      } else {
        entries.forEach(([offset, overText]) => {
          const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          stop.setAttribute('offset', String(offset));
          stop.setAttribute('stop-color', overText ? INK : DRY_SAGE);
          gradient.appendChild(stop);
        });
      }
    };

    const updateLine = () => {
      const heroTitle = document.getElementById('about-hero-title');
      if (!heroTitle) return;

      const heroRect = heroTitle.getBoundingClientRect();
      const lineStartY = heroRect.bottom + window.scrollY;
      const viewportCenterY = window.scrollY + window.innerHeight / 2;
      const docHeight = document.documentElement.scrollHeight;

      const lineEndY = docHeight;
      const lineLength = lineEndY - lineStartY;

      if (lineLength <= 0) return;

      const progress =
        viewportCenterY <= lineStartY
          ? 0
          : viewportCenterY >= lineEndY
            ? 1
            : (viewportCenterY - lineStartY) / lineLength;

      path.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
      updateGradient();
    };

    const updateContainer = () => {
      const heroTitle = document.getElementById('about-hero-title');
      if (!heroTitle || !container) return;

      const heroRect = heroTitle.getBoundingClientRect();
      const startY = heroRect.bottom + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const height = docHeight - startY;

      container.style.top = `${startY}px`;
      container.style.height = `${height}px`;
    };

    const init = () => {
      updateContainer();
      updateGradient();
      updateLine();
    };

    const handleResize = debounce(() => {
      updateContainer();
      updateLine();
    }, 50);

    init();
    requestAnimationFrame(init);
    const timeout100 = setTimeout(init, 100);
    const timeout300 = setTimeout(init, 300);
    const timeout500 = setTimeout(init, 500);

    window.addEventListener('scroll', updateLine, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);

    const aboutPage = document.getElementById('about-page');
    if (aboutPage) resizeObserver.observe(aboutPage);

    return () => {
      clearTimeout(timeout100);
      clearTimeout(timeout300);
      clearTimeout(timeout500);
      window.removeEventListener('scroll', updateLine);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      vv?.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute left-0 right-0 z-10"
      style={{ top: 0, height: '100%' }}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 4000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            ref={gradientRef}
            id={`line-gradient-${gradientId}`}
            x1="500"
            y1="0"
            x2="500"
            y2="4000"
            gradientUnits="userSpaceOnUse"
          />
        </defs>
        <path
          ref={pathRef}
          d={SVG_PATH}
          fill="none"
          stroke={`url(#line-gradient-${gradientId})`}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 2px rgba(202, 202, 170, 0.3))' }}
        />
      </svg>
    </div>
  );
}
