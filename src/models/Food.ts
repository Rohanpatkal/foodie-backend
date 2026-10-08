import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Food category is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Food price is required'],
      min: [0, 'Price must be positive'],
    },
    image: {
      type: String,
      required: [true, 'Image or emoji is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

FoodSchema.index({ name: 'text', category: 'text' });

export const Food = mongoose.model<IFood>('Food', FoodSchema);
