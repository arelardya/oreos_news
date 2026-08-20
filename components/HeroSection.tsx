'use client';

import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    const images = ['/assets/1.webp', '/assets/2.webp', '/assets/3.webp'];
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  }, []);

  return (
    <section className="bg-cream">
      {/* Striped masthead */}
      <div
        className="h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />

      <div className="container mx-auto max-w-3xl text-center px-4 py-16 md:py-20">
        {randomImage && (
          <div className="flex justify-center mb-10 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <div className="p-1.5 border border-primary/40 rounded-sm transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02]">
              <div className="p-2 border border-primary/40 rounded-sm">
                <img
                  src={randomImage}
                  alt="Masyandra"
                  className="w-full max-w-xl h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-xs tracking-[0.3em] uppercase text-primary-dark/70 mb-2 animate-fade-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          a little corner of the internet
        </p>
        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl font-normal text-primary mb-4 animate-fade-up" style={{ animationDelay: '280ms', animationFillMode: 'both' }}>
          Masyandra
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '420ms', animationFillMode: 'both' }}>
          This segment of the internet was made for Masyanda. Buttt... feel free to stay in case you're interested in our stories 🌟
        </p>

        <a
          href="#articles"
          className="inline-block mt-8 text-xs tracking-[0.2em] uppercase text-primary border border-primary/40 rounded-full px-6 py-3 hover:bg-primary hover:text-white transition-colors animate-fade-up"
          style={{ animationDelay: '550ms', animationFillMode: 'both' }}
        >
          Read our stories
        </a>

        <p
          className="mt-10 text-xs uppercase tracking-widest text-primary-dark/50 animate-fade-up"
          style={{ animationDelay: '700ms', animationFillMode: 'both' }}
        >
          scroll down to find a surprise <span className="inline-block animate-bounce">🎉</span>
        </p>
      </div>
    </section>
  );
}
