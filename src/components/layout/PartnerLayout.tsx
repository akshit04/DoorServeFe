import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

const PartnerLayout: React.FC<PartnerLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-6">
            <h2 className="text-xl font-bold">Partner Dashboard</h2>
          </div>
          <nav className="mt-2">
            <Link
              to="/partner"
              className={`flex items-center px-6 py-3 ${isActive('/partner') ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/partner/services"
              className={`flex items-center px-6 py-3 ${isActive('/partner/services') ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Services
            </Link>
            <Link
              to="/partner/bookings"
              className={`flex items-center px-6 py-3 ${isActive('/partner/bookings') ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bookings
            </Link>
            <Link
              to="/partner/profile"
              className={`flex items-center px-6 py-3 ${isActive('/partner/profile') ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <Link
              to="/partner/availability"
              className={`flex items-center px-6 py-3 ${isActive('/partner/availability') ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Availability
            </Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-grow bg-gray-50 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PartnerLayout;
