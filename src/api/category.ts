import api from './axios';
import { Category } from '../types/category';

export const categoryApi = {
  /**
   * Get all service categories
   */
  getAllCategories: async () => {
    // var dummyCategories = [{'id': 'id', 'name': 'name', 'description': 'description', 'iconUrl': 'iconUrl'}];
    // console.log("Dummy categories: ", dummyCategories);
    // return dummyCategories;
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
