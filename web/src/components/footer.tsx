import Link from 'next/link';
import { categories } from '@/lib/products';
import { Logo } from './logo';
import { Newsletter } from './newsletter';

const HELP = [
  'Shipping & delivery',
  'Returns & exchanges',
  'Size guide',
  'Jewellery care',
  'Contact us',
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-ivory">
      <div className="pattern-bg pointer-events-none absolute inset-0 opacity-[0.08] invert" />
      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="mb-10" />
          <p className="eyebrow !text-gold">Letters, with love</p>
          <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight">
            New drops, styling notes and little surprises.
          </h2>
          <Newsletter />
        </div>
        <div>
          <h3 className="eyebrow !text-sage-300">Shop</h3>
          <ul className="mt-5 space-y-3">
            <li>
              <Link href="/shop" className="link-draw text-ivory/80 hover:text-ivory">
                Shop all
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="link-draw text-ivory/80 hover:text-ivory">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wishlist" className="link-draw text-ivory/80 hover:text-ivory">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow !text-sage-300">Help</h3>
          <ul className="mt-5 space-y-3">
            {HELP.map((label) => (
              <li key={label} className="text-ivory/80">
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow !text-sage-300">The house</h3>
          <ul className="mt-5 space-y-3 text-ivory/80">
            <li>
              <Link href="/#story" className="link-draw hover:text-ivory">
                Our story
              </Link>
            </li>
            <li>India</li>
            <li>hello@anbudanbhuvi.com</li>
            <li>Mon–Sat · 10am – 7pm</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-ivory/10">
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap text-center font-luxe text-[13vw] font-bold uppercase leading-[0.95] tracking-[0.06em] text-ivory/[0.05]"
        >
          House of AB
        </p>
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-ivory/50 sm:flex-row">
          <p>© 2026 House of AB · Anbudan Bhuvi. All rights reserved.</p>
          <p>Made with love (anbudan) in India.</p>
        </div>
      </div>
    </footer>
  );
}
