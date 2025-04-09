import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../../types/service';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${service.id}`);
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
          <span className="font-bold text-lg text-indigo-600">${service.price}</span>
          <span className="text-gray-500">{service.duration} mins</span>
        </div>
        {service.rating !== undefined && (
          <div className="mt-3 flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(service.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">{service.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
