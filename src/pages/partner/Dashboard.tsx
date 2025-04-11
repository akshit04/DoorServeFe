import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/api';
import { PartnerStats, PartnerProfile } from '../../types/partner';

const PartnerDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery(['partnerStats', timeframe], () => api.partner.getPartnerStats(timeframe));

  const { 
    data: profile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useQuery('partnerProfile', api.partner.getPartnerProfile);

  const isLoading = statsLoading || profileLoading;
  const error = statsError || profileError;

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard data.</div>;
  }

  return (
    <div>
      <PageTitle 
        title="Partner Dashboard" 
        subtitle="View your business performance at a glance" 
      />

      {/* Time period selector */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeframe === 'day' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeframe('day')}
          >
            Daily
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeframe('week')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeframe === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeframe('month')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bookings"
          value={stats?.totalBookings.toString() || '0'}
          icon={<BookingIcon />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Completed Jobs"
          value={stats?.completedBookings.toString() || '0'}
          icon={<CompletedIcon />}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toFixed(2) || '0.00'}`}
          icon={<RevenueIcon />}
          color="bg-purple-500"
        />
        <StatsCard
          title="Average Rating"
          value={`${stats?.averageRating.toFixed(1) || '0.0'} / 5.0`}
          icon={<RatingIcon />}
          color="bg-yellow-500"
        />
      </div>

      {/* Recent activity chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Booking Activity</h2>
        <div className="h-64 flex items-center justify-center">
          {/* This would be a chart in a real implementation */}
          <div className="text-gray-400">
            {stats?.bookingsByDay.length 
              ? 'Chart showing booking activity over time would be rendered here' 
              : 'No booking data available for the selected time period'}
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
        <div className="h-64 flex items-center justify-center">
          {/* This would be a chart in a real implementation */}
          <div className="text-gray-400">
            {stats?.revenueByDay.length 
              ? 'Chart showing revenue trend over time would be rendered here' 
              : 'No revenue data available for the selected time period'}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className={`${color} h-2`}></div>
      <div className="p-5">
        <div className="flex items-center">
          <div className={`${color} rounded-full p-3 text-white mr-4`}>
            {icon}
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <p className="font-bold text-2xl">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon components
const BookingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CompletedIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RatingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default PartnerDashboard;
