import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface Word {
  word: string;
  clue: string;
  id: number;
}

interface GridCell {
  letter: string;
  number?: number;
  isBlack: boolean;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
}

// Simple crossword generator
function generateCrossword(words: Word[], size: number = 15) {
  // Sort words by length (longest first for better placement)
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);
  
  // Initialize empty grid
  const grid: (GridCell | null)[][] = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => ({ letter: '', number: undefined, isBlack: true }))
  );
  
  const placedWords: { word: Word; row: number; col: number; isVertical: boolean; number: number }[] = [];
  let clueNumber = 1;
  
  // Place first word horizontally in the middle
  if (sortedWords.length > 0) {
    const firstWord = sortedWords[0];
    const row = Math.floor(size / 2);
    const col = Math.floor((size - firstWord.word.length) / 2);
    
    for (let i = 0; i < firstWord.word.length; i++) {
      grid[row][col + i] = { letter: firstWord.word[i], isBlack: false };
    }
    grid[row][col].number = clueNumber;
    placedWords.push({ word: firstWord, row, col, isVertical: false, number: clueNumber++ });
  }
  
  // Try to place remaining words
  for (let i = 1; i < Math.min(sortedWords.length, 20); i++) {
    const word = sortedWords[i];
    let placed = false;
    
    // Try to intersect with existing words
    for (const existing of placedWords) {
      if (placed) break;
      
      for (let j = 0; j < existing.word.word.length; j++) {
        if (placed) break;
        
        for (let k = 0; k < word.word.length; k++) {
          if (existing.word.word[j] === word.word[k]) {
            // Found a potential intersection
            let newRow: number, newCol: number, isVertical: boolean;
            
            if (existing.isVertical) {
              // Place horizontally
              isVertical = false;
              newRow = existing.row + j;
              newCol = existing.col - k;
            } else {
              // Place vertically
              isVertical = true;
              newRow = existing.row - k;
              newCol = existing.col + j;
            }
            
            // Check if placement is valid
            if (canPlaceWord(grid, word.word, newRow, newCol, isVertical, size)) {
              placeWord(grid, word.word, newRow, newCol, isVertical);
              grid[newRow][newCol].number = clueNumber;
              placedWords.push({ word, row: newRow, col: newCol, isVertical, number: clueNumber++ });
              placed = true;
              break;
            }
          }
        }
      }
    }
  }
  
  // Generate clues
  const cluesAcross: Clue[] = [];
  const cluesDown: Clue[] = [];
  
  for (const placed of placedWords) {
    const clue: Clue = {
      number: placed.number,
      clue: placed.word.clue,
      answer: placed.word.word,
      startRow: placed.row,
      startCol: placed.col,
    };
    
    if (placed.isVertical) {
      cluesDown.push(clue);
    } else {
      cluesAcross.push(clue);
    }
  }
  
  return {
    grid,
    cluesAcross: cluesAcross.sort((a, b) => a.number - b.number),
    cluesDown: cluesDown.sort((a, b) => a.number - b.number),
  };
}

function canPlaceWord(grid: (GridCell | null)[][], word: string, row: number, col: number, isVertical: boolean, size: number): boolean {
  if (isVertical) {
    if (row < 0 || row + word.length > size || col < 0 || col >= size) return false;
    
    for (let i = 0; i < word.length; i++) {
      const cell = grid[row + i][col];
      if (cell && !cell.isBlack && cell.letter !== '' && cell.letter !== word[i]) {
        return false;
      }
    }
  } else {
    if (row < 0 || row >= size || col < 0 || col + word.length > size) return false;
    
    for (let i = 0; i < word.length; i++) {
      const cell = grid[row][col + i];
      if (cell && !cell.isBlack && cell.letter !== '' && cell.letter !== word[i]) {
        return false;
      }
    }
  }
  
  return true;
}

function placeWord(grid: (GridCell | null)[][], word: string, row: number, col: number, isVertical: boolean) {
  if (isVertical) {
    for (let i = 0; i < word.length; i++) {
      if (grid[row + i][col]) {
        grid[row + i][col]!.letter = word[i];
        grid[row + i][col]!.isBlack = false;
      }
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      if (grid[row][col + i]) {
        grid[row][col + i]!.letter = word[i];
        grid[row][col + i]!.isBlack = false;
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const { title, difficulty, wordCount = 15 } = await request.json();
    
    // Fetch words from word bank
    const allWords = await sql`
      SELECT id, word, clue
      FROM crossword_words
      WHERE difficulty = ${difficulty}
      ORDER BY RANDOM()
      LIMIT ${wordCount}
    `;
    
    if (allWords.length < 5) {
      return NextResponse.json(
        { error: 'Not enough words in the word bank. Add at least 5 words first.' },
        { status: 400 }
      );
    }
    
    // Generate crossword
    const { grid, cluesAcross, cluesDown } = generateCrossword(allWords as Word[]);
    
    // Save to database
    const result = await sql`
      INSERT INTO crossword_games (
        title, difficulty, grid_data, clues_across, clues_down, published_at
      ) VALUES (
        ${title}, ${difficulty}, ${JSON.stringify(grid)}, 
        ${JSON.stringify(cluesAcross)}, ${JSON.stringify(cluesDown)},
        ${new Date().toISOString()}
      )
      RETURNING id, title, difficulty
    `;
    
    // Update word usage count
    const wordIds = allWords.map((w: any) => w.id);
    await sql`
      UPDATE crossword_words
      SET times_used = times_used + 1
      WHERE id = ANY(${wordIds})
    `;
    
    return NextResponse.json({ 
      success: true, 
      game: result[0],
      wordsUsed: allWords.length
    });
  } catch (error) {
    console.error('Crossword generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate crossword',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
