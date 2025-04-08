import api from './axios';
import { Service } from '../types/service';

export const serviceApi = {
  /**
   * Get all services
   */
  getAllServices: async () => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: number) => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  /**
   * Get services by category
   */
  getServicesByCategory: async (category: string) => {
    const response = await api.get<Service[]>(`/services/category/${category}`);
    return response.data;
  },

  /**
   * Get services by provider ID
   */
  getServicesByProviderId: async (providerId: number) => {
    const response = await api.get<Service[]>(`/services/provider/${providerId}`);
    return response.data;
  },

  /**
   * Create a new service (Partner only)
   */
  createService: async (service: Omit<Service, 'id'>) => {
    const response = await api.post<Service>('/services', service);
    return response.data;
  },

  /**
   * Update an existing service (Partner only)
   */
  updateService: async (id: number, service: Partial<Service>) => {
    const response = await api.put<Service>(`/services/${id}`, service);
    return response.data;
  },

  /**
   * Delete a service (Partner only)
   */
  deleteService: async (id: number) => {
    await api.delete(`/services/${id}`);
  },

  /**
   * Search services by term
   */
  searchServices: async (term: string) => {
    const response = await api.get<Service[]>(`/services/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  /**
   * Get featured services
   */
  getFeaturedServices: async (limit: number = 5) => {
    const response = await api.get<Service[]>(`/services/featured?limit=${limit}`);
    return response.data;
  }
};
