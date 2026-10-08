import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { OrderService } from '../services/order.service.js';
import { OrderStatus } from '../models/Order.js';

export class OrderController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { address, items } = req.body;

      const order = await OrderService.createOrder({
        userId: req.user._id.toString(),
        customerName: req.user.name,
        customerEmail: req.user.email,
        address,
        items,
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCustomerOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const orders = await OrderService.getOrdersByUserId(req.user._id.toString());
      res.status(200).json({
        success: true,
        data: { orders },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAdminOrders(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({
        success: true,
        data: { orders },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ success: false, message: 'Status is required' });
        return;
      }

      const order = await OrderService.updateOrderStatus(id, status as OrderStatus);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }
}
