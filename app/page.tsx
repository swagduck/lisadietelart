import React from 'react';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import { IntroStatement } from '@/components/home/IntroStatement';
import { SelectedWorkGrid } from '@/components/home/SelectedWorkGrid';
import { CommissionsSection } from '@/components/home/CommissionsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ValuePropsSection } from '@/components/home/ValuePropsSection';
import {
  HERO_SLIDES,
  getSelectedWorks,
  TESTIMONIALS_DATA,
  VALUE_PROPS_DATA,
} from '@/lib/data';

export const metadata = {
  title: 'Lisa Dietel — Contemporary Painter & Studio',
  description:
    'Original oil and mineral paintings, limited archival prints, and bespoke commissions by contemporary painter Lisa Dietel.',
};

export default async function HomePage() {
  const selectedWorks = await getSelectedWorks(6);

  return (
    <>
      {/* Full-screen Hero Carousel (2 slides, crossfade, arrows, dots, autoplay respecting prefers-reduced-motion) */}
      <HeroCarousel slides={HERO_SLIDES} />

      {/* Intro statement with "Originals" and "Art prints" buttons */}
      <IntroStatement />

      {/* "Selected work" grid (6 items) */}
      <SelectedWorkGrid artworks={selectedWorks} />

      {/* Commissions section */}
      <CommissionsSection />

      {/* 3 Testimonials */}
      <TestimonialsSection testimonials={TESTIMONIALS_DATA} />

      {/* 3 Value Props */}
      <ValuePropsSection props={VALUE_PROPS_DATA} />
    </>
  );
}
