import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/payment/CheckoutForm';
import { paymentAPI, PaymentIntentRequest } from '../../api/payment';
import { paymentConfig } from '../../config/payment';

const stripePromise = paymentConfig.mockPayment ? null : loadStripe(paymentConfig.stripePublishableKey);

interface CheckoutState {
  items: any[];
  total: number;
  paymentType: 'direct' | 'cart';
  serviceId?: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [orderId, setOrderId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const checkoutData = location.state as CheckoutState;

  useEffect(() => {
    if (!checkoutData) {
      navigate('/cart');
      return;
    }

    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const request: PaymentIntentRequest = {
        amount: checkoutData.total,
        paymentType: checkoutData.paymentType,
        items: checkoutData.items.map(item => ({
          partnerServiceId: item.partnerServiceId || item.id,
          quantity: item.quantity || 1,
          price: item.price,
          bookingDate: item.bookingDate,
          startTime: item.startTime,
          endTime: item.endTime
        }))
      };

      if (checkoutData.serviceId) {
        request.serviceId = checkoutData.serviceId;
      }

      const response = await paymentAPI.createPaymentIntent(request);
      setClientSecret(response.clientSecret);
      setOrderId(response.orderId);
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError('Failed to initialize payment: ' + (err as any)?.response?.data || (err as Error)?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate('/payment-success', { 
      state: { orderId, total: checkoutData.total } 
    });
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              {checkoutData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title || item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity || 1}
                    </p>
                    {item.bookingDate && (
                      <p className="text-sm text-gray-600">
                        Date: {item.bookingDate} | Time: {item.startTime} - {item.endTime}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${((item.price * (item.quantity || 1))).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${checkoutData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {clientSecret && (
              <div className="space-y-6">
                {paymentConfig.mockPayment && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">🧪 Demo Mode</h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      You're in demo mode using mock payments. Click the button below to simulate a successful payment.
                    </p>
                    <p className="text-yellow-600 text-xs">
                      To use real payments, change mockPayment to false in the payment configuration.
                    </p>
                  </div>
                )}
                
                {paymentConfig.mockPayment ? (
                  // Mock payment - no Elements wrapper needed
                  <CheckoutForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  // Real Stripe payment - needs Elements wrapper
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <CheckoutForm
                      clientSecret={clientSecret}
                      orderId={orderId}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;