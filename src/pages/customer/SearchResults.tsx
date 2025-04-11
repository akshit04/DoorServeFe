import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import ServiceCard from '../../components/service/ServiceCard'; 
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('term') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Get search term from URL parameters
  useEffect(() => {
    setSearchTerm(searchParams.get('term') || '');
  }, [location.search]);
  
  // Fetch search results
  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['searchServices', searchTerm],
    queryFn: () => api.service.searchServices(searchTerm),
    enabled: searchTerm.length > 0
  });
  
  // Fetch all categories for filtering
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.category.getAllCategories()
  });
  
  // Filter the search results
  const filteredResults = React.useMemo(() => {
    if (!searchResults) return [];
    
    if (selectedCategory) {
      return searchResults.filter(service => service.category === selectedCategory);
    }
    
    return searchResults;
  }, [searchResults, selectedCategory]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
    
    // Update URL with search term
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('term', searchTerm);
    window.history.pushState({}, '', `${location.pathname}?${newSearchParams.toString()}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="Search Results" 
        subtitle={searchTerm ? `Showing results for "${searchTerm}"` : 'Find the service you need'}
      />
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="What service are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Filter Results</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
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
                  All Categories
                </label>
              </div>
              
              {categories?.map(category => (
                <div key={category.id} className="flex items-center">
                  <input
                    id={`category-${category.id}`}
                    type="radio"
                    checked={selectedCategory === category.name}
                    onChange={() => setSelectedCategory(category.name)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredResults && filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="font-medium text-lg mb-2">No services found</h3>
              <p className="text-gray-600">
                {searchTerm ? `We couldn't find any services matching "${searchTerm}"` : 'Please enter a search term to find services'}
              </p>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory('')}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  Clear category filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
