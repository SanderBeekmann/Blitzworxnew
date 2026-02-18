import Link from 'next/link';
import { FooterBars } from '@/components/animations/FooterBars';
import { FooterLogo } from '@/components/animations/FooterLogo';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/cases', label: 'Cases' },
  { href: '/contact', label: 'Contact' },
];

const footerSkills = ['Webdesign', 'Development', 'Branding'];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 bg-neutral-900 text-dry-sage overflow-hidden">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 md:items-start gap-12">
          <div>
            <FooterLogo />
            <p className="mt-2 text-small max-w-prose">
              Webdesign That Worx! Creative agency voor ondernemers die online willen groeien.
            </p>
          </div>
          <div />
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-left">
            <nav aria-label="Footer navigatie">
              <h3 className="text-small font-semibold text-cornsilk mb-4">Pagina&apos;s</h3>
              <ul className="flex flex-col gap-3">
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
            <div>
              <h3 className="text-small font-semibold text-cornsilk mb-4">Skills</h3>
              <ul className="flex flex-col gap-3">
                {footerSkills.map((skill) => (
                  <li key={skill} className="text-small text-dry-sage">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
