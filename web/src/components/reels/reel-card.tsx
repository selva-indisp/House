'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { getProduct } from '@/lib/products';
import { type Reel, reelDateLabel, reelPoster, reelRelativeLabel, reelVideo } from '@/lib/reels';
import {
  isReelPlayerOpen,
  onReelPlayerChange,
  prefersReducedMotion,
  useVideoProgress,
} from './use-reel-video';

export function PlayGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A 9:16 reel tile that plays muted while it is on screen. */
export function ReelCard({
  reel,
  onOpen,
  featured = false,
  hidden = false,
}: {
  reel: Reel;
  onOpen: () => void;
  featured?: boolean;
  /** True while this reel is open in the player, so the shared frame can fly out of it. */
  hidden?: boolean;
}) {
  const frame = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [label, setLabel] = useState(() => reelDateLabel(reel.publishedAt));
  const product = getProduct(reel.products[0]);

  useVideoProgress(video, bar, playing);

  useEffect(() => setLabel(reelRelativeLabel(reel.publishedAt, new Date())), [reel.publishedAt]);

  useEffect(() => {
    const el = frame.current;
    const v = video.current;
    if (!el || !v || prefersReducedMotion()) return;
    let visible = false;
    const sync = () => {
      if (visible && !isReelPlayerOpen()) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0.55;
        sync();
      },
      { threshold: [0, 0.55, 1] },
    );
    io.observe(el);
    const off = onReelPlayerChange(sync);
    return () => {
      io.disconnect();
      off();
    };
  }, []);

  return (
    <motion.button
      ref={frame}
      type="button"
      onClick={onOpen}
      layoutId={`reel-frame-${reel.slug}`}
      aria-label={`Play reel: ${reel.title}`}
      style={{ opacity: hidden ? 0 : 1 }}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[26px] bg-forest-900 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] outline-offset-4"
    >
      <video
        ref={video}
        src={reelVideo(reel.slug)}
        poster={reelPoster(reel.slug)}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.06]"
      />

      {/* Gold hairline frame */}
      <span className="pointer-events-none absolute inset-2 rounded-[20px] border border-gold/45 transition-all duration-700 ease-silk group-hover:inset-3 group-hover:border-gold/80" />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-forest-950/30" />

      {/* Top row */}
      <span className="absolute inset-x-5 top-5 flex items-center justify-between">
        <span className="flex items-center gap-2 rounded-full bg-forest-950/70 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ivory">
          {featured && <span className="size-1.5 animate-pulse rounded-full bg-gold" />}
          {label}
        </span>
        {featured && (
          <span className="rounded-full bg-gold px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-forest-950">
            New
          </span>
        )}
      </span>

      {/* Centre play glyph */}
      <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full border border-ivory/40 bg-ivory/15 text-ivory opacity-0 transition-all duration-500 ease-silk group-hover:scale-100 group-hover:opacity-100">
        <PlayGlyph size={22} />
      </span>

      {/* Bottom copy */}
      <span className="absolute inset-x-5 bottom-6 block">
        <span
          className={`block font-display leading-[1.05] text-ivory ${featured ? 'text-3xl' : 'text-[1.6rem]'}`}
        >
          {reel.title}
        </span>
        {product && (
          <span className="mt-3 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">
            <span className="h-px w-5 bg-gold" />
            Shop the look
          </span>
        )}
      </span>

      {/* Playback progress */}
      <span className="absolute inset-x-5 bottom-3 h-[2px] overflow-hidden rounded-full bg-ivory/15">
        <span
          ref={bar}
          style={{ transform: 'scaleX(0)' }}
          className="block h-full origin-left bg-gradient-to-r from-gold-soft to-gold"
        />
      </span>
    </motion.button>
  );
}
