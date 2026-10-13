import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { artworkInputSchema } from '@/lib/validations';
import { ARTWORKS_DATA } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const db = await connectToDatabase();
    if (db) {
      const query: Record<string, any> = {};
      if (type && (type === 'original' || type === 'print')) {
        query.type = type;
      }
      if (featured === 'true') {
        query.featured = true;
      }

      const artworks = await Artwork.find(query)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      if (artworks && artworks.length > 0) {
        return NextResponse.json({
          success: true,
          data: artworks.map((a: any) => ({
            ...a,
            id: a._id.toString(),
            imageUrl: a.images?.[0] || '/images/nocturne-in-ochre.svg',
            dimensions: a.size,
            isSoldOut: a.sold,
          })),
        });
      }
    }
  } catch {
    // Return sanitized response on DB query error without leaking details
  }

  // Graceful fallback to static seed data
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const featured = searchParams.get('featured');

  let filtered = ARTWORKS_DATA;
  if (type) {
    filtered = filtered.filter((a) => a.type === type);
  }
  if (featured === 'true') {
    filtered = filtered.filter((a) => a.featured);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate with Zod
    const parseResult = artworkInputSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed. Please verify the artwork payload.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service is currently unavailable.' },
        { status: 503 }
      );
    }

    const createdArtwork = await Artwork.create(parseResult.data);

    // Call revalidatePath so public pages update immediately after creation
    try {
      revalidatePath('/');
      revalidatePath('/originals');
      revalidatePath('/prints');
      revalidatePath(`/artwork/${createdArtwork.slug}`);
      revalidatePath('/sitemap.xml');
    } catch (revalErr) {
      console.warn('Path revalidation note:', revalErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: createdArtwork._id.toString(),
          slug: createdArtwork.slug,
          title: createdArtwork.title,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    // Handle unique slug collision or general database errors without leaking internal details
    if (err?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'An artwork with this slug already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unable to process artwork creation request.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    const { slug, ...updateData } = json;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Artwork slug is required for updates.' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { success: false, error: 'Artwork not found.' },
        { status: 404 }
      );
    }

    // Call revalidatePath for immediate cache invalidation
    try {
      revalidatePath('/');
      revalidatePath('/originals');
      revalidatePath('/prints');
      revalidatePath(`/artwork/${updated.slug}`);
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
      { success: false, error: 'Unable to process artwork update.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Artwork slug is required for deletion.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service is currently unavailable.' },
        { status: 503 }
      );
    }

    const deleted = await Artwork.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Artwork not found.' },
        { status: 404 }
      );
    }

    // Call revalidatePath so cached public pages purge deleted artwork
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
      { success: false, error: 'Unable to process artwork deletion.' },
      { status: 500 }
    );
  }
}
