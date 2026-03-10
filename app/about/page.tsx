import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'Over Blitzworx — Ontmoet Sander, Creative Developer',
  description:
    'Maak kennis met Blitzworx en oprichter Sander. Ontdek onze visie, werkwijze en kernwaarden. Persoonlijke aanpak, geen tussenlagen.',
  openGraph: {
    title: 'Over Blitzworx — Ontmoet Sander',
    description:
      'Maak kennis met Blitzworx en oprichter Sander. Persoonlijke aanpak, geen tussenlagen.',
    url: '/about',
  },
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
