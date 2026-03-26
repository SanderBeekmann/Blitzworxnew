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
      className={`absolute rounded-full blur-3xl pointer-events-none select-none ${className}`}
      style={{
        background: 'radial-gradient(ellipse at center, var(--ebony), transparent 80%)',
        animation: `blob-drift ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
      aria-hidden
    />
  );
}
