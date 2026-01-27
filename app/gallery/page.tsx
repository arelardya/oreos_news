'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

interface GalleryItem {
  id: string | number;
  title: string;
  description?: string;
  imageUrl: string;
  uploadedBy: string;
  createdAt: string;
  type: 'gallery' | 'article';
  likes: number;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch gallery:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-pink-300 mb-4">
            📸 Our Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            A collection of our favorite moments and memories
          </p>
        </header>

        {photos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            <p className="text-xl">No photos yet. Start adding some memories! 💕</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {photo.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {photo.uploadedBy === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
                  </p>
                  {photo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <div className="max-w-5xl max-h-[90vh] w-full">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-b-2xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedPhoto.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  By {selectedPhoto.uploadedBy === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
                </p>
                {selectedPhoto.description && (
                  <p className="text-gray-700 dark:text-gray-200 mt-4">
                    {selectedPhoto.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
