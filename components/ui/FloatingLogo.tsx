'use client';

import { BlitzworxGraphic } from './BlitzworxGraphic';

interface FloatingLogoProps {
  className?: string;
}

export function FloatingLogo({ className = '' }: FloatingLogoProps) {
  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        animation: 'blob-drift 18s ease-in-out 4s infinite alternate',
      }}
      aria-hidden
    >
      <BlitzworxGraphic className="w-[350px] h-auto opacity-10" />
    </div>
  );
}
