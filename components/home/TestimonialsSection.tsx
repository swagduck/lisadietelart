import React from 'react';
import { ITestimonial } from '@/types/artwork';
import { Quote } from 'lucide-react';

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
        <div className="mb-16 max-w-2xl">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Collector Reflections
          </span>
          <h2
            id="testimonials-title"
            className="font-heading text-4xl font-normal text-ink md:text-5xl"
          >
            Words from Private Collectors
          </h2>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {testimonials.map((test) => (
            <figure
              key={test.id}
              className="relative flex flex-col justify-between border border-line bg-paper p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Quote className="mb-6 h-8 w-8 text-mist" strokeWidth={1} />

              <blockquote className="flex-1 text-sm font-light italic leading-relaxed text-ink/90 md:text-base">
                &ldquo;{test.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-8 border-t border-line/60 pt-4">
                <div className="font-heading text-lg font-medium text-ink">
                  {test.author}
                </div>
                <div className="text-xs font-light text-muted">{test.location}</div>
                {test.acquiredArtwork && (
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-sage">
                    {test.acquiredArtwork}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
