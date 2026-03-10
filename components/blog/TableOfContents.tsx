'use client';

import { useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(true);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Inhoudsopgave"
      className="my-8 border border-ebony rounded-sm bg-ink/50 p-6"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-h3 font-bold text-cornsilk">Inhoudsopgave</span>
        <span className="text-grey-olive text-small">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <ol className="mt-4 space-y-2">
          {headings.map((h) => (
            <li
              key={h.id}
              className={h.level === 3 ? 'ml-5' : ''}
            >
              <a
                href={`#${h.id}`}
                className="text-dry-sage hover:text-cornsilk transition-colors text-body leading-relaxed"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
