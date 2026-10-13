import 'server-only';
import { unstable_cache } from 'next/cache';
import { IArtwork, IHeroSlide } from '@/types/artwork';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';

// Field projection for list queries to minimize payload and memory overhead
const ARTWORK_CARD_PROJECTION =
  'title slug type medium size dimensions price currency images sold featured useWallMockup showInHero heroOrder heroHeadline heroSubtitle heroLabel createdAt';

interface RawArtworkDoc {
  _id?: unknown;
  id?: string;
  title?: string;
  slug?: string;
  type?: 'original' | 'print';
  medium?: string;
  size?: string;
  dimensions?: string;
  year?: number;
  price?: number;
  currency?: string;
  description?: string;
  images?: string[];
  imageUrl?: string;
  sold?: boolean;
  isSoldOut?: boolean;
  featured?: boolean;
  useWallMockup?: boolean;
  showInHero?: boolean;
  heroOrder?: number;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroLabel?: string;
  createdAt?: string | Date | number;
  [key: string]: unknown;
}

// Normalization helper for converting Mongoose lean documents to plain serializable objects
export function serializeArtwork(doc: RawArtworkDoc): IArtwork {
  return {
    _id: doc._id ? String(doc._id) : undefined,
    id: doc._id ? String(doc._id) : (doc.slug || 'artwork'),
    title: doc.title || 'Untitled',
    slug: doc.slug || '',
    type: (doc.type === 'print' ? 'print' : 'original') as 'original' | 'print',
    medium: doc.medium || '',
    size: doc.size || doc.dimensions || '',
    dimensions: doc.size || doc.dimensions || '',
    year: typeof doc.year === 'number' ? doc.year : undefined,
    price: typeof doc.price === 'number' ? doc.price : 0,
    currency: doc.currency || 'USD',
    description: doc.description || '',
    images:
      Array.isArray(doc.images) && doc.images.length > 0
        ? doc.images
        : [doc.imageUrl || '/images/nocturne-in-ochre.svg'],
    imageUrl:
      (doc.images && doc.images[0]) || doc.imageUrl || '/images/nocturne-in-ochre.svg',
    sold: Boolean(doc.sold ?? doc.isSoldOut),
    isSoldOut: Boolean(doc.sold ?? doc.isSoldOut),
    featured: Boolean(doc.featured),
    useWallMockup: doc.useWallMockup !== false,
    showInHero: Boolean(doc.showInHero),
    heroOrder: typeof doc.heroOrder === 'number' ? doc.heroOrder : undefined,
    heroHeadline: typeof doc.heroHeadline === 'string' ? doc.heroHeadline : undefined,
    heroSubtitle: typeof doc.heroSubtitle === 'string' ? doc.heroSubtitle : undefined,
    heroLabel: typeof doc.heroLabel === 'string' ? doc.heroLabel : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
  };
}

// Internal query implementations
async function fetchOriginals(): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ type: 'original' })
        .select(ARTWORK_CARD_PROJECTION)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (docs && docs.length > 0) {
        return docs.map(serializeArtwork);
      }
    }
  } catch {
    // Graceful fallback to static data
  }
  return ARTWORKS_DATA.filter((item) => item.type === 'original');
}

async function fetchPrints(): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ type: 'print' })
        .select(ARTWORK_CARD_PROJECTION)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (docs && docs.length > 0) {
        return docs.map(serializeArtwork);
      }
    }
  } catch {
    // Graceful fallback to static data
  }
  return ARTWORKS_DATA.filter((item) => item.type === 'print');
}

async function fetchSelectedWorks(limit = 6): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const featuredDocs = await Artwork.find({ featured: true })
        .select(ARTWORK_CARD_PROJECTION)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      if (featuredDocs && featuredDocs.length > 0) {
        return featuredDocs.map(serializeArtwork);
      }
      const allDocs = await Artwork.find({})
        .select(ARTWORK_CARD_PROJECTION)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      if (allDocs && allDocs.length > 0) {
        return allDocs.map(serializeArtwork);
      }
    }
  } catch {
    // Graceful fallback
  }
  return ARTWORKS_DATA.slice(0, limit);
}

async function fetchArtworkBySlug(slug: string): Promise<IArtwork | undefined> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const doc = await Artwork.findOne({ slug }).lean().exec();
      if (doc) {
        return serializeArtwork(doc);
      }
    }
  } catch {
    // Graceful fallback
  }
  return ARTWORKS_DATA.find((item) => item.slug === slug);
}

