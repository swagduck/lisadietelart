import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';
import { ARTWORKS_DATA } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const artworks = await Artwork.find({}).sort({ year: -1, createdAt: -1 }).lean();
      if (artworks && artworks.length > 0) {
        return NextResponse.json({ success: true, source: 'database', data: artworks });
      }
    }
  } catch (error) {
    console.error(
      'Database query error in /api/artworks, falling back to static data:',
      error
    );
  }

  // Graceful fallback to static seed data
  return NextResponse.json({
    success: true,
    source: 'static',
    data: ARTWORKS_DATA,
  });
}

export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid admin password' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'MongoDB is not connected. Configure MONGODB_URI in your environment.',
        },
        { status: 503 }
      );
    }

    const newArtwork = await Artwork.create(body);
    return NextResponse.json({ success: true, data: newArtwork }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create artwork' },
      { status: 500 }
    );
  }
}
