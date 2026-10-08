import { Router } from 'express';
import { FoodController } from '../controllers/food.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', FoodController.getAll);
router.get('/:id', FoodController.getById);
router.post('/', authenticate, requireAdmin, FoodController.create);
router.delete('/:id', authenticate, requireAdmin, FoodController.delete);

export default router;
