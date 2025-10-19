import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/api';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CartItem } from '../../types/cart';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch cart items
    const { data: cartItems = [], isLoading, error } = useQuery({
        queryKey: ['cart'],
        queryFn: () => api.cart.getCart(),
    });

    // Update cart item mutation
    const updateCartMutation = useMutation({
        mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
            api.cart.updateCartItem(cartItemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        },
    });

    // Remove cart item mutation
    const removeCartMutation = useMutation({
        mutationFn: (cartItemId: number) => api.cart.removeFromCart(cartItemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        },
    });

    // Clear cart mutation
    const clearCartMutation = useMutation({
        mutationFn: () => api.cart.clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        },
    });

    const handleQuantityChange = (cartItem: CartItem, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeCartMutation.mutate(cartItem.id);
        } else {
            updateCartMutation.mutate({ cartItemId: cartItem.id, quantity: newQuantity });
        }
    };

    const handleRemoveItem = (cartItemId: number) => {
        removeCartMutation.mutate(cartItemId);
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            clearCartMutation.mutate();
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        // For now, just navigate to bookings - you can implement checkout later
        navigate('/my-bookings');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Cart</h2>
                <p className="text-gray-600 mb-6">There was an error loading your cart. Please try again.</p>
                <Button onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Add some services to your cart to get started.</p>
                    <Button onClick={() => navigate('/services')}>
                        Browse Services
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <Button
                    variant="outline"
                    onClick={handleClearCart}
                    disabled={clearCartMutation.isPending}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                >
                    Clear Cart
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start space-x-4">
                                {/* Service Image */}
                                <div className="flex-shrink-0">
                                    {item.service.imageUrl ? (
                                        <img
                                            src={item.service.imageUrl}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <span className="text-sm text-indigo-600 font-medium">
                                                {item.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Service Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-1">by {item.provider.name}</p>
                                            <p className="text-sm text-gray-600 mb-2">{item.service.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>{item.service.category}</span>
                                                <span>•</span>
                                                <span>{item.duration} mins</span>
                                                <span>•</span>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span>{item.provider.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                            disabled={removeCartMutation.isPending}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Quantity and Price */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                                    disabled={item.quantity <= 1 || updateCartMutation.isPending}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-l border-r border-gray-300">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                                    disabled={updateCartMutation.isPending}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-indigo-600">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ${item.price.toFixed(2)} each
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Items ({cartItems.length})</span>
                                <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Service Fee</span>
                                <span className="text-gray-900">$0.00</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full mb-3"
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/services')}
                            className="w-full"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;