import api from './axios';
import { PartnerProfile, PartnerStats } from '../types/partner';

export const partnerApi = {
  /**
   * Get partner profile
   */
  getPartnerProfile: async () => {
    const response = await api.get<PartnerProfile>('/partners/profile');
    return response.data;
  },

  /**
   * Update partner profile
   */
  updatePartnerProfile: async (profileData: Partial<PartnerProfile>) => {
    const response = await api.put<PartnerProfile>('/partners/profile', profileData);
    return response.data;
  },

  /**
   * Get partner statistics
   */
  getPartnerStats: async (period: 'day' | 'week' | 'month' = 'month') => {
    const response = await api.get<PartnerStats>(`/partners/stats?period=${period}`);
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
    const response = await api.put('/partners/availability', { availability });
    return response.data;
  },

  /**
   * Get all partners (admin only)
   */
  getAllPartners: async () => {
    const response = await api.get('/partners');
    return response.data;
  }
};
