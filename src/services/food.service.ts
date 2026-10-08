import { Food, IFood } from '../models/Food.js';

export interface CreateFoodDTO {
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

export class FoodService {
  static async getAll(search?: string, category?: string): Promise<IFood[]> {
    const query: any = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
      ];
    }

    return Food.find(query).sort({ createdAt: -1 });
  }

  static async getById(id: string): Promise<IFood> {
    const food = await Food.findById(id);
    if (!food) {
      const err: any = new Error('Food item not found');
      err.statusCode = 404;
      throw err;
    }
    return food;
  }

  static async create(dto: CreateFoodDTO): Promise<IFood> {
    return Food.create(dto);
  }

  static async delete(id: string): Promise<void> {
    const deleted = await Food.findByIdAndDelete(id);
    if (!deleted) {
      const err: any = new Error('Food item not found');
      err.statusCode = 404;
      throw err;
    }
  }
}
