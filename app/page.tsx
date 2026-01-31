'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CountdownTimer from '@/components/CountdownTimer';
import QuoteSection from '@/components/QuoteSection';
import ArticleGrid from '@/components/ArticleGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Article } from '@/types/article';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ghalyndra' | 'masyanda'>('ghalyndra');

  useEffect(() => {
    const fetchArticles = async () => {
      const startTime = Date.now();
      
      try {
        // First, trigger auto-publish for any scheduled articles
        await fetch('/api/articles/publish-scheduled', {
          cache: 'no-store'
        }).catch(err => console.log('Auto-publish check:', err));
        
        // Then fetch all articles (including newly published ones)
        const res = await fetch('/api/articles', {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
      
      // Ensure loading shows for at least 2 seconds
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter articles based on active tab
  const filteredArticles = articles.filter(article => article.author === activeTab);

  return (
    <>
      <div className="bg-gradient-to-b from-primary via-accent via-30% to-pink-50 dark:from-primary-dark dark:via-pink-300 dark:via-30% dark:to-pink-100">
        <HeroSection />
        <CountdownTimer />
        <QuoteSection />
      </div>
      
      {/* Author Tabs */}
      <div className="bg-pink-50 dark:bg-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('ghalyndra')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              activeTab === 'ghalyndra'
                ? 'bg-blue-400 text-white shadow-lg scale-105'
                : 'bg-pink-200 dark:bg-pink-300 text-gray-700 dark:text-gray-800 hover:scale-105'
            }`}
          >
            Ghalyndra 💙
          </button>
          <button
            onClick={() => setActiveTab('masyanda')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              activeTab === 'masyanda'
                ? 'bg-pink-400 text-white shadow-lg scale-105'
                : 'bg-pink-200 dark:bg-pink-300 text-gray-700 dark:text-gray-800 hover:scale-105'
            }`}
          >
            Masyanda 🩷
          </button>
        </div>
      </div>
      </div>
      
      <ArticleGrid articles={filteredArticles} />
    </>
  );
}
