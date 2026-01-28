'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import BackButton from '@/components/BackButton';

interface Cell {
  letter: string;
  number?: number;
  across?: boolean;
  down?: boolean;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
}

interface CrosswordGame {
  id: number;
  title: string;
  difficulty: string;
  gridData: Cell[][];
  cluesAcross: Clue[];
  cluesDown: Clue[];
  createdAt: string;
}

export default function CrosswordGamePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [game, setGame] = useState<CrosswordGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/crossword?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Game not found');
        return res.json();
      })
      .then(data => {
        setGame(data);
        // Initialize user grid with empty strings
        const emptyGrid = data.gridData.map((row: Cell[]) =>
          row.map((cell: Cell) => (cell.letter ? '' : '#'))
        );
        setUserGrid(emptyGrid);
        setLoading(false);

        // Increment play count
        fetch('/api/crossword', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(id) })
        });
      })
      .catch(err => {
        console.error('Failed to fetch game:', err);
        setLoading(false);
      });
  }, [id]);

  const handleCellClick = (row: number, col: number) => {
    if (!game || game.gridData[row][col].letter === '') return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction if clicking same cell
      setSelectedDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (!game) return;
    
    // Only process input if this cell is selected
    if (selectedCell?.row !== row || selectedCell?.col !== col) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newGrid = [...userGrid];
      newGrid[row][col] = '';
      setUserGrid(newGrid);
      moveToPrevious(row, col);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleArrowKey(e.key, row, col);
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      e.preventDefault();
      const newGrid = [...userGrid];
      newGrid[row][col] = e.key.toUpperCase();
      setUserGrid(newGrid);
      moveToNext(row, col);
    }
  };

  const handleArrowKey = (key: string, row: number, col: number) => {
    if (!game) return;
    
    let newRow = row;
    let newCol = col;

    switch (key) {
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        setSelectedDirection('across');
        break;
      case 'ArrowRight':
        newCol = Math.min(game.gridData[0].length - 1, col + 1);
        setSelectedDirection('across');
        break;
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        setSelectedDirection('down');
        break;
      case 'ArrowDown':
        newRow = Math.min(game.gridData.length - 1, row + 1);
        setSelectedDirection('down');
        break;
    }

    // Skip black cells
    while (newRow >= 0 && newRow < game.gridData.length && 
           newCol >= 0 && newCol < game.gridData[0].length &&
           game.gridData[newRow][newCol].letter === '') {
      if (key === 'ArrowLeft') newCol--;
      else if (key === 'ArrowRight') newCol++;
      else if (key === 'ArrowUp') newRow--;
      else if (key === 'ArrowDown') newRow++;
    }

    if (newRow >= 0 && newRow < game.gridData.length && 
        newCol >= 0 && newCol < game.gridData[0].length &&
        game.gridData[newRow][newCol].letter !== '') {
      setSelectedCell({ row: newRow, col: newCol });
    }
  };

  const moveToNext = (row: number, col: number) => {
    if (!game) return;

    if (selectedDirection === 'across') {
      let newCol = col + 1;
      while (newCol < game.gridData[0].length && game.gridData[row][newCol].letter === '') {
        newCol++;
      }
      if (newCol < game.gridData[0].length) {
        setSelectedCell({ row, col: newCol });
      }
    } else {
      let newRow = row + 1;
      while (newRow < game.gridData.length && game.gridData[newRow][col].letter === '') {
        newRow++;
      }
      if (newRow < game.gridData.length) {
        setSelectedCell({ row: newRow, col });
      }
    }
  };

  const moveToPrevious = (row: number, col: number) => {
    if (!game) return;

    if (selectedDirection === 'across') {
      let newCol = col - 1;
      while (newCol >= 0 && game.gridData[row][newCol].letter === '') {
        newCol--;
      }
      if (newCol >= 0) {
        setSelectedCell({ row, col: newCol });
      }
    } else {
      let newRow = row - 1;
      while (newRow >= 0 && game.gridData[newRow][col].letter === '') {
        newRow--;
      }
      if (newRow >= 0) {
        setSelectedCell({ row: newRow, col });
      }
    }
  };

  const checkSolution = () => {
    if (!game) return;

    let correct = true;
    for (let i = 0; i < game.gridData.length; i++) {
      for (let j = 0; j < game.gridData[i].length; j++) {
        if (game.gridData[i][j].letter && 
            userGrid[i][j].toUpperCase() !== game.gridData[i][j].letter.toUpperCase()) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }

    if (correct) {
      setCompleted(true);
      // Increment completion count
      fetch('/api/crossword', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id) })
      });
    } else {
      alert('Not quite right! Keep trying! 💪');
    }
  };

  const resetGrid = () => {
    if (!game) return;
    const emptyGrid = game.gridData.map(row =>
      row.map(cell => (cell.letter ? '' : '#'))
    );
    setUserGrid(emptyGrid);
    setCompleted(false);
    setShowSolution(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!game) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Game Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sorry, we couldn't find that crossword puzzle.
          </p>
          <BackButton />
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <BackButton />
        </div>

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-pink-300 mb-4">
            {game.title}
          </h1>
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase ${getDifficultyColor(game.difficulty)}`}>
            {game.difficulty}
          </span>
        </header>

        {completed && (
          <div className="mb-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-3xl p-6 text-center">
            <p className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              🎉 Congratulations! 🎉
            </p>
            <p className="text-green-700 dark:text-green-400">
              You've completed this crossword puzzle!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6">
              <div className="inline-block" style={{ touchAction: 'none' }}>
                {game.gridData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => {
                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                      const isBlack = cell.letter === '';
                      
                      return (
                        <div
                          key={colIndex}
                          className={`
                            w-14 h-14 border-2 border-gray-300 dark:border-gray-600 relative
                            ${isBlack 
                              ? 'bg-gray-900 dark:bg-gray-950' 
                              : isSelected 
                                ? 'bg-blue-200 dark:bg-blue-900' 
                                : 'bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                            }
                          `}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                          {cell.number && (
                            <span className="absolute top-0.5 left-1 text-xs font-bold text-gray-600 dark:text-gray-400">
                              {cell.number}
                            </span>
                          )}
                          {!isBlack && (
                            <input
                              type="text"
                              maxLength={1}
                              value={showSolution ? cell.letter : userGrid[rowIndex]?.[colIndex] || ''}
                              onChange={() => {}}
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-full h-full text-center text-3xl font-bold uppercase
                                bg-transparent outline-none caret-transparent
                                ${showSolution ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
                              `}
                              readOnly={showSolution}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={checkSolution}
                  disabled={showSolution || completed}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Check Solution
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-full font-semibold transition-colors"
                >
                  {showSolution ? '🙈 Hide' : '👁️ Show'} Solution
                </button>
                <button
                  onClick={resetGrid}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Clues */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 sticky top-4">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="mr-2">➡️</span> Across
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {game.cluesAcross.map((clue) => (
                    <div key={clue.number} className="text-sm">
                      <span className="font-bold text-primary dark:text-pink-300">
                        {clue.number}.
                      </span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">
                        {clue.clue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="mr-2">⬇️</span> Down
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {game.cluesDown.map((clue) => (
                    <div key={clue.number} className="text-sm">
                      <span className="font-bold text-primary dark:text-pink-300">
                        {clue.number}.
                      </span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">
                        {clue.clue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
