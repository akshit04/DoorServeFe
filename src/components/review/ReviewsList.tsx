import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import { Review } from '../../types/review';
import LoadingSpinner from '../common/LoadingSpinner';

interface ReviewsListProps {
  partnerId: number;
  partnerName: string;
  maxReviews?: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ partnerId, partnerName, maxReviews = 5 }) => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['partnerReviews', partnerId],
    queryFn: () => api.review.getPartnerReviews(partnerId),
  });

  const { data: stats } = useQuery({
    queryKey: ['partnerReviewStats', partnerId],
    queryFn: () => api.review.getPartnerReviewStats(partnerId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  const displayedReviews = reviews.slice(0, maxReviews);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>No reviews yet for {partnerName}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Review Summary */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-1">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-sm text-gray-600">{stats.totalReviews} reviews</div>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1 max-w-xs">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating] || 0;
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center text-sm">
                      <span className="w-3 text-gray-600">{rating}</span>
                      <svg className="w-3 h-3 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 mx-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="w-8 text-xs text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {review.customer.firstName.charAt(0)}{review.customer.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {review.customer.firstName} {review.customer.lastName}
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {review.comment && (
              <p className="text-gray-700 text-sm leading-relaxed ml-11">
                {review.comment}
              </p>
            )}
            
            {review.booking?.serviceCatalog?.name && (
              <div className="ml-11 mt-2">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {review.booking.serviceCatalog.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Link */}
      {reviews.length > maxReviews && (
        <div className="text-center pt-4">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View all {reviews.length} reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;