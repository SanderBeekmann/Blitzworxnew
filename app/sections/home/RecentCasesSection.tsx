import Image from 'next/image';
import Link from 'next/link';
import { cases } from '@/lib/cases';
import { CaseCard } from '@/components/cases/CaseCard';

const recentCases = cases.slice(0, 2);

export function RecentCasesSection() {
  return (
    <section className="section" aria-labelledby="recent-cases-title">
      <div className="container-narrow">
        <h2 id="recent-cases-title" className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-12">
          Recent Cases
        </h2>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {recentCases.map((caseItem) => (
            <CaseCard key={caseItem.slug} caseItem={caseItem} />
          ))}
        </div>
      </div>
    </section>
  );
}