async function fetchHeroSlides(): Promise<IHeroSlide[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ showInHero: true })
        .select(
          'title slug type medium size dimensions year images imageUrl description heroOrder heroHeadline heroSubtitle heroLabel createdAt'
        )
        .sort({ heroOrder: 1, createdAt: -1 })
        .limit(5)
        .lean()
        .exec();

      if (docs && docs.length > 0) {
        return docs.map((doc) => {
          const rawDoc = doc as unknown as RawArtworkDoc;
          const image =
            (Array.isArray(rawDoc.images) && rawDoc.images[0]) ||
            rawDoc.imageUrl ||
            '';
          const title = rawDoc.title || 'Untitled';
          const headline =
            typeof rawDoc.heroHeadline === 'string' && rawDoc.heroHeadline.trim()
              ? rawDoc.heroHeadline.trim()
              : title;
          const subtitle =
            typeof rawDoc.heroSubtitle === 'string' && rawDoc.heroSubtitle.trim()
              ? rawDoc.heroSubtitle.trim()
              : (rawDoc.description || '');
          const label =
            typeof rawDoc.heroLabel === 'string' && rawDoc.heroLabel.trim()
              ? rawDoc.heroLabel.trim()
              : undefined;

          const yearStr = rawDoc.year ? ` (${rawDoc.year})` : '';
          const artworkTitle = `${title}${yearStr}`;
          const artworkDetails = [
            rawDoc.medium,
            rawDoc.size || rawDoc.dimensions,
          ]
            .filter(Boolean)
            .join(' · ');

          return {
            id: String(rawDoc._id || rawDoc.slug || 'hero-slide'),
            title: headline,
            subtitle,
            badge: label,
            imageUrl: image,
            artworkTitle,
            artworkDetails,
            primaryCta: {
              label: 'View Artwork',
              href: `/artwork/${rawDoc.slug}`,
            },
            secondaryCta: {
              label: rawDoc.type === 'print' ? 'Browse Prints' : 'Explore Originals',
              href: rawDoc.type === 'print' ? '/prints' : '/originals',
            },
          };
        });
      }
    }
  } catch {
    // Graceful fallback to static data if database unavailable
  }

  const fallbackDocs = ARTWORKS_DATA.filter((item) => Boolean(item.showInHero));
  if (fallbackDocs.length > 0) {
    return fallbackDocs.slice(0, 5).map((doc) => {
      const image =
        (Array.isArray(doc.images) && doc.images[0]) || doc.imageUrl || '';
      const title = doc.title || 'Untitled';
      const headline = doc.heroHeadline?.trim() || title;
      const subtitle = doc.heroSubtitle?.trim() || doc.description || '';
      const label = doc.heroLabel?.trim() || undefined;
      const yearStr = doc.year ? ` (${doc.year})` : '';

      return {
        id: doc.id || doc.slug,
        title: headline,
        subtitle,
        badge: label,
        imageUrl: image,
        artworkTitle: `${title}${yearStr}`,
        artworkDetails: [doc.medium, doc.size || doc.dimensions]
          .filter(Boolean)
          .join(' · '),
        primaryCta: {
          label: 'View Artwork',
          href: `/artwork/${doc.slug}`,
        },
        secondaryCta: {
          label: doc.type === 'print' ? 'Browse Prints' : 'Explore Originals',
          href: doc.type === 'print' ? '/prints' : '/originals',
        },
      };
    });
  }

  return [];
}

// Public cached functions with tags and ISR revalidation
export const getOriginals = unstable_cache(
  fetchOriginals,
  ['originals-gallery'],
  { tags: ['artworks', 'artworks-originals'], revalidate: 60 }
);

export const getPrints = unstable_cache(
  fetchPrints,
  ['prints-gallery'],
  { tags: ['artworks', 'artworks-prints'], revalidate: 60 }
);

export const getSelectedWorks = (limit = 6) =>
  unstable_cache(
    () => fetchSelectedWorks(limit),
    [`selected-works-${limit}`],
    { tags: ['artworks', 'artworks-selected'], revalidate: 60 }
  )();

export const getArtworkBySlug = (slug: string) =>
  unstable_cache(
    () => fetchArtworkBySlug(slug),
    [`artwork-detail-${slug}`],
    { tags: ['artworks', `artwork-${slug}`], revalidate: 60 }
  )();

export const getHeroSlides = unstable_cache(
  fetchHeroSlides,
  ['hero-slides'],
  { tags: ['artworks', 'artworks-hero'], revalidate: 60 }
);
