import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Service } from '../../types/service';
import { Category } from '../../types/category';

// Components
import ServiceCard from '../../components/service/ServiceCard';
import CategoryCard from '../../components/category/CategoryCard';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch featured services
  const { data: featuredServices, isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: () => api.service.getFeaturedServices(6)
  });

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.category.getAllCategories()
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Home Services, Delivered</h1>
            <p className="text-xl mb-8">Book trusted professionals for all your home service needs</p>
            
            <form onSubmit={handleSearch} className="flex max-w-lg mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="What service are you looking for?"
                className="flex-grow px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-indigo-800 hover:bg-indigo-900 px-6 py-2 rounded-r-md transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse Services by Category</h2>
        {categoriesLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Services Section */}
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Services</h2>
          {featuredLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Browse Services</h3>
            <p className="text-gray-600">
              Explore our wide range of professional home services
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Book an Appointment</h3>
            <p className="text-gray-600">
              Select your service and choose a time that works for you
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Get It Done</h3>
            <p className="text-gray-600">
              Our professionals will arrive on time and get the job done right
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;