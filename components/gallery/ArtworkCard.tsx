'use client';

import React from 'react';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { Eye, Plus } from 'lucide-react';
import { useCart } from '../shop/CartContext';

interface ArtworkCardProps {
  artwork: IArtwork;
  onQuickView: (artwork: IArtwork) => void;
}

export function ArtworkCard({ artwork, onQuickView }: ArtworkCardProps) {
  const { addItem } = useCart();

  const getStatusBadge = () => {
    if (artwork.status === 'available' && artwork.isOriginalAvailable) {
      return (
        <span className="border border-line bg-paper/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-sage shadow-sm">
          Original Available
        </span>
      );
    }
    if (artwork.hasPrints && !artwork.isOriginalAvailable) {
      return (
        <span className="border border-line bg-blush/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-ink shadow-sm">
          Archival Prints Available
        </span>
      );
    }
    if (artwork.status === 'reserved') {
      return (
        <span className="border border-line bg-mist px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-muted">
          Reserved
        </span>
      );
    }
    return (
      <span className="border border-line bg-paper/90 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted">
        Private Collection
      </span>
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const artworkImg = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
    const artworkIdentifier = artwork.id || artwork._id || artwork.slug;
    if (artwork.isOriginalAvailable) {
      addItem({
        artworkId: artworkIdentifier,
        title: artwork.title,
        slug: artwork.slug,
        type: 'original',
        price: artwork.price,
        imageUrl: artworkImg,
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
        variant: `Archival Print ${firstPrint.size}`,
        price: firstPrint.price,
        imageUrl: artworkImg,
        medium: artwork.medium,
      });
    } else {
      onQuickView(artwork);
    }
  };

  return (
    <article
      onClick={() => onQuickView(artwork)}
      className="group flex h-full cursor-pointer flex-col border border-line bg-paper p-3 shadow-sm transition-all duration-300 hover:border-ink/20 hover:shadow-xl"
    >
      {/* Frame Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-mist/40">
        <Image
          src={artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg'}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Top Status Pill */}
        <div className="absolute right-3 top-3 z-10">{getStatusBadge()}</div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-ink/30 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(artwork);
            }}
            className="rounded-full bg-paper p-3 text-ink shadow-lg transition-transform hover:scale-110 hover:text-sage"
            title="Quick view"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>

          {(artwork.isOriginalAvailable || artwork.hasPrints) && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="rounded-full bg-ink p-3 text-paper shadow-lg transition-transform hover:scale-110 hover:bg-sage"
              title={artwork.isOriginalAvailable ? 'Acquire Original' : 'Order Print'}
              aria-label={
                artwork.isOriginalAvailable ? 'Acquire Original' : 'Order Print'
              }
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
            {artwork.dimensions}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line/60 pt-3 text-xs">
          <div>
            {artwork.isOriginalAvailable ? (
              <span className="text-sm font-medium text-ink">
                {formatPrice(artwork.price)}
              </span>
            ) : artwork.hasPrints && artwork.printOptions?.length ? (
              <span className="font-light text-ink">
                Prints from{' '}
                <strong className="font-medium">
                  {formatPrice(artwork.printOptions[0].price)}
                </strong>
              </span>
            ) : (
              <span className="text-[11px] italic text-muted">Private Collection</span>
            )}
          </div>

          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted transition-colors group-hover:text-ink">
            Details &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}

export default ArtworkCard;
