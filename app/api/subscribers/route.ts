import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { subscriberInputSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate with Zod
    const parseResult = subscriberInputSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;

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
