import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: noStoreHeaders }
    );
  }

  const isValid = await verifyAdminToken(token);
  if (!isValid) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: noStoreHeaders }
    );
  }

  return NextResponse.json(
    { authenticated: true },
    { headers: noStoreHeaders }
  );
}
