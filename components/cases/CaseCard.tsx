'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Case } from '@/lib/cases';

interface CaseCardProps {
  caseItem: Case;
  headingAs?: 'h3' | 'span';
}

export function CaseCard({ caseItem, headingAs: Heading = 'h3' }: CaseCardProps) {
  return (
    <Link
      href={`/cases/${caseItem.slug}`}
      className="group relative flex flex-col h-full rounded-md border border-white/[0.08] hover:border-dry-sage/20 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(202,202,170,0.04) 100%)' }}
    >
      {/* Image area — fixed aspect ratio for consistent card heights */}
      <div className="relative overflow-hidden rounded-t-md bg-ebony/20 aspect-[4/3]">
        {caseItem.imagePlaceholder ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgba(84,92,82,0.25) 0%, rgba(4,7,17,0.95) 70%)',
            }}
          >
            <span className="text-h3 font-semibold text-ebony/30">{caseItem.client}</span>
          </div>
        ) : (
          <>
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              width={760}
              height={570}
              sizes="(max-width: 768px) 85vw, 380px"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle bottom fade into text area */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(4,7,17,0.8), transparent)',
              }}
              aria-hidden
            />
          </>
        )}
      </div>

      {/* Text area */}
      <div className="px-5 pb-5 pt-3 flex flex-col min-h-[6.5rem]">
        <Heading className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors duration-500">
          {caseItem.title}
        </Heading>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="text-small text-grey-olive">{caseItem.client}</p>
          <span className="text-caption font-mono text-grey-olive/40">{caseItem.year}</span>
        </div>
      </div>
    </Link>
  );
}
