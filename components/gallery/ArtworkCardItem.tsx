import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ArtworkCardItemProps {
  artwork: IArtwork;
}

export function ArtworkCardItem({ artwork }: ArtworkCardItemProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col border border-line bg-paper p-3 shadow-sm transition-all duration-300',
        artwork.isSoldOut
          ? 'opacity-90 hover:border-line'
          : 'hover:border-ink/20 hover:shadow-xl'
      )}
    >
      {/* Artwork Image Frame */}
      <Link
        href={`/artwork/${artwork.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-mist/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        aria-label={`View ${artwork.title}${artwork.isSoldOut ? ' (Sold Out)' : ''}`}
      >
        <Image
          src={artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg'}
          alt={artwork.title}
          fill
          className={cn(
            'object-cover transition-transform duration-700 ease-out',
            artwork.isSoldOut
              ? 'group-hover:scale-102 grayscale-[20%]'
              : 'group-hover:scale-105'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className="absolute right-3 top-3 z-10">
          {artwork.isSoldOut ? (
            <span className="border border-line bg-paper/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-muted shadow-sm">
              Sold Out
            </span>
          ) : (
            <span className="border border-line bg-paper/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-sage shadow-sm">
              Available
            </span>
          )}
        </div>
      </Link>

      {/* Artwork Metadata */}
      <div className="mt-4 flex flex-1 flex-col justify-between space-y-2 px-1">
        <div>
          <h2 className="font-heading text-2xl leading-snug text-ink transition-colors group-hover:text-sage">
            <Link
              href={`/artwork/${artwork.slug}`}
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              {artwork.title}
            </Link>
          </h2>
          <p className="mt-0.5 line-clamp-1 text-xs font-light text-muted">
            {artwork.medium}
          </p>
          <p className="font-sans text-[11px] tracking-wide text-muted/80">
            {artwork.size || artwork.dimensions}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line/60 pt-3 text-xs">
          <div>
            {artwork.isSoldOut ? (
              <span className="text-[11px] italic text-muted">Private Collection</span>
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
            {artwork.isSoldOut ? 'View Archive &rarr;' : 'View Details &rarr;'}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArtworkCardItem;
