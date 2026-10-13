'use client';

import React from 'react';
import Image from 'next/image';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { IHeroSlide } from '@/types/artwork';
import { cn } from '@/lib/utils';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
} from '@/components/ui/Carousel';

interface HeroCarouselProps {
  slides: IHeroSlide[];
}

function HeroSlideContent({
  slide,
  index,
  total,
}: {
  slide: IHeroSlide;
  index: number;
  total: number;
}) {
  const { activeIndex, isPreloaded } = useCarousel();
  const isActive = activeIndex === index;
  const isFirst = index === 0;
  const shouldEagerLoad = isFirst || isPreloaded(index);

  return (
    <CarouselItem index={index} total={total} className="relative h-screen min-h-[640px] max-h-[100svh] w-full overflow-hidden">
      {/* Background Artwork Image with Active Zoom / Ken Burns effect */}
      <div className="absolute inset-0">
        <Image
          src={slide.imageUrl}
          alt={slide.artworkTitle || slide.title}
          fill
          priority={isFirst}
          loading={isFirst ? undefined : shouldEagerLoad ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={getCloudinaryBlurUrl(slide.imageUrl)}
          className={cn(
            'object-cover object-center transition-transform duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none',
            isActive ? 'scale-105' : 'scale-100'
          )}
          sizes="100vw"
        />
        {/* Atmospheric Dark & Film Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/30" />
      </div>

      {/* Slide Foreground Content */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-32">
        <div className="max-w-2xl space-y-6">
          {slide.badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-ink/40 px-3.5 py-1.5 text-xs uppercase tracking-widest text-paper/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              {slide.badge}
            </div>
          )}

          <h1 className="font-heading text-4xl font-normal leading-[1.08] tracking-tight text-paper sm:text-6xl md:text-7xl">
            {slide.title}
          </h1>

          <p className="max-w-xl text-sm font-light leading-relaxed text-paper/85 sm:text-base md:text-lg">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {slide.primaryCta && (
              <TransitionLink
                href={slide.primaryCta.href}
                className="bg-paper px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ink shadow-md transition-all duration-300 hover:bg-sage hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                {slide.primaryCta.label}
              </TransitionLink>
            )}
            {slide.secondaryCta && (
              <TransitionLink
                href={slide.secondaryCta.href}
                className="border border-white/40 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-paper transition-all duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                {slide.secondaryCta.label}
              </TransitionLink>
            )}
          </div>
        </div>

        {/* Artwork Label in Corner */}
        {(slide.artworkTitle || slide.artworkDetails) && (
          <div className="absolute bottom-24 right-12 hidden border-l border-white/20 py-1 pl-4 text-right text-paper/80 lg:block">
            {slide.artworkTitle && (
              <span className="block font-heading text-lg text-paper">
                {slide.artworkTitle}
              </span>
            )}
            {slide.artworkDetails && (
              <span className="font-sans text-[11px] tracking-wide text-paper/70">
                {slide.artworkDetails}
              </span>
            )}
          </div>
        )}
      </div>
    </CarouselItem>
  );
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <Carousel
      variant="hero"
      ariaLabel="Hero Featured Artworks"
      autoplay={slides.length > 1}
      autoplayInterval={6500}
      loop={slides.length > 1}
      showSideFade={false}
      totalSlidesCount={slides.length}
      className="relative h-screen min-h-[640px] max-h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* Scroll-Snap Track */}
      <CarouselContent className="h-full">
        {slides.map((slide, idx) => (
          <HeroSlideContent
            key={slide.id}
            slide={slide}
            index={idx}
            total={slides.length}
          />
        ))}
      </CarouselContent>

      {/* Navigation Controls: Arrows (only if more than 1 slide) */}
      {slides.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8">
            <CarouselPrevious className="pointer-events-auto" />
            <CarouselNext className="pointer-events-auto" />
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center">
            <CarouselDots />
          </div>
        </>
      )}
    </Carousel>
  );
}

export default HeroCarousel;
