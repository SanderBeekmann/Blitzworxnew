'use client';

import { useState, FormEvent, useEffect } from 'react';

const STEPS = 5;
const PROJECT_TYPES = [
  { id: 'website', label: 'Nieuwe website' },
  { id: 'redesign', label: 'Website redesign' },
  { id: 'branding', label: 'Branding / huisstijl' },
  { id: 'other', label: 'Anders' },
] as const;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const DUTCH_DAY_NAMES: Record<number, string> = {
  0: 'Zo', 1: 'Ma', 2: 'Di', 3: 'Wo', 4: 'Do', 5: 'Vr', 6: 'Za',
};

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const day = DUTCH_DAY_NAMES[d.getDay()];
  const date = d.getDate();
  const month = d.getMonth() + 1;
  return `${day} ${date} ${month}`;
}

export function ContactOnboarding() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [preferredDate, setPreferredDate] = useState<string | null>(null);
  const [preferredTime, setPreferredTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step === 4) {
      fetch('/api/availability')
        .then((r) => r.json())
        .then(setAvailability)
        .catch(() => setAvailability({}));
    }
  }, [step]);

  function validateStep(): boolean {
    const err: Record<string, string> = {};
    if (step === 2) {
      const name = formData.name.trim();
      const email = formData.email.trim();
      const phone = formData.phone.trim();
      if (!name || name.length < 2) err.name = 'Vul een geldige naam in (min. 2 tekens)';
      if (!email) err.email = 'Vul een e-mailadres in';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Vul een geldig e-mailadres in';
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone || digitsOnly.length < 9) err.phone = 'Vul een geldig telefoonnummer in (min. 9 cijfers)';
    }
    if (step === 3) {
      const msg = formData.message.trim();
      if (!msg || msg.length < 10) err.message = 'Vul een bericht in (min. 10 tekens)';
    }
    if (step === 4) {
      if (!preferredDate || !preferredTime) err.slot = 'Kies een datum en tijd voor je gesprek';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleNext() {
    if (step === 1 && !projectType) return;
    if ((step === 2 || step === 3 || step === 4) && !validateStep()) return;
    if (step < STEPS) setStep(step + 1);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1500
  ): Promise<Response> {
    let lastError: Error | null = null;
    for (let i = 0; i < retries; i++) {
      const res = await fetch(url, options);
      if (res.status !== 503) return res;
      lastError = new Error(`Service tijdelijk niet beschikbaar (503). Poging ${i + 1}/${retries}.`);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
    }
    throw lastError ?? new Error('Verzenden mislukt');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;
    setStatus('submitting');
    try {
      const res = await fetchWithRetry('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          projectType,
          preferredDate,
          preferredTime,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Verzenden mislukt');
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setProjectType(null);
      setPreferredDate(null);
      setPreferredTime(null);
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

  const dates = Object.keys(availability).sort();

  return (
    <div>
      <h2 className="text-h3 font-semibold text-cornsilk">Stuur een bericht</h2>

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
                <p className="mt-1 text-small text-red-600" role="alert">{errors.name}</p>
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
                <p className="mt-1 text-small text-red-600" role="alert">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="onboard-phone" className="block text-small font-medium text-dry-sage">
                Telefoonnummer
              </label>
              <input
                id="onboard-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="06-12345678"
              />
              {errors.phone && (
                <p className="mt-1 text-small text-red-600" role="alert">{errors.phone}</p>
              )}
            </div>
          </div>
        )}

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
                <p className="mt-1 text-small text-red-600" role="alert">{errors.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-body text-dry-sage">
              Kies een datum en tijd voor een vrijblijvend gesprek. Avonden (18:00–22:00) en weekenden.
            </p>
            {errors.slot && (
              <p className="text-small text-red-600" role="alert">{errors.slot}</p>
            )}
            <div className="space-y-4 max-h-[320px] overflow-y-auto">
              {dates.length === 0 ? (
                <p className="text-small text-grey-olive">Laden...</p>
              ) : (
                dates.map((dateKey) => (
                  <div key={dateKey} className="space-y-2">
                    <p className="text-small font-medium text-cornsilk">
                      {formatDisplayDate(dateKey)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(availability[dateKey] ?? []).map((time) => {
                        const isSelected =
                          preferredDate === dateKey && preferredTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setPreferredDate(dateKey);
                              setPreferredTime(time);
                            }}
                            className={`px-3 py-2 rounded-md border text-small font-medium transition-colors ${
                              isSelected
                                ? 'border-dry-sage bg-dry-sage/20 text-cornsilk'
                                : 'border-ebony text-dry-sage hover:border-grey-olive hover:text-cornsilk'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {step === 5 && (
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
                <span className="text-dry-sage">Telefoon:</span> {formData.phone}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Bericht:</span>
                <br />
                <span className="text-cornsilk">{formData.message}</span>
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Gesprek:</span>{' '}
                {preferredDate && preferredTime
                  ? `${formatDisplayDate(preferredDate)} om ${preferredTime}`
                  : '-'}
              </p>
            </div>
            {status === 'error' && (
              <p className="text-body text-red-600" role="alert">
                Er ging iets mis. Probeer het later opnieuw of mail direct naar sander@blitzworx.nl.
              </p>
            )}
          </div>
        )}

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
