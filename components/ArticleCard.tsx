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
      <article className="bg-white border border-dashed border-primary/25 rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {article.thumbnail && (
          <div className="relative h-48 w-full bg-gray-100 p-2 pb-0">
            <div className="relative h-full w-full rounded-sm overflow-hidden">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <time className="text-[11px] uppercase tracking-widest text-accent font-medium">
              {formatDate(article.date)}
            </time>
            <p className="text-xs text-gray-500">
              {article.author === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
            </p>
          </div>
          <h3 className="font-serif text-2xl text-primary-dark mb-3 hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 flex-1">
            {article.content.split('\n\n')[0]}
          </p>
          <div className="mt-4">
            <span className="text-primary text-sm font-medium hover:text-primary-dark transition-colors">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
