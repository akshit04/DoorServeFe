import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../api/api';
import { Service } from '../../types/service';
import { Booking } from '../../types/booking';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ServiceBooking: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Fetch service details
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: ['service', serviceId],
    queryFn: () => api.service.getServiceById(Number(serviceId)),
    enabled: !!serviceId
  });

  // Generate available time slots based on service duration
  const generateTimeSlots = () => {
    if (!service) return [];
    
    const slots = [];
    const duration = service.duration || 60; // default to 1 hour if not specified
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        if (hour === endHour && minute > 0) continue;
        
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    
    return slots;
  };

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => 
      api.booking.createBooking(bookingData),
    onSuccess: () => {
      navigate('/my-bookings', { state: { message: 'Booking successful!' } });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !selectedDate || !selectedTime) return;
    
    const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    const booking: Omit<Booking, 'id' | 'status' | 'createdAt'> = {
      serviceId: service.id,
      providerId: service.providerId,
      scheduledAt: bookingDateTime.toISOString(),
      notes: notes,
      serviceName: service.name,
      servicePrice: service.price
    };
    
    bookingMutation.mutate(booking);
  };

  // Calculate minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  // Calculate maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageTitle title="Error" subtitle="Could not load service details" />
        <p className="text-red-500">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title={`Book ${service.name}`} 
        subtitle="Select your preferred date and time for your service"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
          
          {service.imageUrl && (
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}
          
          <div className="mb-4">
            <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              {service.category}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
          <p className="text-gray-600 mb-4">{service.description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg text-indigo-600">${service.price}</span>
            <span className="text-gray-500">{service.duration} mins</span>
          </div>
          
          {service.rating !== undefined && (
            <div className="flex items-center">
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
              <span className="ml-2 text-gray-600">{service.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Book Your Appointment</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="date">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDateStr}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="time">
                Select Time
              </label>
              <select
                id="time"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!selectedDate}
              >
                <option value="">Select a time slot</option>
                {generateTimeSlots().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="notes">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or instructions..."
              />
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Service Price:</span>
                <span>${service.price}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${service.price}</span>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;
