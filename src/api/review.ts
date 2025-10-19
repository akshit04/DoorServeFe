import axiosInstance from './axios';
import { Review, ReviewStats } from '../types/review';

export const reviewApi = {
  /**
   * Get reviews for a specific partner
   */
  getPartnerReviews: async (partnerId: number) => {
    const response = await axiosInstance.get<Review[]>(`/reviews/partner/${partnerId}`);
    return response.data;
  },

  /**
   * Get review statistics for a partner
   */
  getPartnerReviewStats: async (partnerId: number) => {
    const response = await axiosInstance.get<ReviewStats>(`/reviews/partner/${partnerId}/stats`);
    return response.data;
  },

  /**
   * Get partner reviews for a specific service
   */
  getPartnerReviewsForService: async (serviceId: number, partnerId: number) => {
    const response = await axiosInstance.get<Review[]>(`/reviews/service/${serviceId}/partner/${partnerId}`);
    return response.data;
  }
};