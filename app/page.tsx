import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import { IntroStatement } from '@/components/home/IntroStatement';
import { SelectedWorkGrid } from '@/components/home/SelectedWorkGrid';
import { CommissionsSection } from '@/components/home/CommissionsSection';
import { ValuePropsSection } from '@/components/home/ValuePropsSection';

const TestimonialsSection = dynamic(
  () => import('@/components/home/TestimonialsSection').then((mod) => mod.TestimonialsSection),
  {
    loading: () => <div className="min-h-[200px]" />,
  }
);
import {
  HERO_SLIDES,
  TESTIMONIALS_DATA,
  VALUE_PROPS_DATA,
} from '@/lib/data';
import { getSelectedWorks } from '@/lib/server-data';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export const metadata = {
  title: 'Lisa Dietel — Contemporary Painter & Studio',
  description:
    'Original oil and mineral paintings, limited archival prints, and bespoke commissions by contemporary painter Lisa Dietel.',
  openGraph: {
    title: 'Lisa Dietel — Contemporary Painter & Studio',
    description:
      'Original oil and mineral paintings, limited archival prints, and bespoke commissions by contemporary painter Lisa Dietel.',
    url: '/',
    images: [
      {
        url: '/images/nocturne-in-ochre.svg',
        width: 1200,
        height: 630,
        alt: 'Lisa Dietel Fine Art',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lisa Dietel — Contemporary Painter & Studio',
    description:
      'Original oil and mineral paintings, limited archival prints, and bespoke commissions.',
    images: ['/images/nocturne-in-ochre.svg'],
  },
  alternates: {
    canonical: '/',
  },
};

function SelectedWorkSliderSkeleton() {
  return (
    <section
      className="w-full overflow-x-clip py-16 md:py-24 space-y-10"
      style={{ paddingInline: 'clamp(16px, 4vw, 56px)' }}
      aria-label="Loading selected artworks"
      aria-busy="true"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 sm:h-12 w-64 rounded bg-line/80 animate-pulse" />
          <div className="h-4 w-80 rounded bg-line/50 animate-pulse" />
        </div>
        <div className="h-4 w-24 rounded bg-line/60 animate-pulse" />
      </div>

      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="shrink-0 aspect-[4/5] w-[280px] sm:w-[320px] rounded-sm bg-mist/40 animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

async function AsyncSelectedWorks() {
  const selectedWorks = await getSelectedWorks(6);
  return <SelectedWorkGrid artworks={selectedWorks} />;
}

export default function HomePage() {
  return (
    <>
      {/* Full-screen Hero Carousel (2 slides, crossfade, arrows, dots, autoplay respecting prefers-reduced-motion) */}
      <HeroCarousel slides={HERO_SLIDES} />

      {/* Intro statement with "Originals" and "Art prints" buttons */}
      <IntroStatement />

      {/* "Selected work" grid streamed with Suspense */}
      <Suspense fallback={<SelectedWorkSliderSkeleton />}>
        <AsyncSelectedWorks />
      </Suspense>

      {/* Commissions section */}
      <CommissionsSection />

      {/* 3 Testimonials */}
      <TestimonialsSection testimonials={TESTIMONIALS_DATA} />

      {/* 3 Value Props */}
      <ValuePropsSection props={VALUE_PROPS_DATA} />
    </>
  );
}
