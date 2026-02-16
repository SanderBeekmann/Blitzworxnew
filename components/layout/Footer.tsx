import Link from 'next/link';
import { FooterBars } from '@/components/animations/FooterBars';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/cases', label: 'Cases' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 bg-neutral-900 text-dry-sage overflow-hidden">
      <div className="container-narrow pt-16 pb-32">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Link href="/" className="text-xl font-semibold text-cornsilk">
              BLITZWORX
            </Link>
            <p className="mt-2 text-small max-w-prose">
              Webdesign That Worx! Creative agency voor ondernemers die online willen groeien.
            </p>
          </div>
          <nav aria-label="Footer navigatie">
            <ul className="flex flex-wrap gap-6">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small hover:text-cornsilk transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 pt-8 border-t border-ebony">
          <p className="text-caption text-grey-olive">
            © {currentYear} BLITZWORX. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
      <FooterBars />
    </footer>
  );
}
