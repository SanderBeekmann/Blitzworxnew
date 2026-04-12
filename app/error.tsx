'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section min-h-[60vh] flex flex-col justify-center">
      <div className="container-narrow text-center">
        <h1 className="text-hero font-bold text-cornsilk">Oeps</h1>
        <p className="mt-4 text-body text-dry-sage">
          Er ging iets mis. Probeer het opnieuw of ga terug naar de homepage.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border border-dry-sage text-dry-sage font-medium rounded-md hover:bg-dry-sage hover:text-ink transition-colors"
          >
            Opnieuw proberen
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
          >
            Naar homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
