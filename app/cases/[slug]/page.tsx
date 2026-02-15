import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cases } from '@/lib/cases';
import { FadeIn } from '@/components/animations/FadeIn';

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

  return (
    <article className="section">
      <div className="container-narrow">
        <FadeIn>
          <Link
            href="/cases"
            className="text-small text-grey-olive hover:text-dry-sage transition-colors"
          >
            ← Terug naar cases
          </Link>
        </FadeIn>
        <div className="mt-8">
          <FadeIn delay={0.1}>
            <h1 className="text-hero md:text-hero-lg font-bold text-cornsilk">
              {caseItem.title}
            </h1>
            <p className="mt-2 text-body text-grey-olive">
              {caseItem.client} · {caseItem.year}
            </p>
          </FadeIn>
          <div className="mt-12 relative aspect-video rounded-md overflow-hidden bg-ebony">
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-12 max-w-prose">
              <p className="text-body text-dry-sage leading-relaxed">{caseItem.description}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </article>
  );
}
