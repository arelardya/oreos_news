'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';
import ImageUpload from '@/components/ImageUpload';
import Modal from '@/components/Modal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<'ghalyndra' | 'masyanda' | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    date: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    thumbnail: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
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

    const user = localStorage.getItem('adminUser') as 'ghalyndra' | 'masyanda';
    setCurrentUser(user);

    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        // Filter articles to show only current user's articles
        const filteredArticles = data.filter((article: Article) => article.author === user);
        setArticles(filteredArticles);
      })
      .catch(err => console.error('Error fetching articles:', err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const handleImageUpload = async (file: File, type: 'image' | 'thumbnail') => {
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
        if (type === 'image') {
          setFormData({ ...formData, imageUrl: url });
        } else {
          setFormData({ ...formData, thumbnail: url });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? 'PUT' : 'POST';
    const url = '/api/articles';
    
    // Auto-generate slug if not provided
    const slug = formData.slug || formData.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          id: editingId || Date.now().toString(),
          date: formData.date || new Date().toISOString().split('T')[0],
          author: currentUser,
        }),
      });

      if (response.ok) {
        const allArticles = await fetch('/api/articles').then(res => res.json());
        const filteredArticles = allArticles.filter((article: Article) => article.author === currentUser);
        setArticles(filteredArticles);
        resetForm();
        setModalState({
          isOpen: true,
          title: editingId ? 'Article Updated!' : 'Article Created!',
          message: editingId 
            ? 'Your article has been successfully updated.' 
            : 'Your article has been created and is now live on the homepage!',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save article. Please try again.',
        type: 'error',
      });
    }
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData(article);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const allArticles = await fetch('/api/articles').then(res => res.json());
        const filteredArticles = allArticles.filter((article: Article) => article.author === currentUser);
        setArticles(filteredArticles);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      date: '',
      content: '',
      imageUrl: '',
      videoUrl: '',
      thumbnail: '',
    });
  };

  if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') !== 'true') {
    return null;
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary dark:text-pink-300">
            {currentUser === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'} Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
              {editingId ? 'Edit Article' : 'Add New Article'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="my-article-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Write your article content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Image
                </label>
                <ImageUpload
                  onUploadAction={(file: File) => handleImageUpload(file, 'image')}
                  currentUrl={formData.imageUrl}
                  disabled={uploadingImage}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <ImageUpload
                  onUploadAction={(file: File) => handleImageUpload(file, 'thumbnail')}
                  currentUrl={formData.thumbnail}
                  disabled={uploadingImage}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="YouTube embed URL"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 bg-primary dark:bg-primary-dark text-white py-3 px-6 rounded-full font-medium hover:bg-primary-dark dark:hover:bg-accent hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : editingId ? 'Update Article' : 'Add Article'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-full font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">Manage Articles</h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {articles.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No articles yet</p>
              ) : (
                articles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-primary dark:text-pink-300 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{article.date}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="px-4 py-2 bg-accent dark:bg-pink-300 text-white rounded-full text-sm font-medium hover:scale-105 transition-transform"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:scale-105 transition-transform"
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
