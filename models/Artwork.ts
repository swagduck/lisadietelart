import mongoose, { Schema, Model } from 'mongoose';
import { IArtwork } from '@/types/artwork';

const PrintOptionSchema = new Schema(
  {
    size: { type: String, required: true },
    price: { type: Number, required: true },
    editionLimit: { type: Number, default: 50 },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Oil on Linen', 'Watercolors', 'Studies & Sketches', 'Selected Archive'],
    },
    medium: { type: String, required: true },
    dimensions: { type: String, required: true },
    surface: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
    },
    isOriginalAvailable: { type: Boolean, default: true },
    hasPrints: { type: Boolean, default: false },
    printOptions: [PrintOptionSchema],
    imageUrl: { type: String, required: true },
    detailImages: [{ type: String }],
    description: { type: String, required: true },
    story: { type: String },
    featured: { type: Boolean, default: false },
    exhibitions: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Artwork: Model<IArtwork> =
  mongoose.models.Artwork || mongoose.model<IArtwork>('Artwork', ArtworkSchema);

export default Artwork;
