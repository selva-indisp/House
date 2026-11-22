'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { getCategory, type Product, productImage } from '@/lib/products';
import { BagIcon, CheckIcon, MinusIcon, PlusIcon, ReturnIcon, StarIcon, TruckIcon } from './icons';
import { Price, WishButton } from './product-card';
import { useStore } from './store';

const EASE = [0.22, 1, 0.36, 1] as const;

function Gallery({ product }: { product: Product }) {
  const views = [productImage(product.slug), productImage(product.slug, true)];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frame = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col-reverse gap-4 lg:sticky lg:top-28 lg:flex-row">
      <div className="flex gap-3 lg:flex-col">
        {views.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show view ${i + 1}`}
            aria-pressed={active === i}
            className={`relative aspect-[4/5] w-20 overflow-hidden rounded-xl bg-mint-50 transition-all duration-500 ${
              active === i
                ? 'ring-2 ring-forest-700 ring-offset-2 ring-offset-ivory'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={src} alt="" fill unoptimized className="object-cover" />
          </button>
        ))}
      </div>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: hover zoom is a mouse-only visual enhancement */}
      <div
        ref={frame}
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-[28px] bg-mint-50"
        onMouseMove={(e) => {
          const r = frame.current?.getBoundingClientRect();
          if (!r) return;
          setZoom({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Image
              src={views[active]}
              alt={product.name}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-silk"
              style={{
                transform: zoom ? 'scale(1.8)' : 'scale(1)',
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : '50% 50%',
              }}
            />
          </motion.div>
        </AnimatePresence>
        <WishButton slug={product.slug} className="absolute right-4 top-4 size-12" />
      </div>
    </div>
  );
}

function Accordion({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-forest-900/10 border-y border-forest-900/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left text-xs font-semibold uppercase tracking-[0.22em] text-forest-900"
            >
              {item.title}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <PlusIcon size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm leading-relaxed text-muted">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useStore();
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const category = getCategory(product.category);

  const onAdd = () => {
    if (product.sizes?.length && !size) {
      setNeedSize(true);
      return;
    }
    add(product.slug, { size, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.1 + i * 0.07, ease: EASE },
  });

  return (
    <section className="container-x grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <Gallery product={product} />
      </motion.div>

      <div className="lg:py-6">
        <motion.nav
          {...stagger(0)}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted"
        >
          <Link href="/" className="link-draw hover:text-forest-900">
            Home
          </Link>
          <span>/</span>
          <Link href={`/shop/${product.category}`} className="link-draw hover:text-forest-900">
            {category?.name}
          </Link>
        </motion.nav>

        <motion.h1
          {...stagger(1)}
          className="mt-5 font-display text-5xl leading-[1.02] text-forest-900 sm:text-6xl"
        >
          {product.name}
        </motion.h1>

        <motion.div {...stagger(2)} className="mt-4 flex items-center gap-3 text-sm text-muted">
          <span className="flex gap-0.5 text-gold">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon
                key={s}
                size={15}
                className={s <= Math.round(product.rating) ? '' : 'opacity-25'}
              />
            ))}
          </span>
          {product.rating.toFixed(1)} · {product.reviews} reviews
        </motion.div>

        <motion.div {...stagger(3)} className="mt-6">
          <Price product={product} large />
          <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
        </motion.div>

        <motion.p {...stagger(4)} className="mt-6 leading-relaxed text-muted">
          {product.description}
        </motion.p>

        <motion.p {...stagger(5)} className="mt-6 text-sm">
          <span className="text-muted">Colour: </span>
          <span className="font-semibold text-forest-900">{product.colour}</span>
        </motion.p>

        {product.sizes && (
          <motion.div {...stagger(6)} className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-900">
                Size
              </p>
              <AnimatePresence>
                {needSize && !size && (
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-rose"
                  >
                    Please choose a size
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              className="mt-3 flex flex-wrap gap-2"
              animate={needSize && !size ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
            >
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={`relative h-12 min-w-14 rounded-full border px-4 text-sm font-semibold transition-colors duration-300 ${
                    size === s
                      ? 'border-forest-900 text-ivory'
                      : 'border-forest-900/20 text-forest-900 hover:border-forest-900'
                  }`}
                >
                  {size === s && (
                    <motion.span
                      layoutId={`size-${product.slug}`}
                      className="absolute inset-0 rounded-full bg-forest-900"
                      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                    />
                  )}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}

        <motion.div {...stagger(7)} className="mt-8 flex gap-3">
          <div className="flex items-center rounded-full border border-forest-900/20">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-12 place-items-center text-forest-900"
            >
              <MinusIcon size={16} />
            </button>
            <span className="relative w-6 overflow-hidden text-center tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={qty}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  className="inline-block"
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="grid size-12 place-items-center text-forest-900"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <button type="button" onClick={onAdd} className="btn btn-primary flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckIcon size={18} /> Added to bag
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <BagIcon size={18} /> Add to bag
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        <motion.ul
          {...stagger(8)}
          className="mt-6 grid gap-3 rounded-2xl bg-mint-50 p-5 text-sm text-forest-900"
        >
          <li className="flex items-center gap-3">
            <TruckIcon size={20} className="text-forest-600" /> Free shipping above ₹1,999 · ships
            in 2–4 days
          </li>
          <li className="flex items-center gap-3">
            <ReturnIcon size={20} className="text-forest-600" /> Easy 7-day returns and exchanges
          </li>
        </motion.ul>

        <motion.div {...stagger(9)} className="mt-8">
          <Accordion
            items={[
              {
                title: 'Details',
                body: (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {product.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'Care',
                body:
                  product.category === 'jewels'
                    ? 'Keep away from perfume, water and sweat. Wipe with a soft dry cloth after wear and store in the pouch provided.'
                    : product.category === 'dresses'
                      ? 'Follow the wash instructions on the label. Store folded in a muslin cloth, away from direct sunlight.'
                      : 'Store stuffed in its dust bag to keep the shape. Spot clean gently with a dry cloth.',
              },
              {
                title: 'Shipping & returns',
                body: 'Orders ship within 2–4 working days, gift-wrapped. Returns are accepted within 7 days of delivery for unused items with tags.',
              },
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}
