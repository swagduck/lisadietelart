import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ARTWORKS_DATA } from '@/lib/data';
import { getArtworkBySlug } from '@/lib/server-data';
import { formatPrice } from '@/lib/format';
import { Mail, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

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

export async function generateMetadata({ params }: ArtworkDetailPageProps): Promise<Metadata> {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) {
    return { title: 'Artwork Not Found' };
  }

  const artworkImage = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const description = `${artwork.title} by Lisa Dietel. ${artwork.medium}, ${artwork.size || artwork.dimensions}. ${artwork.description.slice(0, 140)}...`;

  return {
    title: `${artwork.title} — Lisa Dietel Art`,
    description,
    openGraph: {
      title: `${artwork.title} — Lisa Dietel Art`,
      description,
      url: `/artwork/${artwork.slug}`,
      type: 'article',
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
  };
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const artwork = await getArtworkBySlug(params.slug);

  if (!artwork) {
    notFound();
  }

  const mainImage = artwork.imageUrl || artwork.images?.[0] || '/images/nocturne-in-ochre.svg';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lisadietelart.com';

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
  const mailtoSubject = encodeURIComponent(`Acquisition Enquiry: "${artwork.title}"`);
  const mailtoBody = encodeURIComponent(
    `Hello Lisa,\n\nI am interested in "${artwork.title}" (${artwork.size || artwork.dimensions}, ${artwork.medium}).\n\nPlease let me know further details regarding acquisition, shipping, or viewing.\n\nThank you,\n`
  );
  const mailtoUrl = `mailto:studio@lisadietelart.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  const backLink = artwork.type === 'original' ? '/originals' : '/prints';
  const backLabel =
    artwork.type === 'original' ? 'Back to Originals' : 'Back to Art Prints';

  return (
    <div className="min-h-screen bg-paper pb-24 pt-28">
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
            className="inline-flex items-center gap-2 rounded-sm text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>
        </nav>

        {/* Artwork Presentation Grid */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Large Image */}
          <div className="space-y-4 lg:col-span-7">
            <div className="border border-line bg-paper p-3 shadow-md">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist/30">
                <Image
                  src={mainImage}
                  alt={artwork.title}
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={getCloudinaryBlurUrl(mainImage)}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>

            {/* Optional Detail Views */}
            {artwork.detailImages && artwork.detailImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-2">
                {artwork.detailImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square border border-line bg-paper p-1"
                  >
                    <Image
                      src={img}
                      alt={`${artwork.title} texture detail ${idx + 1}`}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={getCloudinaryBlurUrl(img)}
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, 160px"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-1 text-[11px] text-muted">
              <span>Natural ambient daylight rendering</span>
              <span>Direct from Lisa Dietel Studio</span>
            </div>
          </div>

          {/* Right Column: Metadata & Enquire Action */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.25em] text-sage">
                  {artwork.type === 'original' ? 'Original Work' : 'Archival Print'}
                </span>
                {artwork.isSoldOut && (
                  <span className="border border-line bg-mist/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                    Private Collection
                  </span>
                )}
              </div>

              <h1 className="font-heading text-4xl font-normal leading-tight text-ink sm:text-5xl">
                {artwork.title}
              </h1>

              <div className="pt-2">
                {artwork.isSoldOut ? (
                  <div className="text-sm italic text-muted">
                    Original piece resides in a private collection
                  </div>
                ) : (
                  <div className="font-heading text-3xl font-medium text-ink">
                    {formatPrice(artwork.price)}
                  </div>
                )}
              </div>
            </div>

            {/* Artwork Specifications Table */}
            <div className="space-y-3 border-y border-line py-5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-[11px] uppercase tracking-wider text-muted">
                  Medium
                </span>
                <span className="col-span-2 font-light text-ink">{artwork.medium}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[11px] uppercase tracking-wider text-muted">
                  Size
                </span>
                <span className="col-span-2 font-light text-ink">
                  {artwork.size || artwork.dimensions}
                </span>
              </div>
              {artwork.surface && (
                <div className="grid grid-cols-3">
                  <span className="text-[11px] uppercase tracking-wider text-muted">
                    Substrate
                  </span>
                  <span className="col-span-2 font-light text-ink">
                    {artwork.surface}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3">
                <span className="text-[11px] uppercase tracking-wider text-muted">
                  Year
                </span>
                <span className="col-span-2 font-light text-ink">{artwork.year}</span>
              </div>
            </div>

            {/* Description & Story */}
            <div className="space-y-4 text-sm font-light leading-relaxed text-muted">
              <p>{artwork.description}</p>
              {artwork.story && (
                <p className="border-l-2 border-sage/60 pl-3 italic text-ink/80">
                  &ldquo;{artwork.story}&rdquo;
                </p>
              )}
            </div>

            {/* Enquire Button that opens prefilled mailto */}
            <div className="space-y-4 pt-4">
              <a
                href={mailtoUrl}
                className="flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-xs font-medium uppercase tracking-widest text-paper shadow-sm transition-all duration-300 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" />
                <span>Enquire About This Artwork</span>
              </a>

              {artwork.isSoldOut && (
                <div className="space-y-2 border border-line bg-mist/30 p-4 text-xs">
                  <p className="font-medium text-ink">Interested in a similar piece?</p>
                  <p className="text-muted">
                    Lisa accepts a limited number of bespoke commissions each season based
                    on requested dimensions and color resonance.
                  </p>
                  <Link
                    href="/commissions"
                    className="inline-block text-[11px] font-medium uppercase tracking-wider text-sage underline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  >
                    Learn about commissioning a bespoke canvas &rarr;
                  </Link>
                </div>
              )}

              {/* Collector Guarantees */}
              <div className="grid grid-cols-2 gap-4 border-t border-line/60 pt-2 text-[11px] text-muted">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 flex-shrink-0 text-sage" />
                  <span>Insured white-glove courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 text-sage" />
                  <span>Signed Certificate of Authenticity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
