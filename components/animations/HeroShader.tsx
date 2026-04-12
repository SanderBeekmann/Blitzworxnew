'use client';

import { GrainGradient } from '@paper-design/shaders-react';

export function HeroShader({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
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
        speed={1}
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
