import Link from 'next/link';

export function AuthorCard() {
  return (
    <section className="mt-12 flex items-start gap-5 p-6 border border-ebony rounded-sm bg-ink/50">
      <div className="shrink-0 w-14 h-14 rounded-full bg-ebony flex items-center justify-center text-cornsilk font-bold text-h3">
        SB
      </div>
      <div>
        <p className="font-bold text-cornsilk text-body">Sander Beekman</p>
        <p className="text-small text-grey-olive">Oprichter Blitzworx</p>
        <p className="mt-2 text-body text-dry-sage">
          Sander helpt ondernemers online groeien met webdesign, development en branding.
        </p>
        <div className="mt-3 flex gap-4">
          <Link
            href="/about"
            className="text-small text-grey-olive hover:text-cornsilk transition-colors"
          >
            Over Sander
          </Link>
          <a
            href="https://www.linkedin.com/in/sander-beekman-38b054251/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-small text-grey-olive hover:text-cornsilk transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
