import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section min-h-[60vh] flex flex-col justify-center">
      <div className="container-narrow text-center">
        <h1 className="text-hero font-bold text-cornsilk">404</h1>
        <p className="mt-4 text-body text-dry-sage">
          Deze pagina bestaat niet of is verplaatst.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
        >
          Naar homepage
        </Link>
      </div>
    </section>
  );
}
