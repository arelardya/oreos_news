import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white dark:from-pink-100 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-primary dark:text-pink-300 text-center mb-12">
            Latest Articles
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white dark:from-pink-100 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-primary dark:text-pink-300 text-center mb-12">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
