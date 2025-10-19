import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';

const CartIcon: React.FC = () => {
  const navigate = useNavigate();

  // Fetch cart count
  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: () => api.cart.getCartCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <button
      onClick={handleCartClick}
      className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
      title="View Cart"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;