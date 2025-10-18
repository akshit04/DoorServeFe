import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { User } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.user.getCurrentUser();
      setCurrentUser(response);
      setError(null);
    } catch (err) {
      localStorage.removeItem('token');
      setError('Session expired. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.user.login(email, password);
      const { user, token } = response;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      setError(null);
      return user; // Return user so Login component can handle navigation
    } catch (err: any) {
      setError(err.response?.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    fetchCurrentUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
