import axiosInstance from './axios';
import { Service } from '../types/service';
import { ServiceDetails } from '../types/serviceDetails';

type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const serviceApi = {
  /**
   * Get all services
   */
  getAllServices: async () => {
    const response = await axiosInstance.get<Service[]>('/services');
    return response.data;
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: number) => {
    const response = await axiosInstance.get<Service>(`/services/${id}`);
    return response.data;
  },

  /**
   * Get services by category
   */
  getServicesByCategory: async (category: string) => {
    const response = await axiosInstance.get<Service[]>(`/services/category/${category}`);
    return response.data;
  },

  /**
   * Get services by provider ID
   */
  getServicesByProviderId: async (providerId: number) => {
    const response = await axiosInstance.get<Service[]>(`/services/provider/${providerId}`);
    return response.data;
  },

  /**
   * Create a new service (Partner only)
   */
  createService: async (service: CustomOmit<Service, 'id'>) => {
    const response = await axiosInstance.post<Service>('/services', service);
    return response.data;
  },

  /**
   * Update an existing service (Partner only)
   */
  updateService: async (id: number, service: Partial<Service>) => {
    const response = await axiosInstance.put<Service>(`/services/${id}`, service);
    return response.data;
  },

  /**
   * Delete a service (Partner only)
   */
  deleteService: async (id: number) => {
    await axiosInstance.delete(`/services/${id}`);
  },

  /**
   * Search services by term
   */
  searchServices: async (term: string) => {
    const response = await axiosInstance.get<Service[]>(`/services/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  /**
   * Get featured services
   */
  getFeaturedServices: async (limit: number = 5) => {
    const response = await axiosInstance.get<Service[]>(`/services/featured?limit=${limit}`);
    return response.data;
  },

  /**
   * Get detailed service information with available partners
   */
  getServiceDetails: async (id: number) => {
    const response = await axiosInstance.get<ServiceDetails>(`/services/${id}/details`);
    return response.data;
  },

  // Slug-based methods for better URLs
  /**
   * Get service by slug
   */
  getServiceBySlug: async (slug: string) => {
    const response = await axiosInstance.get<Service>(`/services/by-slug/${slug}`);
    return response.data;
  },

  /**
   * Get detailed service information by slug
   */
  getServiceDetailsBySlug: async (slug: string) => {
    const response = await axiosInstance.get<ServiceDetails>(`/services/by-slug/${slug}/details`);
    return response.data;
  },

  /**
   * Get services by category slug
   */
  getServicesByCategorySlug: async (categorySlug: string) => {
    const response = await axiosInstance.get<Service[]>(`/services/category-slug/${categorySlug}`);
    return response.data;
  },

  /**
   * Get all categories with slugs
   */
  getAllCategories: async () => {
    const response = await axiosInstance.get<{name: string, slug: string}[]>('/categories');
    return response.data;
  }
};
