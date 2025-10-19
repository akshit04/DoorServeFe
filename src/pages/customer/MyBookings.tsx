import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { BookingStatus } from '../../types/booking';
import api from '../../api/api';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyBookings: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showAlert, setShowAlert] = useState<boolean>(!!location.state?.message);
  const [alertMessage, setAlertMessage] = useState<string>(location.state?.message || '');

  // Fetch all bookings for the customer
  const { 
    data: bookings, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['customerBookings', activeTab],
    queryFn: () => activeTab === 'ALL' 
      ? api.booking.getCustomerBookings() 
      : api.booking.getCustomerBookings(activeTab)
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) => api.booking.cancelBooking(bookingId),
    onSuccess: () => {
      refetch();
      setAlertMessage('Booking cancelled successfully.');
      setShowAlert(true);
    }
  });

  // Handle booking cancellation
  const handleCancelBooking = (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(bookingId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter bookings based on activeTab
  const filteredBookings = bookings || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="My Bookings" 
        subtitle="Manage your service appointments"
      />
      
      {/* Success Alert */}
      {showAlert && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{alertMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setShowAlert(false)}
          >
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${activeTab === 'ALL' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('ALL')}
            >
              All
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${activeTab === 'PENDING' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('PENDING')}
            >
              Pending
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${activeTab === 'CONFIRMED' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('CONFIRMED')}
            >
              Confirmed
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${activeTab === 'COMPLETED' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('COMPLETED')}
            >
              Completed
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${activeTab === 'CANCELLED' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('CANCELLED')}
            >
              Cancelled
            </button>
          </li>
        </ul>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load bookings: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      )}
      
      {/* No Bookings State */}
      {!isLoading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-gray-500">
            {activeTab === 'ALL' 
              ? "You haven't made any bookings yet."
              : `You don't have any ${activeTab.toLowerCase()} bookings.`}
          </p>
        </div>
      )}
      
      {/* Bookings List */}
      {!isLoading && !error && filteredBookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.serviceId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(booking.bookingStartDateTime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                      <button
                        onClick={() => handleCancelBooking(Number(booking.id))}
                        className="text-red-600 hover:text-red-900 mr-4"
                        disabled={cancelMutation.isPending}
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Leave Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
