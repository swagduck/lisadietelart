import 'server-only';
import { unstable_cache } from 'next/cache';
import { IArtwork } from '@/types/artwork';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';

// Field projection for list queries to minimize payload and memory overhead
const ARTWORK_CARD_PROJECTION =
  'title slug type medium size dimensions price currency images sold featured createdAt';

interface RawArtworkDoc {
  _id?: unknown;
  id?: string;
  title?: string;
  slug?: string;
  type?: 'original' | 'print';
  medium?: string;
  size?: string;
  dimensions?: string;
  price?: number;
  currency?: string;
  description?: string;
  images?: string[];
  imageUrl?: string;
  sold?: boolean;
  isSoldOut?: boolean;
  featured?: boolean;
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
