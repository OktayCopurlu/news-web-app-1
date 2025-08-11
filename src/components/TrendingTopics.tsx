import React from 'react';
import { TrendingUp, Hash } from 'lucide-react';

const TrendingTopics: React.FC = () => {
  const trendingTopics = [
    { topic: 'Climate Agreement', count: '2.1M mentions', trend: '+15%' },
    { topic: 'Quantum Computing', count: '892K mentions', trend: '+23%' },
    { topic: 'CBDC Pilots', count: '654K mentions', trend: '+8%' },
    { topic: 'Gene Therapy', count: '445K mentions', trend: '+31%' },
    { topic: 'Electric Vehicles', count: '1.2M mentions', trend: '+12%' },
    { topic: 'Cybersecurity', count: '987K mentions', trend: '+19%' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-red-600" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Trending Topics
        </h2>
      </div>
      
      <div className="space-y-3">
        {trendingTopics.map((item, index) => (
          <div
            key={item.topic}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-6">
                #{index + 1}
              </span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.topic}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.count}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">{item.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Quick Links
        </h3>
        <div className="space-y-2 text-sm">
          <a href="/archive" className="block text-blue-600 dark:text-blue-400 hover:underline">
            Browse Archive
          </a>
          <a href="/trending" className="block text-blue-600 dark:text-blue-400 hover:underline">
            Trending Analysis
          </a>
          <a href="/sources" className="block text-blue-600 dark:text-blue-400 hover:underline">
            Source Reliability
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrendingTopics;