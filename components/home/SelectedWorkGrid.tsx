'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { ArrowRight } from 'lucide-react';
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

interface SelectedWorkGridProps {
  artworks: IArtwork[];
}

function SelectedWorkCard({
  artwork,
  index,
  total,
}: {
  artwork: IArtwork;
  index: number;
  total: number;
}) {
  const { isPreloaded } = useCarousel();
  const primaryImg = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const secondImg =
    (artwork.images && artwork.images.length > 1 ? artwork.images[1] : null) ||
    (artwork.detailImages && artwork.detailImages.length > 0 ? artwork.detailImages[0] : null);

  const shouldEagerLoad = isPreloaded(index);
  const isSold = Boolean(artwork.isSoldOut || artwork.sold);

  return (
    <CarouselItem index={index} total={total}>
      <article className="group flex h-full flex-col border border-line bg-paper p-3 transition-all duration-300 hover:border-ink/20 hover:shadow-sm">
        {/* Portrait Aspect Ratio */}
        <Link
          href={`/artwork/${artwork.slug}`}
          prefetch={true}
          className="relative block aspect-[3/4] overflow-hidden bg-mist/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          aria-label={`View details for ${artwork.title}${isSold ? ' (Sold)' : ''}`}
        >
          {/* Primary Image with Soft Hover Zoom (1.02) */}
          <Image
            src={primaryImg}
            alt={artwork.title}
            fill
            loading={shouldEagerLoad ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={getCloudinaryBlurUrl(primaryImg)}
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Second Image Crossfade on Hover if Available */}
          {secondImg && (
            <Image
              src={secondImg}
              alt={`${artwork.title} detail view`}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={getCloudinaryBlurUrl(secondImg)}
              className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Small "Sold" Ribbon in Corner */}
          {isSold ? (
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-16 w-16 overflow-hidden">
              <div className="absolute -left-6 top-3 w-24 -rotate-45 bg-ink/90 py-0.5 text-center text-[9px] font-light tracking-widest text-paper shadow-sm">
                Sold
              </div>
            </div>
          ) : (
            /* Subtle Type Pill in Sentence Case */
            <div className="absolute right-3 top-3 z-10">
              <span className="border border-line/80 bg-paper/95 px-2.5 py-0.5 text-[11px] font-normal text-sage backdrop-blur-sm">
                {artwork.type === 'original' ? 'Original' : 'Art print'}
              </span>
            </div>
          )}
        </Link>

        <div className="mt-4 flex flex-1 flex-col justify-between space-y-2 px-1">
          <div>
            <h3 className="font-heading text-2xl font-normal leading-snug text-ink transition-colors group-hover:text-sage">
              <Link
                href={`/artwork/${artwork.slug}`}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                {artwork.title}
              </Link>
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs font-light text-muted">
              {artwork.medium}
            </p>
            <p className="font-sans text-[11px] tracking-wide text-muted/80">
              {artwork.dimensions || artwork.size}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-line/60 pt-3 text-xs">
            <div>
              {isSold ? (
                <span className="text-xs italic text-muted">
                  Private collection
                </span>
              ) : (
                <span className="text-sm font-normal text-ink">
                  {formatPrice(artwork.price)}
                </span>
              )}
            </div>

            <Link
              href={`/artwork/${artwork.slug}`}
              className="flex items-center gap-1 rounded-sm text-xs font-normal text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage group-hover:text-ink"
            >
              View artwork &rarr;
            </Link>
          </div>
        </div>
      </article>
    </CarouselItem>
  );
}

export function SelectedWorkGrid({ artworks }: SelectedWorkGridProps) {
  const displayItems = artworks.slice(0, 6);

  return (
    <section
      className="border-b border-line bg-paper px-6 py-24 md:px-12"
      aria-labelledby="selected-work-title"
    >
      <div className="mx-auto max-w-7xl">
        <Carousel
          variant="cards"
          ariaLabel="Curated Selected Work Carousel"
          totalSlidesCount={displayItems.length}
          showSideFade={true}
          sideFadeColor="light"
          className="space-y-8"
        >
          {/* Header Row in Sentence Case with Generous Whitespace */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="mb-2 block text-xs font-normal text-sage">
                Curated selection
              </span>
              <h2
                id="selected-work-title"
                className="font-heading text-4xl font-normal text-ink md:text-5xl"
              >
                Selected work
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/originals"
                className="group inline-flex items-center gap-2 rounded-sm text-xs font-medium text-ink transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <span>View all originals &amp; prints</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Accessible Controls: Left/Right Arrows */}
              <div className="hidden md:flex items-center gap-2">
                <CarouselPrevious className="h-9 w-9 p-2" />
                <CarouselNext className="h-9 w-9 p-2" />
              </div>
            </div>
          </div>

          {/* Cards Track: 1.15 visible on mobile, 2 on tablet, 3 on desktop with Peek */}
          <CarouselContent className="py-2">
            {displayItems.map((artwork, idx) => (
              <SelectedWorkCard
                key={artwork.id || artwork._id || artwork.slug}
                artwork={artwork}
                index={idx}
                total={displayItems.length}
              />
            ))}
          </CarouselContent>

          {/* Pagination Dots */}
          <div className="pt-2">
            <CarouselDots />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

export default SelectedWorkGrid;
