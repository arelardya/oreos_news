import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes('webp') && !file.name.toLowerCase().endsWith('.webp')) {
      return NextResponse.json({ error: 'Only .webp files are allowed' }, { status: 400 });
    }

    // Validate file size (30MB)
    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 30MB' }, { status: 400 });
    }

    const filename = `articles/${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    // Upload to Vercel Blob storage
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url, success: true });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
