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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
          id: editingId || Date.now().toString(),
          title: formData.title,
          slug,
          content: formData.content || '',
          image: formData.imageUrl || formData.thumbnail || null,
          date: formData.date || new Date().toISOString().split('T')[0],
          author: currentUser === 'admin' ? (formData.author || 'ghalyndra') : currentUser,
          status,
          scheduledPublishAt: status === 'scheduled' ? scheduledPublishAt : undefined,
          likes: formData.likes || 0,
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

  const inputClass = "w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink";
  const labelClass = "block text-xs uppercase tracking-wide text-gray-500 mb-2";
  const userLabel = currentUser === 'admin' ? 'Master Admin' : currentUser === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷';
  const visibleArticles = articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
            Dashboard
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-primary">
            {userLabel}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => router.push('/admin/gallery')}
            className="text-xs uppercase tracking-wide px-5 py-2.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            📸 Manage Gallery
          </button>
          {(currentUser === 'ghalyndra' || currentUser === 'admin') && (
            <button
              onClick={() => router.push('/admin/crossword')}
              className="text-xs uppercase tracking-wide px-5 py-2.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              🧩 Manage Crosswords
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary-dark mb-1">
              {editingId ? 'Edit Article' : 'Add New Article'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              {editingId ? 'Editing' : 'Posting'} as {userLabel}
              {currentUser === 'admin' ? ' — pick who this article is credited to below' : ''}
            </p>

            <form id="article-form" onSubmit={handleSubmit} className="space-y-5">
              {currentUser === 'ghalyndra' && !editingId && (
                <div className="bg-blush-light border border-dashed border-primary/30 rounded-lg p-5">
                  <label className="block text-xs uppercase tracking-wide text-primary-dark/70 mb-3">
                    Publishing options
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="publishOption"
                        value="now"
                        checked={publishOption === 'now'}
                        onChange={(e) => setPublishOption('now')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-ink text-sm">Publish now</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="publishOption"
                        value="schedule"
                        checked={publishOption === 'schedule'}
                        onChange={(e) => setPublishOption('schedule')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-ink text-sm">Schedule for later</span>
                    </label>
                    {publishOption === 'schedule' && scheduledPublishAt && (
                      <div className="ml-7 mt-2 p-3 bg-white rounded-lg border border-primary/20">
                        <p className="text-xs text-gray-600">
                          Scheduled for: <strong className="text-ink">{new Date(scheduledPublishAt).toLocaleString()}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsDateTimePickerOpen(true)}
                          className="mt-1 text-xs text-primary hover:underline"
                        >
                          Change time
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className={inputClass}
                  placeholder="my-article-slug"
                />
              </div>

              <div>
                <label className={labelClass}>Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputClass}
                />
              </div>

              {currentUser === 'admin' && (
                <div>
                  <label className={labelClass}>Author *</label>
                  <select
                    required
                    value={formData.author || 'ghalyndra'}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value as 'ghalyndra' | 'masyanda' })}
                    className={inputClass}
                  >
                    <option value="ghalyndra">Ghalyndra 💙</option>
                    <option value="masyanda">Masyanda 🩷</option>
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Content *</label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={inputClass}
                  placeholder="Write your article content here..."
                />
              </div>

              <div>
                <label className={labelClass}>Main image</label>
                <ImageUpload
                  onUploadAction={(file: File) => handleImageUpload(file, 'image')}
                  currentUrl={formData.imageUrl}
                  disabled={uploadingImage}
                />
              </div>

              <div>
                <label className={labelClass}>Thumbnail image</label>
                <ImageUpload
                  onUploadAction={(file: File) => handleImageUpload(file, 'thumbnail')}
                  currentUrl={formData.thumbnail}
                  disabled={uploadingImage}
                />
              </div>

              <div>
                <label className={labelClass}>Video URL (optional)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className={inputClass}
                  placeholder="YouTube embed URL"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : editingId ? 'Update Article' : 'Add Article'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-white border border-primary/30 text-gray-600 py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white border border-primary/15 rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary-dark mb-4">Manage Articles</h2>

            {articles.length > 0 && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your articles..."
                className={`${inputClass} mb-4`}
              />
            )}

            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {articles.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No articles yet — fill out the form to publish your first one 💌
                </p>
              ) : visibleArticles.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No articles match "{searchQuery}"</p>
              ) : (
                visibleArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-dashed border-primary/25 rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-serif text-lg text-primary-dark flex-1">{article.title}</h3>
                      {article.status === 'scheduled' && (
                        <span className="px-2 py-0.5 bg-blush-light text-primary-dark text-[10px] uppercase tracking-wide rounded-full whitespace-nowrap">
                          Scheduled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{article.date}</p>
                    {article.status === 'scheduled' && article.scheduledPublishAt && (
                      <p className="text-xs text-primary mb-2">
                        Will publish: {new Date(article.scheduledPublishAt).toLocaleString()}
                      </p>
                    )}
                    {currentUser === 'admin' && article.author && (
                      <p className="text-xs text-gray-500 mb-3">
                        By: {article.author === 'ghalyndra' ? 'Ghalyndra 💙' : 'Masyanda 🩷'}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="px-4 py-1.5 border border-primary/30 text-primary rounded-full text-xs uppercase tracking-wide hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(article.id)}
                        className="px-4 py-1.5 border border-red-300 text-red-500 rounded-full text-xs uppercase tracking-wide hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
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
        title="Delete this article?"
        message="This can't be undone — the article will be removed for everyone."
        type="confirm"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />

      <DateTimePickerModal
        isOpen={isDateTimePickerOpen}
        onCloseAction={() => setIsDateTimePickerOpen(false)}
        onConfirmAction={handleScheduleConfirm}
        initialDateTime={scheduledPublishAt}
      />
    </div>
  );
}
