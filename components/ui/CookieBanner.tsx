'use client';

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Cookie instellingen"
      className="fixed bottom-0 left-0 right-0 z-[200] border-t border-ebony/30 bg-ink/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-4 px-[var(--gutter)] py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-cornsilk/80">
          We gebruiken cookies om het websiteverkeer te analyseren.{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-cornsilk">
            Privacybeleid
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={onDecline}
            className="inline-flex items-center justify-center rounded-md border border-cornsilk/30 px-4 py-2 text-sm font-medium text-cornsilk transition-colors hover:border-cornsilk hover:bg-cornsilk/10"
          >
            Weigeren
          </button>
          <button
            onClick={onAccept}
            className="inline-flex items-center justify-center rounded-md bg-dry-sage px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-cornsilk"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
}
