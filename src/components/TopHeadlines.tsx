import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';
import { useNews } from '../contexts/useNews';
import NewsCard from './NewsCard';

const TopHeadlines: React.FC = () => {
  const { articles } = useNews();
  
  // Get top 3 most recent articles
  const topHeadlines = [...articles]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3);

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Top Headlines
        </h2>
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Updated just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topHeadlines.map((article, index) => (
          <NewsCard 
            key={article.id} 
            article={article} 
            featured={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

export default TopHeadlines;