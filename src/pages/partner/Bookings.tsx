import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import { Booking, BookingStatus, BookingRequest } from '../../types/booking';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PartnerBookings: React.FC = () => {
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch partner bookings
  const { data: recentBookings, isLoading, error } = useQuery({
    queryKey: ['partnerBookings', filter],
    queryFn: async () => {
      // We would typically have a dedicated endpoint in the partner API for this
      // For now, we'll simulate it through the booking API
      const response = await api.booking.getPartnerBookings(filter !== 'ALL' ? filter : undefined);
      return response;
    }
  });

  useEffect(() => {
    if (recentBookings) {
      setBookings(recentBookings);
    }
  }, [recentBookings]);

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      // Find the booking to update
      const bookingToUpdate = bookings.find(b => b.id === bookingId);
      if (!bookingToUpdate) return;

      const updatedBooking = { ...bookingToUpdate, status: newStatus };
      await api.booking.rescheduleBooking(bookingId, updatedBooking);
      
      // Update the booking in our local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    // Assuming timeString is in HH:MM format
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading bookings. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <PageTitle 
        title="Manage Bookings" 
        subtitle="View and manage all your service bookings" 
      />
      
      {/* Filter controls */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-gray-700">Filter by status:</span>
        <div className="flex space-x-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as BookingStatus | 'ALL')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === status 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Bookings table */}
      {bookings && bookings.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.customer?.firstName || 'N/A'} {booking.customer?.lastName || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.service?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.date ? formatDate(booking.date) : formatDate(booking.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.startTime && booking.endTime 
                      ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
                      : booking.bookingStartDateTime || 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS')}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Start Service
                        </button>
                      )}
                      {booking.status === 'IN_PROGRESS' && (
                        <button 
                          onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      )}
    </div>
  );
};

// Note: This code is implementing the missing PartnerBookings component referenced in App.tsx
// Add the updateBookingStatus method to the booking API to make this work fully
// Path: src/pages/partner/Bookings.tsx

export default PartnerBookings;
