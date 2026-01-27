import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Article } from '@/types/article';

/**
 * This endpoint checks for scheduled articles that need to be published
 * and updates their status. Can be called by a cron job or manually.
 */
export async function GET() {
  try {
    const now = new Date();
    
    // Update all scheduled articles that should be published
    const result = await sql`
      UPDATE articles
      SET status = 'published'
      WHERE status = 'scheduled'
        AND scheduled_publish_at IS NOT NULL
        AND scheduled_publish_at <= ${now.toISOString()}
      RETURNING id, title
    `;

    const publishedCount = result.length;

    return NextResponse.json({
      success: true,
      publishedCount,
      message: `Published ${publishedCount} scheduled article(s)`,
      articles: result,
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
