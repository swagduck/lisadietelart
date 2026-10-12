'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IHeroSlide } from '@/types/artwork';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCarouselProps {
  slides: IHeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay with prefers-reduced-motion check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    // Do not autoplay if user prefers reduced motion or is hovering
    if (prefersReducedMotion || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink"
      aria-label="Hero Artwork Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Slides Container with Crossfade */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              isActive
                ? 'pointer-events-auto z-10 opacity-100'
                : 'pointer-events-none z-0 opacity-0'
            )}
          >
            {/* Background Artwork Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.imageUrl}
                alt={slide.artworkTitle}
                fill
                priority={idx === 0}
                className="scale-105 object-cover object-center transition-transform duration-1000 ease-out"
                sizes="100vw"
              />
              {/* Atmospheric Dark & Film Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/30" />
            </div>

            {/* Slide Foreground Content */}
            <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-32">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-ink/40 px-3.5 py-1.5 text-xs uppercase tracking-widest text-paper/90 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                  {slide.badge}
                </div>

                <h1 className="font-heading text-4xl font-normal leading-[1.08] tracking-tight text-paper sm:text-6xl md:text-7xl">
                  {slide.title}
                </h1>

                <p className="max-w-xl text-sm font-light leading-relaxed text-paper/85 sm:text-base md:text-lg">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={slide.primaryCta.href}
                    className="bg-paper px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ink shadow-md transition-all duration-300 hover:bg-sage hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                  >
                    {slide.primaryCta.label}
                  </Link>
                  <Link
                    href={slide.secondaryCta.href}
                    className="border border-white/40 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-paper transition-all duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                </div>
              </div>

              {/* Artwork Label in Corner */}
              <div className="absolute bottom-24 right-12 hidden border-l border-white/20 py-1 pl-4 text-right text-paper/80 lg:block">
                <span className="block font-heading text-lg text-paper">
                  {slide.artworkTitle}
                </span>
                <span className="font-sans text-[11px] tracking-wide text-paper/70">
                  {slide.artworkDetails}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls: Arrows */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="pointer-events-auto rounded-full border border-white/10 bg-ink/30 p-3 text-paper/80 backdrop-blur-sm transition-all hover:bg-ink/60 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="pointer-events-auto rounded-full border border-white/10 bg-ink/30 p-3 text-paper/80 backdrop-blur-sm transition-all hover:bg-ink/60 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Controls: Pagination Dots */}
      <div
        className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-3"
        role="tablist"
        aria-label="Carousel pagination"
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={slide.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                'h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                isActive ? 'w-8 bg-paper' : 'w-2 bg-paper/40 hover:bg-paper/70'
              )}
            />
          );
        })}
      </div>
    </section>
  );
}

export default HeroCarousel;
