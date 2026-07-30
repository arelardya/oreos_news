'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser, clearAuthUser, AdminUser } from '@/lib/auth';

const LABEL: Record<AdminUser, string> = {
  ghalyndra: 'Ghalyndra 💙',
  masyanda: 'Masyanda 🩷',
  admin: 'Admin',
};

export default function AuthButton() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sync = () => setUser(getAuthUser());
    sync();
    window.addEventListener('authchange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('authchange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    router.push('/');
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      {user ? (
        <div className="flex items-center gap-3 bg-cream/95 backdrop-blur-sm border border-primary/15 shadow-md rounded-full pl-5 pr-2 py-2">
          <span className="text-sm text-ink/70 hidden sm:inline">{LABEL[user]}</span>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-wide text-primary bg-white border border-primary/30 rounded-full px-4 py-2 hover:bg-primary hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-4">
          <Link
            href="/admin"
            className="text-xs uppercase tracking-wide text-primary bg-cream/95 backdrop-blur-sm border border-primary/30 shadow-md rounded-full px-6 py-3 hover:bg-primary hover:text-white transition-colors"
          >
            Login
          </Link>
          <div className="relative w-36 -rotate-3">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/60 border border-white/80 shadow-sm rotate-1" />
            <div className="bg-pink-200 shadow-md px-3 py-3 text-[11px] text-ink/80 leading-snug font-medium">
              to add articles and see our mutual questions, login yaa! 🩷
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
