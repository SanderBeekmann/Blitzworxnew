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
      className="group flex flex-col h-full overflow-hidden rounded-md bg-ink border border-transparent hover:border-grey-olive transition-all duration-500 ease-in-out delay-200 hover:delay-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <Image
          src={caseItem.image}
          alt={caseItem.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
        />
        {caseItem.imageHover && (
          <Image
            src={caseItem.imageHover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] absolute inset-0"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none origin-center scale-100 opacity-100 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-150 group-hover:opacity-0 motion-reduce:transition-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(4,7,17,0.35) 45%, rgba(4,7,17,0.85) 100%)',
          }}
          aria-hidden
        />
      </div>
      <div className="p-6 flex-1 flex flex-col min-h-0">
        <h3 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors duration-500 ease-in-out delay-200 group-hover:delay-0">
          {caseItem.title}
        </h3>
        <p className="mt-2 text-small text-grey-olive">{caseItem.client}</p>
      </div>
    </Link>
  );
}
