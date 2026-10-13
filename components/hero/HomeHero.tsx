import React from 'react';
import { getHeroSlides } from '@/lib/server-data';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import { TransitionLink } from '@/components/ui/TransitionLink';

function SimpleHeroFallback() {
  return (
    <section
      aria-label="Studio Introduction"
      className="relative h-screen min-h-[640px] max-h-[100svh] w-full overflow-hidden bg-ink flex items-center justify-center"
    >
      {/* Atmospheric Dark & Subtle Studio Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/70 to-ink/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mist/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      {/* Hero Foreground Content */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-32 w-full">
        <div className="max-w-2xl space-y-6">
          <h1 className="font-heading text-4xl font-normal leading-[1.08] tracking-tight text-paper sm:text-6xl md:text-7xl">
            Lisa Dietel
          </h1>

          <p className="max-w-xl text-sm font-light leading-relaxed text-paper/85 sm:text-base md:text-lg">
            Contemporary painter exploring atmospheric stillness, light, and tactile resonance on raw Belgian linen.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <TransitionLink
              href="/originals"
              className="bg-paper px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ink shadow-md transition-all duration-300 hover:bg-sage hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Explore Originals
            </TransitionLink>
            <TransitionLink
              href="/prints"
              className="border border-white/40 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-paper transition-all duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Browse Art Prints
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function HomeHero() {
  const slides = await getHeroSlides();

  if (!slides || slides.length === 0) {
    return <SimpleHeroFallback />;
  }

  return <HeroCarousel slides={slides} />;
}

export default HomeHero;
