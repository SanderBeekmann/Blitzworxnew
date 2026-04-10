'use client';

import { useState, useEffect, useMemo } from 'react';
import { getVisibleQuestions, allQuestionsAnswered } from '@/lib/decision-tree';
import type { OnboardingResponse } from '@/lib/decision-tree';

type Step = 'loading' | 'welcome' | 'questions' | 'terms' | 'submitting' | 'done' | 'error';

interface SessionData {
  id: string;
  client_name: string;
  company_name: string | null;
  project_type: string | null;
  questions: import('@/lib/decision-tree').OnboardingQuestion[];
  status: string;
}

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
        setErrorMessage(data.error ?? 'Er ging iets mis');
        setStep('error');
        return;
      }
      setStep('done');
    } catch {
      setErrorMessage('Er ging iets mis bij het versturen');
      setStep('error');
    }
  }

  const progress = step === 'questions' ? Math.round(((currentIndex + 1) / Math.max(totalVisible, 1)) * 100) : step === 'terms' ? 100 : 0;
  const hasCurrentAnswer = currentQuestion ? (() => {
    const r = responses.get(currentQuestion.id);
    return r && (r.selected.length > 0 || (r.other_text && r.other_text.length > 0));
  })() : false;

  return (
    <div className="min-h-screen flex flex-col bg-cornsilk text-ink">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-cornsilk/90 backdrop-blur-md border-b border-dry-sage/40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <svg className="w-4 h-4 text-cornsilk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <span className="text-sm font-bold tracking-wide">BLITZWORX</span>
          </div>
          {step === 'questions' && <span className="text-xs text-grey-olive tabular-nums">{currentIndex + 1} / {totalVisible}</span>}
        </div>
        {(step === 'questions' || step === 'terms') && (
          <div className="h-0.5 bg-dry-sage/30">
            <div className="h-full bg-ink transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">

        {/* Loading */}
        {step === 'loading' && (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="flex flex-col items-center text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-1">{errorMessage}</h2>
            <p className="text-sm text-grey-olive">Neem contact op als dit probleem aanhoudt.</p>
          </div>
        )}

        {/* Welcome */}
        {step === 'welcome' && session && (
          <div className="flex flex-col items-center text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-ink flex items-center justify-center mb-6 shadow-lg shadow-ink/20">
              <svg className="w-9 h-9 text-cornsilk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <h1 className="text-h2 md:text-h2-lg font-bold tracking-tight mb-3">
              Welkom{session.client_name ? `, ${session.client_name}` : ''}
            </h1>
            <p className="text-ebony max-w-md leading-relaxed mb-8">
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
              className="px-8 py-3 bg-ink text-cornsilk text-sm font-semibold rounded-xl hover:bg-ebony transition-colors shadow-lg shadow-ink/10 active:scale-[0.98]">
              Laten we beginnen
            </button>
          </div>
        )}

        {/* Questions */}
        {step === 'questions' && currentQuestion && (() => {
          const response = responses.get(currentQuestion.id);
          return (
            <div key={currentQuestion.id} className="animate-fadeIn">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-ink/5 text-[10px] font-semibold uppercase tracking-widest text-grey-olive mb-4">
                {currentQuestion.category}
              </div>
              <h2 className="text-h3 md:text-h3-lg font-bold tracking-tight mb-1">{currentQuestion.question}</h2>
              <p className="text-sm text-grey-olive mb-6">
                {currentQuestion.type === 'multiple' ? 'Selecteer alle opties die van toepassing zijn' : 'Kies de optie die het beste past'}
              </p>
              <div className="space-y-2">
                {currentQuestion.options.map((opt) => {
                  const selected = response?.selected.includes(opt.value) ?? false;
                  return (
                    <button key={opt.value} type="button" onClick={() => handleSelect(currentQuestion.id, opt.value)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.99] ${
                        selected
                          ? 'bg-ink text-cornsilk border-ink shadow-lg shadow-ink/15'
                          : 'bg-white text-ink border-dry-sage/50 hover:border-ebony hover:shadow-sm'
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
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-dry-sage/50 text-sm focus:outline-none focus:border-ink focus:shadow-md transition-all bg-white placeholder:text-grey-olive/60" />
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button type="button" onClick={goPrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-grey-olive hover:text-ink hover:bg-ink/5 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Vorige
                </button>
                {isComplete ? (
                  <button type="button" onClick={() => setStep('terms')}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-ink text-cornsilk hover:bg-ebony transition-colors shadow-sm active:scale-[0.98]">
                    Afronden
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </button>
                ) : (
                  <button type="button" onClick={goNext} disabled={!hasCurrentAnswer}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-ink text-cornsilk hover:bg-ebony disabled:opacity-20 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-[0.98]">
                    Volgende
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Terms */}
        {step === 'terms' && (
          <div className="animate-fadeIn">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ink/5 text-[10px] font-semibold uppercase tracking-widest text-grey-olive mb-4">Laatste stap</div>
            <h2 className="text-h3 md:text-h3-lg font-bold tracking-tight mb-1">Algemene Voorwaarden</h2>
            <p className="text-sm text-grey-olive mb-6">Lees de voorwaarden en bevestig onderaan met je naam.</p>

            <div className="bg-white rounded-2xl border-2 border-dry-sage/40 p-6 max-h-80 overflow-y-auto text-sm text-ebony leading-relaxed space-y-3">
              <p className="font-bold text-ink">Algemene Voorwaarden BLITZWORX v2.0</p>
              <p className="text-xs text-grey-olive">BLITZWORX - Werverweg 6, Wapenveld - KvK 98139789</p>
              <hr className="border-dry-sage/30" />
              <p className="font-semibold text-ink">4. Uitvoering, revisies en termijnen</p>
              <p>4.3. Per opdracht zijn maximaal <strong>drie (3) revisierondes</strong> inbegrepen.</p>
              <p>4.6. Aanvullende revisies: EUR 50 excl. btw per uur.</p>
              <p className="font-semibold text-ink mt-4">5. Meerwerk</p>
              <p>5.1. Werkzaamheden buiten de offerte = meerwerk, pas na akkoord.</p>
              <p>5.4. Tarief meerwerk: EUR 50 excl. btw per uur.</p>
              <p className="font-semibold text-ink mt-4">7. Oplevering en acceptatie</p>
              <p>7.1. 14 dagen om gebreken te melden na oplevering.</p>
              <p>7.2. Geen reactie binnen 14 dagen = stilzwijgende acceptatie.</p>
              <p className="font-semibold text-ink mt-4">8. Prijzen en betaling</p>
              <p>8.3. Facturen binnen 14 dagen betalen.</p>
              <p className="font-semibold text-ink mt-4">11. Intellectueel eigendom</p>
              <p>11.1. Materialen blijven eigendom van BLITZWORX tot volledige betaling.</p>
              <hr className="border-dry-sage/30" />
              <p className="text-xs text-grey-olive italic">Volledige voorwaarden (17 artikelen) worden per e-mail toegestuurd.</p>
            </div>

            <div className="mt-5 bg-white rounded-2xl border-2 border-dry-sage/40 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-0.5">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 rounded-md border-2 border-dry-sage peer-checked:bg-ink peer-checked:border-ink transition-all flex items-center justify-center">
                    {termsAccepted && <svg className="w-3 h-3 text-cornsilk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <span className="text-sm text-ebony">Ik heb de algemene voorwaarden gelezen en ga hiermee akkoord.</span>
              </label>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-grey-olive mb-1.5">Uw volledige naam (als digitale handtekening)</label>
                <input type="text" value={termsName} onChange={(e) => setTermsName(e.target.value)} placeholder="Zoals u bij ons bekend bent"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dry-sage/40 text-sm focus:outline-none focus:border-ink focus:shadow-md transition-all placeholder:text-grey-olive/50" />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button type="button" onClick={() => setStep('questions')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-grey-olive hover:text-ink hover:bg-ink/5 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Terug
              </button>
              <button type="button" onClick={handleSubmit} disabled={!termsAccepted || !termsName.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-ink text-cornsilk hover:bg-ebony disabled:opacity-20 disabled:cursor-not-allowed transition-colors shadow-lg shadow-ink/10 active:scale-[0.98]">
                Bevestigen en versturen
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* Submitting */}
        {step === 'submitting' && (
          <div className="flex flex-col items-center py-24">
            <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-grey-olive">Even geduld...</p>
          </div>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="flex flex-col items-center text-center py-16 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-ink flex items-center justify-center mb-6 shadow-lg shadow-ink/20">
              <svg className="w-9 h-9 text-cornsilk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            </div>
            <h2 className="text-h2 font-bold tracking-tight mb-2">Bedankt!</h2>
            <p className="text-ebony max-w-md leading-relaxed mb-8">
              Je antwoorden zijn ontvangen en je voorwaarden zijn vastgelegd. We gaan aan de slag met je projectvoorstel en nemen snel contact op.
            </p>
            <div className="flex items-center gap-3 text-sm text-grey-olive">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink/5">
                <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Vragen beantwoord
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink/5">
                <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Voorwaarden geaccepteerd
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dry-sage/30 py-4 mt-auto">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between text-[10px] text-grey-olive uppercase tracking-widest">
          <span>BLITZWORX</span>
          <span>Werverweg 6, Wapenveld</span>
          <span>KvK 98139789</span>
        </div>
      </footer>
    </div>
  );
}
