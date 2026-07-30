'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { formatDate } from '@/lib/articles';
import { Article } from '@/types/article';
import BackButton from '@/components/BackButton';
import RecommendationGrid from '@/components/RecommendationGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import Reveal from '@/components/Reveal';

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
      <div className="bg-cream">
        <div
          className="h-3"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
          }}
        />

        <article className="py-14 px-4">
          <div className="container mx-auto max-w-3xl">
            <BackButton />

            <Reveal>
              <header className="mt-10 mb-10 text-center">
                <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-3">
                  {formatDate(article.date)} · {article.author === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
                </p>
                <h1 className="font-serif text-4xl md:text-5xl text-primary">
                  {article.title}
                </h1>
              </header>
            </Reveal>

            {article.imageUrl && (
              <Reveal delay={100} className="flex justify-center mb-10">
                <div className="p-2 bg-white border border-primary/30 rounded-sm w-full max-w-2xl">
                  <div className="relative w-full h-72 md:h-96">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={200} className="max-w-2xl mx-auto">
              {article.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-ink/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {article.videoUrl && (
              <div className="my-12 max-w-2xl mx-auto">
                <div className="relative w-full rounded-sm overflow-hidden border border-primary/30" style={{ paddingBottom: '56.25%' }}>
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

            <footer className="mt-14 pt-8 border-t border-dashed border-primary/25 max-w-2xl mx-auto text-center">
              <p className="font-serif italic text-lg text-ink/70">
                Written by <span className="text-primary">
                  {article.author === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
                </span>
              </p>
            </footer>
          </div>
        </article>
      </div>

      {recommendations.length > 0 && (
        <RecommendationGrid articles={recommendations} />
      )}
    </>
  );
}
