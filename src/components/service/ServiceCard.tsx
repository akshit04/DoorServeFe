import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../../types/service';
import { createSlug } from '../../utils/slugs';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/service/${createSlug(service.name)}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      {service.imageUrl ? (
        <img 
          src={service.imageUrl} 
          alt={service.name} 
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-indigo-100 flex items-center justify-center">
          <span className="text-xl text-indigo-600">{service.name}</span>
        </div>
      )}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
            {service.category}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-medium">Multiple providers available</span>
          <span className="text-gray-500">{service.baseDuration ? `~${service.baseDuration} mins` : 'Duration varies'}</span>
        </div>
        <div className="mt-3">
          <span className="text-sm text-gray-600">Compare providers and pricing →</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
