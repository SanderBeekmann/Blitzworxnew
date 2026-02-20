'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
const navLinks: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/diensten', label: 'Diensten' },
  { href: '/cases', label: 'Cases' },
];

const SCROLL_THRESHOLD = 10;
const MOBILE_DIRECTION_THRESHOLD = 15;
const MOBILE_SHOW_DELAY_MS = 120;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showCta, setShowCta] = useState(false);
  const [inAboutHero, setInAboutHero] = useState(false);
  const lastScrollY = useRef(0);
  const hasScrolledUpRef = useRef(false);
  const showDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAboutPage = pathname === '/about';

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (isAboutPage) {
      setVisible(false);
      setInAboutHero(window.scrollY < window.innerHeight);
      hasScrolledUpRef.current = false;
      lastScrollY.current = window.scrollY;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      const isMobile = window.innerWidth < 768;

      if (isAboutPage) {
        const inHero = currentScrollY < window.innerHeight;
        setInAboutHero(inHero);
        if (currentScrollY < lastScrollY.current && lastScrollY.current > SCROLL_THRESHOLD) {
          hasScrolledUpRef.current = true;
        }
        const showNav =
          hasScrolledUpRef.current &&
          (currentScrollY < SCROLL_THRESHOLD || currentScrollY < lastScrollY.current);
        setVisible(showNav);
        setShowCta(true);
      } else {
        if (currentScrollY < SCROLL_THRESHOLD) {
          if (showDelayRef.current) {
            clearTimeout(showDelayRef.current);
            showDelayRef.current = null;
          }
          setVisible(true);
        } else if (isMobile) {
          if (Math.abs(delta) >= MOBILE_DIRECTION_THRESHOLD) {
            if (delta > 0) {
              if (showDelayRef.current) {
                clearTimeout(showDelayRef.current);
                showDelayRef.current = null;
              }
              setVisible(false);
            } else {
              if (!showDelayRef.current) {
                showDelayRef.current = setTimeout(() => {
                  showDelayRef.current = null;
                  setVisible(true);
                }, MOBILE_SHOW_DELAY_MS);
              }
            }
          }
        } else {
          if (delta > 0) {
            setVisible(false);
          } else {
            setVisible(true);
          }
        }
        setShowCta(pathname === '/' ? currentScrollY >= window.innerHeight : true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (showDelayRef.current) {
        clearTimeout(showDelayRef.current);
      }
    };
  }, [pathname, isAboutPage]);

  const showBackground = showCta || mobileOpen;
  const aboutHeroTransparent = isAboutPage && inAboutHero && !mobileOpen;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('navbar-visibility-change', { detail: { visible: visible || mobileOpen } }));
  }, [visible, mobileOpen]);

  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  const closeMenu = useCallback(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMobileOpen(false);
      return;
    }
    import('gsap').then(({ gsap }) => {
      const overlay = menuRef.current;
      const panel = panelRef.current;
      const items = itemsRef.current?.querySelectorAll('li');
      if (!overlay || !items?.length) {
        setMobileOpen(false);
        return;
      }
      gsap.to(items, { opacity: 0, duration: 0.12, ease: 'power2.in' });
      const finishClose = () => {
        gsap.to(overlay, { opacity: 0, duration: 0.08, ease: 'power2.in', onComplete: () => setMobileOpen(false) });
      };
      if (panel) {
        gsap.to(panel, { x: '100%', duration: 0.25, ease: 'power2.in', onComplete: finishClose });
      } else {
        finishClose();
      }
    }).catch(() => setMobileOpen(false));
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleEscape);
    if (prefersReducedMotion) return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
    import('gsap').then(({ gsap }) => {
      const panel = panelRef.current;
      const items = itemsRef.current?.querySelectorAll('li');
      if (!items?.length) return;
      if (panel) {
        gsap.set(panel, { x: '100%' });
        gsap.to(panel, { x: 0, duration: 0.4, ease: 'power3.out' });
      }
      gsap.set(items, { opacity: 0, x: 32 });
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.45,
        stagger: 0.06,
        delay: 0.1,
        ease: 'power3.out',
      });
    });
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileOpen, closeMenu]);

  const handleMenuLinkClick = () => {
    closeMenu();
  };

  const handleToggleClick = () => {
    if (mobileOpen) {
      closeMenu();
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out motion-reduce:transition-none bg-transparent border-b border-transparent ${
        showBackground && !aboutHeroTransparent ? 'md:bg-ink/95 md:backdrop-blur-sm md:border-b md:border-ebony' : ''
      }`}
      style={{ transform: visible || mobileOpen ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      {mobileOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed inset-0 top-0 z-[100] min-h-screen overflow-hidden"
          aria-label="Navigatiemenu"
          onClick={closeMenu}
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-ink/25 cursor-pointer" aria-hidden />
          <div
            ref={panelRef}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-ink flex flex-col items-start justify-center translate-x-full"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col items-start justify-center w-full px-6 sm:px-8 py-8">
              <ul ref={itemsRef} className="flex flex-col items-start gap-6 sm:gap-8 w-full">
                {navLinks.map((link) => (
                  <li key={link.href} className="w-full text-left">
                    <Link
                      href={link.href}
                      onClick={handleMenuLinkClick}
                      className={`block py-3 text-2xl font-medium tracking-tight transition-colors w-full ${
                        pathname === link.href
                          ? 'text-dry-sage'
                          : 'text-cornsilk hover:text-dry-sage'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 w-full text-left">
                  <Link
                    href="/contact"
                    onClick={handleMenuLinkClick}
                    className="inline-flex items-center justify-start min-h-[52px] w-full px-6 py-4 bg-dry-sage text-ink font-semibold rounded-md hover:bg-cornsilk hover:shadow-[0_0_32px_rgba(254,250,220,0.18)] transition-all duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      <nav
        className="relative z-[110] w-full max-w-full px-4 sm:px-6 lg:px-8 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between md:justify-items-stretch h-16 md:h-20"
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
            onClick={handleToggleClick}
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
    </header>
  );
}
