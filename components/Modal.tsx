'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'confirm';
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  onConfirm,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: ModalProps) {
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
      case 'confirm':
        return '🗑️';
      default:
        return '🎉';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'text-primary';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      case 'confirm':
        return 'text-primary-dark';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">{getIcon()}</div>
          <h2 className={`font-serif text-2xl ${getColorClass()} mb-3`}>
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {type === 'confirm' ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-white border border-primary/30 text-gray-600 py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-red-600 transition-colors"
              >
                {confirmLabel}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-primary text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
