import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReviewsList from '../../components/review/ReviewsList';

const ProviderDetails: React.FC = () => {
  const { serviceId, partnerId } = useParams<{ serviceId: string; partnerId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId, partnerId]);

  // Fetch provider details for specific service
  const { data: providerDetails, isLoading, error } = useQuery({
    queryKey: ['providerDetails', serviceId, partnerId],
    queryFn: () => api.provider.getProviderServiceDetails(Number(serviceId), Number(partnerId)),
    enabled: !!serviceId && !!partnerId
  });

  // Fetch service details for breadcrumb
  const { data: serviceDetails } = useQuery({
    queryKey: ['serviceDetails', serviceId],
    queryFn: () => api.service.getServiceDetails(Number(serviceId)),
    enabled: !!serviceId
  });

  const service = serviceDetails?.service;
  const provider = providerDetails?.provider;
  const partnerService = providerDetails?.partnerService;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { partnerServiceId: number; quantity: number }) => 
      api.cart.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
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

    if (partnerService && partnerId) {
      addToCartMutation.mutate({
        partnerServiceId: partnerService.id,
        quantity: 1
      });
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${serviceId}?partnerId=${partnerId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !provider || !service || !partnerService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h2>
        <p className="text-gray-600 mb-6">The provider you're looking for doesn't exist or is no longer available.</p>
        <Button onClick={() => navigate(`/service/${serviceId}`)}>
          Back to Service
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
          <li>
            <button onClick={() => navigate(`/service/${serviceId}`)} className="hover:text-indigo-600">
              {service.name}
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900">{provider.firstName} {provider.lastName}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Provider Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            {/* Provider Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{provider.firstName} {provider.lastName}</h2>
              <p className="text-gray-600">Professional Service Provider</p>
            </div>

            {/* Provider Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(partnerService.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold">{partnerService.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Jobs Completed</span>
                <span className="font-semibold">{partnerService.totalJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-semibold">{partnerService.experienceYears} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-green-600">Within 2 hours</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{provider.email}</span>
                </div>
                {provider.phone && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{provider.phone}</span>
                  </div>
                )}
                {provider.city && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">{provider.city}, {provider.state}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">${partnerService.price}</div>
                <div className="text-sm text-gray-500 mb-4">{partnerService.duration} minutes</div>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleBookNow}
                    className="w-full"
                    disabled={!partnerService.available}
                  >
                    Book Now
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full"
                    disabled={!partnerService.available || addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </div>

                {!partnerService.available && (
                  <p className="text-sm text-red-600 mt-2">
                    This provider is currently unavailable.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Details and Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
                <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {service.category}
                </span>
              </div>
              {service.imageUrl && (
                <img 
                  src={service.imageUrl} 
                  alt={service.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Service Description</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Provider's Approach</h3>
              <p className="text-gray-600 leading-relaxed">
                {partnerService.description || `${provider.firstName} provides professional ${service.name.toLowerCase()} services with ${partnerService.experienceYears} years of experience. Known for quality work and customer satisfaction.`}
              </p>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-gray-900 text-sm">Quality Guaranteed</h4>
                <p className="text-xs text-gray-600 mt-1">100% satisfaction or money back</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-gray-900 text-sm">On-Time Service</h4>
                <p className="text-xs text-gray-600 mt-1">Punctual and reliable</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h4 className="font-semibold text-gray-900 text-sm">Insured & Bonded</h4>
                <p className="text-xs text-gray-600 mt-1">Fully protected service</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="text-sm text-gray-600">
                Based on {partnerService.totalJobs} completed jobs
              </div>
            </div>
            
            <ReviewsList 
              partnerId={Number(partnerId)} 
              partnerName={`${provider.firstName} ${provider.lastName}`}
              showAll={true}
            />
          </div>

          {/* Other Services by This Provider */}
          {providerDetails?.otherServices && providerDetails.otherServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Other Services by {provider.firstName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerDetails.otherServices.map((otherService) => (
                  <div 
                    key={otherService.serviceId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/service/${otherService.serviceId}/provider/${partnerId}`)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{otherService.serviceName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{otherService.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">${otherService.price}</span>
                      <span className="text-sm text-gray-500">{otherService.duration} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;