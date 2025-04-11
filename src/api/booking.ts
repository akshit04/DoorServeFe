import api from './axios';
import { Booking, BookingStatus, BookingRequest } from '../types/booking';

export const bookingApi = {
  /**
   * Create a new booking
   */
  createBooking: async (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const response = await api.post<Booking>('/bookings', booking);
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (id: number) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Get bookings for current customer
   */
  getCustomerBookings: async (status?: BookingStatus) => {
    const url = status 
      ? `/bookings/customer?status=${status}` 
      : '/bookings/customer';
    const response = await api.get<Booking[]>(url);
    return response.data;
  },

  /**
   * Reschedule booking status
   */
  rescheduleBooking: async (id: number, bookingRequest: BookingRequest) => {
    const response = await api.put<Booking>(`/bookings/${id}/reschedule`, { bookingRequest });
    return response.data;
  },

  /**
   * Cancel booking (Customer only)
   */
  cancelBooking: async (id: number) => {
    const response = await api.put<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  /**
   * Get bookings for current partner (Partner only)
   */
  getPartnerBookings: async (status?: BookingStatus) => {
    const url = status
    ? `/bookings/partner?status=${status}`
    : '/bookings/partner';
    const response = await api.get<Booking[]>(url);
    return response.data;
  },
};
