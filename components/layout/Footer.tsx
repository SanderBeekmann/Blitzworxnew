import Link from 'next/link';

import { FooterLogo } from '@/components/animations/FooterLogo';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/diensten', label: 'Diensten' },
  { href: '/blog', label: 'Blog' },
  { href: '/cases', label: 'Cases' },
  { href: '/contact', label: 'Contact' },
];

const footerSkills = ['UI/UX Design', 'Development', 'Branding', 'AI Automatiseringen'];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 bg-neutral-900 text-dry-sage overflow-hidden">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 md:items-start gap-12">
          <div>
            <div className="w-screen max-w-[100vw] -ml-4 sm:ml-0 md:ml-0 sm:max-w-none md:max-w-none">
              <FooterLogo />
            </div>
            <p className="mt-2 text-small max-w-prose px-4 sm:px-0 md:px-0">
              Webdesign, development en branding op maat voor ondernemers.
            </p>
            <div className="mt-4 flex items-center gap-4 px-4 sm:px-0 md:px-0">
              <a
                href="https://www.linkedin.com/company/blitzworx/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Blitzworx op LinkedIn"
                className="text-grey-olive hover:text-cornsilk transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/blitzworx.nl/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Blitzworx op Instagram"
                className="text-grey-olive hover:text-cornsilk transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-small font-semibold text-cornsilk mb-4">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:sander@blitzworx.nl"
                  className="text-small hover:text-cornsilk transition-colors"
                >
                  sander@blitzworx.nl
                </a>
              </li>
              <li>
                <a
                  href="tel:+31613026280"
                  className="text-small hover:text-cornsilk transition-colors"
                >
                  06 13 02 62 80
                </a>
              </li>
              <li className="text-small text-dry-sage">
                KvK 98139789
              </li>
            </ul>
          </div>
          <div className="flex flex-row gap-6 sm:gap-16 text-left">
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
            © {currentYear} BLITZWORX. Alle rechten voorbehouden. KvK 98139789
          </p>
        </div>
      </div>
    </footer>
  );
}
