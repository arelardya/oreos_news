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
      <div className="container mx-auto max-w-5xl relative">
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -rotate-6">
          <div className="bg-white p-2 pb-7 shadow-lg w-36 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src="/assets/2.webp" alt="" className="w-full h-28 object-cover" />
          </div>
        </div>
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 rotate-6">
          <div className="bg-white p-2 pb-7 shadow-lg w-36 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src="/assets/3.webp" alt="" className="w-full h-28 object-cover" />
          </div>
        </div>

        <Reveal className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-primary/15">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-8 md:p-10 text-center">
              <p className="text-2xl mb-3">💌</p>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-dark/60 mb-2">
                Counting down to
              </p>
              <p className="font-script text-5xl text-primary mb-8">
                seeing you again
              </p>

              <div className="flex items-stretch justify-center divide-x divide-dashed divide-primary/20">
                {units.map((unit) => (
                  <div key={unit.label} className="flex-1 px-2 sm:px-5">
                    <div className="bg-blush-light rounded-lg py-3 sm:py-4 mb-2 shadow-inner">
                      <div className="font-serif text-3xl sm:text-5xl text-primary">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-primary/15">
                <p className="font-serif italic text-sm text-primary-dark/70">
                  August 31, 2026 · 12:00 PM WIB
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
