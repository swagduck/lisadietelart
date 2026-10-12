import { NextResponse } from 'next/server';
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
