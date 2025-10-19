import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import ServiceCard from '../../components/service/ServiceCard'; 
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AllServices: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch all services
  const { data: allServices, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['allServices'],
    queryFn: () => api.service.getAllServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
  
  // Fetch all categories for filtering
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.category.getAllCategories()
  });
  
  // Filter the services by category
  const filteredServices = React.useMemo(() => {
    if (!allServices) return [];
    
    if (selectedCategory) {
      return allServices.filter(service => service.category === selectedCategory);
    }
    
    return allServices;
  }, [allServices, selectedCategory]);

  const isLoading = servicesLoading || categoriesLoading;

  // Handle errors
  if (servicesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="font-medium text-lg mb-2 text-red-600">Error Loading Services</h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the services. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="All Services" 
        subtitle="Browse our complete catalog of professional services"
      />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Filter by Category</h2>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="all-categories"
                type="radio"
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="all-categories" className="ml-2 text-gray-700">
                All Services
              </label>
            </div>
            
            {categories?.map(category => (
              <div key={category.name} className="flex items-center">
                <input
                  id={`category-${category.name}`}
                  type="radio"
                  checked={selectedCategory === category.name}
                  onChange={() => setSelectedCategory(category.name)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`category-${category.name}`} className="ml-2 text-gray-700">
                  {category.name} ({category.serviceCount || 0})
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : allServices && allServices.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
                  {selectedCategory ? ` in ${selectedCategory}` : ' (all categories)'}
                </p>
              </div>
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h3 className="font-medium text-lg mb-2">No services found in this category</h3>
                  <p className="text-gray-600">
                    No services available in the {selectedCategory} category.
                  </p>
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="mt-4 text-indigo-600 hover:text-indigo-800"
                  >
                    View all services
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="font-medium text-lg mb-2">No services available</h3>
              <p className="text-gray-600">
                No services are currently available. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllServices;