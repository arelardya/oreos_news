import Link from 'next/link';

const links = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10" />
    ),
  },
  {
    href: '/gallery',
    label: 'Gallery',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 12l5-5 3 3 4-4 4 4" />
    ),
  },
  {
    href: '/qna',
    label: 'Daily Q&A',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.9 7.9 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M12 21s-7-4.35-9.5-8.8C.5 8.1 2.4 5 5.6 5c1.8 0 3.3 1 4.4 2.5C11.1 6 12.6 5 14.4 5 17.6 5 19.5 8.1 21.5 12.2 19 16.65 12 21 12 21z" />
    ),
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-cream py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="relative flex justify-between items-start">
          <div className="absolute top-6 left-0 right-0 h-px bg-primary/20" />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative z-10 flex flex-col items-center gap-2 flex-1"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-primary/30 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wide text-ink/70 group-hover:text-primary transition-colors text-center">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
