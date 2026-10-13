/**
 * Client-side image compression and direct signed Cloudinary upload helper.
 * 
 * Compresses and resizes images in the browser using HTML5 Canvas (max 2400px, 85% JPEG),
 * tracks upload progress per image, and uploads directly to Cloudinary via a signed endpoint,
 * bypassing Vercel serverless request body limitations.
 */

export interface UploadProgressItem {
  id: string;
  name: string;
  progress: number;
  status: 'compressing' | 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

/**
 * Resizes and compresses an image in the browser using an offscreen canvas.
 * Target: Max 2400px on the longest edge, ~85% quality JPEG.
 */
export async function compressImage(
  file: File,
  maxDimension = 2400,
  quality = 0.85
): Promise<Blob> {
  // If SVG or non-raster, do not compress via canvas
  if (file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { naturalWidth: width, naturalHeight: height } = img;

      if (!width || !height) {
        resolve(file);
        return;
      }

      // Calculate scale if exceeding maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file);
        return;
      }

      // Enable image smoothing for high-quality downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image "${file.name}" for compression.`));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a compressed blob directly to Cloudinary using an authenticated server-issued signature.
 */
export async function uploadDirectToCloudinary(
  blob: Blob,
  fileName: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  // 1. Obtain signed credentials from authenticated API
  const sigRes = await fetch('/api/admin/upload-signature', {
    method: 'POST',
  });

  const sigData = await sigRes.json();
  if (!sigRes.ok || !sigData.success) {
    throw new Error(
      sigData.error ||
        'Unable to obtain upload signature. Please ensure Cloudinary credentials are configured.'
    );
  }

  const { signature, timestamp, apiKey, cloudName, folder } = sigData;

  // 2. Prepare multipart form data for Cloudinary direct upload
  const formData = new FormData();
  const safeName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
  formData.append('file', blob, safeName);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  // 3. Upload via XMLHttpRequest to accurately track progress
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && (response.secure_url || response.url)) {
          resolve(response.secure_url || response.url);
        } else {
          const errorMsg =
            response?.error?.message ||
            `Cloudinary upload failed with status ${xhr.status}.`;
          reject(new Error(errorMsg));
        }
      } catch {
        reject(new Error(`Failed to parse Cloudinary response (status ${xhr.status}).`));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          'Network connection error during direct image upload. Please check your internet connection.'
        )
      );
    };

    xhr.onabort = () => {
      reject(new Error('Image upload was aborted.'));
    };

    xhr.send(formData);
  });
}
