'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { cloudinaryLoader, getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

export interface WallImageProps {
  src: string;
  alt: string;
  useWallMockup?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * WallImage provides a consistent "staged on a wall" gallery presentation for every artwork.
 * Background: neutral wall (#d9d8d6 to #e6e5e3 vertical gradient + soft diagonal light wash).
 * The artwork image is rendered object-fit: contain, centered at ~62% width slightly above vertical middle,
 * with a subtle drop shadow (0 18px 30px rgba(0,0,0,0.18)).
 * At the bottom sits a soft stone pedestal block made with CSS.
 *
 * If useWallMockup is explicitly false (e.g. photo already staged in admin), renders full-bleed with object-fit: cover.
 */
export function WallImage({
  src,
  alt,
  useWallMockup = true,
  priority = false,
  sizes = '(min-width:1280px) 23vw, (min-width:768px) 40vw, 80vw',
  className,
}: WallImageProps) {
  // If the artwork already has a real staged photo, render full-bleed cover
  if (useWallMockup === false) {
    return (
      <div className={cn('relative w-full h-full overflow-hidden bg-mist/30 select-none', className)}>
        <Image
          loader={cloudinaryLoader}
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={getCloudinaryBlurUrl(src)}
          sizes={sizes}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="object-cover pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden select-none', className)}
      style={{
        background: `
          linear-gradient(135deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.1) 45%, rgba(0, 0, 0, 0.05) 100%),
          linear-gradient(180deg, #d9d8d6 0%, #e6e5e3 100%)
        `,
      }}
    >
      {/* Soft Ambient Downlight Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
        }}
      />

      {/* Artwork Canvas Frame: centered at ~62% width, sitting slightly above vertical middle */}
      <div
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[62%] h-[62%] flex items-center justify-center z-10"
        style={{
          filter: 'drop-shadow(0 18px 30px rgba(0, 0, 0, 0.18))',
        }}
      >
        <div className="relative w-full h-full">
          <Image
            loader={cloudinaryLoader}
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={getCloudinaryBlurUrl(src)}
            sizes={sizes}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Soft Stone Pedestal Block (rounded rectangle with a light grey gradient) at the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[15%] z-0 rounded-t-[4px]"
        style={{
          background: 'linear-gradient(180deg, #ecebe9 0%, #deddd9 45%, #cecdc9 100%)',
          boxShadow: '0 -4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Stone Top Surface Highlight */}
        <div className="h-[2px] w-full rounded-t-[4px] bg-white/70" />
      </div>
    </div>
  );
}

export default WallImage;
