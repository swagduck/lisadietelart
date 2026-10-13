import type { ImageLoaderProps } from 'next/image';

/**
 * Checks whether a given URL points to Cloudinary's media CDN.
 */
export function isCloudinaryUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}

/**
 * Inserts Cloudinary optimization transformations (f_auto, q_auto, w_<width>) into a Cloudinary URL.
 * If the URL is not a Cloudinary asset, returns the original URL untouched.
 */
export function getCloudinaryUrl(
  url: string,
  options?: {
    width?: number;
    quality?: number | 'auto';
    blur?: number;
    crop?: string;
  }
): string {
  if (!isCloudinaryUrl(url)) return url;

  const uploadSegment = '/image/upload/';
  const uploadIndex = url.indexOf(uploadSegment);
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + uploadSegment.length);
  const rest = url.substring(uploadIndex + uploadSegment.length);

  // Build transformation chain
  const transforms: string[] = ['f_auto'];

  if (options?.quality) {
    transforms.push(`q_${options.quality}`);
  } else {
    transforms.push('q_auto');
  }

  if (options?.crop) {
    transforms.push(`c_${options.crop}`);
  }

  if (options?.width) {
    transforms.push(`w_${options.width}`);
    if (!options.crop) {
      transforms.push('c_limit');
    }
  }

  if (options?.blur) {
    transforms.push(`e_blur:${options.blur}`);
  }

  // Strip any existing leading transformation parameters to prevent invalid or conflicting chains
  const cleanRest = rest.replace(
    /^(?:(?:[a-z]{1,2}_[a-zA-Z0-9:]+|f_auto|q_auto)(?:,|$))+\//,
    ''
  );

  return `${prefix}${transforms.join(',')}/${cleanRest}`;
}

/**
 * Generates a tiny, highly compressed blurred placeholder URL for Cloudinary images (w_20, e_blur:500).
 * If the source is a local or static image, returns a warm neutral SVG shimmer Data URL.
 */
export function getCloudinaryBlurUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') {
    return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Crect width="10" height="10" fill="%23f7f6f4"/%3E%3C/svg%3E';
  }

  if (isCloudinaryUrl(url)) {
    return getCloudinaryUrl(url, {
      width: 20,
      crop: 'scale',
      quality: 'auto',
      blur: 500,
    });
  }

  // Neutral SVG blurDataURL matching the paper background tone (#f7f6f4)
  return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Crect width="10" height="10" fill="%23f7f6f4"/%3E%3C/svg%3E';
}

/**
 * Cloudinary-based custom loader for next/image components.
 * Automatically injects f_auto, q_auto, and requested target width.
 */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!isCloudinaryUrl(src)) {
    return src;
  }
  return getCloudinaryUrl(src, {
    width,
    quality: quality ? quality : 'auto',
  });
}
