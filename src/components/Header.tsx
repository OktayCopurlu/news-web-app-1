import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon, Globe, User, Bell } from 'lucide-react';
import { useTheme } from '../contexts/useTheme';
import { useUser } from '../contexts/useUser';
import { useNews } from '../contexts/useNews';
import { t } from '../i18n';
import { getPreferredLang, normalizeLang, setPreferredLang, setDocumentLangDir } from '../utils/lang';
import { newsApi } from '../services/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user } = useUser();
  const { searchArticles, reloadArticles } = useNews();
  const navigate = useNavigate();
  const [lang, setLang] = useState<string>(getPreferredLang());
  const DEFAULT_LANG_OPTIONS = ["en","tr","de","fr","es","ar"] as const;
  const [langOptions, setLangOptions] = useState<string[]>([...DEFAULT_LANG_OPTIONS]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await newsApi.getConfig();
        type MarketCfg = { market_code: string; pivot_lang?: string; pretranslate_langs?: string[] | string | null };
        const markets: MarketCfg[] = (cfg as { market?: MarketCfg; markets?: MarketCfg[] }).market
          ? [ (cfg as { market?: MarketCfg }).market as MarketCfg ]
          : (cfg as { market?: MarketCfg; markets?: MarketCfg[] }).markets || [];
        const set = new Set<string>();
        for (const m of markets) {
          if (m?.pivot_lang) set.add(normalizeLang(m.pivot_lang));
          const pls = Array.isArray(m?.pretranslate_langs)
            ? m.pretranslate_langs
            : typeof m?.pretranslate_langs === 'string'
              ? m.pretranslate_langs.split(',')
              : [];
          pls.forEach((l: string) => set.add(normalizeLang(l)));
        }
        if (mounted) {
          const fromConfig = Array.from(set.values());
          // Union with defaults so fallback /config can't collapse options to only 'en'
          const union = Array.from(new Set([...
            DEFAULT_LANG_OPTIONS,
            ...fromConfig,
          ]));
          setLangOptions(union);
        }
      } catch {
        // ignore; keep defaults
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchArticles(searchQuery);
      console.log('Search results:', results);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const categoryIds = ['all','politics','technology','health','environment','finance','sports','entertainment','science'] as const;
  const categoryLabel = (id: string) => {
    switch (id) {
      case 'all': return t('catAll');
      case 'technology': return t('catTechnology');
      case 'health': return t('catHealth');
      case 'environment': return t('catEnvironment');
      case 'finance': return t('catFinance');
      case 'sports': return t('catSports');
      case 'entertainment': return t('catEntertainment');
      case 'science': return t('catScience');
      case 'politics': return t('catPolitics');
      default: return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  const handleLangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = normalizeLang(e.target.value);
    setLang(newLang);
    setPreferredLang(newLang);
    setDocumentLangDir(newLang);
    // update URL ?lang= to keep state shareable
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    navigate(url.pathname + url.search + url.hash, { replace: true });
    // soft reload data in new language
  await reloadArticles();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Insight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
        {categoryIds.slice(0, 6).map((id) => (
                <Link
          key={id}
          to={`/?category=${id}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                >
          {categoryLabel(id)}
                </Link>
              ))}
            </div>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector (minimal) */}
            <div className="hidden md:block">
              <label className="sr-only" htmlFor="lang-select">Language</label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  id="lang-select"
                  value={lang}
                  onChange={handleLangChange}
                  className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-200"
                >
                  {langOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
            ) : (
              <Link
                to="/onboarding"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {t('getStarted')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

  {/* Search Bar */}
  {showSearch && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </form>
          </div>
        )}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3">
        {categoryIds.map((id) => (
                <Link
          key={id}
          to={`/?category=${id}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
          {categoryLabel(id)}
                </Link>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              <Link
                to="/archive"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('browseArchive')}
              </Link>
              {/* Mobile language selector */}
              <div className="pt-3">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="lang-select-mobile">Language</label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <select
                    id="lang-select-mobile"
                    value={lang}
                    onChange={async (e) => { await handleLangChange(e); setIsMenuOpen(false); }}
                    className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-200"
                  >
                    {langOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;