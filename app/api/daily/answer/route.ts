import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { questionId, author, answer } = await request.json();

    if (!questionId || !author || !answer) {
      return NextResponse.json({ error: 'Missing questionId, author, or answer' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO daily_answers (question_id, author, answer)
      VALUES (${questionId}, ${author}, ${answer})
      ON CONFLICT (question_id, author)
      DO UPDATE SET answer = ${answer}, answered_at = NOW()
      RETURNING id, question_id as "questionId", author, answer, answered_at as "answeredAt"
    `;

    return NextResponse.json({ success: true, answer: result[0] });
  } catch (error) {
    console.error('Daily answer submit error:', error);
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 });
  }
}
