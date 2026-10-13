import React from 'react';
import { getPrints } from '@/lib/server-data';
import { ArtworkCardItem } from '@/components/gallery/ArtworkCardItem';
import Link from 'next/link';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export const metadata = {
  title: 'Limited Edition Art Prints — Lisa Dietel Studio',
  description:
    'Museum-grade limited edition archival pigment prints on 310gsm Hahnemühle German Etching cotton paper by Lisa Dietel.',
  openGraph: {
    title: 'Limited Edition Art Prints — Lisa Dietel Studio',
    description:
      'Museum-grade limited edition archival pigment prints on 310gsm Hahnemühle German Etching cotton paper by Lisa Dietel.',
    url: '/prints',
    images: [
      {
        url: '/images/passage-of-light.svg',
        width: 1200,
        height: 630,
        alt: 'Archival Art Prints by Lisa Dietel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limited Edition Art Prints — Lisa Dietel Studio',
    description:
      'Museum-grade limited edition archival pigment prints on 310gsm Hahnemühle German Etching paper.',
    images: ['/images/passage-of-light.svg'],
  },
};

export default async function PrintsPage() {
  const prints = await getPrints();

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
            Archival editions &middot; Museum stock
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
            Archival art prints
          </h1>
          <p className="mx-auto max-w-[65ch] text-sm font-light leading-relaxed text-muted md:text-base">
            Printed on heavy 310gsm Hahnemühle 100% cotton rag with 12-color archival
            mineral pigment inks. Each edition is numbered and signed with the embossed
            studio seal.
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
            Showing {prints.length} print editions
          </span>
          <Link
            href="/originals"
            className="rounded-sm font-normal text-sage transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            Interested in unique canvases? Explore originals &rarr;
          </Link>
        </div>

        {prints.length === 0 ? (
          <div className="py-24 text-center max-w-lg mx-auto space-y-4">
            <h2 className="font-heading text-2xl text-ink font-normal">
              No print editions currently available
            </h2>
            <p className="text-sm font-light text-muted leading-relaxed">
              Archival pigment editions are produced in strictly limited runs on Hahnemühle cotton paper. Check back soon or browse available original canvases.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/originals"
                className="bg-ink text-paper px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-sage transition-colors"
              >
                Explore originals
              </Link>
              <Link
                href="/contact"
                className="border border-line text-ink px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:border-ink transition-colors"
              >
                Inquire with studio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {prints.map((artwork, idx) => (
              <ArtworkCardItem
                key={artwork.id || artwork._id || artwork.slug}
                artwork={artwork}
                priority={idx < 2}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
