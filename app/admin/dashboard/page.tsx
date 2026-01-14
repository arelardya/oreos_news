'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';
import ImageUpload from '@/components/ImageUpload';
import Modal from '@/components/Modal';
import DateTimePickerModal from '@/components/DateTimePickerModal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<'ghalyndra' | 'masyanda' | 'admin' | null>(null);
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
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [scheduledPublishAt, setScheduledPublishAt] = useState<string | undefined>(undefined);
  const [publishOption, setPublishOption] = useState<'now' | 'schedule'>('now');

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      router.push('/admin');
      return;
    }

    const user = localStorage.getItem('adminUser') as 'ghalyndra' | 'masyanda' | 'admin';
    setCurrentUser(user);

    fetch('/api/articles?includeScheduled=true')
      .then(res => res.json())
      .then(data => {
        // Master admin sees all articles, others see only their own
        if (user === 'admin') {
          setArticles(data);
        } else {
          const filteredArticles = data.filter((article: Article) => article.author === user);
          setArticles(filteredArticles);
        }
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
    
    // If ghalyndra wants to schedule, open the date picker
    if (currentUser === 'ghalyndra' && publishOption === 'schedule' && !scheduledPublishAt && !editingId) {
      setIsDateTimePickerOpen(true);
      return;
    }
    
    const method = editingId ? 'PUT' : 'POST';
    const url = '/api/articles';
    
    // Auto-generate slug if not provided
    const slug = formData.slug || formData.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
    
    // Determine article status
    let status: 'draft' | 'scheduled' | 'published' = 'published';
    if (currentUser === 'ghalyndra' && publishOption === 'schedule' && scheduledPublishAt) {
      status = 'scheduled';
    }
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          id: editingId || Date.now().toString(),
          date: formData.date || new Date().toISOString().split('T')[0],
          author: currentUser === 'admin' ? formData.author : currentUser,
          status,
          scheduledPublishAt: status === 'scheduled' ? scheduledPublishAt : undefined,
        }),
      });

      if (response.ok) {
        const allArticles = await fetch('/api/articles?includeScheduled=true').then(res => res.json());
        const filteredArticles = allArticles.filter((article: Article) => article.author === currentUser);
        setArticles(filteredArticles);
        resetForm();
        
        let message = '';
        if (editingId) {
          message = 'Your article has been successfully updated.';
        } else if (status === 'scheduled') {
          const scheduleDate = new Date(scheduledPublishAt!).toLocaleString();
          message = `Your article has been scheduled and will be published on ${scheduleDate}!`;
        } else {
          message = 'Your article has been created and is now live on the homepage!';
        }
        
        setModalState({
          isOpen: true,
          title: editingId ? 'Article Updated!' : status === 'scheduled' ? 'Article Scheduled!' : 'Article Created!',
          message,
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
        const allArticles = await fetch('/api/articles?includeScheduled=true').then(res => res.json());
        // Master admin sees all, others see only their own
        if (currentUser === 'admin') {
          setArticles(allArticles);
        } else {
          const filteredArticles = allArticles.filter((article: Article) => article.author === currentUser);
          setArticles(filteredArticles);
        }
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
    setScheduledPublishAt(undefined);
    setPublishOption('now');
  };

  const handleScheduleConfirm = (dateTime: string) => {
    setScheduledPublishAt(dateTime);
    // Automatically submit the form after setting the date
    setTimeout(() => {
      document.getElementById('article-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }, 100);
  };

  if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') !== 'true') {
    return null;
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary dark:text-pink-300">
            {currentUser === 'admin' ? 'Master Admin Dashboard' : 
             currentUser === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'} Dashboard
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
            
            <form id="article-form" onSubmit={handleSubmit} className="space-y-4">
              {currentUser === 'ghalyndra' && !editingId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6 mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    📅 Publishing Options *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="publishOption"
                        value="now"
                        checked={publishOption === 'now'}
                        onChange={(e) => setPublishOption('now')}
                        className="w-5 h-5 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-900 dark:text-white font-medium">Publish Now</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="publishOption"
                        value="schedule"
                        checked={publishOption === 'schedule'}
                        onChange={(e) => setPublishOption('schedule')}
                        className="w-5 h-5 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-900 dark:text-white font-medium">Schedule for Later</span>
                    </label>
                    {publishOption === 'schedule' && scheduledPublishAt && (
                      <div className="ml-8 mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-300 dark:border-blue-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          ⏰ Scheduled for: <strong>{new Date(scheduledPublishAt).toLocaleString()}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsDateTimePickerOpen(true)}
                          className="mt-2 text-sm text-primary dark:text-pink-300 hover:underline"
                        >
                          Change Time
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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

              {currentUser === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author *
                  </label>
                  <select
                    required
                    value={formData.author || 'ghalyndra'}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value as 'ghalyndra' | 'masyanda' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="ghalyndra">Ghalyndra 💙</option>
                    <option value="masyanda">Masyanda 🩷</option>
                  </select>
                </div>
              )}

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
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-primary dark:text-pink-300 flex-1">{article.title}</h3>
                      {article.status === 'scheduled' && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full font-medium">
                          ⏰ Scheduled
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{article.date}</p>
                    {article.status === 'scheduled' && article.scheduledPublishAt && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                        Will publish: {new Date(article.scheduledPublishAt).toLocaleString()}
                      </p>
                    )}
                    {currentUser === 'admin' && article.author && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        By: {article.author === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
                      </p>
                    )}
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
      
      <DateTimePickerModal
        isOpen={isDateTimePickerOpen}
        onClose={() => setIsDateTimePickerOpen(false)}
        onConfirm={handleScheduleConfirm}
        initialDateTime={scheduledPublishAt}
      />
    </div>
  );
}
