'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

interface CrosswordGame {
  id: number;
  title: string;
  difficulty: string;
  createdAt: string;
  playCount: number;
  completionCount: number;
}

export default function CrosswordPage() {
  const [games, setGames] = useState<CrosswordGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/crossword')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch games:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            🧩 Crossword Puzzles
          </h1>
          <p className="text-gray-600 text-lg">
            Challenge your mind with our collection of crossword puzzles!
          </p>
        </header>

        {games.length === 0 ? (
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <p className="text-2xl text-gray-500 mb-4">
              🎯 Coming Soon!
            </p>
            <p className="text-gray-600">
              We're working on exciting crossword puzzles for you. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/crossword/${game.id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {game.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>🎮 {game.playCount} plays</span>
                    <span>✅ {game.completionCount} completed</span>
                  </div>

                  <div className="text-sm text-gray-500">
                    Added {new Date(game.createdAt).toLocaleDateString()}
                  </div>

                  <div className="mt-6 text-primary font-medium group-hover:text-primary-dark transition-colors">
                    Play Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
