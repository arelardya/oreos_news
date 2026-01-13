'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function Modal({ isOpen, onClose, title, message, type = 'success' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '🎉';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'text-primary dark:text-pink-300';
      case 'error':
        return 'text-red-500 dark:text-red-400';
      case 'info':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-primary dark:text-pink-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-scale-in">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{getIcon()}</div>
          <h2 className={`text-2xl font-bold ${getColorClass()} mb-4`}>
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary dark:bg-primary-dark text-white py-3 px-6 rounded-full font-medium hover:bg-primary-dark dark:hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
