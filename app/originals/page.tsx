import React from 'react';
import { getOriginals } from '@/lib/server-data';
import { ArtworkCardItem } from '@/components/gallery/ArtworkCardItem';
import Link from 'next/link';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export const metadata = {
  title: 'Original Paintings — Lisa Dietel Studio',
  description:
    'Explore original oil and mineral paintings on raw Belgian linen by Lisa Dietel. Worldwide insured shipping available.',
  openGraph: {
    title: 'Original Paintings — Lisa Dietel Studio',
    description:
      'Explore original oil and mineral paintings on raw Belgian linen by Lisa Dietel. Worldwide insured shipping available.',
    url: '/originals',
    images: [
      {
        url: '/images/nocturne-in-ochre.svg',
        width: 1200,
        height: 630,
        alt: 'Original Paintings by Lisa Dietel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Original Paintings — Lisa Dietel Studio',
    description:
      'Explore original oil and mineral paintings on raw Belgian linen by Lisa Dietel.',
    images: ['/images/nocturne-in-ochre.svg'],
  },
};

export default async function OriginalsPage() {
  const originals = await getOriginals();

  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Editorial Header */}
      <section
        className="border-b border-line bg-mist/20 py-16"
        style={{
          paddingInline: 'var(--gutter)',
        }}
      >
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="block text-xs font-normal text-sage">
            Unique works &middot; Oeuvre
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
            Original paintings
          </h1>
          <p className="mx-auto max-w-[65ch] text-sm font-light leading-relaxed text-muted md:text-base">
            One-of-a-kind canvases crafted with historical earth pigments, natural chalk,
            and French walnut oil on hand-stretched Belgian linen.
          </p>
        </div>
      </section>

      {/* Grid: Full-width gallery catalog with --gutter */}
      <section
        className="w-full overflow-x-clip py-16 md:py-24"
        style={{
          paddingInline: 'var(--gutter)',
        }}
      >
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 text-xs">
          <span className="text-muted">
            Showing {originals.length} original paintings
          </span>
          <Link
            href="/commissions"
            className="rounded-sm font-normal text-sage transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            Looking for custom sizing? Commission a piece &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {originals.map((artwork, idx) => (
            <ArtworkCardItem
              key={artwork.id || artwork._id || artwork.slug}
              artwork={artwork}
              priority={idx < 2}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
