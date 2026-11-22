'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { type CategorySlug, categories, products } from '@/lib/products';
import { ProductCard } from './product-card';
import { SplitHeading } from './reveal';

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const;
type Sort = keyof typeof SORTS;

const EASE = [0.22, 1, 0.36, 1] as const;

export function ShopView({ category }: { category?: CategorySlug }) {
  const [sort, setSort] = useState<Sort>('featured');
  const [onSale, setOnSale] = useState(false);
  const current = categories.find((c) => c.slug === category);

  const list = useMemo(() => {
    let l = category ? products.filter((p) => p.category === category) : [...products];
    if (onSale) l = l.filter((p) => p.mrp && p.mrp > p.price);
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price);
    if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return l;
  }, [category, sort, onSale]);

  const pills = [{ slug: undefined, name: 'All' }, ...categories];

  return (
    <>
      <section className="relative overflow-hidden bg-mint-50">
        <div className="pattern-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-x relative py-16 text-center sm:py-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            {current ? current.tagline : 'The full collection'}
          </motion.p>
          <SplitHeading
            as="h1"
            immediate
            delay={0.1}
            text={current ? current.name : 'Shop all'}
            className="mt-4 font-display text-6xl text-forest-900 sm:text-8xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="mx-auto mt-5 max-w-xl text-muted"
          >
            {current
              ? current.description
              : 'Jewels, dresses and bags, handcrafted in small batches and finished with love.'}
          </motion.p>

          <LayoutGroup id="shop-pills">
            <nav
              aria-label="Categories"
              className="no-scrollbar mx-auto mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-ivory p-1.5 shadow-sm"
            >
              {pills.map((c) => {
                const active = c.slug === category;
                return (
                  <Link
                    key={c.name}
                    href={c.slug ? `/shop/${c.slug}` : '/shop'}
                    aria-current={active ? 'page' : undefined}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 sm:px-7 ${
                      active ? 'text-ivory' : 'text-forest-900 hover:text-forest-600'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="shop-pill"
                        className="absolute inset-0 rounded-full bg-forest-900"
                        initial={false}
                      />
                    )}
                    <span className="relative">{c.name}</span>
                  </Link>
                );
              })}
            </nav>
          </LayoutGroup>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forest-900/10 pb-6">
          <p className="text-sm text-muted">
            <motion.span
              key={list.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-forest-900"
            >
              {list.length}
            </motion.span>{' '}
            {list.length === 1 ? 'piece' : 'pieces'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOnSale((v) => !v)}
              aria-pressed={onSale}
              className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${
                onSale
                  ? 'border-forest-900 bg-forest-900 text-ivory'
                  : 'border-forest-900/20 text-forest-900'
              }`}
            >
              <span
                className={`relative h-4 w-7 rounded-full transition-colors duration-500 ${onSale ? 'bg-gold' : 'bg-forest-900/20'}`}
              >
                <motion.span
                  className="absolute top-0.5 size-3 rounded-full bg-ivory"
                  animate={{ left: onSale ? 14 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </span>
              On sale
            </button>
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none rounded-full border border-forest-900/20 bg-transparent py-2.5 pl-4 pr-10 text-xs font-semibold uppercase tracking-[0.16em] text-forest-900 focus:outline-none focus-visible:border-forest-700"
              >
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-forest-900">
                ▾
              </span>
            </label>
          </div>
        </div>

        <motion.div
          layout
          className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                transition={{ duration: 0.9, delay: Math.min(i, 8) * 0.06, ease: EASE }}
              >
                <ProductCard product={p} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <p className="py-24 text-center font-display text-3xl text-forest-900">
            Nothing on sale here right now. Check back soon!
          </p>
        )}
      </section>
    </>
  );
}
