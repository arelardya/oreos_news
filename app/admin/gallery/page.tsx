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
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
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

  const inputClass = "w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink";
  const labelClass = "block text-xs uppercase tracking-wide text-gray-500 mb-2";
  const userLabel = currentUser === 'admin' ? 'Master Admin' : currentUser === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷';

  return (
    <div className="bg-cream min-h-screen">
      <div
        className="h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
              {userLabel}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-primary">
              📸 Gallery
            </h1>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-xs uppercase tracking-wide px-5 py-2.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary-dark mb-6">
              Upload Photo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Photo title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                  placeholder="Enter photo title..."
                />
              </div>

              <div>
                <label className={labelClass}>Description (optional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Add a description..."
                />
              </div>

              <div>
                <label className={labelClass}>Upload image *</label>
                <ImageUpload
                  onUploadAction={(file) => handleImageUpload(file)}
                  currentUrl={formData.imageUrl}
                  disabled={uploadingImage}
                />
              </div>

              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full bg-primary text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? 'Uploading...' : 'Upload to Gallery'}
              </button>
            </form>
          </div>

          {/* Photo List */}
          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary-dark mb-6">
              Your Photos ({photos.length})
            </h2>

            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {photos.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No photos uploaded yet — start adding to your gallery 📷
                </p>
              ) : (
                photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="border border-dashed border-primary/25 rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-primary-dark truncate">
                          {photo.title}
                        </h3>
                        {photo.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setDeleteTarget(photo.id)}
                        className="self-start text-xs uppercase tracking-wide text-red-500 hover:text-red-600"
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

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete this photo?"
        message="This can't be undone — the photo will be removed from the gallery."
        type="confirm"
        onConfirm={() => deleteTarget !== null && handleDelete(deleteTarget)}
      />
    </div>
  );
}
