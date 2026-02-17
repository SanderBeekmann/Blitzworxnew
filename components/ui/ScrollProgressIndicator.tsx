'use client';

import { useEffect, useState, useRef } from 'react';

export function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrolled);
      rafId.current = null;
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 z-[100] h-20 w-[3px] pointer-events-none"
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 w-full h-full bg-cornsilk origin-top"
        style={{ transform: `scaleY(${progress / 100})` }}
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
