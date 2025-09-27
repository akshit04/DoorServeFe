import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CustomerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Fetch recent bookings
  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['customerBookings', 'recent'],
    queryFn: () => api.booking.getCustomerBookings(),
    select: (data) => data.slice(0, 3) // Get just the most recent 3
  });

  // Fetch featured services for recommendations
  const { data: recommendedServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: () => api.service.getFeaturedServices(4)
  });

  if (bookingsLoading || servicesLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title={`Welcome back, ${currentUser?.firstName}!`} 
        subtitle="Manage your bookings and discover services"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview Cards */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.serviceId}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.bookingStartDateTime).toLocaleDateString()} • {booking.bookingStartDateTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link to="/my-bookings" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View all bookings →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
                <Link 
                  to="/" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Browse Services
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Services</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedServices?.map((service) => (
                <Link 
                  key={service.id} 
                  to={`/book/${service.id}`} 
                  className="block group"
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    {service.imageUrl ? (
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={service.imageUrl} 
                          alt={service.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    ) : (
                      <div className="h-36 bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">{service.name}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {service.category}
                      </span>
                      <h3 className="mt-2 font-medium group-hover:text-indigo-600">{service.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-indigo-600">${service.price}</span>
                        <span className="text-sm text-gray-500">{service.duration} mins</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Browse all services →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition"
              >
                <span className="text-indigo-700 font-medium">Find a Service</span>
              </Link>
              <Link 
                to="/my-bookings" 
                className="block bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition"
              >
                <span className="text-indigo-700 font-medium">My Bookings</span>
              </Link>
              <Link 
                to="/profile" 
                className="block bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition"
              >
                <span className="text-indigo-700 font-medium">Edit Profile</span>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              Have questions or need assistance with your bookings? Our support team is here to help!
            </p>
            <Link 
              to="/contact" 
              className="block bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center transition"
            >
              <span className="text-gray-700 font-medium">Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
