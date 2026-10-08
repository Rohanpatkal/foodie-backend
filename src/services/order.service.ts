import mongoose from 'mongoose';
import { Order, IOrder, IOrderItem, OrderStatus } from '../models/Order.js';
import { Food } from '../models/Food.js';

export interface CreateOrderItemInput {
  foodId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  items: CreateOrderItemInput[];
}

export class OrderService {
  static async createOrder(dto: CreateOrderDTO): Promise<IOrder> {
    if (!dto.address || !dto.address.trim()) {
      const err: any = new Error('Delivery address is required');
      err.statusCode = 400;
      throw err;
    }

    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      const err: any = new Error('Order must contain at least one item');
      err.statusCode = 400;
      throw err;
    }

    // Process items & build historical snapshots
    let total = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of dto.items) {
      if (!mongoose.Types.ObjectId.isValid(item.foodId)) {
        const err: any = new Error(`Invalid food ID: ${item.foodId}`);
        err.statusCode = 400;
        throw err;
      }

      const food = await Food.findById(item.foodId);
      if (!food) {
        const err: any = new Error(`Food not found for ID: ${item.foodId}`);
        err.statusCode = 404;
        throw err;
      }

      const quantity = Math.floor(Number(item.quantity));
      if (isNaN(quantity) || quantity <= 0) {
        const err: any = new Error(`Invalid quantity for food item ${food.name}`);
        err.statusCode = 400;
        throw err;
      }

      const itemTotal = food.price * quantity;
      total += itemTotal;

      orderItems.push({
        foodId: food._id,
        foodName: food.name,
        price: food.price, // Snapshot current price!
        quantity,
        image: food.image,
      });
    }

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(dto.userId),
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      address: dto.address.trim(),
      total,
      status: 'Pending',
      items: orderItems,
      paymentMethod: 'Cash on Delivery',
    });

    return order;
  }

  static async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  static async getAllOrders(): Promise<IOrder[]> {
    return Order.find().sort({ createdAt: -1 });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
    const validStatuses: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      const err: any = new Error(`Invalid order status: ${status}`);
      err.statusCode = 400;
      throw err;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    return order;
  }
}
