import axiosInstance from './axios';
import { CartItem, AddToCartRequest } from '../types/cart';

export const cartApi = {
  /**
   * Get user's cart items
   */
  getCart: async () => {
    const response = await axiosInstance.get<CartItem[]>('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  addToCart: async (request: AddToCartRequest) => {
    const response = await axiosInstance.post<CartItem>('/cart/add', request);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (cartItemId: number, quantity: number) => {
    const response = await axiosInstance.put<CartItem>(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartItemId: number) => {
    await axiosInstance.delete(`/cart/${cartItemId}`);
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    await axiosInstance.delete('/cart/clear');
  },

  /**
   * Get cart item count
   */
  getCartCount: async () => {
    const response = await axiosInstance.get<{ count: number }>('/cart/count');
    return response.data.count;
  }
};