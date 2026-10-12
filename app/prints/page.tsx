import React from 'react';
import { getPrints } from '@/lib/data';
import { ArtworkCardItem } from '@/components/gallery/ArtworkCardItem';
import Link from 'next/link';

export const metadata = {
  title: 'Limited Edition Art Prints — Lisa Dietel Studio',
  description:
    'Museum-grade limited edition archival pigment prints on 310gsm Hahnemühle German Etching cotton paper by Lisa Dietel.',
};

export default function PrintsPage() {
  const prints = getPrints();

  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Editorial Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Archival Editions &middot; Museum Stock
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
            Archival Art Prints
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
            Printed on heavy 310gsm Hahnemühle 100% cotton rag with 12-color archival
            mineral pigment inks. Each edition is numbered and signed with the embossed
            studio seal.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="mb-10 flex items-center justify-between border-b border-line pb-4 text-xs">
          <span className="uppercase tracking-wider text-muted">
            Showing {prints.length} Print Editions
          </span>
          <Link
            href="/originals"
            className="rounded-sm font-medium uppercase tracking-widest text-sage transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            Interested in unique canvases? Explore Originals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {prints.map((artwork) => (
            <ArtworkCardItem key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
    </div>
  );
}
