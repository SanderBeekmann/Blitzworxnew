'use client';

import { FormEvent } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { ScoreRing } from './ScoreRing';
import { LockedResultsOverlay } from './LockedResultsOverlay';

export interface AuditIssue {
  title: string;
  description: string;
  displayValue?: string;
  score: number;
}

export interface CategoryResult {
  id: string;
  label: string;
  score: number;
  advice: string;
  issues: AuditIssue[];
}

export interface ContentFinding {
  category: string;
  score: number;
  observation: string;
  recommendation: string;
}

export interface AiAnalysis {
  executiveSummary: string;
  contentFindings: ContentFinding[];
}

export interface ScoreResponse {
  url: string;
  overall: number;
  categories: CategoryResult[];
  scannedAt: string;
  aiAnalysis?: AiAnalysis | null;
}

interface WebsiteScoreResultsProps {
  results: ScoreResponse;
  isUnlocked: boolean;
  email: string;
  emailError: string;
  isSubmittingEmail: boolean;
  newsletterOptIn: boolean;
  onEmailChange: (val: string) => void;
  onNewsletterOptInChange: (val: boolean) => void;
  onEmailSubmit: (e: FormEvent) => void;
}

function getVerdict(score: number): { label: string; tone: string } {
  if (score >= 8.5) return { label: 'Uitstekend', tone: 'var(--dry-sage)' };
  if (score >= 7) return { label: 'Goed', tone: 'var(--dry-sage)' };
  if (score >= 5.5) return { label: 'Matig', tone: '#c4a85c' };
  if (score >= 4) return { label: 'Zwak', tone: '#c4a85c' };
  return { label: 'Slecht', tone: '#c45c5c' };
}

function getScoreColor(score: number): string {
  if (score < 4) return '#c45c5c';
  if (score < 7) return '#c4a85c';
  return 'var(--dry-sage)';
}

function formatScannedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function HeroScoreBlock({ results }: { results: ScoreResponse }) {
  const verdict = getVerdict(results.overall);
  const scannedAt = formatScannedAt(results.scannedAt);

  return (
    <FadeIn>
      <div className="flex flex-col items-center text-center mb-20">
        <p className="text-caption uppercase tracking-[0.2em] text-grey-olive font-semibold mb-3">
          Rapport voor
        </p>
        <p className="text-body text-cornsilk break-all max-w-xl mb-8">
          {results.url}
        </p>

        <ScoreRing score={results.overall} size={200} />

        <p
          className="mt-6 text-h2 font-bold"
          style={{ color: verdict.tone }}
        >
          {verdict.label}
        </p>
        {scannedAt && (
          <p className="mt-2 text-caption uppercase tracking-wider text-grey-olive">
            Gescand op {scannedAt}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

function SummaryHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-ebony" />
      <h2
        id="samenvatting-title"
        className="text-caption uppercase tracking-[0.2em] text-dry-sage font-semibold"
      >
        Samenvatting
      </h2>
      <div className="h-px flex-1 bg-ebony" />
    </div>
  );
}

function SummaryParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-5 text-left">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-body text-cornsilk leading-[1.8]">
          {p}
        </p>
      ))}
    </div>
  );
}

function AiSummaryBlock({
  summary,
  isUnlocked,
}: {
  summary: string;
  isUnlocked: boolean;
}) {
  const paragraphs = summary
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  if (isUnlocked) {
    return (
      <FadeIn delay={0.1}>
        <section className="mb-16" aria-labelledby="samenvatting-title">
          <SummaryHeader />
          <SummaryParagraphs paragraphs={paragraphs} />
        </section>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={0.1}>
      <section className="mb-10" aria-labelledby="samenvatting-title">
        <SummaryHeader />
        <div className="relative">
          {/* Blurred base layer - entire summary always blurred */}
          <div
            className="blur-[6px] opacity-70 pointer-events-none select-none"
            aria-hidden="true"
          >
            <SummaryParagraphs paragraphs={paragraphs} />
          </div>
          {/* Crisp top layer - same content, masked to show only first sentences */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              maskImage:
                'linear-gradient(to bottom, black 0%, black 28%, transparent 55%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black 0%, black 28%, transparent 55%)',
            }}
          >
            <SummaryParagraphs paragraphs={paragraphs} />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

function CategoryIcon({ id }: { id: string }) {
  const cls = 'w-5 h-5 text-dry-sage shrink-0';
  if (id === 'snelheid') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (id === 'seo') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    );
  }
  if (id === 'beveiliging') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 8v4m-4-2h8" />
      <path d="M9 20l3-6 3 6" />
    </svg>
  );
}

