'use client';

import { useEffect, useRef } from 'react';

function getScoreColor(score: number): string {
  if (score < 4) return '#c45c5c';
  if (score < 7) return '#c4a85c';
  return 'var(--dry-sage)';
}

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ score, size = 80, label }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const strokeWidth = size < 100 ? 4 : 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = circumference - (score / 10) * circumference;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.strokeDashoffset = String(target);
      return;
    }

    el.style.strokeDashoffset = String(circumference);
    import('gsap').then(({ gsap }) => {
      gsap.to(el, {
        strokeDashoffset: target,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.3,
      });
    });
  }, [target, circumference]);

  const fontSize = size < 100 ? size * 0.28 : size * 0.3;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--ebony)"
            strokeWidth={strokeWidth}
            opacity={0.4}
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-cornsilk"
          style={{ fontSize, lineHeight: 1 }}
        >
          {score.toFixed(1)}
        </span>
      </div>
      {label && (
        <span className="text-small font-semibold text-cornsilk">{label}</span>
      )}
    </div>
  );
}
