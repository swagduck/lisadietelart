import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

export const ADMIN_COOKIE_NAME = 'admin_session';

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    'default_admin_secret_key_change_me_in_prod_32';
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT token valid for 7 days for the authenticated admin session.
 */
export async function signAdminToken(): Promise<string> {
  const secretKey = getJwtSecret();
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verifies the signed JWT token from the httpOnly cookie.
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secretKey = getJwtSecret();
    const { payload } = await jwtVerify(token, secretKey);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
