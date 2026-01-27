import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Article } from '@/types/article';

async function getArticles(): Promise<Article[]> {
  try {
    const result = await sql`
      SELECT 
        id, title, slug, excerpt, content, image, 
        date, category, author, status, 
        scheduled_publish_at as "scheduledPublishAt",
        likes, created_at as "createdAt", updated_at as "updatedAt"
      FROM articles
      ORDER BY date DESC
    `;
    return result as Article[];
  } catch (error) {
    console.error('Database get error:', error);
    return [];
  }
}

async function createArticle(article: Article): Promise<void> {
  await sql`
    INSERT INTO articles (
      id, title, slug, excerpt, content, image, 
      date, category, author, status, 
      scheduled_publish_at, likes
    ) VALUES (
      ${article.id}, ${article.title}, ${article.slug}, 
      ${article.excerpt}, ${article.content}, ${article.image},
      ${article.date}, ${article.category}, ${article.author},
      ${article.status || 'published'},
      ${article.scheduledPublishAt || null},
      ${article.likes || 0}
    )
  `;
}

async function updateArticle(article: Article): Promise<void> {
  await sql`
    UPDATE articles SET
      title = ${article.title},
      slug = ${article.slug},
      excerpt = ${article.excerpt},
      content = ${article.content},
      image = ${article.image},
      date = ${article.date},
      category = ${article.category},
      author = ${article.author},
      status = ${article.status || 'published'},
      scheduled_publish_at = ${article.scheduledPublishAt || null},
      likes = ${article.likes || 0},
      updated_at = NOW()
    WHERE id = ${article.id}
  `;
}

async function deleteArticle(id: string): Promise<void> {
  await sql`DELETE FROM articles WHERE id = ${id}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeScheduled = searchParams.get('includeScheduled') === 'true';
    
    let articles = await getArticles();
    
    // Filter out scheduled articles that haven't been published yet (for public view)
    if (!includeScheduled) {
      const now = new Date();
      articles = articles.filter(article => {
        if (article.status === 'scheduled' && article.scheduledPublishAt) {
          return new Date(article.scheduledPublishAt) <= now;
        }
        return article.status !== 'scheduled';
      });
    }
    
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
    
    await createArticle(newArticle);
    
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
    await updateArticle(updatedArticle);
    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
