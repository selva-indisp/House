'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowIcon, SparkIcon } from '@/components/icons';
import { SplitHeading } from '@/components/reveal';
import { productImage } from '@/lib/products';

const EASE = [0.22, 1, 0.36, 1] as const;

function Arch({
  slug,
  className,
  delay,
  y,
}: {
  slug: string;
  className: string;
  delay: number;
  y: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div style={{ y }} className={`absolute ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 24px 24px)', scale: 1.08 }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 24px 24px)', scale: 1 }}
        transition={{ duration: 1.5, delay, ease: EASE }}
        className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-3xl bg-mint-100 shadow-[0_40px_80px_-40px_rgba(8,36,26,0.55)]"
      >
        <Link
          href={`/product/${slug}`}
          aria-label="View product"
          className="group relative block h-full w-full"
        >
          <Image
            src={productImage(slug)}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-105"
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const yA = useTransform(smooth, [0, 1], [0, -140]);
  const yB = useTransform(smooth, [0, 1], [0, -60]);
  const yC = useTransform(smooth, [0, 1], [0, -220]);
  const textY = useTransform(smooth, [0, 1], [0, 120]);
  const fade = useTransform(smooth, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory">
      <div className="pattern-bg absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
      <div className="absolute -left-40 top-20 size-[520px] rounded-full bg-mint-100 blur-3xl" />
      <div className="absolute -right-20 bottom-0 size-[420px] rounded-full bg-sage-200/70 blur-3xl" />

      <div className="container-x relative grid min-h-[calc(100svh-7rem)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-10">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="h-px w-10 bg-forest-700" /> Anbudan · with love
          </motion.p>
          <SplitHeading
            as="h1"
            immediate
            delay={0.2}
            text="Grace, woven with love."
            className="mt-6 font-display text-[3.4rem] leading-[0.95] font-medium text-forest-900 sm:text-7xl lg:text-[6.2rem]"
          />
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: EASE }}
            className="mt-7 max-w-md text-lg leading-relaxed text-muted"
          >
            Handcrafted jewels, dresses and bags from the House of Anbudan Bhuvi. Each piece is made
            in small batches and finished by hand, for the moments you will keep forever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link href="/shop" className="btn btn-primary">
              Shop the collection <ArrowIcon size={16} />
            </Link>
            <Link href="/shop/jewels" className="btn btn-outline">
              Explore jewels
            </Link>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-forest-900/10 pt-6"
          >
            {[
              ['4.9★', 'Avg. rating'],
              ['12k+', 'Happy homes'],
              ['100%', 'Handcrafted'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl text-forest-900">{n}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[640px]">
          <Arch
            slug="vanya-anarkali"
            className="left-[2%] top-[14%] h-[62%] w-[44%]"
            delay={0.35}
            y={yA}
          />
          <Arch
            slug="meenakshi-temple-haaram"
            className="right-[2%] top-0 h-[70%] w-[50%]"
            delay={0.5}
            y={yB}
          />
          <Arch
            slug="rani-embroidered-potli"
            className="bottom-0 left-[30%] h-[42%] w-[36%]"
            delay={0.7}
            y={yC}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
            className="absolute -left-2 bottom-[8%] z-10 size-32 sm:size-36"
          >
            <svg viewBox="0 0 200 200" className="size-full animate-spin-slow" aria-hidden="true">
              <defs>
                <path id="ring" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
              </defs>
              <circle cx="100" cy="100" r="98" fill="#0f3d2b" />
              <text fill="#fdfcf7" fontSize="15.5" letterSpacing="5" fontWeight="600">
                <textPath href="#ring">HANDCRAFTED · WITH LOVE · HOUSE OF AB · </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center text-gold">
              <SparkIcon size={30} />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: EASE }}
            className="absolute bottom-[18%] right-0 z-10 animate-float rounded-2xl bg-ivory/90 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(8,36,26,0.5)] backdrop-blur"
          >
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-forest-600">
              Just in
            </p>
            <p className="font-display text-lg text-forest-900">The Wedding Edit</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-muted lg:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-forest-900/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-forest-700"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
