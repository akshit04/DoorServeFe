import axiosInstance from './axios';
import { Category } from '../types/category';

export const categoryApi = {
  /**
   * Get all service categories
   */
  getAllCategories: async () => {
    // var dummyCategories = [{'id': 'id', 'name': 'name', 'description': 'description', 'iconUrl': 'iconUrl'}];
    // console.log("Dummy categories: ", dummyCategories);
    // return dummyCategories;
    try {
        console.log("Dwight: calling categories");
        debugger;
        const response = await axiosInstance.get<Category[]>('/services-catalog');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('getAllCategories failed');
        throw error;
    }
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number) => {
    const response = await axiosInstance.get<Category>(`/services-catalog/${id}`);
    return response.data;
  }
};
