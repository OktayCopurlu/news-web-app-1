import React, { useState } from 'react';
import { Search, Calendar, Folder } from 'lucide-react';
import { useNews } from '../contexts/useNews';
import NewsCard from '../components/NewsCard';
import { t } from '../i18n';

const ArchivePage: React.FC = () => {
  const { articles } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const categories = ['all', 'technology', 'health', 'environment', 'finance', 'space', 'cybersecurity'];
  const timeframes = [
    { value: 'all', label: t('filterAllTime') },
    { value: 'today', label: t('filterToday') },
    { value: 'week', label: t('filterThisWeek') },
    { value: 'month', label: t('filterThisMonth') }
  ];

  React.useEffect(() => {
    let filtered = articles;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by timeframe
    if (selectedTimeframe !== 'all') {
      const now = new Date();
      filtered = filtered.filter(article => {
        const publishedDate = new Date(article.published_at);
        switch (selectedTimeframe) {
          case 'today': {
            return publishedDate.toDateString() === now.toDateString();
          }
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return publishedDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return publishedDate >= monthAgo;
          }
          default: return true;
        }
      });
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery, selectedCategory, selectedTimeframe]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('newsArchiveTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('newsArchiveSubtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchArticlesPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Folder className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? t('catAll') :
                     category === 'technology' ? t('catTechnology') :
                     category === 'health' ? t('catHealth') :
                     category === 'environment' ? t('catEnvironment') :
                     category === 'finance' ? t('catFinance') :
                     category === 'space' ? t('catSpace') :
                     category === 'cybersecurity' ? t('catCybersecurity') :
                     category}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {timeframes.map((timeframe) => (
                  <option key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? t('resultsCountForQuery', { count: filteredArticles.length, plural: filteredArticles.length !== 1 ? 's' : '', query: searchQuery })
              : t('resultsCount', { count: filteredArticles.length, plural: filteredArticles.length !== 1 ? 's' : '' })}
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {t('archiveNoArticlesTitle')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('archiveNoArticlesHint')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;