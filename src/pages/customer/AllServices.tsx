import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/api';
import ServiceCard from '../../components/service/ServiceCard'; 
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AllServices: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  // Initialize search term from URL parameter
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      // If there's a search term, show all services instead of just featured for better search results
      setShowFeaturedOnly(false);
    }
  }, [searchParams]);

  // Update document title based on current view
  useEffect(() => {
    document.title = showFeaturedOnly ? 'Featured Services - DoorServe' : 'All Services - DoorServe';
  }, [showFeaturedOnly]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch all services
  const { data: allServices, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['allServices'],
    queryFn: async () => {
      console.log('Fetching all services...');
      const result = await api.service.getAllServices();
      console.log('Services fetched:', result?.length || 0);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });

  // Fetch featured services
  const { data: featuredServices, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: async () => {
      console.log('Fetching featured services...');
      const result = await api.service.getFeaturedServices();
      console.log('Featured services fetched:', result?.length || 0);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
  
  // Fetch all categories for filtering
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const result = await api.category.getAllCategories();
      console.log('Categories fetched:', result?.length || 0);
      return result;
    }
  });
  
  // Filter the services by categories, search term, and featured status
  const filteredServices = React.useMemo(() => {
    // Choose the base dataset
    let baseServices = showFeaturedOnly ? featuredServices : allServices;
    if (!baseServices) return [];
    
    let filtered = baseServices;
    
    // Filter by categories (if any are selected)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(service => selectedCategories.includes(service.category));
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [allServices, featuredServices, selectedCategories, searchTerm, showFeaturedOnly]);

  const isLoading = servicesLoading || categoriesLoading || featuredLoading;

  // Handle errors
  if (servicesError || categoriesError || featuredError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="font-medium text-lg mb-2 text-red-600">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">
            {servicesError ? 'Error loading services: ' + (servicesError as any)?.message : ''}
            {categoriesError ? 'Error loading categories: ' + (categoriesError as any)?.message : ''}
            {featuredError ? 'Error loading featured services: ' + (featuredError as any)?.message : ''}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure the backend is running on http://localhost:8080
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
        title={showFeaturedOnly ? "Featured Services" : "All Services"} 
        subtitle={showFeaturedOnly ? "Discover our top-rated and most popular services" : "Browse our complete catalog of professional services"}
      />
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by name, description, or category..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Browse Services</h2>
          
          {/* Service Type Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Service Type</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="featured-services"
                  type="radio"
                  checked={showFeaturedOnly}
                  onChange={() => {
                    setShowFeaturedOnly(true);
                    setSelectedCategories([]); // Reset categories when switching to featured
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured-services" className="ml-2 text-gray-700">
                  Featured Services
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="all-services"
                  type="radio"
                  checked={!showFeaturedOnly}
                  onChange={() => setShowFeaturedOnly(false)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="all-services" className="ml-2 text-gray-700">
                  All Services
                </label>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Filter by Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center">
                    <input
                      id={`category-${category.name}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories(prev => [...prev, category.name]);
                        } else {
                          setSelectedCategories(prev => prev.filter(cat => cat !== category.name));
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category.name}`} className="ml-2 text-gray-700">
                      {category.name} ({category.serviceCount || 0})
                    </label>
                  </div>
                ))}
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
                  >
                    Clear all filters ({selectedCategories.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Services Grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
                  {selectedCategories.length > 0 ? ` in ${selectedCategories.length === 1 ? selectedCategories[0] : `${selectedCategories.length} categories`}` : ''}
                  {searchTerm ? ` matching "${searchTerm}"` : ''}
                  {showFeaturedOnly ? ' (featured)' : ' (all services)'}
                </p>
                {selectedCategories.length > 1 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Categories: {selectedCategories.join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          ) : (showFeaturedOnly ? featuredServices : allServices) && (showFeaturedOnly ? featuredServices : allServices)!.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="font-medium text-lg mb-2">No services found</h3>
              <p className="text-gray-600">
                {selectedCategories.length > 0 && searchTerm 
                  ? `No ${showFeaturedOnly ? 'featured ' : ''}services found in selected categories matching "${searchTerm}"`
                  : selectedCategories.length > 0 
                    ? `No ${showFeaturedOnly ? 'featured ' : ''}services available in the selected ${selectedCategories.length === 1 ? 'category' : 'categories'}`
                    : searchTerm 
                      ? `No ${showFeaturedOnly ? 'featured ' : ''}services found matching "${searchTerm}"`
                      : showFeaturedOnly 
                        ? 'No featured services available'
                        : 'No services available'
                }
              </p>
              <div className="mt-4 space-x-4">
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Clear category filters
                  </button>
                )}
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Clear search
                  </button>
                )}
                {showFeaturedOnly && !searchTerm && selectedCategories.length === 0 && (
                  <button 
                    onClick={() => setShowFeaturedOnly(false)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View all services
                  </button>
                )}
              </div>
            </div>
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