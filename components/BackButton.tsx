'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="inline-flex items-center px-6 py-3 bg-primary dark:bg-primary-dark text-white rounded-full font-medium hover:bg-primary-dark dark:hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <span className="mr-2">←</span>
      Back to Home
    </button>
  );
}
