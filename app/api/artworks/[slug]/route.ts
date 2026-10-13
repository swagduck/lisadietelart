import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';
import { deleteCloudinaryImages } from '@/lib/cloudinary-server';
import { artworkUpdateSchema } from '@/lib/validations';
import { IArtwork } from '@/types/artwork';

export const dynamic = 'force-dynamic';

function invalidateArtworkCaches(slug: string, newSlug?: string) {
  try {
    revalidateTag('artworks');
    revalidateTag('artworks-originals');
    revalidateTag('artworks-prints');
    revalidateTag('artworks-selected');
    revalidateTag(`artwork-${slug}`);
    if (newSlug && newSlug !== slug) {
      revalidateTag(`artwork-${newSlug}`);
    }
    revalidatePath('/');
    revalidatePath('/originals');
    revalidatePath('/prints');
    revalidatePath(`/artwork/${slug}`);
    if (newSlug && newSlug !== slug) {
      revalidatePath(`/artwork/${newSlug}`);
    }
    revalidatePath('/sitemap.xml');
  } catch (revalErr) {
    console.warn('Cache revalidation note:', revalErr);
  }
}

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { slug } = params;
    const db = await connectToDatabase();
    if (db) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
      const query = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };
      const doc = await Artwork.findOne(query).lean().exec();
      if (doc) {
        return NextResponse.json(
          {
            success: true,
            data: {
              ...doc,
              id: doc._id ? String(doc._id) : doc.slug,
            },
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
          }
        );
      }
    }

    const fallback = ARTWORKS_DATA.find((item) => item.slug === slug || item.id === slug);
    if (fallback) {
      return NextResponse.json(
        { success: true, data: fallback },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Artwork not found.' },
      {
        status: 404,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artwork.' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { slug } = params;
    const json = await request.json().catch(() => ({}));

    const parsed = artworkUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid update payload.' },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service is currently unavailable.' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

    const updated = await Artwork.findOneAndUpdate(
      query,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Artwork not found.' },
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    // Call revalidateTag & revalidatePath for immediate ISR cache invalidation
    invalidateArtworkCaches(slug, updated.slug);

    return NextResponse.json(
      {
        success: true,
        data: updated,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'An artwork with this slug already exists.' },
        { status: 409, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Unable to update artwork.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

export const PATCH = PUT;

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { slug } = params;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service is currently unavailable.' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

    const deleted = await Artwork.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Artwork not found.' },
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    // Cleanup associated Cloudinary images if present
    if (deleted.images && Array.isArray(deleted.images) && deleted.images.length > 0) {
      await deleteCloudinaryImages(deleted.images);
    }

    // Invalidate ISR cache tags and paths to purge deleted artwork
    invalidateArtworkCaches(deleted.slug);

    return NextResponse.json(
      {
        success: true,
        message: `Artwork "${deleted.slug}" successfully deleted.`,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to delete artwork.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
