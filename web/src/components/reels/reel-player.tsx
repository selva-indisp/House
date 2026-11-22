'use client';

import { useLenis } from 'lenis/react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BagIcon, CheckIcon, ChevronIcon, CloseIcon } from '@/components/icons';
import { useStore } from '@/components/store';
import { formatPrice, getProduct, type Product, productImage } from '@/lib/products';
import {
  INSTAGRAM_URL,
  type Reel,
  reelDateLabel,
  reelPoster,
  reelRelativeLabel,
  reelVideo,
} from '@/lib/reels';
import { PlayGlyph } from './reel-card';
import { setReelPlayerOpen } from './use-reel-video';

const EASE = [0.22, 1, 0.36, 1] as const;

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {muted ? (
        <path d="m16 9.5 5 5M21 9.5l-5 5" />
      ) : (
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
      )}
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShopItem({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add, toast } = useStore();
  const [added, setAdded] = useState(false);
  const needsSize = Boolean(product.sizes?.length);
  const onAdd = () => {
    // Stay in the player: confirm with a toast instead of opening the bag drawer behind it.
    add(product.slug, { openCart: false });
    toast(`${product.name} added to your bag`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl ${
        compact ? 'bg-forest-950/70 p-2 pr-3' : 'bg-ivory/[0.06] p-3 ring-1 ring-ivory/10'
      }`}
    >
      <Link
        href={`/product/${product.slug}`}
        className={`relative shrink-0 overflow-hidden rounded-xl bg-mint-100 ${compact ? 'size-12' : 'size-16'}`}
      >
        <Image
          src={productImage(product.slug)}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${product.slug}`}
          className={`block truncate font-display leading-tight text-ivory hover:text-gold-soft ${compact ? 'text-base' : 'text-lg'}`}
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-ivory/65">{formatPrice(product.price)}</p>
      </div>
      {needsSize ? (
        <Link
          href={`/product/${product.slug}`}
          className="shrink-0 rounded-full border border-gold/60 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-soft transition-colors hover:bg-gold hover:text-forest-950"
        >
          Size
        </Link>
      ) : (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onAdd}
          aria-label={`Add ${product.name} to bag`}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-forest-950 transition-transform hover:scale-105"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'done' : 'bag'}
              initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 22 }}
            >
              {added ? <CheckIcon size={17} /> : <BagIcon size={17} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  );
}

