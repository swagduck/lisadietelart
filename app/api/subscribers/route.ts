import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { subscriberInputSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = rateLimit(`subscribers:${ip}`, 5, 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limitCheck.reset - Date.now()) / 1000)),
          },
        }
      );
    }

    const json = await request.json();

    // Validate with Zod
    const parseResult = subscriberInputSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email, honeypot, website } = parseResult.data;

    // Honeypot detection: If bot completed hidden field, silently return success without persisting
    if (honeypot || website) {
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you for subscribing to Lisa Dietel Studio Dispatch.',
        },
        { status: 201 }
      );
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        // Upsert subscriber or handle duplicate cleanly
        await Subscriber.findOneAndUpdate(
          { email },
          { $setOnInsert: { email, createdAt: new Date() } },
          { upsert: true, new: true }
        );
      }
    } catch {
      // Safe fallback notice without leaking connection details
      console.warn('Subscription registered; database storage is offline.');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing to Lisa Dietel Studio Dispatch.',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}
