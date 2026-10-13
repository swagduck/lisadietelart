import 'server-only';
import { IArtwork } from '@/types/artwork';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';

// Normalization helper for converting Mongoose lean documents to plain serializable objects
export function serializeArtwork(doc: any): IArtwork {
  return {
    _id: doc._id ? doc._id.toString() : undefined,
    id: doc._id ? doc._id.toString() : doc.slug,
    title: doc.title,
    slug: doc.slug,
    type: doc.type,
    medium: doc.medium,
    size: doc.size || doc.dimensions || '',
    dimensions: doc.size || doc.dimensions || '',
    price: doc.price,
    currency: doc.currency || 'USD',
    description: doc.description,
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

// Real MongoDB Atlas Queries with graceful fallback
export async function getOriginals(): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ type: 'original' })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (docs && docs.length > 0) {
        return docs.map(serializeArtwork);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.filter((item) => item.type === 'original');
}

export async function getPrints(): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ type: 'print' })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (docs && docs.length > 0) {
        return docs.map(serializeArtwork);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.filter((item) => item.type === 'print');
}

export async function getSelectedWorks(limit = 6): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const featuredDocs = await Artwork.find({ featured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      if (featuredDocs && featuredDocs.length > 0) {
        return featuredDocs.map(serializeArtwork);
      }
      const allDocs = await Artwork.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      if (allDocs && allDocs.length > 0) {
        return allDocs.map(serializeArtwork);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.slice(0, limit);
}

export async function getArtworkBySlug(slug: string): Promise<IArtwork | undefined> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const doc = await Artwork.findOne({ slug }).lean().exec();
      if (doc) {
        return serializeArtwork(doc);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.find((item) => item.slug === slug);
}
