'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { FREE_SHIPPING_THRESHOLD, formatPrice, productImage } from '@/lib/products';
import { ArrowIcon, BagIcon, CloseIcon, MinusIcon, PlusIcon } from './icons';
import { useStore } from './store';

export function CartDrawer() {
  const { items, subtotal, count, cartOpen, closeCart, setQty, remove, toast } = useStore();
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [cartOpen, closeCart]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            className="fixed inset-0 z-[60] cursor-default bg-forest-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[440px] flex-col bg-ivory shadow-[-30px_0_80px_-30px_rgba(8,36,26,0.45)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 34 }}
          >
            <header className="flex items-center justify-between border-b border-forest-900/10 px-6 py-5">
              <div>
                <p className="eyebrow">Your bag</p>
                <p className="font-display text-2xl text-forest-900">
                  {count} {count === 1 ? 'piece' : 'pieces'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="grid size-11 place-items-center rounded-full border border-forest-900/15 text-forest-900 transition-transform duration-500 ease-silk hover:rotate-90"
              >
                <CloseIcon />
              </button>
            </header>

            <div className="border-b border-forest-900/10 px-6 py-4">
              <p className="text-sm text-muted">
                {remaining > 0 ? (
                  <>
                    You are{' '}
                    <span className="font-semibold text-forest-800">{formatPrice(remaining)}</span>{' '}
                    away from free shipping
                  </>
                ) : (
                  <span className="font-semibold text-forest-800">Yay! Your order ships free.</span>
                )}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mint-100">
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-forest-700 to-forest-500"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2" data-lenis-prevent>
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center"
                >
                  <div className="grid size-20 place-items-center rounded-full bg-mint-100 text-forest-700">
                    <BagIcon size={30} />
                  </div>
                  <p className="font-display text-3xl text-forest-900">Your bag is waiting</p>
                  <p className="max-w-xs text-sm text-muted">
                    Fill it with something made with love.
                  </p>
                  <Link href="/shop" onClick={closeCart} className="btn btn-primary mt-2">
                    Start shopping
                  </Link>
                </motion.div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.08 + i * 0.05 } }}
                        exit={{
                          opacity: 0,
                          x: 60,
                          height: 0,
                          paddingBlock: 0,
                          transition: { duration: 0.35 },
                        }}
                        className="flex gap-4 overflow-hidden border-b border-forest-900/10 py-5"
                      >
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-mint-50"
                        >
                          <Image
                            src={productImage(item.slug)}
                            alt={item.product.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeCart}
                                className="font-display text-lg leading-tight text-forest-900"
                              >
                                {item.product.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-muted">
                                {item.product.colour}
                                {item.size ? ` · Size ${item.size}` : ''}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-forest-900">
                              {formatPrice(item.product.price * item.qty)}
                            </p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-forest-900/15">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                className="grid size-9 place-items-center text-forest-900"
                                onClick={() => setQty(item.key, item.qty - 1)}
                              >
                                <MinusIcon size={14} />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                className="grid size-9 place-items-center text-forest-900"
                                onClick={() => setQty(item.key, item.qty + 1)}
                              >
                                <PlusIcon size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(item.key)}
                              className="link-draw text-xs uppercase tracking-[0.18em] text-muted hover:text-forest-900"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-forest-900/10 bg-mint-50 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0.4, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-2xl text-forest-900"
                  >
                    {formatPrice(subtotal)}
                  </motion.span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Taxes included. Shipping calculated at checkout.
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-4 w-full"
                  onClick={() => toast('Checkout is coming soon. Thank you for your love!')}
                >
                  Checkout <ArrowIcon size={16} />
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
