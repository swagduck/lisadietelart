import mongoose, { Schema, Model } from 'mongoose';
import { IInquiry } from '@/types/inquiry';

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    artworkTitle: { type: String },
    artworkId: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'artwork_inquiry',
        'commission',
        'gallery_representation',
        'studio_visit',
        'general',
      ],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