function CategoryRow({ category, delay }: { category: CategoryResult; delay: number }) {
  const color = getScoreColor(category.score);
  const topIssues = category.issues.slice(0, 4);
  const remaining = Math.max(0, category.issues.length - topIssues.length);

  return (
    <FadeIn delay={delay}>
      <div className="py-8 border-b border-ebony/60 last:border-b-0">
        <div className="flex items-start gap-4 mb-4">
          <CategoryIcon id={category.id} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h3 className="text-h3 font-bold text-cornsilk">{category.label}</h3>
              <span
                className="text-h3 font-bold tabular-nums"
                style={{ color }}
              >
                {category.score.toFixed(1)}
              </span>
            </div>
            <p className="text-body text-dry-sage leading-relaxed">{category.advice}</p>
          </div>
        </div>

        {topIssues.length > 0 && (
          <div className="pl-9">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {topIssues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-small">
                  <span className="text-grey-olive shrink-0 mt-0.5">-</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-cornsilk">{issue.title}</span>
                    {issue.displayValue && (
                      <span className="ml-2 text-[#c45c5c] text-caption font-semibold tabular-nums">
                        {issue.displayValue}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {remaining > 0 && (
              <p className="mt-3 text-caption text-grey-olive italic">
                +{remaining} meer in het volledige rapport
              </p>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

function TechnicalAnalysis({ categories }: { categories: CategoryResult[] }) {
  return (
    <section className="mb-20" aria-labelledby="technisch-title">
      <FadeIn>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ebony" />
          <h2
            id="technisch-title"
            className="text-caption uppercase tracking-[0.2em] text-dry-sage font-semibold"
          >
            Technische analyse
          </h2>
          <div className="h-px flex-1 bg-ebony" />
        </div>
      </FadeIn>
      <div>
        {categories.map((cat, i) => (
          <CategoryRow key={cat.id} category={cat} delay={0.1 + i * 0.05} />
        ))}
      </div>
    </section>
  );
}

function ContentFindingRow({
  finding,
  delay,
}: {
  finding: ContentFinding;
  delay: number;
}) {
  const score10 = finding.score * 2;
  const color = getScoreColor(score10);

  return (
    <FadeIn delay={delay}>
      <div className="py-7 border-b border-ebony/60 last:border-b-0">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h3 className="text-h3 font-bold text-cornsilk">{finding.category}</h3>
          <span
            className="text-body font-bold tabular-nums"
            style={{ color }}
          >
            {finding.score}/5
          </span>
        </div>
        <p className="text-body text-dry-sage leading-relaxed mb-3">
          {finding.observation}
        </p>
        <p className="text-small text-grey-olive leading-relaxed">
          <span className="text-cornsilk font-semibold">Aanbeveling: </span>
          {finding.recommendation}
        </p>
      </div>
    </FadeIn>
  );
}

function ContentReview({ findings }: { findings: ContentFinding[] }) {
  if (findings.length === 0) return null;
  return (
    <section className="mb-10" aria-labelledby="content-title">
      <FadeIn>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ebony" />
          <h2
            id="content-title"
            className="text-caption uppercase tracking-[0.2em] text-dry-sage font-semibold"
          >
            Content & Marketing
          </h2>
          <div className="h-px flex-1 bg-ebony" />
        </div>
      </FadeIn>
      <div>
        {findings.map((finding, i) => (
          <ContentFindingRow
            key={finding.category + i}
            finding={finding}
            delay={0.1 + i * 0.05}
          />
        ))}
      </div>
    </section>
  );
}

export function WebsiteScoreResults({
  results,
  isUnlocked,
  email,
  emailError,
  isSubmittingEmail,
  newsletterOptIn,
  onEmailChange,
  onNewsletterOptInChange,
  onEmailSubmit,
}: WebsiteScoreResultsProps) {
  const summary = results.aiAnalysis?.executiveSummary || '';

  return (
    <div>
      <HeroScoreBlock results={results} />

      {summary && <AiSummaryBlock summary={summary} isUnlocked={isUnlocked} />}

      <div className="relative">
        <div
          className={`transition-[filter,opacity] duration-700 ease-out ${
            isUnlocked ? '' : 'blur-[10px] pointer-events-none select-none opacity-60'
          }`}
          aria-hidden={!isUnlocked}
        >
          {results.aiAnalysis && results.aiAnalysis.contentFindings.length > 0 && (
            <ContentReview findings={results.aiAnalysis.contentFindings} />
          )}

          <TechnicalAnalysis categories={results.categories} />
        </div>

        {!isUnlocked && (
          <LockedResultsOverlay
            email={email}
            emailError={emailError}
            isSubmitting={isSubmittingEmail}
            newsletterOptIn={newsletterOptIn}
            onEmailChange={onEmailChange}
            onNewsletterOptInChange={onNewsletterOptInChange}
            onSubmit={onEmailSubmit}
          />
        )}
      </div>
    </div>
  );
}
