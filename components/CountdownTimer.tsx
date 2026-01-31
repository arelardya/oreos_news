'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Target date: February 21, 2026, 12:00 AM WIB (UTC+7)
      const targetDate = new Date('2026-02-21T00:00:00+07:00');
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 dark:from-pink-400 dark:via-pink-500 dark:to-pink-600 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
            Countdown to February 21, 2026
          </h2>
          
          <div className="grid grid-cols-4 gap-4 md:gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-pink-50 rounded-2xl p-4 md:p-6 shadow-lg w-full">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 dark:text-pink-600 text-center">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
              </div>
              <div className="text-white font-semibold mt-3 text-sm md:text-base drop-shadow">
                Days
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-pink-50 rounded-2xl p-4 md:p-6 shadow-lg w-full">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 dark:text-pink-600 text-center">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
              </div>
              <div className="text-white font-semibold mt-3 text-sm md:text-base drop-shadow">
                Hours
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-pink-50 rounded-2xl p-4 md:p-6 shadow-lg w-full">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 dark:text-pink-600 text-center">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
              </div>
              <div className="text-white font-semibold mt-3 text-sm md:text-base drop-shadow">
                Minutes
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-pink-50 rounded-2xl p-4 md:p-6 shadow-lg w-full">
                <div className="text-4xl md:text-6xl font-bold text-pink-500 dark:text-pink-600 text-center">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="text-white font-semibold mt-3 text-sm md:text-base drop-shadow">
                Seconds
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <p className="text-white font-medium text-sm md:text-base drop-shadow">
                🩷 12:00 AM WIB 🩷
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
