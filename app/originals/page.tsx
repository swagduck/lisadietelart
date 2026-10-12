import React from 'react';
import { getOriginals } from '@/lib/data';
import { ArtworkCardItem } from '@/components/gallery/ArtworkCardItem';
import Link from 'next/link';

export const metadata = {
  title: 'Original Paintings — Lisa Dietel Studio',
  description:
    'Explore original oil and mineral paintings on raw Belgian linen by Lisa Dietel. Worldwide insured shipping available.',
};

export default function OriginalsPage() {
  const originals = getOriginals();

  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Editorial Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Unique Works &middot; Oeuvre
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
            Original Paintings
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
            One-of-a-kind canvases crafted with historical earth pigments, natural chalk,
            and French walnut oil on hand-stretched Belgian linen.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="mb-10 flex items-center justify-between border-b border-line pb-4 text-xs">
          <span className="uppercase tracking-wider text-muted">
            Showing {originals.length} Original Paintings
          </span>
          <Link
            href="/commissions"
            className="rounded-sm font-medium uppercase tracking-widest text-sage transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            Looking for custom sizing? Commission a piece &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {originals.map((artwork) => (
            <ArtworkCardItem key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
    </div>
  );
}
