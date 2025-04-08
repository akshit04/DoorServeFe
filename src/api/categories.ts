import api from './axios';
import { Category } from '../types/category';

export const categoryApi = {
  /**
   * Get all service categories
   */
  getAllCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  }
};
