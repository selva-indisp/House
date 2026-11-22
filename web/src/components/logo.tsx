import Link from 'next/link';

type Tone = 'dark' | 'light';

/**
 * The House of AB crest: a temple arch in deep emerald with a double gold-foil border,
 * a jewel at the apex and an interlaced AB monogram.
 */
export function Crest({ className = '', tone = 'dark' }: { className?: string; tone?: Tone }) {
  // Gradient ids are shared by every crest on the page; the definitions are identical.
  const id = `ab-crest-${tone}`;
  return (
    <svg viewBox="0 0 100 124" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF3C9" />
          <stop offset=".28" stopColor="#E7C56F" />
          <stop offset=".55" stopColor="#B98B2E" />
          <stop offset=".78" stopColor="#F2D88E" />
          <stop offset="1" stopColor="#8A6420" />
        </linearGradient>
        <linearGradient id={`${id}-field`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone === 'light' ? '#1E6B48' : '#1A5A3E'} />
          <stop offset="1" stopColor="#06201A" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="38%" r="55%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Arch body */}
      <path d="M8 120 V52 A42 42 0 0 1 92 52 V120 Z" fill={`url(#${id}-field)`} />
      <path d="M8 120 V52 A42 42 0 0 1 92 52 V120 Z" fill={`url(#${id}-glow)`} />
      {/* Double gold border */}
      <path
        d="M8 120 V52 A42 42 0 0 1 92 52 V120 Z"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="3.2"
      />
      <path
        d="M14.5 114 V53 A35.5 35.5 0 0 1 85.5 53 V114 Z"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="0.9"
      />
      {/* Base plinth */}
      <path d="M3 120 H97 V124 H3 Z" fill={`url(#${id}-gold)`} />

      {/* Apex jewel */}
      <path d="M50 2 L55.5 10 L50 18 L44.5 10 Z" fill={`url(#${id}-gold)`} />
      <circle cx="50" cy="10" r="2" fill="#0F3D2B" />

      {/* Scalloped inner crown */}
      <path
        d="M30 46 Q35 38 40 46 Q45 37 50 46 Q55 37 60 46 Q65 38 70 46"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="50" cy="35.5" r="1.6" fill={`url(#${id}-gold)`} />

      {/* Interlaced monogram: B carries a field-coloured stroke so it cuts through the A */}
      <text
        x="38.5"
        y="101"
        textAnchor="middle"
        fontFamily="var(--font-bodoni), 'Bodoni Moda', Didot, serif"
        fontWeight="700"
        fontSize="56"
        fill={`url(#${id}-gold)`}
      >
        A
      </text>
      <text
        x="62.5"
        y="101"
        textAnchor="middle"
        fontFamily="var(--font-bodoni), 'Bodoni Moda', Didot, serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="56"
        fill={`url(#${id}-gold)`}
        stroke="#0B2E21"
        strokeWidth="3"
        paintOrder="stroke"
      >
        B
      </text>
      {/* Ground line with flourish */}
      <path d="M26 108 H74" stroke={`url(#${id}-gold)`} strokeWidth="0.9" />
      <path d="M50 104.5 L53 108 L50 111.5 L47 108 Z" fill={`url(#${id}-gold)`} />
    </svg>
  );
}

export function Logo({
  tone = 'dark',
  compact = false,
  className = '',
}: {
  tone?: Tone;
  compact?: boolean;
  className?: string;
}) {
  const light = tone === 'light';
  return (
    <Link
      href="/"
      aria-label="House of AB, home"
      className={`group inline-flex items-center gap-2.5 sm:gap-4 ${className}`}
    >
      <Crest
        tone={tone}
        className={`shrink-0 drop-shadow-[0_6px_14px_rgba(8,36,26,0.28)] transition-all duration-700 ease-silk group-hover:-translate-y-0.5 group-hover:rotate-[-2deg] ${
          compact ? 'h-10 sm:h-11' : 'h-11 sm:h-[3.6rem]'
        }`}
      />
      <span className="flex flex-col items-center">
        <span
          className={`logo-wordmark whitespace-nowrap font-luxe font-bold uppercase leading-none tracking-[0.14em] transition-[font-size] duration-700 ease-silk ${
            light ? 'logo-wordmark-light' : ''
          } ${compact ? 'text-[1rem] sm:text-[1.45rem]' : 'text-[1.05rem] sm:text-[1.75rem]'}`}
        >
          House
          <span className="logo-of mx-[0.28em] font-display text-[1.08em] font-semibold normal-case italic tracking-normal">
            of
          </span>
          AB
        </span>
        <span
          className={`mt-1.5 flex items-center gap-2 whitespace-nowrap text-[0.5rem] font-semibold uppercase tracking-[0.32em] sm:text-[0.56rem] sm:tracking-[0.46em] ${
            light ? 'text-gold-soft' : 'text-forest-700'
          }`}
        >
          <span className="hidden h-px w-6 bg-gradient-to-r from-transparent to-gold sm:block" />
          Anbudan Bhuvi
          <span className="hidden h-px w-6 bg-gradient-to-l from-transparent to-gold sm:block" />
        </span>
      </span>
    </Link>
  );
}
