import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = token ? await verifyAdminToken(token) : false;

  // 1. Handle Admin Page Routes
  if (pathname === '/admin/login') {
    // If already logged in, redirect to the admin dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Handle Protected API Routes
  // Public API endpoints that do not require admin auth:
  // - GET /api/artworks, GET /api/artworks/* (public gallery view)
  // - POST /api/inquiries (public visitor contact form)
  // - POST /api/subscribers (public newsletter signup)
  // - POST /api/auth/login, POST /api/auth/logout, GET /api/auth/check
  const isPublicApi =
    pathname.startsWith('/api/auth/') ||
    pathname === '/api/inquiries' ||
    pathname === '/api/subscribers' ||
    ((pathname === '/api/artworks' || pathname.startsWith('/api/artworks/')) &&
      (request.method === 'GET' || request.method === 'HEAD'));

  if (pathname.startsWith('/api/') && !isPublicApi) {
    // Protected API: require valid admin session
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/artworks/:path*',
    '/api/artworks',
    '/api/upload',
    '/api/upload/:path*',
    '/api/admin/:path*',
  ],
};
