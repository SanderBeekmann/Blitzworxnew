'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Case } from '@/lib/cases';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';

interface CaseDetailContentProps {
  caseItem: Case;
}

export function CaseDetailContent({ caseItem }: CaseDetailContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const images = caseItem.images ?? [caseItem.image, caseItem.imageHover].filter(Boolean);
  const paragraphs = (caseItem.fullStory ?? caseItem.description).split(/\n\n+/);

  useEffect(() => {
    if (images.length <= 1) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const updateImageIndex = () => {
      const content = contentRef.current;
      if (!content) return;

      const rect = content.getBoundingClientRect();
      const contentTop = rect.top + window.scrollY;
      const contentHeight = content.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const scrollableHeight = Math.max(0, contentHeight - viewportHeight);
      const scrolled = scrollY - contentTop;
      const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, scrolled / scrollableHeight)) : 0;

      const index = Math.min(
        Math.floor(progress * images.length),
        images.length - 1
      );
      setImageIndex(index);
    };

    updateImageIndex();
    window.addEventListener('scroll', updateImageIndex, { passive: true });
    window.addEventListener('resize', updateImageIndex);
    return () => {
      window.removeEventListener('scroll', updateImageIndex);
      window.removeEventListener('resize', updateImageIndex);
    };
  }, [images.length]);

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

        <div className="mt-16 grid lg:grid-cols-[1fr,minmax(320px,420px)] lg:gap-16 xl:gap-24 items-start">
          <div ref={contentRef} className="min-h-[60vh]">
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
              </div>
            </FadeIn>
          </div>

          <div className="hidden lg:block sticky top-24">
            <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-ebony">
              {images.map((src, i) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === imageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${caseItem.title} - afbeelding ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 lg:hidden">
          <div className="relative aspect-video rounded-md overflow-hidden bg-ebony">
            <Image
              src={images[imageIndex]}
              alt={caseItem.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </article>
  );
}
