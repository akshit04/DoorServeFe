import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/category';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow p-6 text-center cursor-pointer hover:shadow-lg transition"
    >
      {category.iconUrl ? (
        <img 
          src={category.iconUrl} 
          alt={category.name} 
          className="w-16 h-16 mx-auto mb-4"
        />
      ) : (
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-indigo-600">{category.name.charAt(0)}</span>
        </div>
      )}
      <h3 className="font-semibold text-lg">{category.name}</h3>
      <p className="text-gray-600 text-sm mt-2">{category.description}</p>
    </div>
  );
};

export default CategoryCard;
