'use client';

import { useEffect, useRef, useState } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

export function HeroShader({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pause the WebGL shader when scrolled past the hero. Without this, the
    // canvas keeps running its animation loop for the entire page and
    // competes with the marquee + scroll handlers further down.
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: '100px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <GrainGradient
        style={{ height: '100%', width: '100%' }}
        colorBack="hsl(225, 64%, 3%)"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={inView ? 1 : 0}
        colors={[
          'hsl(50, 93%, 93%)',
          'hsl(52, 35%, 75%)',
          'hsl(133, 8%, 40%)',
          'hsl(133, 8%, 35%)',
          'hsl(133, 8%, 28%)',
        ]}
      />
    </div>
  );
}
