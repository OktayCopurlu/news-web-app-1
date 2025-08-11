import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNews } from '../contexts/NewsContext';
import { useUser } from '../contexts/UserContext';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import PersonalizationBanner from '../components/PersonalizationBanner';
import TopHeadlines from '../components/TopHeadlines';
import TrendingTopics from '../components/TrendingTopics';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { articles } = useNews();
  const { user } = useUser();
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
    
    if (category === 'all') {
      // Sort by user preferences if available
      if (user?.preferences.topics.length) {
        const preferredTopics = user.preferences.topics.map(t => t.toLowerCase());
        const sorted = [...articles].sort((a, b) => {
          const aMatches = preferredTopics.some(topic => 
            a.category.toLowerCase().includes(topic) || 
            a.tags.some(tag => tag.toLowerCase().includes(topic))
          );
          const bMatches = preferredTopics.some(topic => 
            b.category.toLowerCase().includes(topic) || 
            b.tags.some(tag => tag.toLowerCase().includes(topic))
          );
          return bMatches ? 1 : aMatches ? -1 : 0;
        });
        setFilteredArticles(sorted);
      } else {
        setFilteredArticles(articles);
      }
    } else {
      const filtered = articles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredArticles(filtered);
    }
  }, [searchParams, articles, user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Personalization Banner */}
      {!user?.onboardingComplete && <PersonalizationBanner />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Headlines */}
        <TopHeadlines />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {/* News Grid */}
            <div className="mt-6">
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try selecting a different category or check back later for new content.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;