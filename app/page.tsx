import type { Metadata } from 'next';
import { HeroSection } from './sections/home/HeroSection';
import { AboutIntroSection } from './sections/home/AboutIntroSection';
import { RecentCasesSection } from './sections/home/RecentCasesSection';
import { HowItWorxSection } from './sections/home/HowItWorxSection';
import { SkillsSection } from './sections/home/SkillsSection';
import { TestimonialSection } from './sections/home/TestimonialSection';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';

export const metadata: Metadata = {
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
          <SkillsSection />
          <TestimonialSection />
        </div>
      </div>
    </>
  );
}
