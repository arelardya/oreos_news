import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/articles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`}>
      <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 h-full flex flex-col">
        {article.thumbnail && (
          <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <time className="text-sm text-accent dark:text-pink-300 font-medium mb-2">
            {formatDate(article.date)}
          </time>
          <h3 className="text-xl font-bold text-primary dark:text-pink-300 mb-3 hover:text-primary-dark dark:hover:text-accent transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
            {article.content.split('\n\n')[0]}
          </p>
          <div className="mt-4">
            <span className="text-primary dark:text-pink-300 font-medium hover:text-primary-dark dark:hover:text-accent transition-colors">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
