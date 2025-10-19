import axiosInstance from './axios';
import { Category } from '../types/category';

export const categoryApi = {
  /**
   * Get all service categories
   */
  getAllCategories: async () => {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get category by name
   */
  getCategoryByName: async (name: string) => {
    const response = await axiosInstance.get<Category>(`/categories/${encodeURIComponent(name)}`);
    return response.data;
  }
};
