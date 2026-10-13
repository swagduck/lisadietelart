'use client';

import { getCloudinaryUrl, isCloudinaryUrl } from './cloudinary-url';

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (isCloudinaryUrl(src)) {
    return getCloudinaryUrl(src, { width, quality });
  }
  return src;
}
