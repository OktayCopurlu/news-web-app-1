import React from 'react';
import { BarChart3, ExternalLink } from 'lucide-react';
import { t } from '../i18n';

interface CoverageComparisonProps {
  comparisons: {
    source: string;
    perspective: string;
    bias: number;
  }[];
}

const CoverageComparison: React.FC<CoverageComparisonProps> = ({ comparisons }) => {
  const getBiasColor = (bias: number) => {
    const absBias = Math.abs(bias);
    if (absBias < 0.2) return 'text-green-600 dark:text-green-400';
    if (absBias < 0.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBiasLabel = (bias: number) => {
    const absBias = Math.abs(bias);
    if (absBias < 0.2) return t('biasNeutral');
    if (absBias < 0.5) return bias > 0 ? t('biasSlightPositive') : t('biasSlightNegative');
    return bias > 0 ? t('biasPositive') : t('biasNegative');
  };

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h3 className="font-semibold text-orange-800 dark:text-orange-300">
          {t('coverageComparisonTitle')}
        </h3>
      </div>

      <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
        {t('coverageComparisonSubtitle')}
      </p>

      <div className="space-y-3">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                <span>{comparison.source}</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </h4>
              <span className={`text-xs font-medium px-2 py-1 rounded ${getBiasColor(comparison.bias)} bg-current bg-opacity-10`}>
                {getBiasLabel(comparison.bias)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {comparison.perspective}
            </p>
            
            {/* Bias visualization */}
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('biasLabel')}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    comparison.bias > 0 ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.abs(comparison.bias) * 100}%`,
                    marginLeft: comparison.bias < 0 ? `${100 - Math.abs(comparison.bias) * 100}%` : '0'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {(comparison.bias * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverageComparison;