import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';
import Reveal from './Reveal';

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <section className="pb-20 px-4 bg-cream">
        <div className="container mx-auto max-w-7xl text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 text-lg">
            No articles found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 px-4 bg-cream">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <Reveal key={article.id} delay={(i % 3) * 100}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
