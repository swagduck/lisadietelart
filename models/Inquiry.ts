import 'server-only';
import mongoose, { Schema, Model } from 'mongoose';
import { IInquiry } from '@/types/artwork';

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    artworkSlug: { type: String, trim: true, default: null },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ read: 1, createdAt: -1 });

export const Inquiry: Model<IInquiry> =
  (mongoose.models?.Inquiry as Model<IInquiry>) ||
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
