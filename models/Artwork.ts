import mongoose, { Schema, Model } from 'mongoose';
import { IArtwork } from '@/types/artwork';

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    type: { type: String, enum: ['original', 'print'], required: true },
    medium: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD', trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], required: true, default: [] },
    sold: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Performance indexes for fast catalog filtering and unique slug resolution
ArtworkSchema.index({ slug: 1 }, { unique: true });
ArtworkSchema.index({ type: 1, sold: 1, createdAt: -1 });
ArtworkSchema.index({ featured: 1, createdAt: -1 });

export const Artwork: Model<IArtwork> =
  (mongoose?.models && mongoose.models.Artwork)
    ? (mongoose.models.Artwork as Model<IArtwork>)
    : (typeof mongoose?.model === 'function'
        ? mongoose.model<IArtwork>('Artwork', ArtworkSchema)
        : ({} as Model<IArtwork>));

export default Artwork;
