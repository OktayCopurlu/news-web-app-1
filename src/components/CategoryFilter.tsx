import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All', emoji: '📰' },
  { id: 'technology', name: 'Technology', emoji: '💻' },
  { id: 'health', name: 'Health', emoji: '🏥' },
  { id: 'environment', name: 'Environment', emoji: '🌍' },
  { id: 'finance', name: 'Finance', emoji: '💰' },
  { id: 'space', name: 'Space', emoji: '🚀' },
  { id: 'cybersecurity', name: 'Security', emoji: '🔒' },
  { id: 'transportation', name: 'Transport', emoji: '🚗' },
  { id: 'agriculture', name: 'Agriculture', emoji: '🌾' }
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/?category=${category.id}`}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
          }`}
        >
          <span>{category.emoji}</span>
          <span className="text-sm font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;