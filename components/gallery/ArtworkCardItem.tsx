'use client';

import React, { useRef } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { IArtwork } from '@/types/artwork';
import { WallImage } from '@/components/ui/WallImage';
import { cn } from '@/lib/utils';

export interface ArtworkCardItemProps {
  artwork: IArtwork;
  priority?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Standard Gallery Artwork Card / Slide.
 * - 4/5 aspect ratio staged on a neutral wall.
 * - Entire card is one link to /artwork/[slug].
 * - Supports native View Transition shared-element morphing for image & title.
 * - Small white rectangular "Sold out" tag in top-right corner only when sold.
 * - Hover (desktop only): image scales to 1.02 over 400ms inside overflow-hidden wrapper, title underlines.
 * - Title below in Jost 16px, 12px below image, left aligned.
 */
export function ArtworkCardItem({
  artwork,
  priority = false,
  className,
  onClick,
}: ArtworkCardItemProps) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const primaryImg =
    artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const isSold = Boolean(artwork.isSoldOut || artwork.sold);

  return (
    <TransitionLink
      href={`/artwork/${artwork.slug}`}
      sharedImageRef={imageWrapperRef}
      sharedTitleRef={titleRef}
      prefetch={true}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'group block w-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
        className
      )}
      aria-label={`View ${artwork.title}${isSold ? ' (Sold out)' : ''}`}
    >
      {/* Aspect Ratio 4/5 Image Area with Shared Element Target */}
      <div
        ref={imageWrapperRef}
        className="artwork-image-wrapper relative aspect-[4/5] w-full overflow-hidden bg-mist/20"
      >
        {/* Soft Hover Zoom (scale 1.02) over 400ms on desktop */}
        <div className="h-full w-full transition-transform duration-[400ms] ease-out group-hover:scale-[1.02] motion-reduce:transform-none">
          <WallImage
            src={primaryImg}
            alt={artwork.title}
            useWallMockup={artwork.useWallMockup}
            priority={priority}
          />
        </div>

        {/* Small White Rectangular "Sold out" Tag */}
        {isSold && (
          <div className="absolute right-3 top-3 z-20 bg-white px-3 py-1.5 text-sm font-normal text-ink shadow-sm">
            Sold out
          </div>
        )}
      </div>

      {/* Title in Jost 16px, left aligned, 12px below image with Shared Element Target */}
      <h3
        ref={titleRef}
        className="mt-[12px] font-sans text-[16px] font-normal leading-normal text-ink text-left group-hover:underline"
      >
        {artwork.title}
      </h3>
    </TransitionLink>
  );
}

export default ArtworkCardItem;
