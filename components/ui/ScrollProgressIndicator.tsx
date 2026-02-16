'use client';

import { useEffect, useState } from 'react';

export function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrolled);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] h-20 w-[3px] pointer-events-none"
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 w-full bg-cornsilk"
        style={{ height: `${progress}%` }}
      >
        {progress > 0 && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[3px] h-[3px] rounded-full bg-cornsilk shadow-[0_0_10px_3px_rgba(254,250,220,0.6)]"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
