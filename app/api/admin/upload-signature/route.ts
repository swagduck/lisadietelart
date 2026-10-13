import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cloudinary credentials are not configured in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Direct signed upload cannot proceed.',
        },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'artworks';
    // Parameters to sign in alphabetical order
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to generate Cloudinary upload signature.',
      },
      { status: 500 }
    );
  }
}
