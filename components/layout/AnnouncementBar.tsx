'use client';

import { useState, useEffect } from 'react';
import { projectsInProgress } from '@/lib/announcements';

interface AnnouncementBarProps {
  showBackground: boolean;
  aboutHeroTransparent: boolean;
}

const ROTATE_INTERVAL_MS = 4000;

export function AnnouncementBar({ showBackground, aboutHeroTransparent }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (projectsInProgress.length <= 1) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % projectsInProgress.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (projectsInProgress.length === 0) return null;
  if (!showBackground || aboutHeroTransparent) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 text-small bg-ink/95 backdrop-blur-sm text-grey-olive border-t border-b border-ebony">
      <span className="shrink-0">Lopende projecten</span>
      <div className="relative min-h-[1.25rem] flex items-center justify-center min-w-0 overflow-hidden">
        {projectsInProgress.map((project, i) => (
          <p
            key={`${project.company}-${project.type}`}
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-center truncate px-2 transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title={`${project.type}: ${project.company}`}
          >
            {project.type}: <span className="font-semibold text-cornsilk">{project.company}</span>
          </p>
        ))}
      </div>
      <span className="shrink-0 invisible" aria-hidden>Lopende projecten</span>
    </div>
  );
}
