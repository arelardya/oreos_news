'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

interface CrosswordWord {
  id: number;
  word: string;
  clue: string;
  category?: string;
  difficulty: string;
  createdBy: string;
  createdAt: string;
  timesUsed: number;
}

export default function CrosswordManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<'ghalyndra' | 'masyanda' | 'admin' | null>(null);
  const [words, setWords] = useState<CrosswordWord[]>([]);
  const [formData, setFormData] = useState({
    word: '',
    clue: '',
    category: '',
    difficulty: 'medium',
  });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });
  const [generating, setGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    title: '',
    difficulty: 'medium',
    wordCount: 15,
  });

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      router.push('/admin');
      return;
    }

    const user = localStorage.getItem('adminUser') as 'ghalyndra' | 'masyanda' | 'admin';
    
    // Only Ghalyndra and admin can access this page
    if (user !== 'ghalyndra' && user !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }
    
    setCurrentUser(user);
    fetchWords();
  }, [router]);

  const fetchWords = async () => {
    try {
      const res = await fetch('/api/crossword/words');
      if (res.ok) {
        const data = await res.json();
        setWords(data);
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.word || !formData.clue) {
      setModalState({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please provide both word and clue.',
        type: 'error',
      });
      return;
    }

    // Validate word (only letters, no spaces)
    if (!/^[A-Za-z]+$/.test(formData.word)) {
      setModalState({
        isOpen: true,
        title: 'Invalid Word',
        message: 'Word must contain only letters (no spaces or numbers).',
        type: 'error',
      });
      return;
    }

    try {
      const response = await fetch('/api/crossword/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: currentUser,
        }),
      });

      if (response.ok) {
        await fetchWords();
        setFormData({ word: '', clue: '', category: '', difficulty: 'medium' });
        setModalState({
          isOpen: true,
          title: 'Success!',
          message: 'Word added to crossword bank! 🧩',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error adding word:', error);
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Failed to add word. Please try again.',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this word?')) return;

    try {
      const response = await fetch('/api/crossword/words', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchWords();
        setModalState({
          isOpen: true,
          title: 'Deleted',
          message: 'Word removed from bank.',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const handleGenerateCrossword = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('/api/crossword/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateForm),
      });

      const data = await response.json();

      if (response.ok) {
        setModalState({
          isOpen: true,
          title: 'Crossword Generated! 🎉',
          message: `Successfully created "${data.game.title}" using ${data.wordsUsed} words from your bank!`,
          type: 'success',
        });
        setGenerateForm({ title: '', difficulty: 'medium', wordCount: 15 });
      } else {
        setModalState({
          isOpen: true,
          title: 'Generation Failed',
          message: data.error || 'Failed to generate crossword.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error generating crossword:', error);
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Failed to generate crossword. Please try again.',
        type: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!currentUser) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-7xl px-4 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary dark:text-pink-300">
            🧩 Crossword Manager
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Word Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
              Add Word
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Word *
                </label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                  placeholder="EXAMPLE"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clue *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.clue}
                  onChange={(e) => setFormData({ ...formData, clue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="A sample or model..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category (Optional)
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="General, Science, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-full font-medium hover:shadow-lg transition-all"
              >
                ➕ Add Word
              </button>
            </form>
          </div>

          {/* Generate Crossword Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
              Generate Puzzle
            </h2>

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Word Bank Stats:</strong><br />
                Total words: {words.length}
              </p>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Easy: {words.filter(w => w.difficulty === 'easy').length} •
                Medium: {words.filter(w => w.difficulty === 'medium').length} •
                Hard: {words.filter(w => w.difficulty === 'hard').length}
              </div>
            </div>

            <form onSubmit={handleGenerateCrossword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Puzzle Title *
                </label>
                <input
                  type="text"
                  required
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Daily Challenge #1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  value={generateForm.difficulty}
                  onChange={(e) => setGenerateForm({ ...generateForm, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Words: {generateForm.wordCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={generateForm.wordCount}
                  onChange={(e) => setGenerateForm({ ...generateForm, wordCount: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 10-15 words
                </p>
              </div>

              <button
                type="submit"
                disabled={generating || words.length < 5}
                className="w-full bg-gradient-to-r from-accent to-primary text-white py-3 px-6 rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? '⏳ Generating...' : '🎲 Generate Crossword'}
              </button>

              {words.length < 5 && (
                <p className="text-xs text-red-500 dark:text-red-400 text-center">
                  Add at least 5 words to generate a crossword
                </p>
              )}
            </form>
          </div>

          {/* Word List */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 lg:col-span-1">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
              Word Bank ({words.length})
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {words.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No words yet. Start building your crossword bank! 🧩
                </p>
              ) : (
                words.map((word) => (
                  <div
                    key={word.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {word.word}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {word.clue}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(word.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex gap-2 items-center mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(word.difficulty)}`}>
                        {word.difficulty}
                      </span>
                      {word.category && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {word.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        Used {word.timesUsed}x
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
