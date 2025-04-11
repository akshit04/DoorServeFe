import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCurrentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userType = params.get('userType');
        const errorMessage = params.get('error');

        if (errorMessage) {
          setError(errorMessage);
          return;
        }

        if (!token) {
          setError('Authentication failed. No token received.');
          return;
        }

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Fetch the current user information
        await fetchCurrentUser();

        // Redirect based on user type
        if (userType === 'PARTNER') {
          navigate('/partner');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('An error occurred during authentication. Please try again.');
      }
    };

    processAuthCallback();
  }, [location, navigate, fetchCurrentUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Processing login...</h2>
            <p className="text-gray-600 mb-6">Please wait while we complete your authentication.</p>
            <div className="flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
