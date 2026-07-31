import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';

interface RecommendationGridProps {
  articles: Article[];
}

export default function RecommendationGrid({ articles }: RecommendationGridProps) {
  return (
    <section className="py-16 px-4 bg-cream">
      <div className="container mx-auto max-w-7xl">
        <p className="text-center text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
          More from the journal
        </p>
        <h2 className="font-serif text-3xl text-primary-dark text-center mb-10">
          You might like these too
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
