'use client';

import { useEffect, useRef, useState } from 'react';

const codeLines = [
  { indent: 0, parts: [{ text: 'const', cls: 'text-dry-sage' }, { text: ' project', cls: 'text-cornsilk' }, { text: ' = {', cls: 'text-dry-sage' }] },
  { indent: 1, parts: [{ text: 'framework: ', cls: 'text-grey-olive' }, { text: "'Next.js'", cls: 'text-cornsilk' }, { text: ',', cls: 'text-grey-olive' }] },
  { indent: 1, parts: [{ text: 'database: ', cls: 'text-grey-olive' }, { text: "'Supabase'", cls: 'text-cornsilk' }, { text: ',', cls: 'text-grey-olive' }] },
  { indent: 1, parts: [{ text: 'deploy: ', cls: 'text-grey-olive' }, { text: "'Netlify'", cls: 'text-cornsilk' }, { text: ',', cls: 'text-grey-olive' }] },
  { indent: 1, parts: [{ text: 'quality: ', cls: 'text-grey-olive' }, { text: "'production-grade'", cls: 'text-cornsilk' }, { text: ',', cls: 'text-grey-olive' }] },
  { indent: 0, parts: [{ text: '}', cls: 'text-dry-sage' }] },
  { indent: 0, parts: [] },
  { indent: 0, parts: [{ text: 'await', cls: 'text-dry-sage' }, { text: ' build', cls: 'text-cornsilk' }, { text: '(project)', cls: 'text-grey-olive' }] },
];

export function TypingTerminal() {
  const [visibleChars, setVisibleChars] = useState(0);
  const [started, setStarted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const totalChars = codeLines.reduce((sum, line) => {
    const lineChars = line.parts.reduce((s, p) => s + p.text.length, 0);
    return sum + lineChars + 1;
  }, 0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleChars(totalChars);
      return;
    }

    const startTimer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(startTimer);
  }, [totalChars]);

  useEffect(() => {
    if (!started || visibleChars >= totalChars) return;

    const speed = 30 + Math.random() * 40;
    const timer = setTimeout(() => {
      setVisibleChars((v) => v + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [started, visibleChars, totalChars]);

  const renderLines = () => {
    let charCount = 0;
    return codeLines.map((line, lineIdx) => {
      const lineContent: JSX.Element[] = [];
      const indent = '  '.repeat(line.indent);

      if (line.parts.length === 0) {
        charCount += 1;
        return <p key={lineIdx} className="h-5">&nbsp;</p>;
      }

      let lineVisible = false;
      line.parts.forEach((part, partIdx) => {
        const partChars: JSX.Element[] = [];
        for (let i = 0; i < part.text.length; i++) {
          const isVisible = charCount < visibleChars;
          if (isVisible) lineVisible = true;
          partChars.push(
            <span
              key={i}
              style={{ opacity: isVisible ? 1 : 0 }}
            >
              {part.text[i]}
            </span>
          );
          charCount++;
        }
        lineContent.push(
          <span key={partIdx} className={part.cls}>
            {partChars}
          </span>
        );
      });
      charCount++;

      const isCurrentLine = charCount >= visibleChars && charCount - (line.parts.reduce((s, p) => s + p.text.length, 0) + 1) < visibleChars;

      return (
        <p key={lineIdx} className="text-grey-olive" style={{ opacity: lineVisible ? 1 : 0.15 }}>
          {indent && <span>{indent}</span>}
          {lineContent}
          {isCurrentLine && visibleChars < totalChars && (
            <span className="text-cornsilk animate-pulse ml-px">&#9612;</span>
          )}
        </p>
      );
    });
  };

  return (
    <div ref={terminalRef} className="relative bg-ink border border-ebony overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ebony bg-ink">
        <span className="w-2.5 h-2.5 rounded-full bg-grey-olive/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-grey-olive/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-grey-olive/50" />
        <span className="ml-3 text-caption text-grey-olive font-mono">blitzworx.dev</span>
      </div>
      <div className="p-6 font-mono text-small leading-relaxed space-y-1">
        {renderLines()}
        {visibleChars >= totalChars && (
          <p className="mt-3 text-grey-olive">
            <span className="text-dry-sage">&rarr;</span>{' '}
            <span className="text-cornsilk animate-pulse">&#9612;</span>
          </p>
        )}
      </div>
    </div>
  );
}
