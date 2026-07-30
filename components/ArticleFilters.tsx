'use client';

import Link from 'next/link';

export type AuthorFilter = 'all' | 'ghalyndra' | 'masyanda';
export type SortOrder = 'latest' | 'oldest';

interface ArticleFiltersProps {
  filter: AuthorFilter;
  onFilterChange: (filter: AuthorFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  isLoggedIn?: boolean;
}

export default function ArticleFilters({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  isLoggedIn,
}: ArticleFiltersProps) {
  return (
    <div className="container mx-auto px-4 max-w-2xl mb-10">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as AuthorFilter)}
            className="px-4 py-2 rounded-full border border-primary/20 bg-white text-xs uppercase tracking-wide text-primary focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="all">All authors</option>
            <option value="ghalyndra">Ghalyndra 💙</option>
            <option value="masyanda">Masyanda 🩷</option>
          </select>

          <div className="flex rounded-full border border-primary/20 bg-white overflow-hidden text-xs uppercase tracking-wide">
            <button
              onClick={() => onSortChange('latest')}
              className={`px-4 py-2 transition-colors ${
                sort === 'latest' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => onSortChange('oldest')}
              className={`px-4 py-2 transition-colors border-l border-primary/20 ${
                sort === 'oldest' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
              }`}
            >
              Oldest
            </button>
          </div>

          {isLoggedIn && (
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 rounded-full border border-dashed border-primary/40 text-primary text-xs uppercase tracking-wide hover:bg-primary hover:text-white hover:border-primary transition-colors whitespace-nowrap"
            >
              + Tambah Artikel
            </Link>
          )}
        </div>

        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-primary/20 bg-white text-sm text-ink placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
