import Link from 'next/link';

export default function CaseNotFound() {
  return (
    <section className="section min-h-[60vh] flex flex-col justify-center">
      <div className="container-narrow text-center">
        <h1 className="text-hero font-bold text-cornsilk">Case niet gevonden</h1>
        <p className="mt-4 text-body text-dry-sage">
          Deze case bestaat niet of is verwijderd.
        </p>
        <Link
          href="/cases"
          className="mt-8 inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
        >
          Terug naar cases
        </Link>
      </div>
    </section>
  );
}
