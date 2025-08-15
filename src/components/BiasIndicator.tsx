import React from 'react';
import { t } from '../i18n';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { ArticleDetail } from '../types/models';

type ArticleWithAnalysis = ArticleDetail & {
  bias: { score: number; explanation: string; sources: string[] };
  sentiment: { score: number; label: string };
};

interface BiasIndicatorProps { article: ArticleWithAnalysis }

const BiasIndicator: React.FC<BiasIndicatorProps> = ({ article }) => {
  const getBiasLevel = (score: number) => {
    const absScore = Math.abs(score);
  if (absScore < 0.1) return { level: 'neutral', label: t('biasNeutral'), color: 'green' };
  if (absScore < 0.3) return { level: 'slight', label: t('biasSlightPositive'), color: 'yellow' };
  if (absScore < 0.6) return { level: 'moderate', label: t('biasSlightNegative'), color: 'orange' };
  return { level: 'high', label: t('biasNegative'), color: 'red' };
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const bias = getBiasLevel(article.bias.score);
  const isPositiveBias = article.bias.score > 0;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {t('biasLabel')} & {t('sentimentLabel')} Analysis
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            {/* Bias Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('biasLabel')} Level
                </span>
                <div className="flex items-center space-x-1">
                  {bias.level === 'neutral' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className={`w-4 h-4 text-${bias.color}-600`} />
                  )}
                  <span className={`text-sm font-medium text-${bias.color}-600 dark:text-${bias.color}-400`}>
                    {bias.label}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${bias.color}-500`}
                  style={{ width: `${Math.abs(article.bias.score) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {isPositiveBias ? t('biasPositive') : t('biasNegative')} ({Math.abs(article.bias.score * 100).toFixed(0)}%)
              </p>
            </div>

            {/* Sentiment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('sentimentLabel')}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getSentimentIcon(article.sentiment.label)}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {article.sentiment.label.charAt(0).toUpperCase() + article.sentiment.label.slice(1)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    article.sentiment.label === 'positive' ? 'bg-green-500' :
                    article.sentiment.label === 'negative' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}
                  style={{ width: `${Math.abs(article.sentiment.score) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            {article.bias.explanation}
          </p>

          {/* Sources */}
          <div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Analysis based on: {article.bias.sources.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiasIndicator;