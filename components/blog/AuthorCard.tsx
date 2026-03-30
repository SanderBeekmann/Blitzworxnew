import Image from 'next/image';
import Link from 'next/link';

export function AuthorCard({ className }: { className?: string }) {
  return (
    <section className={`relative flex items-start gap-5 p-6 border border-ebony rounded-sm overflow-hidden ${className ?? ''}`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
        }}
        aria-hidden
      />
      <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden">
        <Image
          src="/assets/images/Sander.webp"
          alt="Sander Beekman"
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="relative">
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
