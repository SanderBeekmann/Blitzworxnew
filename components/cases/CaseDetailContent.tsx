'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Case } from '@/lib/cases';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

function CaseVideo({ src, title }: { src: string; title: string }) {
  return (
    <div className="rounded-md overflow-hidden bg-ink-black border border-ebony">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto block"
        aria-label={`${title} — scroll demo`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}


interface CaseDetailContentProps {
  caseItem: Case;
}

export function CaseDetailContent({ caseItem }: CaseDetailContentProps) {
  const paragraphs = (caseItem.fullStory ?? caseItem.description).split(/\n\n+/);

  return (
    <article className="section">
      <div className="container-narrow">
        <header className="py-24 md:py-36">
          <FadeIn>
            <Link
              href="/cases"
              className="text-small text-grey-olive hover:text-dry-sage transition-colors"
            >
              ← Terug naar cases
            </Link>
          </FadeIn>
          <div className="mt-8">
            <TitleReveal
              as="h1"
              className="text-hero md:text-hero-xl font-bold text-cornsilk"
            >
              {caseItem.title}
            </TitleReveal>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-body text-grey-olive">
                {caseItem.client} · {caseItem.year}
              </p>
            </FadeIn>
          </div>
        </header>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <FadeIn delay={0.2}>
            <div className="max-w-prose">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-body text-dry-sage leading-relaxed ${i > 0 ? 'mt-6' : ''}`}
                >
                  {paragraph}
                </p>
              ))}
              <div className="mt-10 flex flex-wrap gap-4">
                {caseItem.websiteUrl && (
                  <a
                    href={caseItem.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk hover:shadow-[0_0_32px_rgba(254,250,220,0.18)] transition-colors transition-shadow duration-300"
                    aria-label="Bezoek de website (opent in nieuw tabblad)"
                  >
                    Bezoek de website
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 font-medium rounded-md btn-secondary-cta"
                >
                  Neem contact op
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Video + hero image */}
          <FadeIn delay={0.3}>
            <div className="space-y-6">
              {caseItem.video && (
                <CaseVideo src={caseItem.video} title={caseItem.title} />
              )}

              {!caseItem.imagePlaceholder && (
                <div className="rounded-md overflow-hidden bg-ink-black">
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    width={760}
                    height={570}
                    className="w-full h-auto block"
                    sizes="(max-width: 1024px) 90vw, 45vw"
                  />
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Testimonial */}
        {caseItem.testimonial && (
          <div className="mt-16 md:mt-24">
            <FadeIn delay={0.2}>
              <blockquote className="relative p-6 md:p-8 rounded-md bg-dry-sage border border-ebony">
                <p className="text-body text-ink leading-relaxed">
                  &ldquo;{caseItem.testimonial.quote}&rdquo;
                </p>
                <div className="flex gap-1 mt-4" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-ink shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <footer className="mt-6 pt-4 border-t border-[rgba(4,7,17,0.8)]">
                  <cite className="not-italic">
                    <span className="font-semibold text-ink block">
                      {caseItem.testimonial.author}
                    </span>
                    <span className="text-small text-[rgba(4,7,17,0.8)]">
                      {caseItem.testimonial.role} · {caseItem.client}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </FadeIn>
          </div>
        )}
      </div>
    </article>
  );
}
