'use client';

import { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

interface LockedResultsOverlayProps {
  email: string;
  emailError: string;
  isSubmitting: boolean;
  newsletterOptIn: boolean;
  onEmailChange: (val: string) => void;
  onNewsletterOptInChange: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void;
}

function LockIcon() {
  return (
    <svg
      className="w-10 h-10 text-dry-sage"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-dry-sage shrink-0 mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function LockedResultsOverlay({
  email,
  emailError,
  isSubmitting,
  newsletterOptIn,
  onEmailChange,
  onNewsletterOptInChange,
  onSubmit,
}: LockedResultsOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-24 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-xl mx-4">
        <div
          className="relative p-10 rounded-sm border border-dry-sage/30 overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(4,7,17,0.96) 0%, rgba(13,17,23,0.96) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {/* Subtle accent glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(202,202,170,0.08) 0%, transparent 60%)',
            }}
          />

          <div className="relative text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full border border-dry-sage/20 bg-ink/40">
                <LockIcon />
              </div>
            </div>

            <h3 className="text-h3 font-bold text-cornsilk mb-3">
              Jouw volledige rapport
            </h3>

            <p className="text-body text-dry-sage leading-relaxed mb-8 max-w-md mx-auto">
              Ontvang het volledige rapport met concrete actiepunten per categorie en een AI-analyse van je site. Direct in je inbox.
            </p>

            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="jouw@email.nl"
                disabled={isSubmitting}
                aria-invalid={!!emailError}
                className="flex-1 min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none disabled:opacity-50"
              />
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Bezig...' : 'Ontgrendel rapport'}
              </Button>
            </form>

            {emailError && (
              <p role="alert" className="mt-3 text-small text-[#c45c5c] text-left">
                {emailError}
              </p>
            )}

            <p className="mt-5 mb-2 text-xs text-grey-olive text-left">
              Je rapport ontvang je sowieso. Dit is optioneel:
            </p>

            <label className="mb-6 flex items-start gap-3 text-left text-small text-dry-sage cursor-pointer">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => onNewsletterOptInChange(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 shrink-0 accent-dry-sage cursor-pointer"
              />
              <span>
                Ja, stuur me praktische tips waarmee mijn website meer klanten oplevert.
                Afmelden kan altijd met één klik onderaan elke e-mail. Zie onze{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-cornsilk"
                >
                  privacyverklaring
                </a>
                .
              </span>
            </label>

            <ul className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-6 text-small text-grey-olive">
              <li className="flex items-center gap-2 justify-center">
                <CheckIcon />
                <span>Gratis en vrijblijvend</span>
              </li>
              <li className="flex items-center gap-2 justify-center">
                <CheckIcon />
                <span>Direct in je inbox</span>
              </li>
              <li className="flex items-center gap-2 justify-center">
                <CheckIcon />
                <span>Geen spam</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
