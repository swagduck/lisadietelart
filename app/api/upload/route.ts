import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file was provided.' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
    ];
    if (file.type && !validMimeTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Please upload a valid image file (JPEG, PNG, WebP, AVIF, SVG).' },
        { status: 400 }
      );
    }

    // Size limit: 12MB
    const maxBytes = 12 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowable limit (12MB).' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';
    const base64DataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    let cloudinarySuccessUrl: string | null = null;

    // Attempt Cloudinary upload if cloud name is configured
    if (cloudName) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const cloudFormData = new FormData();
        cloudFormData.append('file', base64DataUri);

        if (apiKey && apiSecret) {
          // Signed upload (most secure and standard for server-side route handlers)
          const toSign = `folder=artworks&timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash('sha1').update(toSign).digest('hex');
          cloudFormData.append('api_key', apiKey);
          cloudFormData.append('timestamp', String(timestamp));
          cloudFormData.append('signature', signature);
          cloudFormData.append('folder', 'artworks');
        } else if (uploadPreset) {
          // Unsigned upload preset
          cloudFormData.append('upload_preset', uploadPreset);
        }

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: cloudFormData,
          }
        );

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          if (cloudData.secure_url || cloudData.url) {
            cloudinarySuccessUrl = cloudData.secure_url || cloudData.url;
          }
        } else {
          const errorData = await cloudRes.json().catch(() => ({}));
          console.warn('Cloudinary upload warning:', errorData);
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload request failed:', cloudErr);
      }
    }

    if (cloudinarySuccessUrl) {
      return NextResponse.json({
        success: true,
        url: cloudinarySuccessUrl,
        provider: 'cloudinary',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          'Cloudinary upload failed or is not configured. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      },
      { status: 502 }
    );
  } catch (err: any) {
    console.error('Upload route error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal error processing image upload.' },
      { status: 500 }
    );
  }
}
