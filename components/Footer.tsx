import Link from 'next/link';
import Logo from './Logo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blush-light mt-20">
      <div
        className="h-2"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Logo />
              <p className="font-script text-primary-dark text-3xl">Masyandra</p>
            </div>
            <p className="text-ink/70 text-sm max-w-xs mx-auto md:mx-0">
              a place to realize the world as ours and cherish every little moment.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-dark mb-3">
              Find your way
            </p>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-ink/80 hover:text-primary-dark transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-dark mb-3">
              Written by
            </p>
            <p className="text-sm text-ink/80">Ghalyndra 💙 &amp; Masyanda 🩷</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-dark/15 text-center">
          <p className="text-ink/60 text-xs tracking-wide">
            © {currentYear} Masyandra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
