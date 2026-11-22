'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Splits a heading into words that rise out of a mask one after another. */
export function SplitHeading({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const words = text.split(' ');
  const MotionTag = motion[Tag];
  const state = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '-10%' } };
  return (
    <MotionTag className={className} initial="hidden" {...state} aria-label={text}>
      {words.map((word, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: words can repeat; order is stable
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: {
                y: '0%',
                rotate: 0,
                transition: { duration: 1.1, ease: EASE, delay: delay + i * 0.07 },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Moves its child vertically as the section scrolls past, for depth. */
export function Parallax({
  children,
  speed = 80,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
