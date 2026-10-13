'use client';

import React from 'react';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { Eye, Plus } from 'lucide-react';
import { useCart } from '../shop/CartContext';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

interface ArtworkCardProps {
  artwork: IArtwork;
  onQuickView: (artwork: IArtwork) => void;
}

export function ArtworkCard({ artwork, onQuickView }: ArtworkCardProps) {
  const { addItem } = useCart();
  const primaryImg = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const secondImg =
    (artwork.images && artwork.images.length > 1 ? artwork.images[1] : null) ||
    (artwork.detailImages && artwork.detailImages.length > 0 ? artwork.detailImages[0] : null);

  const isSold = Boolean(artwork.isSoldOut || artwork.sold);

  const getStatusBadge = () => {
    if (isSold) {
      return null;
    }
    if (artwork.status === 'available' && artwork.isOriginalAvailable) {
      return (
        <span className="border border-line/80 bg-paper/95 px-2.5 py-0.5 text-[11px] font-normal text-sage backdrop-blur-sm">
          Original
        </span>
      );
    }
    if (artwork.hasPrints && !artwork.isOriginalAvailable) {
      return (
        <span className="border border-line/80 bg-blush/90 px-2.5 py-0.5 text-[11px] font-normal text-ink backdrop-blur-sm">
          Art print
        </span>
      );
    }
    if (artwork.status === 'reserved') {
      return (
        <span className="border border-line/80 bg-mist px-2.5 py-0.5 text-[11px] font-normal text-muted">
          Reserved
        </span>
      );
    }
    return (
      <span className="border border-line/80 bg-paper/90 px-2.5 py-0.5 text-[11px] font-normal text-muted">
        Private collection
      </span>
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const artworkIdentifier = artwork.id || artwork._id || artwork.slug;
    if (artwork.isOriginalAvailable) {
      addItem({
        artworkId: artworkIdentifier,
        title: artwork.title,
        slug: artwork.slug,
        type: 'original',
        price: artwork.price,
        imageUrl: primaryImg,
        medium: artwork.medium,
      });
    } else if (
      artwork.hasPrints &&
      artwork.printOptions &&
      artwork.printOptions.length > 0
    ) {
      const firstPrint = artwork.printOptions[0];
      addItem({
        artworkId: artworkIdentifier,
        title: artwork.title,
        slug: artwork.slug,
        type: 'print',
        variant: `Archival print ${firstPrint.size}`,
        price: firstPrint.price,
        imageUrl: primaryImg,
        medium: artwork.medium,
      });
    } else {
      onQuickView(artwork);
    }
  };

  return (
    <article
      onClick={() => onQuickView(artwork)}
      className="group flex h-full cursor-pointer flex-col border border-line bg-paper p-3 transition-all duration-300 hover:border-ink/20 hover:shadow-sm"
    >
      {/* Frame Container - Portrait Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-mist/30">
        <Image
          src={primaryImg}
          alt={artwork.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL={getCloudinaryBlurUrl(primaryImg)}
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
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
          /* Top Status Pill */
          <div className="absolute right-3 top-3 z-10">{getStatusBadge()}</div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-ink/20 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(artwork);
            }}
            className="rounded-full bg-paper p-3 text-ink shadow-sm transition-transform hover:scale-105 hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            title="Quick view"
            aria-label={`Quick view ${artwork.title}`}
          >
            <Eye className="h-4 w-4" />
          </button>

          {(artwork.isOriginalAvailable || artwork.hasPrints) && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="rounded-full bg-ink p-3 text-paper shadow-sm transition-transform hover:scale-105 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              title={artwork.isOriginalAvailable ? 'Acquire original' : 'Order print'}
              aria-label={artwork.isOriginalAvailable ? 'Acquire original' : 'Order print'}
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metadata & Description */}
      <div className="mt-4 flex flex-1 flex-col justify-between space-y-1.5 px-1">
        <div>
          <h3 className="font-heading text-2xl font-normal leading-snug text-ink transition-colors group-hover:text-sage">
            {artwork.title}
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
              <span className="text-xs italic text-muted">Private collection</span>
            ) : artwork.isOriginalAvailable ? (
              <span className="text-sm font-normal text-ink">
                {formatPrice(artwork.price)}
              </span>
            ) : artwork.hasPrints && artwork.printOptions?.length ? (
              <span className="font-light text-ink">
                Prints from{' '}
                <strong className="font-normal">
                  {formatPrice(artwork.printOptions[0].price)}
                </strong>
              </span>
            ) : (
              <span className="text-xs italic text-muted">Private collection</span>
            )}
          </div>

          <span className="flex items-center gap-1 text-xs font-normal text-muted transition-colors group-hover:text-ink">
            Details &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}

export default ArtworkCard;
