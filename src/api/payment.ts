import axiosInstance from './axios';

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  items?: CheckoutItem[];
  paymentType: 'direct' | 'cart';
  serviceId?: number;
}

export interface CheckoutItem {
  partnerServiceId: number;
  quantity: number;
  price: number;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  orderId: number;
}

export interface PaymentConfirmationRequest {
  paymentIntentId: string;
  orderId: number;
}

export const paymentAPI = {
  createPaymentIntent: async (data: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
    const response = await axiosInstance.post('/payments/create-payment-intent', data);
    return response.data;
  },

  confirmPayment: async (data: PaymentConfirmationRequest): Promise<string> => {
    const response = await axiosInstance.post('/payments/confirm-payment', data);
    return response.data;
  }
};