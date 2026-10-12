import mongoose, { Schema, Model } from 'mongoose';
import { IInquiry } from '@/types/artwork';

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    artworkSlug: { type: String, trim: true, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Inquiry: Model<IInquiry> =
  (mongoose?.models && mongoose.models.Inquiry)
    ? (mongoose.models.Inquiry as Model<IInquiry>)
    : (typeof mongoose?.model === 'function'
        ? mongoose.model<IInquiry>('Inquiry', InquirySchema)
        : ({} as Model<IInquiry>));

export default Inquiry;
