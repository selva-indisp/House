'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, ChevronIcon } from '@/components/icons';
import { Reveal, SplitHeading } from '@/components/reveal';
import { reels as allReels, INSTAGRAM_URL, msUntilNextDrop, type Reel } from '@/lib/reels';
import { ReelCard } from './reel-card';
import { ReelPlayer } from './reel-player';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Live countdown to the next 6 PM IST drop. Renders a neutral label until mounted. */
export function NextDrop({ className = '' }: { className?: string }) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setMs(msUntilNextDrop(new Date()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  const parts =
    ms === null
      ? null
      : [Math.floor(ms / 3_600_000), Math.floor(ms / 60_000) % 60, Math.floor(ms / 1000) % 60].map(
          (n) => String(n).padStart(2, '0'),
        );

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-gold/35 bg-forest-900/80 py-2 pl-3 pr-4 ${className}`}
    >
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-gold" />
      </span>
      <span className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-ivory/70">
        Next drop in
      </span>
      <span className="font-luxe text-base font-bold tabular-nums tracking-[0.08em] text-gold-soft">
        {parts
          ? parts.map((p, i) => (
              <span key={['h', 'm', 's'][i]}>
                {i > 0 && <span className="mx-0.5 text-gold/60">:</span>}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={p}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="inline-block"
                  >
                    {p}
                  </motion.span>
                </AnimatePresence>
              </span>
            ))
          : '6 PM IST'}
      </span>
    </div>
  );
}

/** Opens the shared full-screen player for a list of reels. */
export function useReelPlayer(list: Reel[]) {
  const [open, setOpen] = useState<number | null>(null);
  const player = (
    <AnimatePresence>
      {open !== null && (
        <ReelPlayer
          key="player"
          reels={list}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </AnimatePresence>
  );
  return { open, setOpen, player };
}

export function ReelsRail() {
  const reels = allReels;
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const { open, setOpen, player } = useReelPlayer(reels);

  const update = () => {
    const el = rail.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  const scroll = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.75, behavior: 'smooth' });

  return (
    <section className="relative overflow-hidden bg-forest-950 py-24 text-ivory sm:py-32">
      <div className="pattern-bg pointer-events-none absolute inset-0 opacity-[0.06] invert" />
      <div className="pointer-events-none absolute -left-40 top-0 size-[680px] bg-[radial-gradient(closest-side,rgb(30_107_72/0.32),transparent)]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[560px] bg-[radial-gradient(closest-side,rgb(200_162_74/0.12),transparent)]" />

      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3 !text-gold">
                <span className="h-px w-10 bg-gold" /> Every evening on Instagram
              </p>
            </Reveal>
            <h2 className="mt-5 font-luxe text-5xl font-bold uppercase leading-[0.95] tracking-[0.04em] sm:text-7xl">
              <SplitHeading as="span" text="Fresh" className="inline" />{' '}
              <span className="font-display text-[1.1em] font-medium normal-case italic tracking-normal text-gold">
                at
              </span>{' '}
              <SplitHeading as="span" text={'6\u00A0PM'} delay={0.15} className="inline" />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-lg leading-relaxed text-ivory/70">
                A new look every day, styled in our studio. Watch the reels, then shop every piece
                you see.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.25} className="flex flex-wrap items-center gap-3">
            <NextDrop />
            <div className="flex gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => scroll(dir)}
                  disabled={dir === -1 ? edge.start : edge.end}
                  aria-label={dir === -1 ? 'Previous reels' : 'More reels'}
                  className="grid size-12 place-items-center rounded-full border border-ivory/20 text-ivory transition-all duration-500 hover:border-gold hover:bg-gold hover:text-forest-950 disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronIcon size={18} className={dir === -1 ? 'rotate-180' : ''} />
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <LayoutGroup id="reels">
        <div
          ref={rail}
          onScroll={update}
          className="no-scrollbar relative mt-14 flex snap-x snap-mandatory items-end gap-5 overflow-x-auto scroll-smooth px-5 pb-6 md:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]"
        >
          {reels.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 1, delay: Math.min(i, 5) * 0.08, ease: EASE }}
              className={`shrink-0 snap-start ${i === 0 ? 'w-[74vw] sm:w-[340px]' : 'w-[62vw] sm:w-[270px]'}`}
            >
              <ReelCard reel={r} featured={i === 0} hidden={open === i} onOpen={() => setOpen(i)} />
            </motion.div>
          ))}
          <Link
            href="/reels"
            className="group flex aspect-[9/16] w-[62vw] shrink-0 snap-start flex-col items-center justify-center gap-5 rounded-[26px] border border-dashed border-gold/40 text-center transition-colors duration-500 hover:border-gold hover:bg-forest-900/60 sm:w-[270px]"
          >
            <span className="grid size-16 place-items-center rounded-full border border-gold/50 text-gold transition-transform duration-700 ease-silk group-hover:translate-x-1 group-hover:bg-gold group-hover:text-forest-950">
              <ArrowIcon />
            </span>
            <span className="font-display text-3xl">
              All <span className="italic text-gold">6 PM</span>
              <br />
              reels
            </span>
          </Link>
        </div>
        {player}
      </LayoutGroup>

      <div className="container-x relative mt-8 flex justify-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw text-xs font-semibold uppercase tracking-[0.24em] text-ivory/70 hover:text-gold"
        >
          Follow Anbudan Bhuvi on Instagram
        </a>
      </div>
    </section>
  );
}
