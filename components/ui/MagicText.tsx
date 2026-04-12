'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface WordProps {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: number[];
  className?: string;
}

const Word = ({ children, progress, range, className }: WordProps) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className={`mr-1 ${className ?? ''}`}>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

interface MagicTextProps {
  text: string;
  className?: string;
  scrollOffset?: [string, string];
}

export function MagicText({ text, className, scrollOffset = ['start 0.9', 'start 0.25'] }: MagicTextProps) {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: scrollOffset as unknown as ["start 0.9", "start 0.25"],
  });

  const tokens = text.split(/(\n\n|\n)/).flatMap((segment) =>
    segment === '\n\n' ? ['\n\n'] : segment === '\n' ? ['\n'] : segment.split(' ').filter(Boolean),
  );

  return (
    <p ref={container} className={`flex flex-wrap ${className ?? ''}`}>
      {tokens.map((token, i) => {
        if (token === '\n\n') {
          return <span key={i} className="w-full h-4" aria-hidden />;
        }
        if (token === '\n') {
          return <span key={i} className="w-full" aria-hidden />;
        }

        const start = i / tokens.length;
        const end = start + 1 / tokens.length;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {token}
          </Word>
        );
      })}
    </p>
  );
}
