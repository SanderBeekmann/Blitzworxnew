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

  // Split paragraphs: intro (before pain points), closing (after)
  const introParagraphs = paragraphs.filter((p) => !p.startsWith('-')).slice(0, 2);
  const closingParagraphs = paragraphs.length > 2
    ? paragraphs.filter((p) => !p.startsWith('-')).slice(2)
    : [];

  return (
    <section className="section border-t border-ebony/60 relative overflow-hidden">
      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px h-[200%] opacity-[0.06] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--grey-olive), transparent)',
          transform: 'rotate(25deg)',
          transformOrigin: 'top right',
        }}
        aria-hidden
      />

      <div className="container-narrow relative">
        {/* Section header - full width, editorial style */}
        <FadeIn>
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-caption font-mono text-grey-olive/40 tracking-widest uppercase">Probleem</span>
            <div className="flex-1 h-px bg-ebony/40" />
          </div>
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk max-w-2xl">
            {section.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-6 max-w-xl space-y-4">
            {introParagraphs.map((p, i) => (
              <Paragraph key={i} text={p} />
            ))}
          </div>
        </FadeIn>

        {/* Pain point cards - stacked with increasing visual weight */}
        {listItems.length > 0 && (
          <div className="mt-14 space-y-4">
            {listItems.map((item, i) => {
              // Extract bold title and remaining text
              const match = item.match(/^\*\*(.+?)\*\*\s*([\s\S]*)/);
              const painTitle = match ? match[1] : '';
              const painBody = match ? match[2] : item;
              // Increasing opacity for visual escalation
              const borderOpacity = [0.15, 0.25, 0.4][i] ?? 0.3;

              return (
                <FadeIn key={i} delay={0.2 + i * 0.12}>
                  <div
                    className="relative grid grid-cols-[auto_1fr] gap-6 p-6 md:p-8 group transition-all duration-500 hover:translate-x-1"
                    style={{
                      background: `linear-gradient(90deg, rgba(139,129,116,${borderOpacity * 0.15}) 0%, transparent 60%)`,
                    }}
                  >
                    {/* Number marker */}
                    <div className="flex flex-col items-center gap-2 pt-0.5">
                      <span
                        className="flex items-center justify-center w-8 h-8 text-caption font-mono font-bold border transition-colors duration-500 group-hover:border-dry-sage/60 group-hover:text-cornsilk"
                        style={{
                          borderColor: `rgba(139,129,116,${borderOpacity})`,
                          color: `rgba(202,202,170,${0.4 + i * 0.2})`,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {i < listItems.length - 1 && (
                        <div
                          className="w-px flex-1 min-h-[16px]"
                          style={{ background: `rgba(139,129,116,${borderOpacity * 0.5})` }}
                          aria-hidden
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      {painTitle && (
                        <h3 className="text-body font-semibold text-cornsilk/90 group-hover:text-cornsilk transition-colors">
                          {painTitle}
                        </h3>
                      )}
                      <p className="mt-1.5 text-small text-dry-sage/70 leading-relaxed">
                        {painBody}
                      </p>
                    </div>

                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        opacity: borderOpacity,
                        background: `linear-gradient(to bottom, transparent, var(--grey-olive), transparent)`,
                      }}
                      aria-hidden
                    />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* Closing - agitation + resolution tease */}
        {closingParagraphs.length > 0 && (
          <FadeIn delay={0.5}>
            <div className="mt-14 relative pl-6 md:pl-10 border-l border-dry-sage/20">
              <div className="space-y-3">
                {closingParagraphs.map((p, i) => {
                  // Last paragraph = resolution tease, style differently
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
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function SolutionSection({ section }: { section: ContentSection }) {
  const paragraphs = extractParagraphs(section.body);
  // Find bold items (USPs) - paragraphs starting with **
  const usps = paragraphs.filter((p) => p.startsWith('**'));
  const introParagraphs = paragraphs.filter((p) => !p.startsWith('**'));

  return (
    <section className="section relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--dry-sage) 0%, transparent 50%)',
        }}
        aria-hidden
      />

      <div className="container-narrow relative">
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
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {usps.map((usp, i) => {
              const titleMatch = usp.match(/^\*\*(.+?)\*\*\.?\s*([\s\S]*)/);
              const uspTitle = titleMatch ? titleMatch[1] : '';
              const uspBody = titleMatch ? titleMatch[2] : usp;

              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-6 border border-ebony/60 bg-ink/50 hover:border-dry-sage/30 transition-colors duration-500 group">
                    <div className="flex items-start gap-4">
                      <span className="text-caption font-mono text-grey-olive/60 mt-1 shrink-0">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="text-body font-semibold text-cornsilk group-hover:text-dry-sage transition-colors">
                          {uspTitle}
                        </h3>
                        {uspBody && (
                          <p className="mt-2 text-small text-dry-sage/80 leading-relaxed">{uspBody}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
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
          <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-12">{section.title}</h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ebony/30">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="bg-ink p-6 md:p-8 h-full hover:bg-ebony/10 transition-colors duration-500 group">
                <span className="text-caption font-mono text-grey-olive/50 block mb-3">
                  0{i + 1}
                </span>
                <h3 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-small text-dry-sage/80 leading-relaxed">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
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
          <div className="mt-10 space-y-6">
            {items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border-l-2 border-dry-sage pl-6">
                  <h3 className="text-h3 font-semibold text-cornsilk">{item.title}</h3>
                  <p className="mt-2 text-body text-dry-sage leading-relaxed">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
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
