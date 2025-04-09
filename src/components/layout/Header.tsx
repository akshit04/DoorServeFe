import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">DoorServe</Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link to="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
            {currentUser?.userType === 'PARTNER' ? (
              <Link to="/partner" className="text-gray-600 hover:text-indigo-600">Partner Dashboard</Link>
            ) : (
              <Link to="/my-bookings" className="text-gray-600 hover:text-indigo-600">My Bookings</Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span className="text-gray-700">Hello, {currentUser?.firstName}</span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-indigo-600">
                        {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-x-3">
                <Link 
                  to="/login" 
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
