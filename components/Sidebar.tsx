'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

const baseNavItems = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10" />
    ),
  },
  {
    href: '/gallery',
    label: 'Gallery',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 12l5-5 3 3 4-4 4 4" />
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s-7-4.35-9.5-8.8C.5 8.1 2.4 5 5.6 5c1.8 0 3.3 1 4.4 2.5C11.1 6 12.6 5 14.4 5 17.6 5 19.5 8.1 21.5 12.2 19 16.65 12 21 12 21z" />
    ),
  },
];

const qnaItem = {
  href: '/qna',
  label: 'QnA',
  icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.9 7.9 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  ),
};

const dashboardItem = {
  href: '/admin/dashboard',
  label: 'Dashboard',
  icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h3v6H4V6zm0 8h5v6H6a2 2 0 01-2-2v-4zm7 6v-6h9v4a2 2 0 01-2 2h-7zm0-8V4h7a2 2 0 012 2v6h-9z" />
  ),
};

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const [loggedIn, setLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sync = () => setLoggedIn(Boolean(getAuthUser()));
    sync();
    window.addEventListener('authchange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('authchange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  const navItems = loggedIn
    ? [...baseNavItems.slice(0, 2), qnaItem, ...baseNavItems.slice(2), dashboardItem]
    : baseNavItems;

  return (
    <nav
      className={`fixed z-50 bg-cream/95 backdrop-blur-sm shadow-md border border-primary/10 flex gap-1 p-2 transition-[padding,gap,background-color] duration-300
        ${expanded ? 'rounded-2xl' : 'rounded-full'}
        bottom-4 left-1/2 -translate-x-1/2 ${expanded ? 'flex-col-reverse items-stretch' : 'flex-row items-center'}
        md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col md:items-stretch`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        className="flex items-center justify-center w-11 h-11 rounded-full text-primary hover:bg-primary/10 transition-colors shrink-0"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {expanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {navItems.map((item) => (
        <div key={item.href} className="relative group">
          <Link
            href={item.href}
            aria-label={item.label}
            className={`flex items-center gap-3 rounded-full transition-colors ${
              expanded ? 'px-3 py-2.5' : 'w-11 h-11 justify-center'
            } ${
              isActive(item.href)
                ? 'bg-primary text-white'
                : 'text-primary hover:bg-primary/10'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            {expanded && (
              <span className="text-xs uppercase tracking-wide whitespace-nowrap">{item.label}</span>
            )}
          </Link>
          {!expanded && (
            <span
              className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                bg-ink text-cream text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-md
                bottom-full mb-2 left-1/2 -translate-x-1/2
                md:bottom-auto md:mb-0 md:top-1/2 md:-translate-y-1/2 md:left-full md:ml-3 md:translate-x-0"
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
