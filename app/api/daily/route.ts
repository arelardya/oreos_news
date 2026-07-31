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
    const { question, askedBy, date } = await request.json();

    if (!question || !askedBy || !date) {
      return NextResponse.json({ error: 'Missing question, askedBy, or date' }, { status: 400 });
    }

    // Only one question can be unanswered at a time -- if one's already
    // outstanding, hand that back instead of starting a second thread.
    const pending = await sql`
      SELECT q.id, q.question_date as "questionDate", q.question, q.asked_by as "askedBy", q.created_at as "createdAt"
      FROM daily_questions q
      LEFT JOIN daily_answers a ON a.question_id = q.id
      WHERE a.id IS NULL
      ORDER BY q.created_at DESC
      LIMIT 1
    `;

    if (pending.length > 0) {
      return NextResponse.json({ success: true, question: { ...pending[0], answers: [] } });
    }

    const [inserted] = await sql`
      INSERT INTO daily_questions (question_date, question, asked_by)
      VALUES (${date}, ${question}, ${askedBy})
      RETURNING id, question_date as "questionDate", question, asked_by as "askedBy", created_at as "createdAt"
    `;

    return NextResponse.json({ success: true, question: { ...inserted, answers: [] } });
  } catch (error) {
    console.error('Daily question create error:', error);
    return NextResponse.json({ error: 'Failed to create daily question' }, { status: 500 });
  }
}
