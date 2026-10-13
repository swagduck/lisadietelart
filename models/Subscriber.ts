import 'server-only';
import mongoose, { Schema, Model } from 'mongoose';
import { ISubscriber } from '@/types/artwork';

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Subscriber: Model<ISubscriber> =
  (mongoose.models?.Subscriber as Model<ISubscriber>) ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
