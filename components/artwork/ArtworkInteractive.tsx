'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Eye } from 'lucide-react';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';

const WallPreviewModal = dynamic(
  () => import('./WallPreviewModal').then((mod) => mod.WallPreviewModal),
  { ssr: false }
);

interface ArtworkInteractiveProps {
  artwork: IArtwork;
  mailtoUrl: string;
  mainImage: string;
}

export function ArtworkInteractive({
  artwork,
  mailtoUrl,
  mainImage,
}: ArtworkInteractiveProps) {
  const [wallModalOpen, setWallModalOpen] = useState(false);

  const isSold = Boolean(artwork.isSoldOut || artwork.sold);

  return (
    <>
      {/* "See it on your wall" trigger button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setWallModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-sm border border-line bg-paper px-4 py-2.5 text-xs font-normal text-ink shadow-sm transition-all hover:border-ink hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          aria-label={`Preview ${artwork.title} on a living room wall`}
        >
          <Eye className="h-4 w-4 text-sage" />
          <span>See it on your wall</span>
          <span className="text-[11px] text-muted">({artwork.size || artwork.dimensions})</span>
        </button>
      </div>

      {/* Desktop Enquire Button */}
      <div className="pt-4">
        <a
          href={mailtoUrl}
          className="flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-xs font-normal text-paper shadow-sm transition-all duration-300 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
        >
          <Mail className="h-4 w-4" />
          <span>Enquire about this artwork</span>
        </a>
      </div>

      {/* Sticky Mobile Enquire Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-line bg-paper/95 p-4 shadow-lg backdrop-blur-md md:hidden"
        role="region"
        aria-label="Quick acquisition bar"
      >
        <div className="pr-4">
          <span className="block font-heading text-lg font-normal leading-snug text-ink truncate max-w-[200px]">
            {artwork.title}
          </span>
          <span className="text-xs text-muted">
            {isSold ? 'Sold out' : formatPrice(artwork.price, artwork.currency)}
          </span>
        </div>

        <div>
          <a
            href={mailtoUrl}
            className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-5 py-2.5 text-xs font-normal text-paper shadow-sm transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            aria-label={`Enquire about acquiring ${artwork.title}`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Enquire</span>
          </a>
        </div>
      </div>

      {/* Wall Preview Modal: Loaded on demand */}
      {wallModalOpen && (
        <WallPreviewModal
          isOpen={wallModalOpen}
          onClose={() => setWallModalOpen(false)}
          imageUrl={mainImage}
          title={artwork.title}
          dimensions={artwork.size || artwork.dimensions}
          medium={artwork.medium}
        />
      )}
    </>
  );
}

export default ArtworkInteractive;
