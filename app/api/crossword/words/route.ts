import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const words = await sql`
      SELECT 
        id, word, clue, category, difficulty,
        created_by as "createdBy", created_at as "createdAt",
        times_used as "timesUsed"
      FROM crossword_words
      ORDER BY created_at DESC
    `;
    return NextResponse.json(words);
  } catch (error) {
    console.error('Word bank fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { word, clue, category, difficulty, createdBy } = await request.json();

    const result = await sql`
      INSERT INTO crossword_words (word, clue, category, difficulty, created_by)
      VALUES (${word.toUpperCase()}, ${clue}, ${category || null}, ${difficulty}, ${createdBy})
      RETURNING id, word, clue, category, difficulty, 
                created_by as "createdBy", created_at as "createdAt", times_used as "timesUsed"
    `;

    return NextResponse.json({ success: true, word: result[0] });
  } catch (error) {
    console.error('Word add error:', error);
    return NextResponse.json({ error: 'Failed to add word' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM crossword_words WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Word delete error:', error);
    return NextResponse.json({ error: 'Failed to delete word' }, { status: 500 });
  }
}
