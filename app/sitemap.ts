import { MetadataRoute } from 'next';
import { ARTWORKS_DATA } from '@/lib/data';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';

export const revalidate = 3600; // 1 hour ISR for sitemap

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lisadietelart.com';

  let artworkSlugs: { slug: string; updatedAt?: Date }[] = ARTWORKS_DATA.map((art) => ({
    slug: art.slug,
    updatedAt: new Date(),
  }));

  try {
    const db = await connectToDatabase();
    if (db) {
      const dbArtworks = await Artwork.find({}, 'slug updatedAt createdAt').lean().exec();
      if (dbArtworks && dbArtworks.length > 0) {
        artworkSlugs = dbArtworks.map((item) => ({
          slug: item.slug,
          updatedAt: item.updatedAt
            ? new Date(item.updatedAt)
            : item.createdAt
              ? new Date(item.createdAt)
              : new Date(),
        }));
      }
    }
  } catch {
    // Graceful fallback to static list
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/originals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prints`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/commissions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const artworkRoutes: MetadataRoute.Sitemap = artworkSlugs.map((art) => ({
    url: `${baseUrl}/artwork/${art.slug}`,
    lastModified: art.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...artworkRoutes];
}
