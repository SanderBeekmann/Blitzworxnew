import type { Metadata } from 'next';
import { HeroSection } from './sections/home/HeroSection';
import { AboutIntroSection } from './sections/home/AboutIntroSection';
import { RecentCasesSection } from './sections/home/RecentCasesSection';
import { HowItWorxSection } from './sections/home/HowItWorxSection';
import { SkillsSection } from './sections/home/SkillsSection';
import { TestimonialSection } from './sections/home/TestimonialSection';
import { WhyBlitzworxSection } from './sections/home/WhyBlitzworxSection';
import { AnimatedGradient } from '@/components/layout/AnimatedGradient';
import { MaintenanceSection } from '@/components/sections/MaintenanceSection';
import { GradientBlob } from '@/components/ui/GradientBlob';

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
    <div className="relative">
      <GradientBlob className="top-[85vh] right-[-8%] w-[400px] h-[300px] opacity-35" duration={22} />
      <GradientBlob className="top-[280vh] left-[-12%] w-[350px] h-[400px] opacity-30" duration={18} delay={4} />
      <GradientBlob className="top-[420vh] right-[3%] w-[300px] h-[250px] opacity-35" duration={25} delay={8} />
      <AnimatedGradient className="relative">
        <HeroSection />
        <AboutIntroSection />
      </AnimatedGradient>
      <div className="relative z-10">
        <div className="relative z-30">
          <RecentCasesSection />
          <HowItWorxSection />
          <MaintenanceSection />
          <WhyBlitzworxSection />
          <SkillsSection />
          <TestimonialSection />
        </div>
      </div>
    </div>
  );
}
