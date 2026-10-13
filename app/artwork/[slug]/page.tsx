import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARTWORKS_DATA } from '@/lib/data';
import { getArtworkBySlug, getOriginals, getPrints } from '@/lib/server-data';
import { formatPrice } from '@/lib/format';
import { ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { GalleryCarousel } from '@/components/ui/Carousel';
import { ArtworkInteractive } from '@/components/artwork/ArtworkInteractive';

const SelectedWorkGrid = dynamic(
  () => import('@/components/home/SelectedWorkGrid').then((mod) => mod.SelectedWorkGrid),
  {
    loading: () => <div className="min-h-[250px]" />,
  }
);

interface ArtworkDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export function generateStaticParams() {
  return ARTWORKS_DATA.map((artwork) => ({
    slug: artwork.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArtworkDetailPageProps): Promise<Metadata> {
  const artwork = await getArtworkBySlug(params.slug);

  if (!artwork) {
    return {
      title: 'Artwork Not Found — Lisa Dietel Art',
      description: 'The requested artwork could not be found in the gallery archive.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lisadietelart.com';
  const artworkImage =
    artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const description =
    artwork.description ||
    `${artwork.title} by Lisa Dietel. ${artwork.medium}, ${artwork.size || artwork.dimensions}.`;

  return {
    title: `${artwork.title} — Lisa Dietel Art`,
    description,
    openGraph: {
      title: `${artwork.title} — Lisa Dietel Art`,
      description,
      url: `/artwork/${artwork.slug}`,
      images: [
        {
          url: artworkImage,
          width: 1200,
          height: 630,
          alt: `${artwork.title} by Lisa Dietel`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artwork.title} — Lisa Dietel Art`,
      description,
      images: [artworkImage],
    },
    alternates: {
      canonical: `/artwork/${artwork.slug}`,
    },
  };
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const artwork = await getArtworkBySlug(params.slug);

  if (!artwork) {
    notFound();
  }

  const mainImage = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lisadietelart.com';

  // Fetch related collection pieces
  const collectionWorks =
    artwork.type === 'original' ? await getOriginals() : await getPrints();
  const relatedArtworks = collectionWorks
    .filter((item) => item.slug !== artwork.slug)
    .slice(0, 6);

  // JSON-LD Product & VisualArtwork structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: artwork.title,
    image: [mainImage.startsWith('http') ? mainImage : `${siteUrl}${mainImage}`],
    description: artwork.description,
    category: artwork.type === 'original' ? 'Original Artwork' : 'Limited Edition Art Print',
    material: artwork.medium,
    size: artwork.size || artwork.dimensions,
    brand: {
      '@type': 'Person',
      name: 'Lisa Dietel',
    },
    offers: {
      '@type': 'Offer',
      price: artwork.price,
      priceCurrency: artwork.currency || 'USD',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        artwork.isSoldOut || artwork.sold
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      url: `${siteUrl}/artwork/${artwork.slug}`,
    },
  };

  // Pre-fill mailto inquiry link with artwork title and dimensions
  const mailtoSubject = encodeURIComponent(`Acquisition enquiry: "${artwork.title}"`);
  const mailtoBody = encodeURIComponent(
    `Hello Lisa,\n\nI am interested in "${artwork.title}" (${artwork.size || artwork.dimensions}, ${artwork.medium}).\n\nPlease let me know further details regarding acquisition, shipping, or viewing.\n\nThank you,\n`
  );
  const mailtoUrl = `mailto:studio@lisadietelart.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  const backLink = artwork.type === 'original' ? '/originals' : '/prints';
  const backLabel =
    artwork.type === 'original' ? 'Back to originals' : 'Back to art prints';

  const isSold = Boolean(artwork.isSoldOut || artwork.sold);

  return (
    <div className="min-h-screen bg-paper pb-28 pt-28">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 rounded-sm text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>
        </nav>

        {/* Artwork Presentation Grid: Clean Two-Column Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Gallery Carousel with Lightbox */}
          <div className="space-y-4 lg:col-span-7">
            <GalleryCarousel
              images={Array.from(
                new Set(
                  [
                    mainImage,
                    ...(artwork.images || []),
                    ...(artwork.detailImages || []),
                  ].filter(Boolean) as string[]
                )
              )}
              title={artwork.title}
              aspectRatio="aspect-[4/5]"
            />

            <div className="flex justify-between pt-1 text-[11px] text-muted">
              <span>Natural ambient daylight rendering &bull; Tap image to inspect detail</span>
              <span>Lisa Dietel Studio</span>
            </div>
          </div>

          {/* Right Column: Metadata, Specs & Acquisition Actions */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-sage">
                  {artwork.type === 'original' ? 'Original work' : 'Archival print'}
                </span>
                {isSold && (
                  <span className="border border-line bg-mist/40 px-2 py-0.5 text-[11px] text-muted">
                    Private collection
                  </span>
                )}
              </div>

              <h1 className="font-heading text-4xl font-normal leading-tight text-ink sm:text-5xl">
                {artwork.title}
              </h1>

              <div className="pt-1">
                {isSold ? (
                  <div className="text-sm italic text-muted">
                    This piece resides in a private collection
                  </div>
                ) : (
                  <div className="font-heading text-3xl font-normal text-ink">
                    {formatPrice(artwork.price)}
                  </div>
                )}
              </div>
            </div>

            {/* Artwork Specifications Table */}
            <div className="space-y-3 border-y border-line/70 py-5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-muted">Medium</span>
                <span className="col-span-2 font-light text-ink">{artwork.medium}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-muted">Size</span>
                <span className="col-span-2 font-light text-ink">
                  {artwork.size || artwork.dimensions}
                </span>
              </div>
              {artwork.surface && (
                <div className="grid grid-cols-3">
                  <span className="text-muted">Substrate</span>
                  <span className="col-span-2 font-light text-ink">
                    {artwork.surface}
                  </span>
                </div>
              )}
              {artwork.year && (
                <div className="grid grid-cols-3">
                  <span className="text-muted">Year</span>
                  <span className="col-span-2 font-light text-ink">{artwork.year}</span>
                </div>
              )}
            </div>

            {/* Description & Story: Line length under 70 characters */}
            <div className="max-w-[65ch] space-y-4 text-sm font-light leading-relaxed text-muted">
              <p>{artwork.description}</p>
              {artwork.story && (
                <p className="border-l-2 border-sage/60 pl-3 italic text-ink/80">
                  &ldquo;{artwork.story}&rdquo;
                </p>
              )}
            </div>

            {/* Interactive Actions: "See it on your wall" + Enquire Button + Sticky Mobile Bar */}
            <div className="space-y-4 pt-2">
              <ArtworkInteractive
                artwork={artwork}
                mailtoUrl={mailtoUrl}
                mainImage={mainImage}
              />

              {isSold && (
                <div className="space-y-2 border border-line bg-mist/20 p-4 text-xs">
                  <p className="font-normal text-ink">Interested in a similar piece?</p>
                  <p className="text-muted">
                    Lisa creates a limited number of bespoke commissions each season based
                    on specific dimensions and tone palette.
                  </p>
                  <Link
                    href="/commissions"
                    className="inline-block text-xs text-sage underline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  >
                    Learn about commissioning a bespoke canvas &rarr;
                  </Link>
                </div>
              )}

              {/* Collector Guarantees */}
              <div className="grid grid-cols-2 gap-4 border-t border-line/60 pt-4 text-[11px] text-muted">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 flex-shrink-0 text-sage" />
                  <span>Insured courier delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 text-sage" />
                  <span>Certificate of Authenticity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* "More from this collection" Slider at Bottom */}
      {relatedArtworks.length > 0 && (
        <SelectedWorkGrid
          artworks={relatedArtworks}
          title="More from this collection"
          subtitle={
            artwork.type === 'original'
              ? 'Original oil and mixed media paintings from the studio.'
              : 'Archival pigment print editions from the studio.'
          }
          viewAllHref={backLink}
          viewAllLabel="View all"
          ariaLabel="More from this collection carousel"
          id="related-collection-title"
          className="mt-20 border-t border-line/70 pt-16 pb-8 bg-paper overflow-x-clip"
          priorityLimit={0}
        />
      )}
    </div>
  );
}
