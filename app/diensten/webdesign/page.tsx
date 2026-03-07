import type { Metadata } from 'next';
import { WebdesignPageClient } from './WebdesignPageClient';

export const metadata: Metadata = {
  title: 'Webdesign',
  description:
    'Professioneel webdesign voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk. Blitzworx maakt websites die werken.',
  alternates: { canonical: '/diensten/webdesign' },
};

export default function WebdesignPage() {
  return <WebdesignPageClient />;
}
