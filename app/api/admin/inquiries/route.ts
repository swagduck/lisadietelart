import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean().exec();

    return NextResponse.json({
      success: true,
      data: inquiries.map((item: any) => ({
        ...item,
        id: item._id.toString(),
      })),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
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
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry successfully deleted.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json();
    const { id, read } = json;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { read: Boolean(read) } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updated.toObject(),
        id: updated._id.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry read status' },
      { status: 500 }
    );
  }
}

