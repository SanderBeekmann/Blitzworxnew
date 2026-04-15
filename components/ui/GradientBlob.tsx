interface GradientBlobProps {
  className?: string;
  /** Animation duration in seconds (default 20) */
  duration?: number;
  /** Animation delay in seconds (default 0) */
  delay?: number;
}

export function GradientBlob({ className = '', duration = 20, delay = 0 }: GradientBlobProps) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none select-none ${className}`}
      style={{
        // Bake the "blur" into the gradient stops instead of filter: blur(48px).
        // filter: blur repaints the whole element every frame during scroll/animation
        // and was the primary cause of jank around the marquee.
        background:
          'radial-gradient(ellipse at center, var(--ebony) 0%, color-mix(in srgb, var(--ebony) 50%, transparent) 40%, transparent 80%)',
        animation: `blob-drift ${duration}s ease-in-out ${delay}s infinite alternate`,
        willChange: 'transform',
      }}
      aria-hidden
    />
  );
}
