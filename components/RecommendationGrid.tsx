import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';

interface RecommendationGridProps {
  articles: Article[];
}

export default function RecommendationGrid({ articles }: RecommendationGridProps) {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-primary dark:text-pink-300 text-center mb-10">
          You Might Also Enjoy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
