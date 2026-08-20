'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import QuoteSection from '@/components/QuoteSection';
import ArticleGrid from '@/components/ArticleGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import QuickLinks from '@/components/QuickLinks';
import CountdownTimer from '@/components/CountdownTimer';
import AnniversaryCard from '@/components/AnniversaryCard';
import Reveal from '@/components/Reveal';
import { Article } from '@/types/article';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <>
      <HeroSection />
      <CountdownTimer />
      <AnniversaryCard />
      <QuickLinks />
      <QuoteSection />

      <div id="articles" className="bg-cream pt-16">
        <Reveal className="text-center mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
            From the journal
          </p>
          <h2 className="font-serif text-4xl text-primary-dark">
            Latest Articles
          </h2>
        </Reveal>
      </div>

      <ArticleGrid articles={latestArticles} />

      <div className="bg-cream pb-20 flex justify-center">
        <Link
          href="/articles"
          className="text-xs uppercase tracking-wide text-primary border border-primary/40 rounded-full px-6 py-3 hover:bg-primary hover:text-white transition-colors"
        >
          View All Articles →
        </Link>
      </div>
    </>
  );
}
