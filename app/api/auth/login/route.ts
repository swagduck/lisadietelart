import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { signAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: 5 login attempts per 15 minutes per IP
    const limitCheck = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
    if (!limitCheck.success) {
      const waitSeconds = Math.max(1, Math.ceil((limitCheck.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please wait ${Math.ceil(waitSeconds / 60)} minute(s) before trying again.`,
        },
        {
          status: 429,
          headers: {
            ...noStoreHeaders,
            'Retry-After': String(waitSeconds),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) {
      console.error('ADMIN_PASSWORD environment variable is not defined.');
      return NextResponse.json(
        { success: false, error: 'Admin authentication is temporarily unavailable.' },
        { status: 503, headers: noStoreHeaders }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Constant-time password comparison to prevent timing side-channel attacks
    const inputHash = crypto.createHash('sha256').update(password).digest();
    const expectedHash = crypto.createHash('sha256').update(expectedPassword).digest();

    if (!crypto.timingSafeEqual(inputHash, expectedHash)) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    const token = await signAdminToken();
    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful.',
      },
      { headers: noStoreHeaders }
    );

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal authentication service error.' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
