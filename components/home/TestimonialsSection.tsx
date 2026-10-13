'use client';

import React from 'react';
import { ITestimonial } from '@/types/artwork';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/components/ui/Carousel';

interface TestimonialsSectionProps {
  testimonials: ITestimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section
      className="border-b border-line bg-paper px-6 py-24 md:px-12"
      aria-labelledby="testimonials-title"
    >
      <div className="mx-auto max-w-7xl">
        <Carousel
          variant="cards"
          ariaLabel="Collector reflections carousel"
          totalSlidesCount={testimonials.length}
          showSideFade={true}
          sideFadeColor="light"
          className="space-y-8"
        >
          {/* Header Row with Title and Carousel Arrows */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="mb-2 block text-xs font-normal text-sage">
                Collector reflections
              </span>
              <h2
                id="testimonials-title"
                className="font-heading text-4xl font-normal text-ink md:text-5xl"
              >
                Words from private collectors
              </h2>
            </div>

            {/* Accessible Navigation Arrows (hidden on touch, disabled at ends) */}
            <div className="hidden md:flex items-center gap-2">
              <CarouselPrevious className="h-9 w-9 p-2" />
              <CarouselNext className="h-9 w-9 p-2" />
            </div>
          </div>

          {/* Testimonial Cards Track (1.15 on mobile with peek, 3 on desktop) */}
          <CarouselContent className="py-2">
            {testimonials.map((test, idx) => (
              <CarouselItem
                key={test.id}
                index={idx}
                total={testimonials.length}
              >
                <figure className="relative flex h-full flex-col justify-between border border-line bg-paper p-8 transition-all duration-300 hover:border-ink/20">
                  <Quote className="mb-6 h-7 w-7 text-mist" strokeWidth={1.5} />

                  <blockquote className="flex-1 text-sm font-light italic leading-relaxed text-ink/90 md:text-base max-w-[60ch]">
                    &ldquo;{test.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-8 border-t border-line/60 pt-4">
                    <div className="font-heading text-lg font-normal text-ink">
                      {test.author}
                    </div>
                    <div className="text-xs font-light text-muted">{test.location}</div>
                    {test.acquiredArtwork && (
                      <div className="mt-1 text-xs font-normal text-sage">
                        {test.acquiredArtwork}
                      </div>
                    )}
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Clickable Pagination Dots */}
          <div className="pt-2">
            <CarouselDots />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

export default TestimonialsSection;
