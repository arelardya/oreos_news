'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';

const UNLOCK_AT = '2026-08-21T00:00:00+07:00';
const AUDIO_SRC = '/audio/11-months.m4a';

export default function AnniversaryCard() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const check = () => setUnlocked(new Date() >= new Date(UNLOCK_AT));
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!unlocked) return null;

  return (
    <div className="px-4 py-14 bg-blush">
      <Reveal className="container mx-auto max-w-lg">
        <div className="bg-white border border-dashed border-primary/30 rounded-lg p-6 md:p-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-dark/70 mb-2">
            Happy
          </p>
          <p className="font-script text-5xl text-primary mb-4">
            11 Months
          </p>
          <p className="text-sm text-ink/70 mb-6">
            a little something for today 🎧
          </p>
          <audio controls className="w-full" preload="none">
            <source src={AUDIO_SRC} type="audio/mp4" />
            Your browser doesn't support audio playback.
          </audio>
        </div>
      </Reveal>
    </div>
  );
}
