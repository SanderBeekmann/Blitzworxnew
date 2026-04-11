'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { getVisibleQuestions, allQuestionsAnswered } from '@/lib/decision-tree';
import type { OnboardingResponse } from '@/lib/decision-tree';
import { TERMS_ARTICLES, TERMS_COMPANY_INFO, TERMS_VERSION } from '@/lib/terms-v2';

type Step = 'loading' | 'welcome' | 'questions' | 'terms' | 'submitting' | 'done' | 'error';

interface SessionData {
  id: string;
  client_name: string;
  company_name: string | null;
  project_type: string | null;
  questions: import('@/lib/decision-tree').OnboardingQuestion[];
  status: string;
}

// --- Terms document renderer ---

function TermsDocument() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ebony/60">
        <p className="text-sm font-semibold text-cornsilk mb-2">Algemene Voorwaarden BLITZWORX v{TERMS_VERSION}</p>
        <p className="text-xs text-grey-olive leading-relaxed">{TERMS_COMPANY_INFO}</p>
      </div>

      {TERMS_ARTICLES.map((article) => (
        <div key={article.number} className="space-y-2">
          <h3 className="text-sm font-semibold text-cornsilk">
            {article.number}. {article.heading}
          </h3>
          <div className="space-y-2 text-[13px] text-dry-sage/90 leading-relaxed">
            {article.clauses.map((clause, idx) => {
              // Article 1 uses term/definition format
              if (clause.term) {
                return (
                  <p key={idx}>
                    <span className="font-semibold text-cornsilk">{clause.term}:</span>{' '}
                    {clause.definition}
                  </p>
                );
              }
              // Other articles use clause/text format
              return (
                <div key={idx}>
                  <p>
                    {clause.clause && <span className="font-semibold text-cornsilk mr-1">{clause.clause}.</span>}
                    {clause.text}
                  </p>
                  {clause.examples && (
                    <ul className="mt-2 ml-6 space-y-1 list-disc marker:text-grey-olive">
                      {clause.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-ebony/60">
        <p className="text-xs text-grey-olive italic">
          Door akkoord te gaan verklaart u de volledige voorwaarden te hebben gelezen en ermee in te stemmen.
        </p>
      </div>
    </div>
  );
}

// --- BlitzWorx logo component ---

function BlitzworxLogo({ className = 'h-6 w-auto' }: { className?: string }) {
  return (
    <Image
      src="/assets/images/blitzworx-logo.png"
      alt="BLITZWORX"
      width={140}
      height={32}
      className={className}
      priority
    />
  );
}

// --- Main flow ---

export function IntakeFlow({ token }: { token: string }) {
  const [step, setStep] = useState<Step>('loading');
  const [session, setSession] = useState<SessionData | null>(null);
  const [responses, setResponses] = useState<Map<string, OnboardingResponse>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [termsName, setTermsName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const visibleQuestions = useMemo(() => {
    if (!session?.questions) return [];
    return getVisibleQuestions(session.questions, responses);
  }, [session?.questions, responses]);

  const totalVisible = visibleQuestions.length;
  const currentQuestion = visibleQuestions[currentIndex] ?? null;
  const isComplete = useMemo(() => {
    if (!session?.questions) return false;
    return allQuestionsAnswered(session.questions, responses);
  }, [session?.questions, responses]);

  useEffect(() => {
    loadSession();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSession() {
    try {
      const res = await fetch(`/api/intake/${token}`);
      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error ?? 'Er is iets misgegaan');
        setStep('error');
        return;
      }
      const data = await res.json();
      setSession(data.session);
      setStep('welcome');
    } catch {
      setErrorMessage('Kan de vragenlijst niet laden');
      setStep('error');
    }
  }

  function handleSelect(questionId: string, value: string) {
    const q = session?.questions.find((q) => q.id === questionId);
    if (!q) return;
    setResponses((prev) => {
      const next = new Map(prev);
      const existing = next.get(questionId);
      if (q.type === 'multiple') {
        const selected = existing?.selected ?? [];
        const updated = selected.includes(value) ? selected.filter((s) => s !== value) : [...selected, value];
        next.set(questionId, { question_id: questionId, selected: updated, other_text: existing?.other_text });
      } else {
        next.set(questionId, { question_id: questionId, selected: [value], other_text: existing?.other_text });
      }
      return next;
    });
  }

  function handleOther(questionId: string, text: string) {
    setResponses((prev) => {
      const next = new Map(prev);
      const existing = next.get(questionId);
      next.set(questionId, { question_id: questionId, selected: existing?.selected ?? [], other_text: text });
      return next;
    });
  }

  function goNext() {
    const newVisible = getVisibleQuestions(session?.questions ?? [], responses);
    const nextIdx = newVisible.findIndex((q, i) => {
      if (i <= currentIndex) return false;
      const r = responses.get(q.id);
      return !r || (r.selected.length === 0 && !r.other_text);
    });
    if (nextIdx >= 0) setCurrentIndex(nextIdx);
    else if (currentIndex < newVisible.length - 1) setCurrentIndex(currentIndex + 1);
  }

  function goPrev() {
    if (currentIndex === 0) setStep('welcome');
    else setCurrentIndex(currentIndex - 1);
  }

  async function handleSubmit() {
    if (!termsAccepted || !termsName.trim()) return;
    setStep('submitting');
    try {
      const res = await fetch(`/api/intake/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: Array.from(responses.values()),
          terms_accepted_name: termsName.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error ?? 'Er is iets misgegaan');
        setStep('error');
        return;
      }
      setStep('done');
    } catch {
      setErrorMessage('Er is iets misgegaan bij het versturen');
      setStep('error');
    }
  }

  const progress = step === 'questions' ? Math.round(((currentIndex + 1) / Math.max(totalVisible, 1)) * 100) : step === 'terms' ? 100 : 0;
  const hasCurrentAnswer = currentQuestion ? (() => {
    const r = responses.get(currentQuestion.id);
    return r && (r.selected.length > 0 || (r.other_text && r.other_text.length > 0));
  })() : false;

  return (
    <div className="min-h-screen flex flex-col bg-ink text-cornsilk">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-ink/95 backdrop-blur-sm border-b border-ebony/60">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <BlitzworxLogo className="h-6 w-auto" />
          {step === 'questions' && (
            <span className="text-xs text-grey-olive tabular-nums">{currentIndex + 1} / {totalVisible}</span>
          )}
        </div>
        {(step === 'questions' || step === 'terms') && (
          <div className="h-0.5 bg-ebony/40">
            <div className="h-full bg-dry-sage transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">

        {/* Loading */}
        {step === 'loading' && (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-dry-sage border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="flex flex-col items-center text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-red-900/20 border border-red-500/30 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-1 text-cornsilk">{errorMessage}</h2>
            <p className="text-sm text-grey-olive">Neem contact op als dit probleem aanhoudt.</p>
          </div>
        )}

        {/* Welcome */}
        {step === 'welcome' && session && (
          <div className="flex flex-col items-center text-center py-12">
            <div className="mb-8">
              <BlitzworxLogo className="h-12 w-auto" />
            </div>
            <h1 className="text-h2 md:text-h2-lg font-bold tracking-tight mb-3 text-cornsilk">
              Welkom{session.client_name ? `, ${session.client_name}` : ''}
            </h1>
            <p className="text-dry-sage max-w-md leading-relaxed mb-8">
              Fijn dat je met BLITZWORX aan de slag gaat. Beantwoord een paar korte vragen zodat we precies weten wat je nodig hebt.
            </p>
            <div className="flex items-center gap-6 text-sm text-grey-olive mb-10">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                ~3 minuten
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                Veilig
              </div>
            </div>
            <button type="button" onClick={() => setStep('questions')}
              className="px-8 py-3 bg-dry-sage text-ink text-sm font-semibold rounded-md hover:bg-cornsilk hover:shadow-[0_0_32px_rgba(254,250,220,0.18)] transition-all active:scale-[0.98]">
              Laten we beginnen
            </button>
          </div>
        )}

        {/* Questions */}
        {step === 'questions' && currentQuestion && (() => {
          const response = responses.get(currentQuestion.id);
          return (
            <div key={currentQuestion.id}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-dry-sage/10 border border-dry-sage/20 text-[10px] font-semibold uppercase tracking-widest text-dry-sage mb-4">
                {currentQuestion.category}
              </div>
              <h2 className="text-h3 md:text-h3-lg font-bold tracking-tight mb-1 text-cornsilk">{currentQuestion.question}</h2>
              <p className="text-sm text-grey-olive mb-6">
                {currentQuestion.type === 'multiple' ? 'Selecteer alle opties die van toepassing zijn' : 'Kies de optie die het beste past'}
              </p>
              <div className="space-y-2">
                {currentQuestion.options.map((opt) => {
                  const selected = response?.selected.includes(opt.value) ?? false;
                  return (
                    <button key={opt.value} type="button" onClick={() => handleSelect(currentQuestion.id, opt.value)}
                      className={`w-full text-left px-5 py-3.5 rounded-md border text-sm font-medium transition-all active:scale-[0.99] ${
                        selected
                          ? 'bg-dry-sage text-ink border-dry-sage shadow-[0_0_24px_rgba(202,202,170,0.15)]'
                          : 'bg-ink/40 text-cornsilk border-ebony/60 hover:border-dry-sage/60 hover:bg-ebony/20'
                      }`}>
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {selected && <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {currentQuestion.allow_other && (
                <div className="mt-3">
                  <input type="text" placeholder="Anders, namelijk..." value={response?.other_text ?? ''}
                    onChange={(e) => handleOther(currentQuestion.id, e.target.value)}
                    className="w-full px-5 py-3.5 rounded-md border border-ebony/60 bg-ink/40 text-cornsilk text-sm focus:outline-none focus:border-dry-sage focus:shadow-[0_0_16px_rgba(202,202,170,0.1)] transition-all placeholder:text-grey-olive/60" />
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button type="button" onClick={goPrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm text-grey-olive hover:text-cornsilk hover:bg-ebony/30 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Vorige
                </button>
                {isComplete ? (
                  <button type="button" onClick={() => setStep('terms')}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold bg-dry-sage text-ink hover:bg-cornsilk hover:shadow-[0_0_32px_rgba(254,250,220,0.18)] transition-all active:scale-[0.98]">
                    Afronden
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </button>
                ) : (
                  <button type="button" onClick={goNext} disabled={!hasCurrentAnswer}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold bg-dry-sage text-ink hover:bg-cornsilk hover:shadow-[0_0_32px_rgba(254,250,220,0.18)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all active:scale-[0.98]">
                    Volgende
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Terms - full document */}
        {step === 'terms' && (
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-dry-sage/10 border border-dry-sage/20 text-[10px] font-semibold uppercase tracking-widest text-dry-sage mb-4">
              Laatste stap
            </div>
            <h2 className="text-h3 md:text-h3-lg font-bold tracking-tight mb-1 text-cornsilk">Algemene Voorwaarden</h2>
            <p className="text-sm text-grey-olive mb-6">Lees de voorwaarden en bevestig onderaan met je naam.</p>

            {/* Full terms document - scrollable */}
            <div className="bg-ink/40 rounded-md border border-ebony/60 p-6 max-h-[60vh] overflow-y-auto">
              <TermsDocument />
            </div>

            {/* Acceptance block */}
            <div className="mt-5 bg-ink/40 rounded-md border border-ebony/60 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-0.5">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 rounded-sm border-2 border-dry-sage/60 peer-checked:bg-dry-sage peer-checked:border-dry-sage transition-all flex items-center justify-center">
                    {termsAccepted && <svg className="w-3 h-3 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <span className="text-sm text-dry-sage">Ik heb de algemene voorwaarden gelezen en ga hiermee akkoord.</span>
              </label>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-grey-olive mb-1.5 uppercase tracking-wider">Uw volledige naam (als digitale handtekening)</label>
                <input type="text" value={termsName} onChange={(e) => setTermsName(e.target.value)} placeholder="Zoals u bij ons bekend bent"
                  className="w-full px-4 py-3 rounded-md border border-ebony/60 bg-ink/40 text-cornsilk text-sm focus:outline-none focus:border-dry-sage focus:shadow-[0_0_16px_rgba(202,202,170,0.1)] transition-all placeholder:text-grey-olive/50" />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button type="button" onClick={() => setStep('questions')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm text-grey-olive hover:text-cornsilk hover:bg-ebony/30 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Terug
              </button>
              <button type="button" onClick={handleSubmit} disabled={!termsAccepted || !termsName.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold bg-dry-sage text-ink hover:bg-cornsilk hover:shadow-[0_0_32px_rgba(254,250,220,0.18)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all active:scale-[0.98]">
                Bevestigen en versturen
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* Submitting */}
        {step === 'submitting' && (
          <div className="flex flex-col items-center py-24">
            <div className="w-10 h-10 border-2 border-dry-sage border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-grey-olive">Even geduld...</p>
          </div>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="flex flex-col items-center text-center py-16">
            <div className="mb-6">
              <BlitzworxLogo className="h-12 w-auto" />
            </div>
            <h2 className="text-h2 font-bold tracking-tight mb-2 text-cornsilk">Bedankt!</h2>
            <p className="text-dry-sage max-w-md leading-relaxed mb-8">
              Je antwoorden zijn ontvangen en je voorwaarden zijn vastgelegd. We gaan aan de slag met je projectvoorstel en nemen snel contact op.
            </p>
            <div className="flex items-center gap-3 text-sm text-grey-olive">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-ink/40 border border-ebony/60">
                <svg className="w-4 h-4 text-dry-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Vragen beantwoord
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-ink/40 border border-ebony/60">
                <svg className="w-4 h-4 text-dry-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Voorwaarden geaccepteerd
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-ebony/60 py-4 mt-auto">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between text-[10px] text-grey-olive uppercase tracking-widest">
          <span>BLITZWORX</span>
          <span>Werverweg 6, Wapenveld</span>
          <span>KvK 98139789</span>
        </div>
      </footer>
    </div>
  );
}
