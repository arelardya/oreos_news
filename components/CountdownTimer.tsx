'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';

const TARGET_DATE = '2026-08-31T12:00:00+07:00';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(TARGET_DATE);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="px-4 py-14 bg-blush-light">
      <Reveal className="container mx-auto max-w-2xl">
        <div className="bg-white border border-dashed border-primary/30 rounded-lg p-6 md:p-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-dark/70 mb-2">
            Counting down to
          </p>
          <p className="font-serif italic text-2xl text-primary mb-6">
            seeing you again 💕
          </p>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-4">
            {units.map((unit) => (
              <div key={unit.label}>
                <div className="font-serif text-3xl sm:text-4xl text-primary">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400">August 31, 2026 · 12:00 PM WIB</p>
        </div>
      </Reveal>
    </div>
  );
}
