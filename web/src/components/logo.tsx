import Link from 'next/link';

export function Logo({
  tone = 'dark',
  className = '',
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const color = tone === 'light' ? 'text-ivory' : 'text-forest-900';
  return (
    <Link
      href="/"
      aria-label="House of AB home"
      className={`group inline-flex flex-col items-center ${color} ${className}`}
    >
      <span className="font-display text-[1.7rem] leading-none tracking-[0.08em] sm:text-[2rem]">
        HOUSE{' '}
        <span className="italic text-gold transition-colors duration-500 group-hover:text-current">
          of
        </span>{' '}
        AB
      </span>
      <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.5em] opacity-70">
        Anbudan Bhuvi
      </span>
    </Link>
  );
}
