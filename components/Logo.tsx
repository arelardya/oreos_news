export default function Logo({
  className = '',
  size = 'sm',
}: {
  className?: string;
  size?: 'sm' | 'lg';
}) {
  if (size === 'lg') {
    return (
      <span
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full border border-dashed border-primary/60 text-primary font-serif italic font-semibold text-2xl leading-none bg-cream ${className}`}
      >
        M
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-cream font-serif font-semibold text-lg leading-none ${className}`}
    >
      M
    </span>
  );
}
