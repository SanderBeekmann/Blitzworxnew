import type { Metadata } from 'next';
import { HeroSection } from './sections/home/HeroSection';
import { AboutIntroSection } from './sections/home/AboutIntroSection';
import { RecentCasesSection } from './sections/home/RecentCasesSection';
import { HowItWorxSection } from './sections/home/HowItWorxSection';
import { SkillsSection } from './sections/home/SkillsSection';
import { TestimonialSection } from './sections/home/TestimonialSection';
import { WhyBlitzworxSection } from './sections/home/WhyBlitzworxSection';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { MaintenanceSection } from '@/components/sections/MaintenanceSection';

export const metadata: Metadata = {
  title: 'Development, UI/UX Design & Branding voor Ondernemers',
  description:
    'Blitzworx is een AI-development partner voor ondernemers die online willen groeien. Webdesign, development en branding vanuit Zwolle.',
  openGraph: {
    title: 'Blitzworx | Development That Worx!',
    description:
      'AI-development voor ondernemers die online willen groeien. Webdesign, development en branding.',
    url: '/',
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="relative z-10">
        <AboutIntroSection />
        <div className="relative z-50 w-full">
          <AnnouncementBar />
        </div>
        <div className="relative z-30">
          <RecentCasesSection />
          <HowItWorxSection />
          <MaintenanceSection />
          <WhyBlitzworxSection />
          <SkillsSection />
          <TestimonialSection />
        </div>
      </div>
    </>
  );
}
