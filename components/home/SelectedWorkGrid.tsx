import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { ArrowRight } from 'lucide-react';

interface SelectedWorkGridProps {
  artworks: IArtwork[];
}

export function SelectedWorkGrid({ artworks }: SelectedWorkGridProps) {
  const displayItems = artworks.slice(0, 6);

  return (
    <section
      className="border-b border-line bg-paper px-6 py-24 md:px-12"
      aria-labelledby="selected-work-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-sage">
              Curated Selection
            </span>
            <h2
              id="selected-work-title"
              className="font-heading text-4xl font-normal text-ink md:text-5xl"
            >
              Selected Work
            </h2>
          </div>

          <Link
            href="/originals"
            className="group inline-flex items-center gap-2 rounded-sm text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <span>View All Originals &amp; Prints</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6-item Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {displayItems.map((artwork) => (
            <article
              key={artwork.id}
              className="group flex h-full flex-col border border-line bg-paper p-3 shadow-sm transition-all duration-300 hover:border-ink/20 hover:shadow-xl"
            >
              <Link
                href={`/artwork/${artwork.slug}`}
                className="relative block aspect-[3/4] overflow-hidden bg-mist/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                aria-label={`View details for ${artwork.title}`}
              >
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Status Badges */}
                <div className="absolute right-3 top-3 z-10">
                  {artwork.isSoldOut ? (
                    <span className="border border-line bg-paper/95 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted">
                      Sold Out
                    </span>
                  ) : artwork.type === 'original' ? (
                    <span className="border border-line bg-paper/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-sage shadow-sm">
                      Original
                    </span>
                  ) : (
                    <span className="border border-line bg-blush/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-ink shadow-sm">
                      Art Print
                    </span>
                  )}
                </div>
              </Link>

              <div className="mt-4 flex flex-1 flex-col justify-between space-y-2 px-1">
                <div>
                  <h3 className="font-heading text-2xl leading-snug text-ink transition-colors group-hover:text-sage">
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
                    {artwork.dimensions}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-line/60 pt-3 text-xs">
                  <div>
                    {artwork.isSoldOut ? (
                      <span className="text-[11px] italic text-muted">
                        Private Collection
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-ink">
                        {formatPrice(artwork.price)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/artwork/${artwork.slug}`}
                    className="flex items-center gap-1 rounded-sm text-[10px] font-medium uppercase tracking-wider text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage group-hover:text-ink"
                  >
                    View Artwork &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SelectedWorkGrid;
