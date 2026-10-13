import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

interface ArtworkCardItemProps {
  artwork: IArtwork;
}

export function ArtworkCardItem({ artwork }: ArtworkCardItemProps) {
  const primaryImg = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const secondImg =
    (artwork.images && artwork.images.length > 1 ? artwork.images[1] : null) ||
    (artwork.detailImages && artwork.detailImages.length > 0 ? artwork.detailImages[0] : null);

  const isSold = Boolean(artwork.isSoldOut || artwork.sold);

  return (
    <article
      className={cn(
        'group flex h-full flex-col border border-line bg-paper p-3 transition-all duration-300',
        isSold ? 'opacity-90 hover:border-line' : 'hover:border-ink/20 hover:shadow-sm'
      )}
    >
      {/* Artwork Image Frame - Portrait Ratio */}
      <Link
        href={`/artwork/${artwork.slug}`}
        prefetch={true}
        className="relative block aspect-[3/4] overflow-hidden bg-mist/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        aria-label={`View ${artwork.title}${isSold ? ' (Sold)' : ''}`}
      >
        {/* Primary Image with Soft Hover Zoom (1.02) */}
        <Image
          src={primaryImg}
          alt={artwork.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL={getCloudinaryBlurUrl(primaryImg)}
          className={cn(
            'object-cover transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none',
            'group-hover:scale-[1.02]',
            isSold && 'grayscale-[15%]'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          /* Available / Print Pill in Sentence Case */
          <div className="absolute right-3 top-3 z-10">
            <span className="border border-line/80 bg-paper/95 px-2.5 py-0.5 text-[11px] font-normal text-sage backdrop-blur-sm">
              {artwork.type === 'original' ? 'Original' : 'Art print'}
            </span>
          </div>
        )}
      </Link>

      {/* Artwork Metadata */}
      <div className="mt-4 flex flex-1 flex-col justify-between space-y-2 px-1">
        <div>
          <h2 className="font-heading text-2xl font-normal leading-snug text-ink transition-colors group-hover:text-sage">
            <Link
              href={`/artwork/${artwork.slug}`}
              prefetch={true}
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
            {isSold ? (
              <span className="text-xs italic text-muted">Private collection</span>
            ) : (
              <span className="text-sm font-normal text-ink">
                {formatPrice(artwork.price)}
              </span>
            )}
          </div>

          <Link
            href={`/artwork/${artwork.slug}`}
            prefetch={true}
            className="flex items-center gap-1 rounded-sm text-xs font-normal text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage group-hover:text-ink"
          >
            {isSold ? 'View archive &rarr;' : 'View artwork &rarr;'}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArtworkCardItem;
