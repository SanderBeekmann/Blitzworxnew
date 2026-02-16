import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cases } from '@/lib/cases';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

export const metadata: Metadata = {
  title: 'Cases',
  alternates: { canonical: '/cases' },
  description:
    'Bekijk onze recente projecten. Van webdesign tot development en branding: cases die laten zien wat Blitzworx kan.',
};

export default function CasesPage() {
  return (
    <section className="section" aria-labelledby="cases-title">
      <div className="container-narrow">
        <header className="py-24 md:py-36">
          <TitleReveal
            as="h1"
            id="cases-title"
            className="text-hero md:text-hero-xl font-bold text-cornsilk mb-24"
          >
            Cases
          </TitleReveal>
        </header>
        <ul className="space-y-16">
          {cases.map((caseItem, index) => (
            <li key={caseItem.slug}>
              <FadeIn delay={index * 0.1}>
                <article className="group/case grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="relative aspect-video rounded-md overflow-hidden bg-ebony">
                    {caseItem.imagePlaceholder ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink">
                        <span className="text-body font-medium text-grey-olive">Coming soon</span>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={caseItem.image}
                          alt={caseItem.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover/case:scale-105"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none origin-center scale-100 opacity-100 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover/case:scale-150 group-hover/case:opacity-0 motion-reduce:transition-none"
                          style={{
                            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(4,7,17,0.35) 45%, rgba(4,7,17,0.85) 100%)',
                          }}
                          aria-hidden
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <h2 className="text-h2 font-bold text-cornsilk">{caseItem.title}</h2>
                    <p className="mt-2 text-small text-grey-olive">{caseItem.client} · {caseItem.year}</p>
                    <p className="mt-4 text-body text-dry-sage max-w-prose">{caseItem.description}</p>
                    <Link
                      href={`/cases/${caseItem.slug}`}
                      className="mt-6 inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
                    >
                      Lees de gehele case
                    </Link>
                  </div>
                </article>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
