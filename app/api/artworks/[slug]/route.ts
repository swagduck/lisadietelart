import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';

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
        return NextResponse.json({
          success: true,
          data: {
            ...doc,
            id: (doc as any)._id.toString(),
          },
        });
      }
    }

    const fallback = ARTWORKS_DATA.find((item) => item.slug === slug || (item as any).id === slug);
    if (fallback) {
      return NextResponse.json({ success: true, data: fallback });
    }

    return NextResponse.json({ success: false, error: 'Artwork not found.' }, { status: 404 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artwork.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { slug } = params;
    const updateData = await request.json();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service is currently unavailable.' },
        { status: 503 }
      );
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

    const updated = await Artwork.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Artwork not found.' }, { status: 404 });
    }

    // Call revalidateTag & revalidatePath for immediate ISR cache invalidation
    invalidateArtworkCaches(slug, updated.slug);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to update artwork.' },
      { status: 500 }
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
        { status: 503 }
      );
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

    const deleted = await Artwork.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Artwork not found.' }, { status: 404 });
    }

    // Invalidate ISR cache tags and paths to purge deleted artwork
    invalidateArtworkCaches(deleted.slug);

    return NextResponse.json({
      success: true,
      message: `Artwork "${deleted.slug}" successfully deleted.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to delete artwork.' },
      { status: 500 }
    );
  }
}
