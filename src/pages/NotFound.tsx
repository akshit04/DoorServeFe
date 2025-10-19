import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="text-4xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-4 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link 
            to="/" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go Back Home
          </Link>
          <Link 
            to="/services" 
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Browse Services
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Looking for something specific?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/" 
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md"
          >
            <div className="text-indigo-500 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Homepage</h4>
              <p className="text-sm text-gray-500">Return to our main page</p>
            </div>
          </Link>
          
          <Link 
            to="/categories" 
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md"
          >
            <div className="text-indigo-500 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Service Categories</h4>
              <p className="text-sm text-gray-500">Browse services by category</p>
            </div>
          </Link>
          
          <Link 
            to="/my-bookings" 
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md"
          >
            <div className="text-indigo-500 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">My Bookings</h4>
              <p className="text-sm text-gray-500">View your booking history</p>
            </div>
          </Link>
          
          <Link 
            to="/contact" 
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md"
          >
            <div className="text-indigo-500 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Contact Support</h4>
              <p className="text-sm text-gray-500">Get help with your issue</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Note: This code is implementing the missing NotFound component referenced in App.tsx
// Path: src/pages/NotFound.tsx

export default NotFound;
