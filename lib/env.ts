import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://lisadietelart.com'),
  MONGODB_URI: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  SESSION_SECRET: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `Variable "${issue.path.join('.')}": ${issue.message}`)
      .join(', ');
    const message = `[Environment Validation Error] Configuration issues detected: ${errorDetails}`;
    console.error(message);
    throw new Error(message);
  }

  // Validate production runtime recommendations
  if (process.env.NODE_ENV === 'production') {
    const criticalVars: (keyof Env)[] = [
      'MONGODB_URI',
      'ADMIN_PASSWORD',
      'SESSION_SECRET',
    ];
    const missing = criticalVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      console.warn(
        `[Environment Warning] Recommended production variables are not configured: ${missing.join(', ')}. ` +
        `Please ensure these are set in your Vercel project settings.`
      );
    }
  }

  return result.data;
}

export const env = parseEnv();

/**
 * Asserts that a required server environment variable is present.
 * Throws a clean, informative error specifying which variable is missing without leaking sensitive data.
 */
export function requireEnv(key: keyof Env): string {
  const value = process.env[key];
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `[Missing Environment Variable] Required variable "${key}" is missing or empty. ` +
      `Please define it in your .env.local file or deployment environment settings.`
    );
  }
  return value;
}
