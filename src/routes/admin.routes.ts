import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/orders', authenticate, requireAdmin, OrderController.getAdminOrders);
router.patch('/orders/:id/status', authenticate, requireAdmin, OrderController.updateStatus);

export default router;
