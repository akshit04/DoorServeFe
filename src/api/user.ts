import api from './axios';
import { User } from '../types/user';

export const userApi = {
  /**
   * Register a new user
   */
  register: async (userData: Omit<User, 'id'>) => {
    const response = await api.post<{ user: User, token: string }>('/auth/register', userData);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Login
   */
  login: async (email: string, password: string) => {
    const response = await api.get<User>('/auth/login', email, password);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put<User>('/users/profile', userData);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    await api.put('/users/password', { currentPassword, newPassword });
  }
};
