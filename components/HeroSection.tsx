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
    <section className="py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Random Image */}
        {randomImage && (
          <div className="flex justify-center mb-8">
            <img 
              src={randomImage} 
              alt="Oreo" 
              className="w-full max-w-2xl h-auto rounded-3xl object-contain shadow-2xl border-4 border-white/80" 
            />
          </div>
        )}
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in">
          Psst! Welcome to Oreo's News 💌
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed px-2">
          This segment of the internet was made for Masyanda. Buttt... feel free to stay in case you're interested in our stories 🌟
        </p>
      </div>
    </section>
  );
}
