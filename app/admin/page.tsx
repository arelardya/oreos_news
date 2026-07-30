'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthUser, getAuthUser, AdminUser } from '@/lib/auth';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (getAuthUser()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if ((username === 'ghalyndra' && password === 'oreo') ||
        (username === 'masyanda' && password === 'chiro') ||
        (username === 'admin' && password === 'oreos2025')) {
      setAuthUser(username as AdminUser);
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-[80vh] bg-cream flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <div className="bg-white border border-primary/15 rounded-lg shadow-sm p-8">
          <p className="text-center text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
            Just for us
          </p>
          <h1 className="font-serif text-3xl text-primary text-center mb-8">
            Sign in
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none bg-cream text-ink"
                placeholder="Enter password"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide hover:bg-primary-dark transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
