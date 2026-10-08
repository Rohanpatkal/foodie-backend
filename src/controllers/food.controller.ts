import { Request, Response, NextFunction } from 'express';
import { FoodService } from '../services/food.service.js';

export class FoodController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;

      const foods = await FoodService.getAll(search, category);
      res.status(200).json({
        success: true,
        data: { foods },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const food = await FoodService.getById(id);
      res.status(200).json({
        success: true,
        data: { food },
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, category, price, image, description } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ success: false, message: 'Food name is required' });
        return;
      }
      if (!category || !category.trim()) {
        res.status(400).json({ success: false, message: 'Category is required' });
        return;
      }
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        res.status(400).json({ success: false, message: 'Valid positive price is required' });
        return;
      }
      if (!image || !image.trim()) {
        res.status(400).json({ success: false, message: 'Food image/emoji is required' });
        return;
      }

      const food = await FoodService.create({
        name: name.trim(),
        category: category.trim(),
        price: numPrice,
        image: image.trim(),
        description: description?.trim() || '',
      });

      res.status(201).json({
        success: true,
        message: 'Food created successfully',
        data: { food },
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await FoodService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Food item deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}
