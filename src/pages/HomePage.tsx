import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNews } from '../contexts/useNews'
import { useUser } from '../contexts/useUser'
import { Search } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import CategoryFilter from '../components/CategoryFilter'
import PersonalizationBanner from '../components/PersonalizationBanner'
import TopHeadlines from '../components/TopHeadlines'
import TrendingTopics from '../components/TrendingTopics'

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { articles, loading, error } = useNews()
  const { user } = useUser()
  const [filteredArticles, setFilteredArticles] = useState(articles)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [uiCategories, setUiCategories] = useState<{id:string;name:string;emoji?:string;count:number}[]>([])

  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    setSelectedCategory(category)

    // derive dynamic categories from article.category + tag hierarchies
    const counts = new Map<string, number>()
    const inc = (key: string | undefined) => {
      if (!key) return
      const k = key.toLowerCase()
      counts.set(k, (counts.get(k) || 0) + 1)
    }
    articles.forEach(a => {
      if (a.category) {
        const parts = a.category.split('.')
        // accumulate hierarchical prefixes
        for (let i=1;i<=parts.length;i++) inc(parts.slice(0,i).join('.'))
      }
      a.tags?.forEach(t => {
        const segs = t.split('.')
        for (let i=1;i<=segs.length;i++) inc(segs.slice(0,i).join('.'))
      })
    })
    const label = (id: string) => {
      if (id === 'general') return 'General'
      if (id === 'sports') return 'Sports'
      if (id === 'sports.football') return 'Football'
      if (id.startsWith('sports.transfer')) return 'Transfers'
      if (id === 'geo') return 'World'
      if (id === 'geo.uk') return 'UK'
      if (id === 'geo.uk.london') return 'London'
      return id.replace(/\./g, ' › ')
    }
    const emoji = (id: string) => {
      if (id.startsWith('sports.football')) return '⚽'
      if (id === 'sports') return '🏅'
      if (id.startsWith('geo.uk.london')) return '🏙️'
      if (id.startsWith('geo.uk')) return '🇬🇧'
      if (id.startsWith('geo')) return '🌍'
      if (id.startsWith('sports.transfer')) return '🔁'
      return undefined
    }
    const dynamicCats = Array.from(counts.entries())
      .sort((a,b) => b[1]-a[1])
      .slice(0,25)
      .map(([id,count]) => ({ id, name: label(id), emoji: emoji(id), count }))
    setUiCategories([{id:'all', name:'All', emoji:'📰', count: articles.length}, ...dynamicCats])

    if (category === 'all') {
      // Sort by user preferences if available
      if (user?.preferences.topics.length) {
        const preferredTopics = user.preferences.topics.map(t => t.toLowerCase())
        const sorted = [...articles].sort((a, b) => {
          const aMatches = preferredTopics.some(topic => 
            a.category.toLowerCase().includes(topic) || 
            a.tags.some(tag => tag.toLowerCase().includes(topic))
          )
          const bMatches = preferredTopics.some(topic => 
            b.category.toLowerCase().includes(topic) || 
            b.tags.some(tag => tag.toLowerCase().includes(topic))
          )
          return bMatches ? 1 : aMatches ? -1 : 0
        })
        setFilteredArticles(sorted)
      } else {
        setFilteredArticles(articles)
      }
    } else {
      const sel = category.toLowerCase()
      const filtered = articles.filter(article => {
        const baseCat = article.category?.toLowerCase() || ''
        if (baseCat === sel || baseCat.startsWith(sel + '.')) return true
        if (article.tags && article.tags.length) {
          return article.tags.some(t => {
            const lower = t.toLowerCase()
            return lower === sel || lower.startsWith(sel + '.')
          })
        }
        return false
      })
      setFilteredArticles(filtered)
    }
  }, [searchParams, articles, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading latest news...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to Load News
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Personalization Banner */}
      {!user?.onboarding_complete && <PersonalizationBanner />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Headlines */}
        {articles.length > 0 && <TopHeadlines />}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {articles.length > 0 && (
              <>
                {/* Category Filter */}
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categories={uiCategories}
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
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage