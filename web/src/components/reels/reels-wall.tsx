'use client';

import { LayoutGroup, motion } from 'motion/react';
import { SplitHeading } from '@/components/reveal';
import { INSTAGRAM_URL, reels } from '@/lib/reels';
import { ReelCard } from './reel-card';
import { NextDrop, useReelPlayer } from './reels-rail';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The /reels page: every reel in a staggered masonry-like grid, opening the same player. */
export function ReelsWall() {
  const { open, setOpen, player } = useReelPlayer(reels);

  return (
    <section className="relative min-h-screen overflow-hidden bg-forest-950 pb-28 text-ivory">
      <div className="pattern-bg pointer-events-none absolute inset-0 opacity-[0.06] invert" />
      <div className="pointer-events-none absolute -right-40 top-10 size-[720px] bg-[radial-gradient(closest-side,rgb(30_107_72/0.28),transparent)]" />

      <div className="container-x relative pt-16 text-center sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="eyebrow !text-gold"
        >
          The 6 PM diaries
        </motion.p>
        <h1 className="mt-5 font-luxe text-6xl font-bold uppercase leading-[0.95] tracking-[0.04em] sm:text-8xl">
          <SplitHeading as="span" immediate text="Fresh" className="inline" />{' '}
          <span className="font-display text-[1.1em] font-medium normal-case italic tracking-normal text-gold">
            at
          </span>{' '}
          <SplitHeading as="span" immediate delay={0.15} text={'6\u00A0PM'} className="inline" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="mx-auto mt-6 max-w-xl leading-relaxed text-ivory/70"
        >
          Every evening at 6 PM, a new look from the House of AB studio goes live on Instagram.
          Catch up on all of them here and shop the pieces you love.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <NextDrop />
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border border-gold/50 text-gold-soft before:bg-gold hover:text-forest-950"
          >
            Follow on Instagram
          </a>
        </motion.div>
      </div>

      <LayoutGroup id="reels-wall">
        <div className="container-x relative mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {reels.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 1, delay: (i % 4) * 0.08, ease: EASE }}
              className={i % 4 === 1 || i % 4 === 3 ? 'lg:mt-16' : ''}
            >
              <ReelCard reel={r} featured={i === 0} hidden={open === i} onOpen={() => setOpen(i)} />
            </motion.div>
          ))}
        </div>
        {player}
      </LayoutGroup>
    </section>
  );
}
