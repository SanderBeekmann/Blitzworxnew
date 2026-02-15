import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Introducing Blitzworx – visie, werkwijze en kernwaarden. Ontmoet Sander en ontdek wat Blitzworx uniek maakt.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
