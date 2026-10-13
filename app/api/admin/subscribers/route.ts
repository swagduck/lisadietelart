import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503, headers: noStoreHeaders }
      );
    }

    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean().exec();

    return NextResponse.json(
      {
        success: true,
        data: subscribers.map((item) => ({
          ...item,
          id: String(item._id),
        })),
      },
      { headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503, headers: noStoreHeaders }
      );
    }

    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Subscriber successfully removed.',
      },
      { headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
