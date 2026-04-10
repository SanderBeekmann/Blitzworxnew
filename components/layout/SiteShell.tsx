'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgressIndicator } from '@/components/ui/ScrollProgressIndicator';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isIntake = pathname?.startsWith('/intake');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Preload GSAP + ScrollTrigger so animations trigger on first paint
  useEffect(() => {
    if (!isIntake) {
      import('@/lib/gsap').then(({ loadGsap }) => loadGsap());
    }
  }, [isIntake]);

  if (isAdmin || isIntake) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <ScrollProgressIndicator />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
