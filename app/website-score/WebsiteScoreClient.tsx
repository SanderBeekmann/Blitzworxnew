'use client';

import { useState, useRef, FormEvent, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { Button } from '@/components/ui/Button';
import { WebsiteScoreResults } from '@/components/website-score/WebsiteScoreResults';
import type { ScoreResponse } from '@/components/website-score/WebsiteScoreResults';

type Phase = 'input' | 'loading' | 'results';

const LOADING_STEPS = [
  { label: 'Website ophalen' },
  { label: 'Snelheid meten' },
  { label: 'SEO controleren' },
  { label: 'Beveiliging analyseren' },
  { label: 'Content scrapen' },
  { label: 'AI analyse genereren' },
];

const STEP_DELAYS = [1500, 1500, 1500, 3000, 3000, 0];
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 60; // 3 minutes max

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LoadingStepRow({ step, index, currentStep }: { step: typeof LOADING_STEPS[number]; index: number; currentStep: number }) {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;
  const isPending = index > currentStep;

  return (
    <div
      className={`flex items-center gap-4 transition-all duration-500 ${
        isPending ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
          isCompleted
            ? 'bg-dry-sage text-ink'
            : isCurrent
              ? 'border-2 border-dry-sage text-dry-sage animate-pulse'
              : 'border border-ebony text-ebony'
        }`}
      >
        {isCompleted ? <CheckIcon /> : <span className="text-xs font-medium">{index + 1}</span>}
      </div>
      <span
        className={`text-small transition-colors duration-500 ${
          isCompleted
            ? 'text-dry-sage'
            : isCurrent
              ? 'text-cornsilk font-medium'
              : 'text-grey-olive'
        }`}
      >
        {step.label}
        {isCurrent && <span className="inline-flex ml-1 animate-pulse">...</span>}
      </span>
    </div>
  );
}

export function WebsiteScoreClient() {
  const [phase, setPhase] = useState<Phase>('input');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<ScoreResponse | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [email, setEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const autoStartedRef = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const prefillEmail = searchParams.get('email');
    if (prefillEmail) setEmail(prefillEmail);

    const prefillUrl = searchParams.get('url');
    if (prefillUrl && !autoStartedRef.current) {
      autoStartedRef.current = true;
      setUrl(prefillUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (autoStartedRef.current && url && phase === 'input') {
      autoStartedRef.current = false;
      handleSubmit();
    }
  }, [url]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  const pollForResults = useCallback((id: string, attempt = 0) => {
    if (attempt >= POLL_MAX_ATTEMPTS) {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      setError('De analyse duurt te lang. Probeer het later opnieuw.');
      setPhase('input');
      return;
    }

    pollRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tools/website-score?jobId=${id}`);
        const data = await res.json();

        if (data.status === 'completed' && data.result) {
          if (intervalRef.current) clearTimeout(intervalRef.current);
          setResults(data.result);
          setPhase('results');
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
          return;
        }

        if (data.status === 'failed') {
          if (intervalRef.current) clearTimeout(intervalRef.current);
          setError(data.error || 'Analyse mislukt. Probeer het opnieuw.');
          setPhase('input');
          return;
        }

        // Still pending/processing - poll again
        pollForResults(id, attempt + 1);
      } catch {
        // Network error - retry
        pollForResults(id, attempt + 1);
      }
    }, POLL_INTERVAL_MS);
  }, []);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Vul een URL in.');
      return;
    }

    setPhase('loading');
    setLoadingStep(0);

    // Accelerating step progression
    let step = 0;
    function scheduleNext() {
      const delay = STEP_DELAYS[step];
      if (delay <= 0) return;
      intervalRef.current = setTimeout(() => {
        step++;
        setLoadingStep(step);
        if (step < LOADING_STEPS.length - 1) scheduleNext();
      }, delay);
    }
    scheduleNext();

    try {
      // Start the job
      const res = await fetch('/api/tools/website-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (intervalRef.current) clearTimeout(intervalRef.current);
        setError(data.error || 'Er ging iets mis.');
        setPhase('input');
        return;
      }

      // Got a jobId - start polling
      setJobId(data.jobId);
      pollForResults(data.jobId);
    } catch {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      setError('Verbindingsfout. Controleer je internet en probeer opnieuw.');
      setPhase('input');
    }
  }

  function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailError('');

    if (!email.trim() || !email.includes('@')) {
      setEmailError('Vul een geldig e-mailadres in.');
      return;
    }

    setIsUnlocked(true);

    // Trigger email send + lead enrollment via the unlock flow
    fetch('/api/tools/website-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, email, newsletterOptIn, jobId }),
    }).catch((err) => {
      console.error('Email delivery failed:', err);
    });
  }

  function handleReset() {
    setPhase('input');
    setResults(null);
    setUrl('');
    setEmail('');
    setNewsletterOptIn(false);
    setIsUnlocked(false);
    setError('');
    setEmailError('');
    setJobId(null);
  }

  return (
    <>
      {/* Hero + Input */}
      <section className="section min-h-[70vh] flex flex-col justify-center" aria-labelledby="score-title">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center">
            <TitleReveal
              as="h1"
              id="score-title"
              className="text-hero md:text-hero-lg font-bold text-cornsilk mb-6"
            >
              Hoe scoort jouw website?
            </TitleReveal>
            <FadeIn delay={0.3}>
              <p className="text-body text-dry-sage leading-relaxed mb-10">
                Vul je website link (URL) in en laat onze AI agent je website onderzoeken op snelheid, SEO, inhoud en meer! Geheel vrijblijvend!
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(''); }}
                    placeholder="bijv. jouwbedrijf.nl"
                    disabled={phase === 'loading'}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'url-error' : undefined}
                    className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={phase === 'loading'}
                >
                  {phase === 'loading' ? 'Bezig...' : 'Analyseer mijn website'}
                </Button>
              </form>
              {error && (
                <p id="url-error" role="alert" className="mt-3 text-small text-[#c45c5c]">
                  {error}
                </p>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Loading */}
      {phase === 'loading' && (
        <section className="section" aria-label="Website wordt geanalyseerd">
          <div className="container-narrow">
            <div className="max-w-sm mx-auto">
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-ebony/30 overflow-hidden mb-10">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-out ${
                    loadingStep >= LOADING_STEPS.length - 1
                      ? 'animate-pulse'
                      : ''
                  }`}
                  style={{
                    width: loadingStep >= LOADING_STEPS.length - 1
                      ? '95%'
                      : `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
                    background: 'linear-gradient(90deg, rgba(202,202,170,0.5) 0%, var(--dry-sage) 100%)',
                  }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-5">
                {LOADING_STEPS.map((step, i) => (
                  <LoadingStepRow
                    key={step.label}
                    step={step}
                    index={i}
                    currentStep={loadingStep}
                  />
                ))}
              </div>

              <p className="mt-8 text-caption text-grey-olive text-center">
                Dit duurt meestal 15-30 seconden
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {phase === 'results' && results && (
        <div ref={resultsRef}>
          <section className="section" aria-label="Website score resultaten">
            <div className="container-narrow">
              <WebsiteScoreResults
                results={results}
                isUnlocked={isUnlocked}
                email={email}
                emailError={emailError}
                isSubmittingEmail={isSubmittingEmail}
                newsletterOptIn={newsletterOptIn}
                onEmailChange={(val) => { setEmail(val); setEmailError(''); }}
                onNewsletterOptInChange={setNewsletterOptIn}
                onEmailSubmit={handleEmailSubmit}
              />

              {/* Actions - only visible after unlock */}
              {isUnlocked && (
                <FadeIn delay={0.4}>
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={handleReset}
                      className="text-small text-grey-olive hover:text-cornsilk underline underline-offset-4 transition-colors"
                    >
                      Andere website testen
                    </button>
                  </div>
                </FadeIn>
              )}
            </div>
          </section>

          {/* CTA - only visible after unlock */}
          {isUnlocked && (
            <section className="section border-t border-ebony">
              <div className="container-narrow text-center">
                <FadeIn>
                  <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6">
                    Wil je deze punten laten verbeteren?
                  </h2>
                  <p className="text-body text-dry-sage leading-relaxed max-w-xl mx-auto mb-10">
                    BlitzWorx bouwt websites die snel laden, goed scoren in Google en er professioneel uitzien
                    op elk apparaat. Plan een vrijblijvend gesprek en ontdek wat er mogelijk is.
                  </p>
                  <Button href="/contact" variant="primary">
                    Plan een vrijblijvend gesprek
                  </Button>
                </FadeIn>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
