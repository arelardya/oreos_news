'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import QuoteSection from '@/components/QuoteSection';
import ArticleGrid from '@/components/ArticleGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Article } from '@/types/article';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const startTime = Date.now();
      
      try {
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

  return (
    <>
      <div className="bg-gradient-to-b from-primary via-accent via-30% to-pink-50 dark:from-primary-dark dark:via-pink-300 dark:via-30% dark:to-pink-100">
        <HeroSection />
        <QuoteSection />
      </div>
      <ArticleGrid articles={articles} />
    </>
  );
}
