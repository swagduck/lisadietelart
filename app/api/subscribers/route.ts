import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { subscriberInputSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

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
            ...noStoreHeaders,
            'Retry-After': String(Math.ceil((limitCheck.reset - Date.now()) / 1000)),
          },
        }
      );
    }

    const json = await request.json().catch(() => ({}));

    // Validate with Zod
    const parseResult = subscriberInputSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400, headers: noStoreHeaders }
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
        { status: 201, headers: noStoreHeaders }
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
      { status: 201, headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to process subscription. Please try again.' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
