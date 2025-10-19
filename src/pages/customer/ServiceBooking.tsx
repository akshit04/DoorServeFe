import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../api/api';
import { Service } from '../../types/service';
import { Booking } from '../../types/booking';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

const ServiceBooking: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
    const duration = service.baseDuration || 60; // default to 1 hour if not specified
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
    mutationFn: (bookingData: CustomOmit<Booking, 'id' | 'status' | 'createdAt'>) => 
      api.booking.createBooking(bookingData),
    onSuccess: () => {
      navigate('/my-bookings', { state: { message: 'Booking successful!' } });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !selectedDate || !selectedTime) return;
    
    const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    const booking: CustomOmit<Booking, 'id' | 'status' | 'createdAt'> = {
        serviceId: service.id,
        partnerId: 1, // TODO: This should be selected from available partners
        bookingStartDateTime: bookingDateTime.toISOString(),
        bookingDuration: service.baseDuration || 60,
        customerId: 1, // TODO: Get from current user
        notes: notes,
        totalPrice: 100 // TODO: Get from selected provider
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
            <span className="text-indigo-600">Select a provider to see pricing</span>
            <span className="text-gray-500">{service.baseDuration ? `~${service.baseDuration} mins` : 'Duration varies'}</span>
          </div>
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
                <span>Select provider first</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>TBD</span>
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