export function ReelPlayer({
  reels,
  index,
  onIndex,
  onClose,
}: {
  reels: Reel[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const reel = reels[index];
  const video = useRef<HTMLVideoElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [when, setWhen] = useState(() => reelDateLabel(reel.publishedAt));
  // Rendered only after a click, so window is available; full-bleed with square corners on phones.
  const [radius] = useState(() => (window.innerWidth >= 768 ? 30 : 0));
  const lenis = useLenis();
  // The frame shares a layout animation with the card it opened from. Once the viewer moves to
  // another reel the link is dropped, so new reels don't fly in from the grid behind the overlay.
  const [openedAt] = useState(index);
  const [moved, setMoved] = useState(false);
  if (!moved && index !== openedAt) setMoved(true);
  const linked = !moved && index === openedAt;
  const products = reel.products.map(getProduct).filter((p): p is Product => Boolean(p));

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = index + dir;
      if (next >= 0 && next < reels.length) onIndex(next);
    },
    [index, reels.length, onIndex],
  );

  // Lock page scroll while open.
  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    setReelPlayerOpen(true);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      setReelPlayerOpen(false);
    };
  }, [lenis]);

  useEffect(() => {
    setPaused(false);
    setWhen(reelRelativeLabel(reel.publishedAt, new Date()));
  }, [reel.publishedAt]);

  // Story-style progress: finished bars full, current one follows playback, upcoming empty.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      bars.current.forEach((b, i) => {
        if (!b) return;
        const v = video.current;
        const value = i < index ? 1 : i > index ? 0 : v?.duration ? v.currentTime / v.duration : 0;
        b.style.transform = `scaleX(${value})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key.toLowerCase() === 'm') setMuted((m) => !m);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => setPaused(true));
  }, [paused]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 140) onClose();
    else if (info.offset.x < -70) go(1);
    else if (info.offset.x > 70) go(-1);
  };

  const peek = (i: number, side: 'left' | 'right') => {
    const r = reels[i];
    if (!r) return null;
    return (
      <motion.button
        key={`${side}-${r.slug}`}
        type="button"
        onClick={() => onIndex(i)}
        aria-label={`${side === 'left' ? 'Previous' : 'Next'} reel: ${r.title}`}
        initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
        animate={{ opacity: 0.4, x: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ opacity: 0.75, scale: 1.02 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative hidden aspect-[9/16] h-[58vh] shrink-0 overflow-hidden rounded-[22px] xl:block"
      >
        <Image src={reelPoster(r.slug)} alt="" fill unoptimized className="object-cover" />
        <span className="absolute inset-0 bg-forest-950/30" />
      </motion.button>
    );
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Reel: ${reel.title}`}
      className="fixed inset-0 z-[95]"
    >
      <motion.div
        className="absolute inset-0 bg-forest-950/[0.97]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        onClick={onClose}
      >
        <div className="pattern-bg absolute inset-0 opacity-[0.07] invert" />
        <motion.div
          key={reel.slug}
          className="absolute inset-0 scale-110 opacity-40 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 1 }}
        >
          <Image src={reelPoster(reel.slug)} alt="" fill unoptimized className="object-cover" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute inset-x-0 top-0 z-20 hidden items-center justify-between px-8 py-6 text-ivory md:flex"
      >
        <p className="font-luxe text-lg font-bold uppercase tracking-[0.18em]">
          Fresh{' '}
          <span className="font-display normal-case italic tracking-normal text-gold">at</span> 6 PM
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reels"
          className="grid size-12 place-items-center rounded-full border border-ivory/25 transition-transform duration-500 ease-silk hover:rotate-90 hover:border-gold"
        >
          <CloseIcon />
        </button>
      </motion.div>

      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center gap-8 md:px-8">
        <div className="pointer-events-auto hidden w-[150px] justify-end overflow-hidden rounded-r-[22px] xl:flex">
          <AnimatePresence mode="popLayout">{peek(index - 1, 'left')}</AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous reel"
          className="pointer-events-auto hidden size-12 shrink-0 rotate-180 place-items-center rounded-full border border-ivory/25 text-ivory transition-all hover:border-gold hover:text-gold disabled:opacity-20 md:grid"
        >
          <ChevronIcon />
        </button>

        <motion.div
          layoutId={linked ? `reel-frame-${reel.slug}` : undefined}
          initial={linked ? undefined : false}
          exit={linked ? undefined : { opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.35}
          onDragEnd={onDragEnd}
          className="pointer-events-auto relative aspect-[9/16] h-full max-h-[100svh] w-full overflow-hidden bg-forest-900 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] md:h-[min(calc(100svh-9rem),880px)] md:w-auto md:rounded-[30px] md:ring-1 md:ring-gold/40"
          style={{ borderRadius: radius }}
        >
          <video
            key={reel.slug}
            ref={video}
            src={reelVideo(reel.slug)}
            poster={reelPoster(reel.slug)}
            autoPlay
            playsInline
            muted={muted}
            preload="auto"
            onEnded={() => (index < reels.length - 1 ? go(1) : video.current?.play())}
            className="absolute inset-0 size-full object-cover"
          />

          <button
            type="button"
            aria-label={paused ? 'Play' : 'Pause'}
            onClick={() => setPaused((p) => !p)}
            className="absolute inset-0 z-10 cursor-pointer"
          />

          <AnimatePresence>
            {paused && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/40 bg-forest-950/60 text-ivory"
              >
                <PlayGlyph size={28} />
              </motion.span>
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-forest-950/80 to-transparent px-4 pb-10 pt-4">
            <div className="flex gap-1.5">
              {reels.map((r, i) => (
                <span
                  key={r.slug}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-ivory/25"
                >
                  <span
                    ref={(el) => {
                      bars.current[i] = el;
                    }}
                    style={{ transform: 'scaleX(0)' }}
                    className="block h-full origin-left rounded-full bg-gradient-to-r from-gold-soft to-gold"
                  />
                </span>
              ))}
            </div>
            <div className="pointer-events-auto mt-4 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-forest-900 ring-1 ring-gold/70">
                <span className="font-luxe text-sm font-bold italic text-gold">AB</span>
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-sm font-semibold text-ivory">Anbudan Bhuvi</p>
                <p className="text-xs text-ivory/65">{when}</p>
              </div>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="grid size-10 place-items-center rounded-full bg-forest-950/60 text-ivory"
              >
                <SoundIcon muted={muted} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close reels"
                className="grid size-10 place-items-center rounded-full bg-forest-950/60 text-ivory md:hidden"
              >
                <CloseIcon size={18} />
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent px-5 pb-6 pt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={reel.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <h2 className="font-display text-3xl leading-tight text-ivory">{reel.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ivory/75">
                  {reel.caption}
                </p>
                <div className="pointer-events-auto mt-4 space-y-2 lg:hidden">
                  {products.slice(0, 1).map((p) => (
                    <ShopItem key={p.slug} product={p} compact />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === reels.length - 1}
          aria-label="Next reel"
          className="pointer-events-auto hidden size-12 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory transition-all hover:border-gold hover:text-gold disabled:opacity-20 md:grid"
        >
          <ChevronIcon />
        </button>

        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
          className="pointer-events-auto hidden w-[320px] shrink-0 text-ivory lg:block"
        >
          <p className="eyebrow !text-gold">Shop the look</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={reel.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mt-4 space-y-3"
            >
              {products.map((p) => (
                <ShopItem key={p.slug} product={p} />
              ))}
            </motion.div>
          </AnimatePresence>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-gold"
          >
            <InstagramIcon /> Watch on Instagram
          </a>
          {reels[index + 1] && (
            <button
              type="button"
              onClick={() => go(1)}
              className="group mt-8 flex w-full items-center gap-4 rounded-2xl border border-ivory/10 p-3 text-left transition-colors hover:border-gold/50"
            >
              <span className="relative aspect-[9/16] w-14 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={reelPoster(reels[index + 1].slug)}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold">
                  Up next
                </span>
                <span className="mt-1 block truncate font-display text-lg text-ivory">
                  {reels[index + 1].title}
                </span>
              </span>
            </button>
          )}
        </motion.aside>
      </div>
    </div>,
    document.body,
  );
}
