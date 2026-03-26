'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

const navLinks: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/diensten', label: 'Diensten' },
  { href: '/cases', label: 'Cases' },
];

const DIENSTEN = [
  {
    href: '/diensten/webdesign',
    label: 'Webdesign',
    description: 'Visueel ontwerp dat jouw merk versterkt en bezoekers overtuigt.',
    mono: '01',
  },
  {
    href: '/diensten/development',
    label: 'Development',
    description: 'Op maat gemaakte websites en backends die meegroeien.',
    mono: '02',
  },
  {
    href: '/diensten/branding',
    label: 'Branding',
    description: 'Merkidentiteit en huisstijl die je onderneming herkenbaar maken.',
    mono: '03',
  },
  {
    href: '/diensten/ai-automatiseringen',
    label: 'AI Automatiseringen',
    description: 'Slimme workflows, chatbots en integraties die tijd besparen.',
    mono: '04',
  },
] as const;

const SCROLL_THRESHOLD = 10;
const MOBILE_DIRECTION_THRESHOLD = 60;
const MOBILE_SHOW_DELAY_MS = 250;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showCta, setShowCta] = useState(false);
  const [inAboutHero, setInAboutHero] = useState(false);
  const lastScrollY = useRef(0);
  const hasScrolledUpRef = useRef(false);
  const showDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cumulativeDelta = useRef(0);

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
          // Track cumulative scroll distance; reset when direction flips
          if ((delta > 0 && cumulativeDelta.current < 0) || (delta < 0 && cumulativeDelta.current > 0)) {
            cumulativeDelta.current = 0;
          }
          cumulativeDelta.current += delta;

          if (Math.abs(cumulativeDelta.current) >= MOBILE_DIRECTION_THRESHOLD) {
            if (cumulativeDelta.current > 0) {
              if (showDelayRef.current) {
                clearTimeout(showDelayRef.current);
                showDelayRef.current = null;
              }
              setVisible(false);
              cumulativeDelta.current = 0;
            } else {
              if (!showDelayRef.current) {
                showDelayRef.current = setTimeout(() => {
                  showDelayRef.current = null;
                  setVisible(true);
                  cumulativeDelta.current = 0;
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

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
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

  // Close mobile menu on route change and ensure overflow is always reset
  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  // Safety guard: always reset overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
                    {link.href === '/diensten' && (
                      <div className="pl-4 mt-1 flex flex-col gap-2">
                        {DIENSTEN.map((d) => (
                          <Link
                            key={d.href}
                            href={d.href}
                            onClick={handleMenuLinkClick}
                            className={`text-base transition-colors ${
                              pathname === d.href ? 'text-dry-sage' : 'text-grey-olive hover:text-cornsilk'
                            }`}
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    )}
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
          className="justify-self-start hover:opacity-80 transition-opacity"
        >
          <Image
            src="/assets/images/blitzworx-logo.png"
            alt="Blitzworx"
            width={140}
            height={32}
            className="h-5 sm:h-5 md:h-5 lg:h-6 xl:h-8 2xl:h-9 w-auto"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center justify-center gap-8 justify-self-center">
          {navLinks.map((link) => {
            if (link.href === '/diensten') {
              const isActive = pathname?.startsWith('/diensten');
              return (
                <li
                  key={link.href}
                  className="relative group"
                  onMouseLeave={() => {}}
                >
                  <Link
                    href={link.href}
                    className={`text-body font-medium transition-colors flex items-center gap-1 ${
                      isActive ? 'text-dry-sage' : 'text-grey-olive hover:text-cornsilk group-hover:text-cornsilk'
                    }`}
                  >
                    {link.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className="mt-px transition-transform duration-300 group-hover:rotate-180"
                    >
                      <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  {/* Invisible bridge between link and dropdown */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-[340px] h-6" />

                  {/* Dropdown panel */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[340px] pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-[opacity,transform] duration-300 ease-out"
                  >
                    {/* Subtle upward arrow */}
                    <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#0d1117] border-t border-l border-ebony/60" />

                    <div
                      className="relative overflow-hidden rounded-lg border border-ebony/60 bg-[#0d1117]/90 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(84,92,82,0.1)]"
                    >
                      {/* Ambient glow */}
                      <div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse, rgba(202,202,170,0.06) 0%, transparent 70%)' }}
                        aria-hidden
                      />

                      <div className="relative p-2">
                        {DIENSTEN.map((dienst) => {
                          const isItemActive = pathname === dienst.href;
                          return (
                            <Link
                              key={dienst.href}
                              href={dienst.href}
                              className={`group/item flex items-start gap-4 px-4 py-3.5 rounded-md transition-all duration-200 ${
                                isItemActive
                                  ? 'bg-ebony/20'
                                  : 'hover:bg-ebony/15'
                              }`}
                            >
                              <span className="text-[11px] font-mono text-grey-olive/40 mt-0.5 shrink-0 tabular-nums tracking-wider">
                                {dienst.mono}
                              </span>
                              <div className="min-w-0">
                                <span className={`block text-[15px] font-semibold transition-colors duration-200 ${
                                  isItemActive
                                    ? 'text-dry-sage'
                                    : 'text-cornsilk group-hover/item:text-dry-sage'
                                }`}>
                                  {dienst.label}
                                </span>
                                <span className="block text-[13px] text-grey-olive leading-relaxed mt-0.5">
                                  {dienst.description}
                                </span>
                              </div>
                              <span className="text-grey-olive/0 group-hover/item:text-grey-olive/60 transition-all duration-200 ml-auto mt-0.5 shrink-0 translate-x-[-4px] group-hover/item:translate-x-0">
                                →
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Bottom bar: link to overview */}
                      <div className="border-t border-ebony/40 px-4 py-3">
                        <Link
                          href="/diensten"
                          className="flex items-center justify-between text-[12px] font-mono tracking-wider uppercase text-grey-olive/50 hover:text-dry-sage transition-colors"
                        >
                          <span>Alle diensten</span>
                          <span className="transition-transform duration-200 hover:translate-x-0.5">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            }

            return (
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
            );
          })}
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
