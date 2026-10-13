import { NextResponse } from 'next/server';
import { signAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

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
        { status: 500 }
      );
    }

    if (!password || typeof password !== 'string' || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const token = await signAdminToken();
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
    });

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
      { success: false, error: 'Unable to process login request.' },
      { status: 500 }
    );
  }
}
