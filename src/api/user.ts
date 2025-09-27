import axiosInstance from './axios';
import { User } from '../types/user';

type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const userApi = {
  /**
   * Register a new user
   */
  register: async (userData: CustomOmit<User, 'id'>) => {
    const response = await axiosInstance.post<{ user: User, token: string }>('/auth/register', userData);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Login
   */
  login: async (email: string, password: string) => {
    const loginData = {
        email: email,
        password: password
    };
    const response = await axiosInstance.post<User>('/auth/login', loginData);
    return {user: response.data, token: "token"};
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>) => {
    const response = await axiosInstance.put<User>('/users/profile', userData);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    await axiosInstance.put('/users/password', { currentPassword, newPassword });
  }
};
