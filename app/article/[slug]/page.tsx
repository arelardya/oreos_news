'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { formatDate } from '@/lib/articles';
import { Article } from '@/types/article';
import BackButton from '@/components/BackButton';
import RecommendationGrid from '@/components/RecommendationGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const articles = await res.json();
          const foundArticle = articles.find((a: Article) => a.slug === slug);
          setArticle(foundArticle || null);
          
          if (foundArticle) {
            const recs = articles.filter((a: Article) => a.slug !== slug).slice(0, 3);
            setRecommendations(recs);
          }
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <BackButton />
          
          <header className="mt-8 mb-8">
            <time className="text-accent dark:text-pink-300 font-medium text-lg block mb-4">
              {formatDate(article.date)}
            </time>
            <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-pink-300 mb-6">
              {article.title}
            </h1>
          </header>

          {article.imageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-3xl overflow-hidden shadow-lg">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {article.videoUrl && (
            <div className="my-12">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={article.videoUrl}
                  title={`Video for ${article.title}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <footer className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 italic text-lg">
              Written by <span className="text-primary dark:text-pink-300 font-semibold">
                {article.author === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
              </span>
            </p>
          </footer>
        </div>
      </article>

      {recommendations.length > 0 && (
        <RecommendationGrid articles={recommendations} />
      )}
    </>
  );
}
