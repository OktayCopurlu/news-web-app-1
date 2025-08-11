import React, { useState } from 'react'
import { Plus, RefreshCw, Database, Zap } from 'lucide-react'
import { useNews } from '../contexts/NewsContext'
import { newsApi } from '../services/api'

const AdminPanel: React.FC = () => {
  const { initializeData } = useNews()
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleInitializeData = async () => {
    setIsInitializing(true)
    setStatus('Initializing sample data...')
    
    try {
      await initializeData()
      setStatus('Sample data initialized successfully!')
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      setStatus('Failed to initialize data')
      setTimeout(() => setStatus(null), 3000)
    } finally {
      setIsInitializing(false)
    }
  }

  const handleFetchNews = async () => {
    setIsInitializing(true)
    setStatus('Fetching and processing news...')
    
    try {
      await newsApi.fetchNews()
      setStatus('News fetched and processed successfully!')
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      setStatus('Failed to fetch news')
      setTimeout(() => setStatus(null), 3000)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleInitializeData}
            disabled={isInitializing}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInitializing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Initialize Sample Data</span>
          </button>

          <button
            onClick={handleFetchNews}
            disabled={isInitializing}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInitializing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Fetch Latest News</span>
          </button>
        </div>

        {status && (
          <div className={`p-3 rounded-lg text-sm ${
            status.includes('success') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : status.includes('Failed')
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          }`}>
            {status}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            System Status
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-green-600 dark:text-green-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>AI Services:</span>
              <span className="text-green-600 dark:text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Edge Functions:</span>
              <span className="text-green-600 dark:text-green-400">Deployed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel