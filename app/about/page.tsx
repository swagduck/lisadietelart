import React from 'react';
import Image from 'next/image';
import { ExhibitionList } from '@/components/exhibitions/ExhibitionList';
import { EXHIBITIONS_DATA } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'About the Artist & Studio — Lisa Dietel',
  description:
    'Read the story, artist statement, painterly philosophy, and exhibition CV of contemporary independent painter Lisa Dietel.',
  openGraph: {
    title: 'About the Artist & Studio — Lisa Dietel',
    description:
      'Read the story, artist statement, painterly philosophy, and exhibition CV of contemporary independent painter Lisa Dietel.',
    url: '/about',
    images: [
      {
        url: '/images/artist-studio.svg',
        width: 1200,
        height: 630,
        alt: 'Lisa Dietel Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About the Artist & Studio — Lisa Dietel',
    description:
      'Read the story, artist statement, painterly philosophy, and exhibition CV of Lisa Dietel.',
    images: ['/images/artist-studio.svg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Editorial Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Biography &middot; Philosophy
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
            Lisa Dietel
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
            Independent contemporary painter exploring geological memory, mineral pigment,
            and quiet atmospheric horizons.
          </p>
        </div>
      </section>

      {/* Main Story & Large Images */}
      <section className="mx-auto max-w-7xl border-b border-line px-6 py-20 md:px-12">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/* Left Column: Portrait and Studio Details */}
          <div className="space-y-8 lg:col-span-5">
            <div className="border border-line bg-paper p-3 shadow-md">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist/40">
                <Image
                  src="/images/artist-studio.svg"
                  alt="Lisa Dietel in the studio"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={getCloudinaryBlurUrl('/images/artist-studio.svg')}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <p className="mt-3 text-center text-[11px] italic text-muted">
                Lisa Dietel hand-grinding dry mineral pigments in the studio, 2024.
              </p>
            </div>

            <div className="space-y-3 border border-line bg-mist/30 p-6 text-xs">
              <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
                Studio Particulars
              </span>
              <ul className="space-y-2 font-light leading-relaxed text-ink/80">
                <li>
                  &bull; <strong className="font-medium">Education:</strong> BFA in Fine
                  Arts &amp; Painting
                </li>
                <li>
                  &bull; <strong className="font-medium">Primary Media:</strong> Oil on
                  linen, cold wax, raw minerals, distemper
                </li>
                <li>
                  &bull; <strong className="font-medium">Substrates:</strong>{' '}
                  Hand-stretched European flax linen
                </li>
                <li>
                  &bull; <strong className="font-medium">Selected Collections:</strong>{' '}
                  Private collections across New York, London, Paris, and Zurich
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Artist Statement */}
          <div className="space-y-8 lg:col-span-7">
            <div className="space-y-4">
              <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
                Artist Statement
              </span>
              <h2 className="font-heading text-3xl font-normal leading-snug text-ink sm:text-4xl">
                &ldquo;I am drawn to the subtle threshold where physical terrain dissolves
                into atmosphere.&rdquo;
              </h2>
            </div>

            <div className="space-y-5 text-sm font-light leading-relaxed text-muted md:text-base">
              <p>
                My paintings are born out of repetitive observation of wild, quiet
                topographies: coastal cliffs during dense marine fog, limestone quarries
                at dusk, and river valleys in the quiet freeze of midwinter.
              </p>
              <p>
                Rather than rendering literal landscapes, I endeavor to capture the
                tactile memory of silence and illumination. I prepare all linen substrates
                by hand using traditional rabbit-skin glue sizing and chalk grounds,
                allowing the texture of the organic fiber to breathe through thin,
                luminous veils of oil.
              </p>
              <p>
                Color in my work is deeply rooted in geology. I grind natural lapis
                lazuli, French ochres, German vine blacks, and Italian umbers with
                cold-pressed walnut oils. Because mineral pigments have irregular particle
                sizes, they scatter incoming light organically, giving the canvas an
                active presence that shifts with changing ambient conditions.
              </p>
            </div>

            {/* Materials breakdown */}
            <div className="space-y-4 border-t border-line pt-6">
              <h3 className="font-heading text-2xl text-ink">
                Materials &amp; Archival Standards
              </h3>
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="border border-line bg-paper p-4">
                  <h4 className="font-heading text-lg font-medium text-ink">
                    Substrates
                  </h4>
                  <p className="mt-1 font-light leading-relaxed text-muted">
                    Heavyweight 450gsm Belgian flax linen stretched over hand-keyed
                    mortise-and-tenon cedar bars.
                  </p>
                </div>
                <div className="border border-line bg-paper p-4">
                  <h4 className="font-heading text-lg font-medium text-ink">
                    Pigments &amp; Binders
                  </h4>
                  <p className="mt-1 font-light leading-relaxed text-muted">
                    Cold-pressed alkali-refined walnut oil, Venetian turpentine, and pure
                    historical earth minerals.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/originals"
                className="bg-ink px-6 py-3 text-xs font-medium uppercase tracking-widest text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                View Originals
              </Link>
              <Link
                href="/commissions"
                className="border border-ink px-6 py-3 text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                Commission a Piece
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions CV */}
      <ExhibitionList exhibitions={EXHIBITIONS_DATA} />
    </div>
  );
}
