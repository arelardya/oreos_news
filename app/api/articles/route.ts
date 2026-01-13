import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { Article } from '@/types/article';

const ARTICLES_KEY = 'articles';

function getRedisClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set');
  }
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
  });
}

async function getArticles(): Promise<Article[]> {
  const redis = getRedisClient();
  try {
    const data = await redis.get(ARTICLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Redis get error:', error);
    return [];
  } finally {
    redis.disconnect();
  }
}

async function saveArticles(articles: Article[]): Promise<void> {
  const redis = getRedisClient();
  try {
    await redis.set(ARTICLES_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Redis set error:', error);
    throw error;
  } finally {
    redis.disconnect();
  }
}

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newArticle: Article = await request.json();
    console.log('Creating article:', newArticle.id);
    
    const articles = await getArticles();
    articles.unshift(newArticle);
    await saveArticles(articles);
    
    console.log('Article created successfully');
    return NextResponse.json({ success: true, article: newArticle });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create article',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
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
