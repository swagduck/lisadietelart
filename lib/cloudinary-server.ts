import 'server-only';
import crypto from 'crypto';

/**
 * Server-only Cloudinary utility for managing remote media assets.
 * Securely handles asset deletion and cleanup using server credentials.
 */

function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('res.cloudinary.com') && !url.includes('cloudinary.com')) return null;

  try {
    const urlObj = new URL(url);
    // Path structure: /<cloud_name>/image/upload/(v<version>/)?<public_id>.<ext>
    const parts = urlObj.pathname.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex >= parts.length - 1) return null;

    let subParts = parts.slice(uploadIndex + 1);
    // Skip version prefix if present, e.g. v1700000000
    if (subParts[0] && /^v\d+$/.test(subParts[0])) {
      subParts = subParts.slice(1);
    }

    if (subParts.length === 0) return null;
    const fullPath = subParts.join('/');
    // Strip file extension
    const dotIndex = fullPath.lastIndexOf('.');
    return dotIndex !== -1 ? fullPath.slice(0, dotIndex) : fullPath;
  } catch {
    return null;
  }
}

/**
 * Deletes a list of Cloudinary images by URL.
 * Catches all errors safely to prevent database transaction rollback or unhandled rejections.
 */
export async function deleteCloudinaryImages(urls: (string | undefined | null)[]): Promise<void> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    // Cloudinary credentials not configured; skip remote deletion gracefully
    return;
  }

  const validUrls = urls.filter((u): u is string => Boolean(u));

  for (const url of validUrls) {
    const publicId = extractCloudinaryPublicId(url);
    if (!publicId) continue;

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      const formData = new URLSearchParams();
      formData.append('public_id', publicId);
      formData.append('timestamp', String(timestamp));
      formData.append('api_key', apiKey);
      formData.append('signature', signature);

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
    } catch (err) {
      // Log generic note without leaking secrets or stopping execution
      console.warn('Note: Cloudinary image removal request could not be completed.');
    }
  }
}
