import React from 'react';
import { ArtworkGrid } from '@/components/gallery/ArtworkGrid';
import { ARTWORKS_DATA } from '@/lib/data';
import type { Metadata } from 'next';
import { ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Originals & Limited Prints — Aura Vance Studio Shop',
  description:
    'Acquire original oil paintings and museum-grade archival pigment prints directly from the independent painter studio.',
};

export default function ShopPage() {
  const shopArtworks = ARTWORKS_DATA.filter((a) => a.isOriginalAvailable || a.hasPrints);

  return (
    <div className="pt-8">
      {/* Shop Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Studio Acquisitions
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink md:text-6xl">
            Original Paintings &amp; Limited Prints
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
            Acquire unique originals on Belgian linen, or select museum-grade archival
            pigment editions printed on 310gsm Hahnemühle cotton etching paper.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-line bg-paper px-6 py-8 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 text-xs text-ink/80 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 flex-shrink-0 text-sage" />
            <div>
              <p className="font-medium">Insured Worldwide Transit</p>
              <p className="text-[11px] text-muted">Bespoke wooden crate packing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-sage" />
            <div>
              <p className="font-medium">Certificate of Authenticity</p>
              <p className="text-[11px] text-muted">Hand-signed &amp; embossed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 flex-shrink-0 text-sage" />
            <div>
              <p className="font-medium">Museum-Grade Pigments</p>
              <p className="text-[11px] text-muted">100+ year lightfast rating</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 flex-shrink-0 text-sage" />
            <div>
              <p className="font-medium">14-Day In-Home Return</p>
              <p className="text-[11px] text-muted">Satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Works Available */}
      <ArtworkGrid
        artworks={shopArtworks}
        title="Works Currently Available"
        subtitle="Direct from the Studio"
        showFilters={true}
      />
    </div>
  );
}
