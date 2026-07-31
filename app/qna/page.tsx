'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Reveal from '@/components/Reveal';

type User = 'ghalyndra' | 'masyanda' | 'admin';

interface Answer {
  id: number;
  questionId: number;
  author: string;
  answer: string;
  answeredAt: string;
}

interface DailyQuestion {
  id: number;
  questionDate: string;
  question: string;
  askedBy: string;
  createdAt: string;
  answers: Answer[];
}

const JAKARTA_TZ = 'Asia/Jakarta';

const PARTNER_LABEL: Record<string, string> = {
  ghalyndra: 'Ghalyndra 💙',
  masyanda: 'Masyanda 🩷',
};

const OTHER_USER: Record<string, string> = {
  ghalyndra: 'masyanda',
  masyanda: 'ghalyndra',
};

function jakartaToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: JAKARTA_TZ });
}

function dateStr(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-CA');
}

function formatAskedAt(isoDate: string) {
  return new Date(isoDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function QnAPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerDraft, setAnswerDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
  });

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      router.push('/admin');
      return;
    }
    setCurrentUser(localStorage.getItem('adminUser') as User);
    fetchQuestions();
  }, [router]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/daily');
      if (res.ok) {
        setQuestions(await res.json());
      }
    } catch (error) {
      console.error('Error fetching daily questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !currentUser) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion.trim(), askedBy: currentUser, date: jakartaToday() }),
      });
      if (res.ok) {
        setNewQuestion('');
        await fetchQuestions();
      } else {
        setModalState({ isOpen: true, title: 'Oops', message: 'Could not post the question. Try again.', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: number, e: React.FormEvent) => {
    e.preventDefault();
    const draft = answerDraft.trim();
    if (!draft || !currentUser) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/daily/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, author: currentUser, answer: draft }),
      });
      if (res.ok) {
        setAnswerDraft('');
        await fetchQuestions();
      } else {
        setModalState({ isOpen: true, title: 'Oops', message: 'Could not save your answer. Try again.', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser || loading) {
    return <LoadingSpinner />;
  }

  if (currentUser === 'admin') {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500 text-center max-w-sm">
          Daily Q&A is a just-the-two-of-you thing — log in as Ghalyndra or Masyanda to ask and answer.
        </p>
      </div>
    );
  }

  const partner = OTHER_USER[currentUser];
  const current = questions.find((q) => q.answers.length === 0);
  const history = questions.filter((q) => q.answers.length > 0);
  const iAsked = current?.askedBy === currentUser;

  return (
    <div className="bg-cream min-h-screen">
      <div
        className="h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <Reveal className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
            Just between the two of you
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary">
            💌 Daily Q&A
          </h1>
        </Reveal>

        <div className="space-y-8">
          {current ? (
            <div className="bg-white border border-dashed border-primary/25 rounded-lg p-6 md:p-8">
              <p className="text-xs uppercase tracking-wide text-primary-dark/70 mb-2">
                {PARTNER_LABEL[current.askedBy] || current.askedBy} asked {PARTNER_LABEL[OTHER_USER[current.askedBy]] || OTHER_USER[current.askedBy]} · {formatAskedAt(current.createdAt)}
              </p>
              <h2 className="font-serif text-xl md:text-2xl text-primary-dark mb-6">
                {current.question}
              </h2>

              {iAsked ? (
                <p className="text-gray-400 italic text-sm">
                  waiting for {PARTNER_LABEL[partner]} to answer 💭
                </p>
              ) : (
                <form onSubmit={(e) => handleAnswer(current.id, e)} className="space-y-3">
                  <textarea
                    rows={3}
                    required
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    placeholder="Your answer..."
                    className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white px-6 py-2.5 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Submit answer'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-primary/25 rounded-lg p-6 md:p-8">
              <h2 className="font-serif text-xl text-primary-dark mb-4">
                Your turn to ask
              </h2>
              <form onSubmit={handleAskQuestion} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={`What do you want to ask ${PARTNER_LABEL[partner]}?`}
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-6 py-2.5 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Ask a question'}
                </button>
              </form>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-primary-dark mb-2">
                History
              </h2>
              <div className="bg-white border border-primary/15 rounded-lg px-6 md:px-8">
                {history.map((q) => {
                  return (
                    <div key={q.id} className="py-4 border-b border-primary/10 last:border-0">
                      <p className="text-xs text-gray-400 mb-1">{dateStr(q.questionDate)}</p>
                      <p className="font-serif text-ink mb-2">
                        {q.question}
                        <span className="text-xs text-gray-400 font-sans not-italic"> — asked by {PARTNER_LABEL[q.askedBy] || q.askedBy}</span>
                      </p>
                      <div className="space-y-1">
                        {q.answers.map((a) => (
                          <p key={a.id} className="text-sm text-ink/80">
                            <span className="text-primary-dark">{PARTNER_LABEL[a.author] || a.author}:</span> {a.answer}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
