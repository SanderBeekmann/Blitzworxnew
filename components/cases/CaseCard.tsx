'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Case } from '@/lib/cases';

interface CaseCardProps {
  caseItem: Case;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <Link
      href={`/cases/${caseItem.slug}`}
      className="group relative flex flex-col h-full rounded-md border border-ebony/40 hover:border-dry-sage/30 bg-ink transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
    >
      {/* Image area — no crop, full image visible */}
      <div className="relative overflow-hidden rounded-t-md bg-ebony/20">
        {caseItem.imagePlaceholder ? (
          <div
            className="flex items-center justify-center py-24"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgba(84,92,82,0.25) 0%, rgba(4,7,17,0.95) 70%)',
            }}
          >
            <span className="text-h3 font-semibold text-ebony/30">{caseItem.client}</span>
          </div>
        ) : (
          <div className="relative">
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              width={760}
              height={570}
              sizes="(max-width: 768px) 85vw, 380px"
              className="w-full h-auto"
            />
            {/* Subtle bottom fade into text area */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, var(--ink-black), transparent)',
              }}
              aria-hidden
            />
          </div>
        )}
      </div>

      {/* Text area */}
      <div className="px-5 pb-5 pt-3 flex-1 flex flex-col min-h-0">
        <h3 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors duration-500">
          {caseItem.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-small text-grey-olive">{caseItem.client}</p>
          <span className="text-caption font-mono text-grey-olive/40">{caseItem.year}</span>
        </div>
      </div>
    </Link>
  );
}
