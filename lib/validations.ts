import { z } from 'zod';

export const artworkInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  type: z.enum(['original', 'print']),
  medium: z.string().min(1, 'Medium is required').max(200),
  size: z.string().min(1, 'Size is required').max(100),
  price: z.number().positive('Price must be a positive number'),
  currency: z.string().default('USD'),
  description: z.string().min(1, 'Description is required').max(5000),
  images: z.array(z.string().min(1)).min(1, 'At least one image is required'),
  sold: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const inquiryInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
  artworkSlug: z.string().optional().nullable(),
  honeypot: z.string().optional(),
  website: z.string().optional(),
});

export const subscriberInputSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  honeypot: z.string().optional(),
  website: z.string().optional(),
});

export type ArtworkInput = z.infer<typeof artworkInputSchema>;
export type InquiryInput = z.infer<typeof inquiryInputSchema>;
export type SubscriberInput = z.infer<typeof subscriberInputSchema>;
