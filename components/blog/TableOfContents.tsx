'use client';

import { useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings, className }: { headings: Heading[]; className?: string }) {
  const [open, setOpen] = useState(true);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Inhoudsopgave"
      className={`border border-ebony rounded-sm bg-ink/50 p-6 ${className ?? ''}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-h3 font-bold text-cornsilk">Inhoudsopgave</span>
        <span className="text-grey-olive text-small">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <ul className="mt-4 space-y-2">
          {headings.map((h) => (
            <li
              key={h.id}
              className={`flex items-baseline gap-2 ${h.level === 3 ? 'ml-5' : ''}`}
            >
              <span className="text-grey-olive shrink-0">-</span>
              <a
                href={`#${h.id}`}
                className="text-dry-sage hover:text-cornsilk transition-colors text-body leading-relaxed"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
