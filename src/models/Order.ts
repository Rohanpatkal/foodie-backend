import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface IOrderItem {
  foodId: mongoose.Types.ObjectId;
  foodName: string;
  price: number; // Historical price snapshot
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  address: string;
  total: number;
  status: OrderStatus;
  items: IOrderItem[];
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    foodId: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Preparing',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: any[]) => val.length > 0, 'Order must contain at least one item'],
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
