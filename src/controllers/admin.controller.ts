import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { User } from '../models/User.js';
import { Content } from '../models/Content.js';

export class AdminController {
  static async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalOrders, orders, totalFoods, totalUsers] = await Promise.all([
        Order.countDocuments(),
        Order.find().select('status total createdAt'),
        Food.countDocuments(),
        User.countDocuments(),
      ]);

      let totalRevenue = 0;
      let pendingOrders = 0;
      let deliveredOrders = 0;
      let preparingOrders = 0;
      let outForDeliveryOrders = 0;
      let cancelledOrders = 0;

      for (const order of orders) {
        if (order.status !== 'Cancelled') {
          totalRevenue += order.total;
        }
        switch (order.status) {
          case 'Pending':
            pendingOrders++;
            break;
          case 'Confirmed':
          case 'Preparing':
            preparingOrders++;
            break;
          case 'Out for Delivery':
            outForDeliveryOrders++;
            break;
          case 'Delivered':
            deliveredOrders++;
            break;
          case 'Cancelled':
            cancelledOrders++;
            break;
        }
      }

      const statusBreakdown = {
        Pending: pendingOrders,
        Preparing: preparingOrders,
        'Out for Delivery': outForDeliveryOrders,
        Delivered: deliveredOrders,
        Cancelled: cancelledOrders,
      };

      res.status(200).json({
        success: true,
        data: {
          stats: {
            totalRevenue: Number(totalRevenue.toFixed(2)),
            totalOrders,
            pendingOrders: pendingOrders + preparingOrders + outForDeliveryOrders,
            deliveredOrders,
            cancelledOrders,
            totalFoods,
            totalUsers,
            statusBreakdown,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: { users },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getContent(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let content = await Content.findOne();
      if (!content) {
        content = await Content.create({});
      }
      res.status(200).json({
        success: true,
        data: { content },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateContent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let content = await Content.findOne();
      if (!content) {
        content = new Content(req.body);
      } else {
        Object.assign(content, req.body);
      }
      await content.save();

      res.status(200).json({
        success: true,
        message: 'Website content and settings updated successfully',
        data: { content },
      });
    } catch (err) {
      next(err);
    }
  }
}
