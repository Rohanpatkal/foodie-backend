import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

// Customer Order Endpoints
router.post('/', authenticate, OrderController.create);
router.get('/', authenticate, OrderController.getCustomerOrders);

// Admin Order Endpoints (can be accessed via /api/orders/admin or via /api/admin/orders)
router.get('/admin', authenticate, requireAdmin, OrderController.getAdminOrders);
router.patch('/admin/:id/status', authenticate, requireAdmin, OrderController.updateStatus);

export default router;
