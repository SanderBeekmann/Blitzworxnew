'use client';

import { useState, FormEvent } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const err: Record<string, string> = {};
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    if (!name || name.length < 2) {
      err.name = 'Vul een geldige naam in (min. 2 tekens)';
    }
    if (!email) {
      err.email = 'Vul een e-mailadres in';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = 'Vul een geldig e-mailadres in';
    }
    if (!message || message.length < 10) {
      err.message = 'Vul een bericht in (min. 10 tekens)';
    }

    return err;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    try {
      // Mock submit: in productie: POST naar API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      <h2 className="text-h3 font-semibold text-cornsilk">Stuur een bericht</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="contact-name" className="block text-small font-medium text-dry-sage">
            Naam
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
            placeholder="Je naam"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-small text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-small font-medium text-dry-sage">
            E-mail
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
            placeholder="je@email.nl"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-small text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-small font-medium text-dry-sage">
            Bericht
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className="mt-2 block w-full min-h-[120px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none resize-y"
            placeholder="Vertel over je project..."
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-small text-red-600" role="alert">
              {errors.message}
            </p>
          )}
        </div>
        {status === 'success' && (
          <p className="text-body text-green-600" role="status">
            Bedankt! Je bericht is verzonden. We nemen zo snel mogelijk contact op.
          </p>
        )}
        {status === 'error' && (
          <p className="text-body text-red-600" role="alert">
            Er ging iets mis. Probeer het later opnieuw of mail direct naar info@blitzworx.nl.
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'submitting' ? 'Verzenden...' : 'Verstuur'}
        </button>
      </form>
    </div>
  );
}
