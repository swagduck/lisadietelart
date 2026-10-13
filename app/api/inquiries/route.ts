import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';
import { inquiryInputSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = rateLimit(`inquiries:${ip}`, 5, 10 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many inquiry submissions. Please wait a few minutes before trying again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limitCheck.reset - Date.now()) / 1000)),
          },
        }
      );
    }

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

    const { name, email, message, artworkSlug, honeypot, website } = parseResult.data;

    // Honeypot check: silently accept bot submissions without storing in DB
    if (honeypot || website) {
      return NextResponse.json(
        {
          success: true,
          message: 'Your inquiry has been received. The studio will respond shortly.',
        },
        { status: 201 }
      );
    }

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
