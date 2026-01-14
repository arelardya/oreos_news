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

/**
 * This endpoint checks for scheduled articles that need to be published
 * and updates their status. Can be called by a cron job or manually.
 */
export async function GET() {
  try {
    const articles = await getArticles();
    const now = new Date();
    let publishedCount = 0;

    const updatedArticles = articles.map(article => {
      if (
        article.status === 'scheduled' &&
        article.scheduledPublishAt &&
        new Date(article.scheduledPublishAt) <= now
      ) {
        publishedCount++;
        return {
          ...article,
          status: 'published' as const,
        };
      }
      return article;
    });

    if (publishedCount > 0) {
      await saveArticles(updatedArticles);
    }

    return NextResponse.json({
      success: true,
      publishedCount,
      message: `Published ${publishedCount} scheduled article(s)`,
    });
  } catch (error) {
    console.error('Error publishing scheduled articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to publish scheduled articles',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
