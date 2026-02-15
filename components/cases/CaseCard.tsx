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
      className="group block overflow-hidden rounded-md bg-ink border border-transparent hover:border-grey-olive transition-all duration-500 ease-in-out"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={caseItem.image}
          alt={caseItem.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {caseItem.imageHover && (
          <Image
            src={caseItem.imageHover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out absolute inset-0"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500 ease-in-out pointer-events-none"
          aria-hidden
        />
      </div>
      <div className="p-6">
        <h3 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors duration-500 ease-in-out">
          {caseItem.title}
        </h3>
        <p className="mt-2 text-small text-grey-olive">{caseItem.client}</p>
      </div>
    </Link>
  );
}
