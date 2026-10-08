import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

// Orders management
router.get('/orders', authenticate, requireAdmin, OrderController.getAdminOrders);
router.patch('/orders/:id/status', authenticate, requireAdmin, OrderController.updateStatus);

// Analytics & Dashboard statistics
router.get('/stats', authenticate, requireAdmin, AdminController.getStats);

// Customer & User management
router.get('/users', authenticate, requireAdmin, AdminController.getUsers);

// Website static content & settings
router.get('/content', AdminController.getContent); // Public or admin can read content
router.put('/content', authenticate, requireAdmin, AdminController.updateContent);

export default router;
