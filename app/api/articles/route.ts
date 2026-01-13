import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Article } from '@/types/article';

const ARTICLES_KEY = 'articles';

async function getArticles(): Promise<Article[]> {
  const articles = await kv.get<Article[]>(ARTICLES_KEY);
  return articles || [];
}

async function saveArticles(articles: Article[]): Promise<void> {
  await kv.set(ARTICLES_KEY, articles);
}

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const newArticle: Article = await request.json();
    const articles = await getArticles();
    articles.unshift(newArticle);
    await saveArticles(articles);
    return NextResponse.json({ success: true, article: newArticle });
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle: Article = await request.json();
    const articles = await getArticles();
    const index = articles.findIndex(a => a.id === updatedArticle.id);
    
    if (index !== -1) {
      articles[index] = updatedArticle;
      await saveArticles(articles);
      return NextResponse.json({ success: true, article: updatedArticle });
    }
    
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const articles = await getArticles();
    const filtered = articles.filter(a => a.id !== id);
    await saveArticles(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
