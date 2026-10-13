import 'server-only';
import mongoose, { Schema, Model } from 'mongoose';

export interface IOrderItem {
  artworkId: string;
  title: string;
  type: 'original' | 'print';
  variant?: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IOrder {
  _id?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'in_production' | 'shipped' | 'delivered';
  trackingNumber?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    artworkId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['original', 'print'], required: true },
    variant: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    shippingAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unfulfilled', 'in_production', 'shipped', 'delivered'],
      default: 'unfulfilled',
    },
    trackingNumber: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  (mongoose.models?.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
