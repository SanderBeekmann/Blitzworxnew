'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/klanten', label: 'Klanten' },
  { href: '/admin/agenda', label: 'Agenda' },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/admin' || pathname === '/admin/login';

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#040711] text-[#fefadc] flex flex-col">
      <header className="sticky top-0 z-10 border-b border-[#545c52] bg-[#040711]/95 backdrop-blur-sm">
        <div className="container-narrow flex items-center justify-between h-14 px-4 sm:px-6">
          <Link
            href="/admin/leads"
            className="text-lg font-semibold text-[#fefadc] hover:text-[#cacaaa] transition-colors"
          >
            Blitzworx Admin
          </Link>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'bg-[#cacaaa]/20 text-[#cacaaa]'
                    : 'text-[#8b8174] hover:text-[#fefadc] hover:bg-[#545c52]/30'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
