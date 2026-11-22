'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { categories } from '@/lib/products';
import { BagIcon, CloseIcon, HeartIcon, MenuIcon } from './icons';
import { Logo } from './logo';
import { useStore } from './store';

const ANNOUNCEMENTS = [
  'Free shipping on orders above ₹1,999',
  'Handcrafted with love in India',
  'New arrivals every Friday',
  'Easy 7-day returns',
  'Gift wrapping on every order',
];

const NAV = [
  { href: '/shop', label: 'Shop all' },
  ...categories.map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
  { href: '/#story', label: 'Our story' },
];

function Announcement() {
  const row = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="overflow-hidden bg-forest-950 text-ivory">
      <div className="flex w-max animate-marquee [--marquee-duration:38s] hover:[animation-play-state:paused]">
        {row.map((text, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated static list for a seamless loop
            key={i}
            aria-hidden={i >= ANNOUNCEMENTS.length}
            className="flex items-center gap-6 px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.28em]"
          >
            {text}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CountBadge({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 18 }}
          className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-gold text-[0.62rem] font-bold text-forest-950"
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count, openCart, wishlist } = useStore();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !menuOpen);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the menu whenever the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <Announcement />
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          scrolled
            ? 'bg-ivory/85 shadow-[0_10px_30px_-20px_rgba(8,36,26,0.4)] backdrop-blur-xl'
            : 'bg-ivory'
        }`}
      >
        <div
          className={`container-x grid grid-cols-[1fr_auto_1fr] items-center transition-[padding] duration-500 ${
            scrolled ? 'py-3' : 'py-5'
          }`}
        >
          <div className="flex items-center gap-8">
            <button
              type="button"
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full text-forest-900 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon size={22} />
            </button>
            <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
              {NAV.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="link-draw text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-forest-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo compact={scrolled} />

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
              href="/#story"
              className="link-draw mr-4 hidden text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-forest-900 lg:inline"
            >
              Our story
            </Link>
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative grid size-11 place-items-center rounded-full text-forest-900 transition-colors hover:bg-mint-100"
            >
              <HeartIcon size={21} />
              <CountBadge n={wishlist.length} />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open bag, ${count} items`}
              className="relative grid size-11 place-items-center rounded-full text-forest-900 transition-colors hover:bg-mint-100"
            >
              <BagIcon size={21} />
              <CountBadge n={count} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-forest-900 text-ivory lg:hidden"
            initial={{ clipPath: 'circle(0% at 32px 32px)' }}
            animate={{ clipPath: 'circle(150% at 32px 32px)' }}
            exit={{ clipPath: 'circle(0% at 32px 32px)' }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo tone="light" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid size-11 place-items-center rounded-full border border-ivory/20"
              >
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    className="font-display text-5xl leading-tight"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="px-8 pb-10 text-sm text-ivory/60">Anbudan · with love, from Bhuvi</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
