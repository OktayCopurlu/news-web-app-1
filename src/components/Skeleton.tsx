import React from 'react';

export const ArticleSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-3">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    ))}
  </div>
);
