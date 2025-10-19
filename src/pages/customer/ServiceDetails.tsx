import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  // Fetch service details
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => api.service.getServiceById(Number(serviceId)),
    enabled: !!serviceId
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { serviceId: number; quantity: number }) => 
      api.cart.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      // Show success message or redirect
      alert('Service added to cart!');
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
      alert('Failed to add service to cart. Please try again.');
    }
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (service) {
      addToCartMutation.mutate({
        serviceId: service.id,
        quantity
      });
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${serviceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button onClick={() => navigate('/')} className="hover:text-indigo-600">
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button onClick={() => navigate(`/category/${service.category}`)} className="hover:text-indigo-600">
              {service.category}
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900">{service.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Image */}
        <div className="aspect-w-16 aspect-h-12">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-indigo-100 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6m-6 4h6" />
                </svg>
                <span className="text-xl text-indigo-600 font-medium">{service.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Service Details */}
        <div className="space-y-6">
          {/* Category Badge */}
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {service.category}
            </span>
          </div>

          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
            {service.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(service.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{service.rating.toFixed(1)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Professional Service</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
            <div>
              <span className="text-sm text-gray-500">Duration</span>
              <p className="font-semibold text-gray-900">{service.duration} minutes</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Availability</span>
              <p className={`font-semibold ${service.available ? 'text-green-600' : 'text-red-600'}`}>
                {service.available ? 'Available' : 'Not Available'}
              </p>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-indigo-600">${service.price}</span>
                <span className="text-gray-500 ml-2">per service</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1"
                disabled={!service.available || addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleBookNow}
                className="flex-1"
                disabled={!service.available}
              >
                Book Now
              </Button>
            </div>

            {!service.available && (
              <p className="text-sm text-red-600 text-center">
                This service is currently not available for booking.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <svg className="w-8 h-8 text-indigo-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-semibold text-gray-900 mb-2">Verified Professionals</h4>
          <p className="text-sm text-gray-600">All service providers are background-checked and verified.</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <svg className="w-8 h-8 text-indigo-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h4>
          <p className="text-sm text-gray-600">Book services at your convenience with flexible time slots.</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <svg className="w-8 h-8 text-indigo-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h4 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h4>
          <p className="text-sm text-gray-600">100% satisfaction guarantee or your money back.</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;