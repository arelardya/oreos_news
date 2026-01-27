'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';
import Modal from '@/components/Modal';

interface GalleryPhoto {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  uploadedBy: string;
  createdAt: string;
  likes: number;
}

export default function GalleryManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<'ghalyndra' | 'masyanda' | 'admin' | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      router.push('/admin');
      return;
    }

    const user = localStorage.getItem('adminUser') as 'ghalyndra' | 'masyanda' | 'admin';
    setCurrentUser(user);

    fetchPhotos();
  }, [router]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        const galleryPhotos = data.filter((p: any) => p.type === 'gallery');
        setPhotos(galleryPhotos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData({ ...formData, imageUrl: url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      setModalState({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please provide a title and upload an image.',
        type: 'error',
      });
      return;
    }

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          uploadedBy: currentUser,
        }),
      });

      if (response.ok) {
        await fetchPhotos();
        setFormData({ title: '', description: '', imageUrl: '' });
        setModalState({
          isOpen: true,
          title: 'Success!',
          message: 'Your photo has been uploaded to the gallery! 📸',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Failed to upload photo. Please try again.',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchPhotos();
        setModalState({
          isOpen: true,
          title: 'Deleted',
          message: 'Photo removed from gallery.',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary dark:text-pink-300">
            📸 Gallery Manager
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              ← Back to Articles
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
              Upload Photo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter photo title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Add a description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image *
                </label>
                <ImageUpload
                  onUpload={(file) => handleImageUpload(file)}
                  currentImage={formData.imageUrl}
                  disabled={uploadingImage}
                />
              </div>

              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {uploadingImage ? 'Uploading...' : '📸 Upload to Gallery'}
              </button>
            </form>
          </div>

          {/* Photo List */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
              Your Photos ({photos.length})
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {photos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No photos uploaded yet. Start adding to your gallery! 📷
                </p>
              ) : (
                photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {photo.title}
                        </h3>
                        {photo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
