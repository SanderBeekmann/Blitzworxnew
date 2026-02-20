'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgressIndicator } from '@/components/ui/ScrollProgressIndicator';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
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
