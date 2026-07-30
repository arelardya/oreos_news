'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="inline-flex items-center text-xs uppercase tracking-wide px-5 py-2.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
    >
      <span className="mr-2">←</span>
      Back to Home
    </button>
  );
}
