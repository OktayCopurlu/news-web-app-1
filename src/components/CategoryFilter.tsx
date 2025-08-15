import React from 'react';
import { t } from '../i18n';
import { Link } from 'react-router-dom';

interface UICategory {
  id: string;
  name: string;
  emoji?: string;
  count?: number;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: UICategory[]; // optional dynamic list
}

// Fallback base list if dynamic categories not provided
const DEFAULT_CATEGORIES: UICategory[] = [
  { id: 'all', name: t('catAll'), emoji: '📰' },
  { id: 'general', name: t('catGeneral'), emoji: '📌' },
  { id: 'world', name: t('catWorld'), emoji: '🌍' },
  { id: 'uk', name: t('catUK'), emoji: '🇬🇧' },
  { id: 'sports', name: t('catSports'), emoji: '🏅' },
  { id: 'football', name: t('catFootball'), emoji: '⚽' },
  { id: 'transfers', name: t('catTransfers'), emoji: '🔁' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange, categories }) => {
  const list = categories && categories.length ? categories : DEFAULT_CATEGORIES;
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {list.map((category) => (
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
          {category.emoji && <span>{category.emoji}</span>}
          <span className="text-sm font-medium">
            {category.name}
            {typeof category.count === 'number' && category.id !== 'all' && (
              <span className="ml-1 text-xs opacity-70">{category.count}</span>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;