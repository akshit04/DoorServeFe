import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { paymentAPI } from '../../api/payment';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = location.state?.orderId || searchParams.get('orderId');
  const total = location.state?.total;
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntentId && orderId) {
      confirmPayment();
    }
  }, [paymentIntentId, orderId]);

  const confirmPayment = async () => {
    try {
      await paymentAPI.confirmPayment({
        paymentIntentId: paymentIntentId!,
        orderId: parseInt(orderId!)
      });
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your booking has been confirmed.
        </p>
        
        {total && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Amount Paid</p>
            <p className="text-xl font-semibold text-gray-900">${total.toFixed(2)}</p>
          </div>
        )}
        
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-medium text-gray-900">#{orderId}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/my-bookings')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
          >
            View My Bookings
          </button>
          
          <button
            onClick={() => navigate('/services')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;