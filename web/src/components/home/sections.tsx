'use client';

import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowIcon,
  ChevronIcon,
  HandIcon,
  ReturnIcon,
  ShieldIcon,
  SparkIcon,
  StarIcon,
  TruckIcon,
} from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import { Parallax, Reveal, SplitHeading } from '@/components/reveal';
import { type CategorySlug, categories, productImage, products, productsIn } from '@/lib/products';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- Marquee of big words ---------------- */

export function WordMarquee() {
  const words = ['Jewels', 'Dresses', 'Bags', 'Made with love', 'Anbudan'];
  const row = [...words, ...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-forest-900/10 bg-ivory py-6">
      <div className="flex w-max animate-marquee [--marquee-duration:55s]">
        {row.map((w, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated static list for a seamless loop
            key={i}
            aria-hidden={i >= words.length}
            className={`flex items-center gap-10 px-5 font-display text-5xl italic sm:text-6xl ${
              i % 2
                ? 'text-transparent [-webkit-text-stroke:1px_var(--color-forest-700)]'
                : 'text-forest-900'
            }`}
          >
            {w}
            <SparkIcon size={22} className="not-italic text-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Category trio ---------------- */

export function CategoryTrio() {
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <p className="eyebrow">Shop by category</p>
          </Reveal>
          <SplitHeading
            text="Three houses, one heart."
            className="mt-4 max-w-xl font-display text-5xl leading-[1.02] text-forest-900 sm:text-6xl"
          />
        </div>
        <Reveal delay={0.2}>
          <Link
            href="/shop"
            className="link-draw text-sm font-semibold uppercase tracking-[0.2em] text-forest-900"
          >
            View everything
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 80, clipPath: 'inset(18% 0% 0% 0% round 28px)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.2, delay: i * 0.14, ease: EASE }}
            className={i === 1 ? 'md:mt-16' : ''}
          >
            <Link
              href={`/shop/${c.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] bg-mint-100"
            >
              <Image
                src={productImage(c.cover)}
                alt={c.name}
                fill
                unoptimized
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1.6s] ease-silk group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-950/10 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-ivory">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-soft">
                  0{i + 1} · {productsIn(c.slug).length} pieces
                </p>
                <h3 className="mt-2 font-display text-5xl">{c.name}</h3>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-silk group-hover:grid-rows-[1fr]">
                  <p className="overflow-hidden text-sm leading-relaxed text-ivory/80">
                    <span className="block pt-3">{c.tagline}</span>
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]">
                  Explore
                  <span className="grid size-8 place-items-center rounded-full border border-ivory/40 transition-all duration-500 group-hover:translate-x-1 group-hover:bg-ivory group-hover:text-forest-900">
                    <ArrowIcon size={14} />
                  </span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Tabbed products ---------------- */

const TABS: { id: CategorySlug | 'all'; label: string }[] = [
  { id: 'all', label: 'Loved most' },
  { id: 'jewels', label: 'Jewels' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'bags', label: 'Bags' },
];

export function CraftedTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('all');
  const list =
    tab === 'all'
      ? products.filter((p) => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 8)
      : productsIn(tab).slice(0, 8);

  return (
    <section className="bg-mint-50 py-24 sm:py-32">
      <div className="container-x">
        <div className="text-center">
          <Reveal>
            <p className="eyebrow">Crafted with love</p>
          </Reveal>
          <SplitHeading
            text="Pieces everyone is falling for"
            className="mx-auto mt-4 max-w-2xl font-display text-5xl leading-[1.02] text-forest-900 sm:text-6xl"
          />
        </div>

        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <LayoutGroup id="crafted-tabs">
            <div
              role="tablist"
              className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-ivory p-1.5 shadow-sm"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 sm:px-7 ${
                    tab === t.id ? 'text-ivory' : 'text-forest-900 hover:text-forest-600'
                  }`}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-forest-900"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div
          layout
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 text-center">
          <Link href={tab === 'all' ? '/shop' : `/shop/${tab}`} className="btn btn-outline">
            View all {tab === 'all' ? 'pieces' : tab} <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Wedding edit banner ---------------- */

export function EditBanner() {
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="relative grid overflow-hidden rounded-[36px] bg-forest-900 text-ivory lg:grid-cols-2">
        <div className="pattern-bg pointer-events-none absolute inset-0 opacity-[0.12] invert" />
        <div className="relative z-10 flex flex-col justify-center p-10 sm:p-16">
          <Reveal>
            <p className="eyebrow !text-gold">The Wedding Edit · 2026</p>
          </Reveal>
          <SplitHeading
            text="For the days you will tell stories about."
            className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md leading-relaxed text-ivory/75">
              Ivory lehengas, temple haarams and pearl-handled potlis, curated for brides,
              bridesmaids and every cousin with a playlist.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/product/mallika-bridal-lehenga" className="btn btn-light">
                Shop the edit <ArrowIcon size={16} />
              </Link>
              <Link
                href="/shop/jewels"
                className="btn border border-ivory/30 text-ivory before:bg-ivory/10"
              >
                Bridal jewels
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="relative grid min-h-[480px] grid-cols-2 gap-4 p-4 sm:p-6">
          <Parallax speed={50} className="overflow-hidden rounded-[26px]">
            <div className="relative h-[115%] w-full">
              <Image
                src={productImage('mallika-bridal-lehenga')}
                alt="Mallika ivory lehenga set"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </Parallax>
          <div className="grid gap-4">
            <Parallax speed={-40} className="overflow-hidden rounded-[26px]">
              <div className="relative h-[120%] w-full">
                <Image
                  src={productImage('mayil-pearl-jhumkas', true)}
                  alt="Mayil pearl jhumkas"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </Parallax>
            <Parallax speed={30} className="overflow-hidden rounded-[26px]">
              <div className="relative h-[120%] w-full">
                <Image
                  src={productImage('pavizham-pearl-clutch')}
                  alt="Pavizham pearl clutch"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- New arrivals rail ---------------- */

export function NewArrivals() {
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const list = [...products].reverse();

  const update = () => {
    const el = rail.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="overflow-hidden py-24 sm:py-28">
      <div className="container-x flex items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="eyebrow">Fresh from the studio</p>
          </Reveal>
          <SplitHeading
            text="New arrivals"
            className="mt-4 font-display text-5xl text-forest-900 sm:text-6xl"
          />
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scroll(dir)}
              disabled={dir === -1 ? edge.start : edge.end}
              aria-label={dir === -1 ? 'Previous' : 'Next'}
              className="grid size-12 place-items-center rounded-full border border-forest-900/20 text-forest-900 transition-all duration-500 hover:bg-forest-900 hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronIcon size={18} className={dir === -1 ? 'rotate-180' : ''} />
            </button>
          ))}
        </div>
      </div>
      <div
        ref={rail}
        onScroll={update}
        data-lenis-prevent-wheel
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 md:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]"
      >
        {list.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: Math.min(i, 5) * 0.06, ease: EASE }}
            className="w-[68vw] shrink-0 snap-start sm:w-[300px]"
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Story with scroll-lit words ---------------- */

const STORY =
  'Anbudan means “with love” in Tamil, the way the warmest letters are signed. Anbudan, Bhuvi. House of AB carries that signature into every jewel we polish, every hem we stitch and every bag we pack, so that what reaches you feels less like a parcel and more like a letter from home.';

const STORY_WORDS = STORY.split(' ').map((text, n) => ({ text, id: `${n}-${text}` }));

function LitWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export function Story() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  return (
    <section id="story" className="relative scroll-mt-24 overflow-hidden bg-ivory py-28 sm:py-40">
      <div className="pattern-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[32px] bg-mint-100 shadow-[0_40px_80px_-40px_rgba(8,36,26,0.5)]">
            <Parallax speed={40} className="absolute inset-0 scale-110">
              <div className="relative h-full w-full">
                <Image
                  src={productImage('emerald-dew-choker')}
                  alt="Emerald Dew choker"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </Parallax>
          </div>
          <div className="absolute -bottom-6 -right-4 rounded-2xl bg-forest-900 px-6 py-5 text-ivory shadow-xl">
            <p className="font-display text-4xl italic">Anbudan,</p>
            <p className="font-display text-2xl text-gold-soft">Bhuvi</p>
          </div>
        </Reveal>
        <div>
          <p className="eyebrow">Our story</p>
          <p
            ref={ref}
            className="mt-6 font-display text-[2rem] leading-[1.25] text-forest-900 sm:text-[2.6rem]"
          >
            {STORY_WORDS.map((w, i) => (
              <LitWord
                key={w.id}
                word={w.text}
                progress={scrollYProgress}
                range={[i / STORY_WORDS.length, (i + 1) / STORY_WORDS.length]}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Promises ---------------- */

const PROMISES = [
  {
    icon: HandIcon,
    title: 'Handcrafted',
    text: 'Made in small batches by artisans we know by name.',
  },
  {
    icon: TruckIcon,
    title: 'Free shipping',
    text: 'On every order above ₹1,999, anywhere in India.',
  },
  {
    icon: ReturnIcon,
    title: '7-day returns',
    text: 'Changed your mind? Send it back, no questions asked.',
  },
  {
    icon: ShieldIcon,
    title: 'Secure payments',
    text: 'UPI, cards and netbanking, encrypted end to end.',
  },
];

export function Promises() {
  return (
    <section className="border-y border-forest-900/10 bg-mint-50">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4">
        {PROMISES.map(({ icon: Icon, title, text }, i) => (
          <Reveal
            key={title}
            delay={i * 0.08}
            className="group flex flex-col items-start gap-4 sm:flex-row"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ivory text-forest-700 shadow-sm transition-transform duration-700 ease-silk group-hover:-translate-y-1 group-hover:rotate-6">
              <Icon size={24} />
            </span>
            <div>
              <h3 className="font-display text-2xl text-forest-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

const REVIEWS = [
  {
    quote:
      'The Mayil jhumkas are so light I forgot I was wearing them, until everyone at the wedding asked where they were from.',
    name: 'Priya R.',
    place: 'Coimbatore',
    item: 'mayil-pearl-jhumkas',
  },
  {
    quote:
      'The Vanya anarkali fits like it was stitched for me. The zari hem catches the light in every photo.',
    name: 'Anjali M.',
    place: 'Bengaluru',
    item: 'vanya-anarkali',
  },
  {
    quote:
      'It arrived wrapped like a gift with a handwritten note. The potli is even prettier in person.',
    name: 'Fathima S.',
    place: 'Chennai',
    item: 'rani-embroidered-potli',
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % REVIEWS.length), 6000);
    return () => window.clearInterval(t);
  }, []);
  const r = REVIEWS[i];

  return (
    <section className="container-x py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="relative mx-auto aspect-square w-full max-w-md">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={r.item}
              initial={{ opacity: 0, scale: 1.08, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotate: 3 }}
              transition={{ duration: 1, ease: EASE }}
              className="absolute inset-0 overflow-hidden rounded-full bg-mint-100"
            >
              <Image
                src={productImage(r.item, true)}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <div>
          <p className="eyebrow">Letters back to us</p>
          <div className="mt-4 flex gap-1 text-gold">
            {[0, 1, 2, 3, 4].map((s) => (
              <StarIcon key={s} size={18} />
            ))}
          </div>
          <div className="relative mt-6 min-h-[15rem] sm:min-h-[12rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <blockquote className="font-display text-3xl leading-snug text-forest-900 sm:text-4xl">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm uppercase tracking-[0.2em] text-muted">
                  {r.name} · {r.place}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex gap-2">
            {REVIEWS.map((rev, n) => (
              <button
                key={rev.name}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show review ${n + 1}`}
                className="relative h-1.5 w-12 overflow-hidden rounded-full bg-forest-900/15"
              >
                {n === i && (
                  <motion.span
                    key={`${i}-bar`}
                    className="absolute inset-0 origin-left rounded-full bg-forest-700"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
