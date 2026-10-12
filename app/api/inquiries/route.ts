import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';
import { inquiryInputSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate input with Zod
    const parseResult = inquiryInputSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input. Please provide a valid name, email, and message.',
        },
        { status: 400 }
      );
    }

    const { name, email, message, artworkSlug } = parseResult.data;

    try {
      const db = await connectToDatabase();
      if (db) {
        await Inquiry.create({
          name,
          email,
          message,
          artworkSlug: artworkSlug || null,
        });
      }
    } catch {
      // In development or if MongoDB Atlas is momentarily unavailable, log safe notice
      console.warn('Inquiry received; database storage is offline.');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. The studio will respond shortly.',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to process inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
