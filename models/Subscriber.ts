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
  (mongoose?.models && mongoose.models.Subscriber)
    ? (mongoose.models.Subscriber as Model<ISubscriber>)
    : (typeof mongoose?.model === 'function'
        ? mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
        : ({} as Model<ISubscriber>));

export default Subscriber;
