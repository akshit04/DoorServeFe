import axiosInstance from './axios';
import { User } from '../types/user';

type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const userApi = {
  /**
   * Register a new user
   */
  register: async (userData: CustomOmit<User, 'id'>) => {
    const response = await axiosInstance.post<{
      token: string;
      userType: string;
      email: string;
      firstName: string;
      lastName: string;
    }>('/auth/register', userData);
    
    // Convert AuthResponse to User format expected by frontend
    const user: User = {
      id: '', // Will be populated when we fetch current user
      email: response.data.email,
      password: '', // Not returned from backend for security
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      phone: userData.phone || '',
      address: userData.address || {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      userType: response.data.userType as 'CUSTOMER' | 'PARTNER'
    };
    
    return { user, token: response.data.token };
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
    const response = await axiosInstance.post<{
      token: string;
      userType: string;
      email: string;
      firstName: string;
      lastName: string;
    }>('/auth/login', loginData);
    
    // Convert AuthResponse to User format expected by frontend
    const user: User = {
      id: '', // Will be populated when we fetch current user
      email: response.data.email,
      password: '', // Not returned from backend for security
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      userType: response.data.userType as 'CUSTOMER' | 'PARTNER'
    };
    
    return { user, token: response.data.token };
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
