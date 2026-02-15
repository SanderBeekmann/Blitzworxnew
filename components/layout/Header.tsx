'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/cases', label: 'Cases' },
];

const SCROLL_THRESHOLD = 10;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showCta, setShowCta] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < SCROLL_THRESHOLD) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      if (pathname === '/') {
        setShowCta(currentScrollY >= window.innerHeight);
      } else {
        setShowCta(true);
      }
      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-out motion-reduce:transition-none ${
        showCta || mobileOpen ? 'bg-ink/95 backdrop-blur-sm border-b border-ebony' : 'bg-transparent border-b border-transparent'
      }`}
      style={{ transform: visible || mobileOpen ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <nav
        className="w-full max-w-full px-4 sm:px-6 lg:px-8 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between md:justify-items-stretch h-16 md:h-20"
        aria-label="Hoofdnavigatie"
      >
        <Link
          href="/"
          className="text-xl font-semibold text-cornsilk tracking-tight hover:text-dry-sage transition-colors justify-self-start"
        >
          BLITZWORX
        </Link>

        <ul className="hidden md:flex items-center justify-center gap-8 justify-self-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-body font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-dry-sage'
                    : 'text-grey-olive hover:text-cornsilk'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-4 justify-self-end">
          <Link
            href="/contact"
            className={`hidden md:inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors transition-opacity duration-300 ${
              showCta ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Contact
          </Link>
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu openen"
          >
          <span
            className={`block w-6 h-0.5 bg-cornsilk transition-transform ${
              mobileOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-cornsilk transition-opacity ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-cornsilk transition-transform ${
              mobileOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-ebony bg-ink">
          <ul className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-body font-medium ${
                    pathname === link.href ? 'text-dry-sage' : 'text-grey-olive'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center min-h-[44px] w-full px-6 py-3 bg-dry-sage text-ink font-medium rounded-md"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
