'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../shop/CartContext';
import { ARTWORKS_DATA } from '@/lib/data';

export function Hero() {
  const { addItem } = useCart();
  const heroArtwork = ARTWORKS_DATA[0];

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-line bg-paper pb-24 pt-12 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Editorial Headline & Copy */}
        <div className="space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-mist/30 px-3.5 py-1.5 text-xs uppercase tracking-widest text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Series VII &mdash; Nocturne &amp; Solitude
          </div>

          <h1 className="font-heading text-5xl font-normal leading-[1.05] tracking-tight text-ink md:text-7xl lg:text-8xl">
            Capturing silence in{' '}
            <span className="font-light italic text-sage">pigment</span> and earth.
          </h1>

          <p className="max-w-xl text-base font-light leading-relaxed text-muted md:text-lg">
            Contemporary landscape and meditative figurative paintings exploring memory,
            organic texture, and natural luminescence on raw Belgian linen.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/shop"
              className="inline-block bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-paper shadow-sm transition-all duration-300 hover:bg-sage"
            >
              View Available Works
            </Link>
            <Link
              href="/about"
              className="inline-block border border-ink/30 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ink transition-all duration-300 hover:border-ink"
            >
              Studio Story
            </Link>
          </div>

          {/* Painter quote / detail */}
          <div className="flex items-center gap-4 border-t border-line/60 pt-6 text-xs text-muted">
            <div className="h-[1px] w-8 bg-sage" />
            <span className="font-light italic">
              &ldquo;The canvas is not a surface to be filled, but a threshold where
              natural light remembers itself.&rdquo;
            </span>
          </div>
        </div>

        {/* Right Column: Framed Featured Canvas Preview */}
        <div className="relative lg:col-span-5">
          <div className="relative border border-line bg-paper p-3 shadow-2xl shadow-ink/5 transition-transform duration-500 hover:-translate-y-1">
            <div className="group relative aspect-[4/5] overflow-hidden bg-mist/60">
              <Image
                src={heroArtwork.imageUrl}
                alt={heroArtwork.title}
                fill
                priority
                className="object-cover contrast-[105%] grayscale-[15%] transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
              <div className="absolute inset-0 flex items-end justify-between bg-ink/15 p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="bg-paper/95 px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink shadow-sm">
                  {heroArtwork.dimensions}
                </span>
                <button
                  onClick={() =>
                    addItem({
                      artworkId: heroArtwork.id,
                      title: heroArtwork.title,
                      slug: heroArtwork.slug,
                      type: 'original',
                      price: heroArtwork.price,
                      imageUrl: heroArtwork.imageUrl,
                      medium: heroArtwork.medium,
                    })
                  }
                  className="bg-sage px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-paper shadow-sm transition-colors hover:bg-ink"
                >
                  Acquire Original
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between border-t border-line/60 px-2 pt-4 text-xs">
              <div>
                <span className="block font-heading text-lg font-medium text-ink">
                  {heroArtwork.title} ({heroArtwork.year})
                </span>
                <span className="text-[11px] font-light text-muted">
                  {heroArtwork.medium}
                </span>
              </div>
              <div className="text-right">
                <span className="block font-medium tracking-wider text-ink">
                  ${heroArtwork.price.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-sage">
                  Original Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
