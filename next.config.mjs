/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // All assets are served locally from /public/images to avoid remote 404s
    remotePatterns: [],
  },
};

export default nextConfig;
