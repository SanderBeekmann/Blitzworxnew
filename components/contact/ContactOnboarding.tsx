'use client';

import { useState, FormEvent } from 'react';

const STEPS = 4;
const PROJECT_TYPES = [
  { id: 'website', label: 'Nieuwe website' },
  { id: 'redesign', label: 'Website redesign' },
  { id: 'branding', label: 'Branding / huisstijl' },
  { id: 'other', label: 'Anders' },
] as const;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactOnboarding() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep(): boolean {
    const err: Record<string, string> = {};
    if (step === 2) {
      const name = formData.name.trim();
      const email = formData.email.trim();
      if (!name || name.length < 2) err.name = 'Vul een geldige naam in (min. 2 tekens)';
      if (!email) err.email = 'Vul een e-mailadres in';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Vul een geldig e-mailadres in';
    }
    if (step === 3) {
      const msg = formData.message.trim();
      if (!msg || msg.length < 10) err.message = 'Vul een bericht in (min. 10 tekens)';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleNext() {
    if (step === 1 && !projectType) return;
    if ((step === 2 || step === 3) && !validateStep()) return;
    if (step < STEPS) setStep(step + 1);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          projectType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Verzenden mislukt');
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setProjectType(null);
      setStep(1);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 rounded-md border border-ebony bg-ink/50 text-center">
        <p className="text-h3 font-semibold text-cornsilk mb-2">Bedankt!</p>
        <p className="text-body text-dry-sage">
          Je bericht is verzonden. We nemen zo snel mogelijk contact op.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-h3 font-semibold text-cornsilk">Stuur een bericht</h2>

      {/* Progress */}
      <div className="mt-6 flex gap-2 mb-8" aria-hidden>
        {Array.from({ length: STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors ${
              i + 1 <= step ? 'bg-dry-sage' : 'bg-ebony/50'
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Project type */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-body text-dry-sage">Waar kunnen we je mee helpen?</p>
            <div className="flex flex-wrap gap-3">
              {PROJECT_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setProjectType(id)}
                  className={`px-4 py-3 rounded-md border font-medium transition-colors ${
                    projectType === id
                      ? 'border-dry-sage bg-dry-sage/10 text-cornsilk'
                      : 'border-ebony text-dry-sage hover:border-grey-olive hover:text-cornsilk'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Name & Email */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="onboard-name" className="block text-small font-medium text-dry-sage">
                Naam
              </label>
              <input
                id="onboard-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                autoComplete="name"
                aria-invalid={!!errors.name}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="Je naam"
              />
              {errors.name && (
                <p className="mt-1 text-small text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="onboard-email" className="block text-small font-medium text-dry-sage">
                E-mail
              </label>
              <input
                id="onboard-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="je@email.nl"
              />
              {errors.email && (
                <p className="mt-1 text-small text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Message */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="onboard-message" className="block text-small font-medium text-dry-sage">
                Bericht
              </label>
              <textarea
                id="onboard-message"
                value={formData.message}
                onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                rows={5}
                aria-invalid={!!errors.message}
                className="mt-2 block w-full min-h-[120px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none resize-y"
                placeholder="Vertel over je project..."
              />
              {errors.message && (
                <p className="mt-1 text-small text-red-600" role="alert">
                  {errors.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-md border border-ebony bg-ink/50 space-y-3">
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Project:</span>{' '}
                {PROJECT_TYPES.find((p) => p.id === projectType)?.label ?? '-'}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Naam:</span> {formData.name}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">E-mail:</span> {formData.email}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Bericht:</span>
                <br />
                <span className="text-cornsilk">{formData.message}</span>
              </p>
            </div>
            {status === 'error' && (
              <p className="text-body text-red-600" role="alert">
                Er ging iets mis. Probeer het later opnieuw of mail direct naar info@blitzworx.nl.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-md border border-ebony text-dry-sage hover:border-grey-olive hover:text-cornsilk transition-colors"
            >
              Terug
            </button>
          ) : (
            <div />
          )}
          <div className="flex-1" />
          {step < STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !projectType}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Volgende
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'submitting' ? 'Verzenden...' : 'Verstuur'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
