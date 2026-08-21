'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import { getAuthUser } from '@/lib/auth';

const UNLOCK_AT = '2026-08-21T00:00:00+07:00';
const AUDIO_SRC = '/audio/11-months.m4a';

interface AnniversaryCardProps {
  photos: [string, string];
}

export default function AnniversaryCard({ photos }: AnniversaryCardProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setUnlocked(new Date() >= new Date(UNLOCK_AT));
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sync = () => setLoggedIn(Boolean(getAuthUser()));
    sync();
    window.addEventListener('authchange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('authchange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!unlocked || !loggedIn) return null;

  return (
    <div className="px-4 py-14 bg-blush">
      <div className="container mx-auto max-w-5xl relative">
        <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 -rotate-3 text-4xl">
          🎉
        </div>
        <div className="hidden lg:block absolute left-16 top-1/3 rotate-6">
          <div className="bg-white p-2 pb-7 shadow-lg w-32 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src={photos[0]} alt="" loading="lazy" className="w-full h-24 object-cover" />
          </div>
        </div>
        <div className="hidden lg:block absolute right-16 top-1/3 -rotate-6">
          <div className="bg-white p-2 pb-7 shadow-lg w-32 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src={photos[1]} alt="" loading="lazy" className="w-full h-24 object-cover" />
          </div>
        </div>
        <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 rotate-3 text-4xl">
          💕
        </div>

        <Reveal className="max-w-lg mx-auto">
          <div className="relative -rotate-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 border border-white/80 shadow-sm rotate-2 z-10" />
            <div className="bg-white border border-primary/10 shadow-lg px-6 py-10 md:px-10 md:py-12 text-center">
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
          </div>
        </Reveal>
      </div>
    </div>
  );
}
