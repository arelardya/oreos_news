import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, fetch single game
    if (id) {
      const games = await sql`
        SELECT 
          id, title, difficulty,
          grid_data as "gridData", clues_across as "cluesAcross", 
          clues_down as "cluesDown", created_at as "createdAt",
          published_at as "publishedAt", play_count as "playCount",
          completion_count as "completionCount"
        FROM crossword_games
        WHERE id = ${parseInt(id)} AND published_at IS NOT NULL
      `;
      
      if (games.length === 0) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }
      
      return NextResponse.json(games[0]);
    }

    // Otherwise fetch all games
    const games = await sql`
      SELECT 
        id, title, difficulty,
        grid_data as "gridData", clues_across as "cluesAcross", 
        clues_down as "cluesDown", created_at as "createdAt",
        published_at as "publishedAt", play_count as "playCount",
        completion_count as "completionCount"
      FROM crossword_games
      WHERE published_at IS NOT NULL
      ORDER BY created_at DESC
    `;
    return NextResponse.json(games);
  } catch (error) {
    console.error('Crossword fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, difficulty, gridData, cluesAcross, cluesDown, published } = await request.json();

    const result = await sql`
      INSERT INTO crossword_games (
        title, difficulty, grid_data, clues_across, clues_down, published_at
      ) VALUES (
        ${title}, ${difficulty}, ${JSON.stringify(gridData)}, 
        ${JSON.stringify(cluesAcross)}, ${JSON.stringify(cluesDown)},
        ${published ? new Date().toISOString() : null}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, game: result[0] });
  } catch (error) {
    console.error('Crossword create error:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    
    // Increment play count
    await sql`
      UPDATE crossword_games
      SET play_count = play_count + 1
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Crossword update error:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    
    // Increment completion count
    await sql`
      UPDATE crossword_games
      SET completion_count = completion_count + 1
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Crossword completion update error:', error);
    return NextResponse.json({ error: 'Failed to update completion' }, { status: 500 });
  }
}
