import React from 'react';
import { ArtworkGrid } from '@/components/gallery/ArtworkGrid';
import { ARTWORKS_DATA } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Selected Works & Archive — Aura Vance Fine Art',
  description:
    'Explore the complete collection of oil on linen paintings, water media, and field studies by independent painter Aura Vance.',
};

export default function WorksPage() {
  return (
    <div className="pt-8">
      {/* Intro Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Oeuvre &middot; Archive
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink md:text-6xl">
            Selected Works &amp; Studies
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
            Spanning continuous investigations into mineral light, highland terrain, and
            organic linen texture from 2021 through present.
          </p>
        </div>
      </section>

      {/* Grid with interactive filters */}
      <ArtworkGrid
        artworks={ARTWORKS_DATA}
        title="Works in Circulation"
        subtitle="Catalogue Raisonné"
        showFilters={true}
      />
    </div>
  );
}
