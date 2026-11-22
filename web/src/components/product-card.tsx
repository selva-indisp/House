'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { discountPercent, formatPrice, type Product, productImage } from '@/lib/products';
import { BagIcon, HeartIcon } from './icons';
import { useStore } from './store';

export function Price({ product, large = false }: { product: Product; large?: boolean }) {
  const off = discountPercent(product);
  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-2.5 ${large ? 'text-2xl' : 'text-[0.95rem]'}`}
    >
      <span className="font-semibold text-forest-900">{formatPrice(product.price)}</span>
      {product.mrp && off ? (
        <>
          <span className={`text-muted line-through decoration-1 ${large ? 'text-lg' : 'text-sm'}`}>
            {formatPrice(product.mrp)}
          </span>
          <span className={`font-semibold text-forest-600 ${large ? 'text-base' : 'text-xs'}`}>
            {off}% off
          </span>
        </>
      ) : null}
    </div>
  );
}

export function WishButton({ slug, className = '' }: { slug: string; className?: string }) {
  const { isWished, toggleWish } = useStore();
  const on = isWished(slug);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault();
        toggleWish(slug);
      }}
      aria-pressed={on}
      aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`grid size-10 place-items-center rounded-full bg-ivory/90 text-forest-900 shadow-sm backdrop-blur transition-colors hover:bg-ivory ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={on ? 'on' : 'off'}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          className={on ? 'text-rose' : ''}
        >
          <HeartIcon size={18} filled={on} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { add } = useStore();
  const off = discountPercent(product);
  const needsSize = Boolean(product.sizes?.length);

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-mint-50">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0"
          aria-label={product.name}
        >
          <Image
            src={productImage(product.slug)}
            alt={product.name}
            fill
            unoptimized
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-[transform,opacity] duration-[1.2s] ease-silk group-hover:scale-[1.06] group-hover:opacity-0"
          />
          <Image
            src={productImage(product.slug, true)}
            alt=""
            aria-hidden
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="scale-[1.12] object-cover opacity-0 transition-[transform,opacity] duration-[1.2s] ease-silk group-hover:scale-100 group-hover:opacity-100"
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-forest-900 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ivory">
              {product.badge}
            </span>
          )}
          {off && (
            <span className="rounded-full bg-ivory px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-forest-800">
              −{off}%
            </span>
          )}
        </div>

        <WishButton slug={product.slug} className="absolute right-3 top-3" />

        {needsSize ? (
          <Link
            href={`/product/${product.slug}`}
            tabIndex={-1}
            className="absolute inset-x-3 bottom-3 hidden translate-y-4 items-center justify-center gap-2 rounded-full bg-ivory/95 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-forest-900 opacity-0 shadow-lg backdrop-blur transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100 md:flex"
          >
            Choose size
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => add(product.slug)}
            className="absolute inset-x-3 bottom-3 hidden translate-y-4 items-center justify-center gap-2 rounded-full bg-forest-900/95 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory opacity-0 shadow-lg backdrop-blur transition-all duration-500 ease-silk hover:bg-forest-700 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:flex"
          >
            <BagIcon size={15} /> Add to bag
          </button>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-forest-600">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-xl leading-snug text-forest-900">
            <Link href={`/product/${product.slug}`} className="link-draw">
              {product.name}
            </Link>
          </h3>
          <div className="mt-1.5">
            <Price product={product} />
          </div>
        </div>
        {!needsSize && (
          <button
            type="button"
            onClick={() => add(product.slug)}
            aria-label={`Add ${product.name} to bag`}
            className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 text-forest-900 md:hidden"
          >
            <BagIcon size={17} />
          </button>
        )}
      </div>
    </article>
  );
}
