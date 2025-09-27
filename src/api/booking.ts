import axiosInstance from './axios';
import { Booking, BookingStatus, BookingRequest } from '../types/booking';

type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const bookingApi = {
  /**
   * Create a new booking
   */
  createBooking: async (booking: CustomOmit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const response = await axiosInstance.post<Booking>('/bookings', booking);
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (id: number) => {
    const response = await axiosInstance.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Get bookings for current customer
   */
  getCustomerBookings: async (status?: BookingStatus) => {
    const url = status 
      ? `/bookings/customer?status=${status}` 
      : '/bookings/customer';
    const response = await axiosInstance.get<Booking[]>(url);
    return response.data;
  },

  /**
   * Reschedule booking status
   */
  rescheduleBooking: async (id: number, bookingRequest: Booking) => {
    const response = await axiosInstance.put<Booking>(`/bookings/${id}/reschedule`, { bookingRequest });
    return response.data;
  },

  /**
   * Cancel booking (Customer only)
   */
  cancelBooking: async (id: number) => {
    const response = await axiosInstance.put<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  /**
   * Get bookings for current partner (Partner only)
   */
  getPartnerBookings: async (status?: BookingStatus) => {
    const url = status
    ? `/bookings/partner?status=${status}`
    : '/bookings/partner';
    const response = await axiosInstance.get<Booking[]>(url);
    return response.data;
  },
};
