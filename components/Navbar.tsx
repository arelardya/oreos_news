'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Only transparent on homepage when not scrolled
  const isTransparent = isHomePage && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent' 
        : 'bg-white/95 dark:bg-gray-800/95 shadow-md backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link 
            href="/" 
            className={`text-lg sm:text-xl md:text-2xl font-bold hover:text-primary-dark transition-colors truncate flex items-center gap-2 ${
              isTransparent
                ? 'text-white dark:text-white' 
                : 'text-primary dark:text-pink-300'
            }`}
          >
            <span className="text-2xl">🐱</span>
            <span>Oreo's News</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
            <Link
              href="/"
              className={`text-sm sm:text-base font-medium transition-colors ${
                isActive('/')
                  ? isTransparent
                    ? 'text-white dark:text-white border-b-2 border-white'
                    : 'text-primary dark:text-pink-300 border-b-2 border-primary dark:border-pink-300'
                  : isTransparent
                    ? 'text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-pink-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={`text-sm sm:text-base font-medium transition-colors ${
                isActive('/gallery')
                  ? isTransparent
                    ? 'text-white dark:text-white border-b-2 border-white'
                    : 'text-primary dark:text-pink-300 border-b-2 border-primary dark:border-pink-300'
                  : isTransparent
                    ? 'text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-pink-300'
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/crossword"
              className={`text-sm sm:text-base font-medium transition-colors ${
                isActive('/crossword')
                  ? isTransparent
                    ? 'text-white dark:text-white border-b-2 border-white'
                    : 'text-primary dark:text-pink-300 border-b-2 border-primary dark:border-pink-300'
                  : isTransparent
                    ? 'text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-pink-300'
              }`}
            >
              Crossword
            </Link>
            <Link
              href="/about"
              className={`text-sm sm:text-base font-medium transition-colors ${
                isActive('/about')
                  ? isTransparent
                    ? 'text-white dark:text-white border-b-2 border-white'
                    : 'text-primary dark:text-pink-300 border-b-2 border-primary dark:border-pink-300'
                  : isTransparent
                    ? 'text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-pink-300'
              }`}
            >
              About
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
