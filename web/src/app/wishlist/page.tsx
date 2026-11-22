'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { HeartIcon } from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import { SplitHeading } from '@/components/reveal';
import { useStore } from '@/components/store';
import { getProduct, type Product } from '@/lib/products';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter((p): p is Product => Boolean(p));

  return (
    <section className="container-x min-h-[60vh] py-16 sm:py-24">
      <div className="text-center">
        <p className="eyebrow">Saved with love</p>
        <SplitHeading
          as="h1"
          immediate
          text="Your wishlist"
          className="mt-4 font-display text-6xl text-forest-900 sm:text-7xl"
        />
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4 text-center"
        >
          <span className="grid size-20 place-items-center rounded-full bg-mint-100 text-forest-700">
            <HeartIcon size={30} />
          </span>
          <p className="text-muted">Tap the heart on any piece to keep it here for later.</p>
          <Link href="/shop" className="btn btn-primary mt-2">
            Discover pieces
          </Link>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
