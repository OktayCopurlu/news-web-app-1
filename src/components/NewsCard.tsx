import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, TrendingUp, Volume2 } from 'lucide-react';
import type { ArticleDetail } from '../types/models';
import { useUser } from '../contexts/useUser';

interface NewsCardProps {
  article: ArticleDetail;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const { user } = useUser();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getBiasColor = (score: number) => {
    if (score >= 0.3) return 'text-red-600 dark:text-red-400';
    if (score >= -0.3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <article className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${
      featured ? 'md:col-span-2 lg:col-span-1' : ''
    }`}>
      <Link to={`/news/${article.id}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-48' : 'h-40'}`}>
          <img
            src={article.image_url || ''}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              {article.category}
            </span>
          </div>
          {article.audio_summary_url && user?.preferences.audioPreferences && (
            <div className="absolute top-3 right-3">
              <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm">
                <Volume2 className="w-3 h-3 text-blue-600" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(article.published_at)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{article.reading_time} min</span>
              </span>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {article.source}
            </span>
          </div>

          {/* Title */}
          <h2 className={`font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
            featured ? 'text-lg' : 'text-base'
          }`}>
            {article.title}
          </h2>

          {/* Summary */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {article.summary}
          </p>

          {/* Bias and Sentiment Indicators */}
          {user?.preferences.biasAnalysis && article.article_analytics?.[0] && (
            <div className="flex items-center space-x-4 text-xs mb-3">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-gray-500 dark:text-gray-400">Bias:</span>
                <span className={getBiasColor(article.article_analytics[0].bias_score)}>
                  {Math.abs(article.article_analytics[0].bias_score) < 0.1 ? 'Neutral' :
                   article.article_analytics[0].bias_score > 0 ? 'Positive' : 'Negative'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400">Sentiment:</span>
                <span className={getSentimentColor(article.article_analytics[0].sentiment_label)}>
                  {article.article_analytics[0].sentiment_label.charAt(0).toUpperCase() + article.article_analytics[0].sentiment_label.slice(1)}
                </span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {article.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {article.tags && article.tags.length > 3 && (
              <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;