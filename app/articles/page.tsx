'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ArticleGrid from '@/components/ArticleGrid';
import ArticleFilters, { AuthorFilter, SortOrder } from '@/components/ArticleFilters';
import Reveal from '@/components/Reveal';
import { getAuthUser } from '@/lib/auth';
import { Article } from '@/types/article';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AuthorFilter>('all');
  const [sort, setSort] = useState<SortOrder>('latest');
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAuthUser()));

    fetch('/api/articles', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error('Failed to fetch articles:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredArticles = articles
    .filter((article) => filter === 'all' || article.author === filter)
    .filter((article) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return article.title.toLowerCase().includes(q) || article.content.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sort === 'latest' ? -diff : diff;
    });

  return (
    <div className="bg-cream">
      <div
        className="h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />

      <div className="container mx-auto px-4 pt-16">
        <Reveal className="text-center mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
            From the journal
          </p>
          <h1 className="font-serif text-4xl text-primary-dark">
            All Articles
          </h1>
        </Reveal>

        <ArticleFilters
          filter={filter}
          onFilterChange={setFilter}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <ArticleGrid articles={filteredArticles} />
    </div>
  );
}
