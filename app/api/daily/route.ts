import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const questions = await sql`
      SELECT id, question_date as "questionDate", question, asked_by as "askedBy", created_at as "createdAt"
      FROM daily_questions
      ORDER BY question_date DESC
    `;

    const answers = await sql`
      SELECT id, question_id as "questionId", author, answer, answered_at as "answeredAt"
      FROM daily_answers
    `;

    const questionsWithAnswers = questions.map((q: any) => ({
      ...q,
      answers: answers.filter((a: any) => a.questionId === q.id),
    }));

    return NextResponse.json(questionsWithAnswers);
  } catch (error) {
    console.error('Daily questions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch daily questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { question, askedBy } = await request.json();

    if (!question || !askedBy) {
      return NextResponse.json({ error: 'Missing question or askedBy' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO daily_questions (question_date, question, asked_by)
      VALUES (CURRENT_DATE, ${question}, ${askedBy})
      ON CONFLICT (question_date) DO NOTHING
      RETURNING id, question_date as "questionDate", question, asked_by as "askedBy", created_at as "createdAt"
    `;

    if (result.length > 0) {
      return NextResponse.json({ success: true, question: { ...result[0], answers: [] } });
    }

    const existing = await sql`
      SELECT id, question_date as "questionDate", question, asked_by as "askedBy", created_at as "createdAt"
      FROM daily_questions
      WHERE question_date = CURRENT_DATE
    `;

    return NextResponse.json({ success: true, question: { ...existing[0], answers: [] } });
  } catch (error) {
    console.error('Daily question create error:', error);
    return NextResponse.json({ error: 'Failed to create daily question' }, { status: 500 });
  }
}
