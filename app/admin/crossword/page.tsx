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
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
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

  const inputClass = "w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink";
  const labelClass = "block text-xs uppercase tracking-wide text-gray-500 mb-2";
  const userLabel = currentUser === 'admin' ? 'Master Admin' : 'Ghalyndra 💙';

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-sage/20 text-sage';
      case 'medium': return 'bg-accent/20 text-primary-dark';
      case 'hard': return 'bg-primary/15 text-primary-dark';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <div
        className="h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
              {userLabel}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-primary">
              🧩 Crossword
            </h1>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-xs uppercase tracking-wide px-5 py-2.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Word Form */}
          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary-dark mb-6">
              Add Word
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Word *</label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value.toUpperCase() })}
                  className={`${inputClass} uppercase`}
                  placeholder="EXAMPLE"
                  maxLength={20}
                />
              </div>

              <div>
                <label className={labelClass}>Clue *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.clue}
                  onChange={(e) => setFormData({ ...formData, clue: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="A sample or model..."
                />
              </div>

              <div>
                <label className={labelClass}>Category (optional)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClass}
                  placeholder="General, Science, etc."
                />
              </div>

              <div>
                <label className={labelClass}>Difficulty *</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className={inputClass}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors"
              >
                Add Word
              </button>
            </form>
          </div>

          {/* Generate Crossword Form */}
          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary-dark mb-6">
              Generate Puzzle
            </h2>

            <div className="mb-6 p-4 bg-blush-light border border-dashed border-primary/30 rounded-lg">
              <p className="text-xs uppercase tracking-wide text-primary-dark/70 mb-1">
                Word bank stats
              </p>
              <p className="text-sm text-ink">
                {words.length} total words
              </p>
              <div className="mt-1 text-xs text-gray-600">
                Easy: {words.filter(w => w.difficulty === 'easy').length} ·
                {' '}Medium: {words.filter(w => w.difficulty === 'medium').length} ·
                {' '}Hard: {words.filter(w => w.difficulty === 'hard').length}
              </div>
            </div>

            <form onSubmit={handleGenerateCrossword} className="space-y-5">
              <div>
                <label className={labelClass}>Puzzle title *</label>
                <input
                  type="text"
                  required
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                  className={inputClass}
                  placeholder="Daily Challenge #1"
                />
              </div>

              <div>
                <label className={labelClass}>Difficulty *</label>
                <select
                  value={generateForm.difficulty}
                  onChange={(e) => setGenerateForm({ ...generateForm, difficulty: e.target.value })}
                  className={inputClass}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Number of words: {generateForm.wordCount}</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={generateForm.wordCount}
                  onChange={(e) => setGenerateForm({ ...generateForm, wordCount: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 10-15 words
                </p>
              </div>

              <button
                type="submit"
                disabled={generating || words.length < 5}
                className="w-full bg-primary text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Crossword'}
              </button>

              {words.length < 5 && (
                <p className="text-xs text-red-500 text-center">
                  Add at least 5 words to generate a crossword
                </p>
              )}
            </form>
          </div>

          {/* Word List */}
          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8 lg:col-span-1">
            <h2 className="font-serif text-2xl text-primary-dark mb-6">
              Word Bank ({words.length})
            </h2>

            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {words.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No words yet — start building your crossword bank 🧩
                </p>
              ) : (
                words.map((word) => (
                  <div
                    key={word.id}
                    className="border border-dashed border-primary/25 rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-primary-dark">
                          {word.word}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {word.clue}
                        </p>
                      </div>
                      <button
                        onClick={() => setDeleteTarget(word.id)}
                        className="text-xs uppercase tracking-wide text-red-500 hover:text-red-600 ml-2"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex gap-2 items-center mt-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wide font-medium ${getDifficultyClass(word.difficulty)}`}>
                        {word.difficulty}
                      </span>
                      {word.category && (
                        <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wide bg-primary/10 text-primary-dark">
                          {word.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
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

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete this word?"
        message="This can't be undone — it'll be removed from the crossword word bank."
        type="confirm"
        onConfirm={() => deleteTarget !== null && handleDelete(deleteTarget)}
      />
    </div>
  );
}
