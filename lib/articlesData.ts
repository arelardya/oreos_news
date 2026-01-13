import { articles } from '@/data/articles';
import { Article } from '@/types/article';

// Shared articles data that both API routes use
export let articlesData = [...articles];

export function getArticlesData() {
  return articlesData;
}

export function setArticlesData(data: Article[]) {
  articlesData = data;
}

export function updateArticle(updatedArticle: Article) {
  const index = articlesData.findIndex(a => a.id === updatedArticle.id);
  if (index !== -1) {
    articlesData[index] = updatedArticle;
    return true;
  }
  return false;
}

export function addArticle(article: Article) {
  articlesData.push(article);
  articlesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function deleteArticle(id: string) {
  articlesData = articlesData.filter(a => a.id !== id);
}
