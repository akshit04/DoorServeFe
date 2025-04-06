import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCurrentUser } = useAuth();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userType = params.get('userType');
    
    if (token) {
      localStorage.setItem('token', token);
      fetchCurrentUser();
      
      if (userType === 'PARTNER') {
        navigate('/partner');
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate, fetchCurrentUser]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
