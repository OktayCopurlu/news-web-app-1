import React, { useState } from 'react'
import { Plus, RefreshCw, Database, Zap, CheckCircle, XCircle } from 'lucide-react'
import { useNews } from '../contexts/NewsContext'
import { newsApi } from '../services/api'
import { testAllConnections } from '../utils/connectionTest'

const AdminPanel: React.FC = () => {
  const { initializeData } = useNews()
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [testingConnections, setTestingConnections] = useState(false)

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

  const handleTestConnections = async () => {
    setTestingConnections(true)
    setStatus('Testing connections...')
    
    try {
      const results = await testAllConnections()
      setConnectionStatus(results)
      
      if (results.allConnected) {
        setStatus('All connections successful!')
      } else {
        setStatus('Some connections failed - check console for details')
      }
      
      setTimeout(() => setStatus(null), 5000)
    } catch (error) {
      setStatus('Connection test failed')
      setTimeout(() => setStatus(null), 3000)
    } finally {
      setTestingConnections(false)
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleTestConnections}
            disabled={testingConnections}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testingConnections ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>Test Connections</span>
          </button>

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

        {connectionStatus && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Connection Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Database:</span>
                <div className="flex items-center space-x-1">
                  {connectionStatus.database.connected ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={connectionStatus.database.connected ? 'text-green-600' : 'text-red-600'}>
                    {connectionStatus.database.connected ? 'Connected' : 'Failed'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gemini API:</span>
                <div className="flex items-center space-x-1">
                  {connectionStatus.gemini.connected ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={connectionStatus.gemini.connected ? 'text-green-600' : 'text-red-600'}>
                    {connectionStatus.gemini.connected ? 'Connected' : 'Failed'}
                  </span>
                </div>
              </div>
              {!connectionStatus.database.connected && connectionStatus.database.error && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  DB Error: {connectionStatus.database.error}
                </div>
              )}
              {!connectionStatus.gemini.connected && connectionStatus.gemini.error && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Gemini Error: {connectionStatus.gemini.error}
                </div>
              )}
            </div>
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