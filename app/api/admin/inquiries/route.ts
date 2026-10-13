import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

const patchInquirySchema = z.object({
  id: z.string().min(1, 'Inquiry ID is required'),
  read: z.boolean(),
});

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503, headers: noStoreHeaders }
      );
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean().exec();

    return NextResponse.json(
      {
        success: true,
        data: inquiries.map((item) => ({
          ...item,
          id: String(item._id),
        })),
      },
      { headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
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
        { success: false, error: 'Inquiry ID is required' },
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

    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry successfully deleted.',
      },
      { headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parseResult = patchInquirySchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID and read status boolean are required' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    const { id, read } = parseResult.data;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503, headers: noStoreHeaders }
      );
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { read } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...updated.toObject(),
          id: updated._id.toString(),
        },
      },
      { headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry read status' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
