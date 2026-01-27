import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Get all article images
    const articleImages = await sql`
      SELECT 
        id, title, image as "imageUrl", author as "uploadedBy", 
        date as "createdAt"
      FROM articles
      WHERE image IS NOT NULL
      ORDER BY date DESC
    `;

    // Get individual gallery photos
    const galleryPhotos = await sql`
      SELECT 
        id, title, description, image_url as "imageUrl", 
        uploaded_by as "uploadedBy", created_at as "createdAt", likes
      FROM gallery_photos
      ORDER BY created_at DESC
    `;

    // Combine and format
    const allPhotos = [
      ...galleryPhotos.map((photo: any) => ({
        ...photo,
        type: 'gallery',
      })),
      ...articleImages.map((article: any) => ({
        id: `article-${article.id}`,
        title: article.title,
        imageUrl: article.imageUrl,
        uploadedBy: article.uploadedBy,
        createdAt: article.createdAt,
        type: 'article',
        likes: 0,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allPhotos);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, imageUrl, uploadedBy } = await request.json();

    const result = await sql`
      INSERT INTO gallery_photos (title, description, image_url, uploaded_by)
      VALUES (${title}, ${description || null}, ${imageUrl}, ${uploadedBy})
      RETURNING id, title, description, image_url as "imageUrl", 
                uploaded_by as "uploadedBy", created_at as "createdAt", likes
    `;

    return NextResponse.json({ success: true, photo: result[0] });
  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM gallery_photos WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery delete error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
