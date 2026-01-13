import { NextResponse } from 'next/server';
import { Article } from '@/types/article';
import { getArticlesData, addArticle, updateArticle, deleteArticle, setArticlesData } from '@/lib/articlesData';

export async function GET() {
  return NextResponse.json(getArticlesData());
}

export async function POST(request: Request) {
  try {
    const newArticle: Article = await request.json();
    addArticle(newArticle);
    return NextResponse.json({ success: true, article: newArticle });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle: Article = await request.json();
    const success = updateArticle(updatedArticle);
    
    if (success) {
      const articles = getArticlesData();
      setArticlesData(articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      return NextResponse.json({ success: true, article: updatedArticle });
    }
    
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
