import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cases } from '@/lib/cases';
import { CaseDetailContent } from '@/components/cases/CaseDetailContent';

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = cases.find((c) => c.slug === slug);
  if (!caseItem) return { title: 'Case niet gevonden' };
  return {
    title: caseItem.title,
    description: caseItem.description,
  };
}

export default async function CaseDetailPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseItem = cases.find((c) => c.slug === slug);

  if (!caseItem) {
    notFound();
  }

  return <CaseDetailContent caseItem={caseItem} />;
}
