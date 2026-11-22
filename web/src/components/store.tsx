'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getProduct, type Product } from '@/lib/products';

export type CartLine = { slug: string; size?: string; qty: number };
export type CartItem = CartLine & { product: Product; key: string };

type Store = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (slug: string, opts?: { size?: string; qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  toast: (message: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const CART_KEY = 'hoab.cart.v1';
const WISH_KEY = 'hoab.wish.v1';

const lineKey = (slug: string, size?: string) => (size ? `${slug}::${size}` : slug);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); the store still works in memory.
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const hydrated = useRef(false);
  const toastId = useRef(0);

  useEffect(() => {
    setLines(read<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.slug)));
    setWishlist(read<string[]>(WISH_KEY, []).filter((s) => getProduct(s)));
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) write(CART_KEY, lines);
  }, [lines]);

  useEffect(() => {
    if (hydrated.current) write(WISH_KEY, wishlist);
  }, [wishlist]);

  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const add = useCallback<Store['add']>((slug, opts) => {
    const qty = opts?.qty ?? 1;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.size === opts?.size);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + qty, 10) } : l));
      }
      return [...prev, { slug, size: opts?.size, qty }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l.slug, l.size) !== key)
        : prev.map((l) => (lineKey(l.slug, l.size) === key ? { ...l, qty: Math.min(qty, 10) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l.slug, l.size) !== key));
  }, []);

  const toggleWish = useCallback(
    (slug: string) => {
      const has = wishlist.includes(slug);
      toast(has ? 'Removed from wishlist' : 'Saved to your wishlist');
      setWishlist((prev) => (has ? prev.filter((s) => s !== slug) : [...prev, slug]));
    },
    [toast, wishlist],
  );

  const value = useMemo<Store>(() => {
    const items = lines.flatMap((l) => {
      const product = getProduct(l.slug);
      return product ? [{ ...l, product, key: lineKey(l.slug, l.size) }] : [];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      add,
      setQty,
      remove,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      wishlist,
      toggleWish,
      isWished: (slug) => wishlist.includes(slug),
      toast,
    };
  }, [lines, wishlist, cartOpen, add, setQty, remove, toggleWish, toast]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-ivory shadow-[0_18px_40px_-12px_rgba(8,36,26,0.55)]"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
