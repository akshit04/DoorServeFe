import axiosInstance from './axios';
import { PartnerProfile, PartnerStats } from '../types/partner';

export const partnerApi = {
  /**
   * Get partner profile
   */
  getPartnerProfile: async () => {
    const response = await axiosInstance.get<PartnerProfile>('/partners/profile');
    return response.data;
  },

  /**
   * Update partner profile
   */
  updatePartnerProfile: async (profileData: Partial<PartnerProfile>) => {
    const response = await axiosInstance.put<PartnerProfile>('/partners/profile', profileData);
    return response.data;
  },

  /**
   * Get partner statistics
   */
  getPartnerStats: async (period: 'day' | 'week' | 'month' = 'month') => {
    const response = await axiosInstance.get<PartnerStats>(`/partners/stats?period=${period}`);
    return response.data;
  },

  /**
   * Update partner availability
   */
  updateAvailability: async (availability: { 
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    available: boolean
  }[]) => {
    const response = await axiosInstance.put('/partners/availability', { availability });
    return response.data;
  },

  /**
   * Get all partners (admin only)
   */
  getAllPartners: async () => {
    const response = await axiosInstance.get('/partners');
    return response.data;
  }
};
