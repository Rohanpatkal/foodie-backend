import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  bannerText: string;
  bannerEnabled: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  supportPhone: string;
  supportEmail: string;
  operatingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    bannerText: {
      type: String,
      default: '⚡ Weekend Flash Sale: 20% off all Gourmet Pizzas & Burgers! Use code FOODIE20',
    },
    bannerEnabled: {
      type: Boolean,
      default: true,
    },
    heroHeadline: {
      type: String,
      default: 'Delicious Food, Delivered Hot & Fresh',
    },
    heroSubheadline: {
      type: String,
      default: 'Craving artisanal pizza, juicy burgers, or savory noodles? Order your favorites from top local kitchens now.',
    },
    supportPhone: {
      type: String,
      default: '+1 (800) 555-FOOD',
    },
    supportEmail: {
      type: String,
      default: 'support@foodie.com',
    },
    operatingHours: {
      type: String,
      default: '10:00 AM - 11:00 PM Daily',
    },
    deliveryFee: {
      type: Number,
      default: 4.99,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 35.0,
    },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model<IContent>('Content', ContentSchema);
