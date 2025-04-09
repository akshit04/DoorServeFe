import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import ServiceCard from '../../components/service/ServiceCard';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CategoryView: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => api.categoryApi.getCategoryById(Number(categoryId)),
    enabled: !!categoryId
  });
  
  // Fetch services for this category
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['servicesByCategory', categoryId],
    queryFn: () => api.service.getServicesByCategory(category?.name || ''),
    enabled: !!category?.name
  });
  
  const isLoading = categoryLoading || servicesLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
          <p className="text-gray-600">The category you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title={category.name} 
        subtitle={category.description}
      />
      
      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="font-medium text-lg mb-2">No services available</h3>
          <p className="text-gray-600">
            There are currently no services available in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryView;
