'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/Button';
import type { ContentSection } from './page';
import { useState } from 'react';

interface Props {
  title: string;
  sections: ContentSection[];
  faqItems: Array<{ question: string; answer: string }>;
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-cornsilk font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cornsilk underline underline-offset-2 hover:text-dry-sage transition-colors">$1</a>')
    .replace(/\n/g, '<br />');
}

function Paragraph({ text }: { text: string }) {
  return (
    <p
      className="text-body text-dry-sage leading-relaxed"
      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
    />
  );
}

function extractParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('-'));
}

function extractListItems(body: string): string[] {
  return body
    .split('\n')
    .filter((l) => l.trim().startsWith('- '))
    .map((l) => l.trim().slice(2));
}

function extractBlockquote(body: string): string | null {
  const match = body.match(/^> "?(.+?)"?\s*$/m);
  return match ? match[1].replace(/^"|"$/g, '') : null;
}

// --- Section renderers ---

function HeroSection({ section }: { section: ContentSection }) {
  const paragraphs = extractParagraphs(section.body);

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-[0.07] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--dry-sage), transparent 70%)',
        }}
        aria-hidden
      />

      <div className="container-narrow relative">
        <FadeIn>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-small text-grey-olive mb-12">
            <Link href="/" className="hover:text-dry-sage transition-colors">Home</Link>
            <span>/</span>
            <Link href="/diensten" className="hover:text-dry-sage transition-colors">Diensten</Link>
            <span>/</span>
            <span className="text-dry-sage">Lokaal</span>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-hero md:text-hero-lg lg:text-hero-xl font-bold text-cornsilk tracking-tight max-w-3xl">
            {section.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-8 max-w-2xl space-y-4">
            {paragraphs.slice(0, 2).map((p, i) => (
              <Paragraph key={i} text={p} />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">Plan een gesprek</Button>
            <Button href="/diensten" variant="outline">Bekijk diensten</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ProblemSection({ section }: { section: ContentSection }) {
  const paragraphs = extractParagraphs(section.body);
  const listItems = extractListItems(section.body);

  const introParagraphs = paragraphs.filter((p) => !p.startsWith('-')).slice(0, 2);
  const closingParagraphs = paragraphs.length > 2
    ? paragraphs.filter((p) => !p.startsWith('-')).slice(2)
    : [];

  return (
    <section className="section border-t border-ebony/60">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk max-w-2xl">
            {section.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-6 max-w-2xl space-y-4">
            {introParagraphs.map((p, i) => (
              <Paragraph key={i} text={p} />
            ))}
          </div>
        </FadeIn>

        {listItems.length > 0 && (
          <FadeIn delay={0.25}>
            <ul className="mt-8 max-w-2xl space-y-4">
              {listItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-body text-dry-sage leading-relaxed">
                  <span className="text-grey-olive mt-1.5 shrink-0" aria-hidden>
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 8h12M10 4l4 4-4 4" />
                    </svg>
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        {closingParagraphs.length > 0 && (
          <FadeIn delay={0.35}>
            <div className="mt-8 max-w-2xl space-y-3">
              {closingParagraphs.map((p, i) => {
                const isResolution = i === closingParagraphs.length - 1;
                return isResolution ? (
                  <p
                    key={i}
                    className="text-body text-cornsilk font-semibold"
                    dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(p) }}
                  />
                ) : (
                  <Paragraph key={i} text={p} />
                );
              })}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function SolutionSection({ section }: { section: ContentSection }) {
  const paragraphs = extractParagraphs(section.body);
  const usps = paragraphs.filter((p) => p.startsWith('**'));
  const introParagraphs = paragraphs.filter((p) => !p.startsWith('**'));

  return (
    <section className="section border-t border-ebony/60">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk">{section.title}</h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-6 max-w-2xl space-y-4">
            {introParagraphs.slice(0, 3).map((p, i) => (
              <Paragraph key={i} text={p} />
            ))}
          </div>
        </FadeIn>

        {usps.length > 0 && (
          <FadeIn delay={0.25}>
            <ul className="mt-8 max-w-2xl space-y-5">
              {usps.map((usp, i) => {
                const titleMatch = usp.match(/^\*\*(.+?)\*\*\.?\s*([\s\S]*)/);
                const uspTitle = titleMatch ? titleMatch[1] : '';
                const uspBody = titleMatch ? titleMatch[2] : usp;

                return (
                  <li key={i} className="flex gap-3">
                    <span className="text-dry-sage/50 mt-1 shrink-0" aria-hidden>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 8.5l4 4 8-9" />
                      </svg>
                    </span>
                    <div>
                      <span className="text-body font-semibold text-cornsilk">{uspTitle}</span>
                      {uspBody && (
                        <span className="text-body text-dry-sage/80"> {uspBody}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function ServicesSection({ section }: { section: ContentSection }) {
  const items = section.items ?? [];

  return (
    <section className="section border-t border-ebony/60">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk">{section.title}</h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <ul className="mt-8 max-w-2xl space-y-6">
            {items.map((item, i) => (
              <li key={i} className="border-l-2 border-ebony/40 pl-5">
                <h3 className="text-body font-semibold text-cornsilk">{item.title}</h3>
                <p className="mt-1 text-small text-dry-sage/80 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

function TestimonialSection({ section }: { section: ContentSection }) {
  const quote = extractBlockquote(section.body);
  const paragraphs = extractParagraphs(section.body.replace(/^>.*$/m, ''));

  return (
    <section className="section">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk text-center mb-12">
            {section.title}
          </h2>
        </FadeIn>

        {quote && (
          <FadeIn delay={0.15}>
            <div className="flex justify-center">
              <blockquote className="max-w-2xl p-6 md:p-8 bg-dry-sage border border-ebony transition-all duration-600 hover:shadow-[0_0_32px_rgba(254,250,220,0.12),0_0_64px_rgba(202,202,170,0.18)]">
                <div className="flex gap-1 mb-4" aria-hidden>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-ink" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-body text-ink leading-relaxed italic">
                  &ldquo;{quote}&rdquo;
                </p>
              </blockquote>
            </div>
          </FadeIn>
        )}

        {paragraphs.length > 0 && (
          <FadeIn delay={0.3}>
            <div className="mt-8 text-center max-w-2xl mx-auto space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-body text-dry-sage/80 leading-relaxed">{p}</p>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function FaqSection({ section }: { section: ContentSection }) {
  const items = section.items ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section border-t border-ebony/60">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk text-center mb-12">
            {section.title}
          </h2>
        </FadeIn>

        <div className="max-w-2xl mx-auto divide-y divide-ebony/40">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="py-5">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
                >
                  <h3 className="text-body font-semibold text-cornsilk group-hover:text-dry-sage transition-colors">
                    {item.title}
                  </h3>
                  <span
                    className="text-grey-olive shrink-0 transition-transform duration-300"
                    style={{ transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    aria-hidden
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openIndex === i ? '500px' : '0',
                    opacity: openIndex === i ? 1 : 0,
                  }}
                >
                  <p className="pt-3 text-body text-dry-sage/80 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ section }: { section: ContentSection }) {
  const paragraphs = extractParagraphs(section.body);

  return (
    <section className="section relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom right, var(--dry-sage), transparent 60%)',
        }}
        aria-hidden
      />
      <div className="container-narrow relative text-center">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk">
            {section.title}
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-6 max-w-xl mx-auto space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-body text-dry-sage leading-relaxed">{p}</p>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button href="/contact" variant="primary">Plan een vrijblijvend gesprek</Button>
            <Button href="/cases" variant="outline">Bekijk cases</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function GenericSection({ section }: { section: ContentSection }) {
  const paragraphs = extractParagraphs(section.body);
  const items = section.items ?? [];

  return (
    <section className="section border-t border-ebony/60">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk">{section.title}</h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-6 max-w-2xl space-y-4">
            {paragraphs.map((p, i) => (
              <Paragraph key={i} text={p} />
            ))}
          </div>
        </FadeIn>
        {items.length > 0 && (
          <FadeIn delay={0.25}>
            <ul className="mt-8 max-w-2xl space-y-5">
              {items.map((item, i) => (
                <li key={i} className="border-l-2 border-ebony/40 pl-5">
                  <h3 className="text-body font-semibold text-cornsilk">{item.title}</h3>
                  <p className="mt-1 text-small text-dry-sage/80 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

// --- Main component ---

export function LandingPageContent({ title, sections, faqItems }: Props) {
  return (
    <main className="min-h-screen">
      {sections.map((section, i) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={i} section={section} />;
          case 'problem':
            return <ProblemSection key={i} section={section} />;
          case 'solution':
            return <SolutionSection key={i} section={section} />;
          case 'services':
            return <ServicesSection key={i} section={section} />;
          case 'testimonial':
            return <TestimonialSection key={i} section={section} />;
          case 'faq':
            return <FaqSection key={i} section={section} />;
          case 'cta':
            return <CtaSection key={i} section={section} />;
          default:
            return <GenericSection key={i} section={section} />;
        }
      })}

      {/* Always end with CTA if last section isn't one */}
      {sections[sections.length - 1]?.type !== 'cta' && (
        <section className="section border-t border-ebony/60 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at bottom right, var(--dry-sage), transparent 60%)',
            }}
            aria-hidden
          />
          <div className="container-narrow relative text-center">
            <FadeIn>
              <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk">
                Klaar om te beginnen?
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-6 text-body text-dry-sage max-w-xl mx-auto leading-relaxed">
                Plan een vrijblijvend gesprek en ontdek wat BlitzWorx voor jouw bedrijf kan betekenen.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Button href="/contact" variant="primary">Plan een gesprek</Button>
                <Button href="/diensten" variant="outline">Bekijk diensten</Button>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </main>
  );
}
