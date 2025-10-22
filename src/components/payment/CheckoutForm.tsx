import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement
} from '@stripe/react-stripe-js';
import { paymentConfig } from '../../config/payment';

interface CheckoutFormProps {
  clientSecret: string;
  orderId: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Mock Payment Form Component
const MockCheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  orderId,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate mock payment confirmation
    setTimeout(() => {
      console.log('🧪 MOCK MODE: Simulating successful payment');
      onSuccess();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Payment</h3>
        <p className="text-gray-600 text-sm">
          This is a simulated payment for testing purposes. No real payment will be processed.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing Demo Payment...' : 'Complete Demo Payment'}
      </button>
    </form>
  );
};

// Real Stripe Payment Form Component
const StripeCheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  orderId,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
      },
      redirect: 'if_required'
    });

    if (error) {
      onError(error.message || 'Payment failed');
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <PaymentElement />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
        <AddressElement options={{ mode: 'billing' }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  );
};

// Main CheckoutForm component that chooses between mock and real
const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  if (paymentConfig.mockPayment) {
    return <MockCheckoutForm {...props} />;
  }
  return <StripeCheckoutForm {...props} />;
};

export default CheckoutForm;