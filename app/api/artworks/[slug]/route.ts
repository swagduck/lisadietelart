import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';

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
      const doc = await Artwork.findOne({ slug }).lean().exec();
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

    const fallback = ARTWORKS_DATA.find((item) => item.slug === slug);
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

    const updated = await Artwork.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Artwork not found.' }, { status: 404 });
    }

    // Call revalidatePath for immediate ISR cache invalidation
    try {
      revalidatePath('/');
      revalidatePath('/originals');
      revalidatePath('/prints');
      revalidatePath(`/artwork/${slug}`);
      if (updated.slug !== slug) {
        revalidatePath(`/artwork/${updated.slug}`);
      }
      revalidatePath('/sitemap.xml');
    } catch (revalErr) {
      console.warn('Path revalidation note:', revalErr);
    }

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

    const deleted = await Artwork.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Artwork not found.' }, { status: 404 });
    }

    // Call revalidatePath to purge deleted artwork from ISR cache
    try {
      revalidatePath('/');
      revalidatePath('/originals');
      revalidatePath('/prints');
      revalidatePath(`/artwork/${slug}`);
      revalidatePath('/sitemap.xml');
    } catch (revalErr) {
      console.warn('Path revalidation note:', revalErr);
    }

    return NextResponse.json({
      success: true,
      message: `Artwork "${slug}" successfully deleted.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to delete artwork.' },
      { status: 500 }
    );
  }
}
