/**
 * "Fresh at 6 PM" reels.
 *
 * These are sample clips standing in for the daily Instagram videos. The footage is from
 * Mixkit (https://mixkit.co), free for commercial use under the Mixkit License, cropped to 9:16
 * and re-encoded for the web. Later this list can come from the bff, fed by the Instagram API,
 * with the same shape.
 */

export type Reel = {
  slug: string;
  title: string;
  caption: string;
  /** ISO timestamp of when the reel went live (6 PM IST). */
  publishedAt: string;
  /** Product slugs to show under "Shop the look". */
  products: string[];
};

/** Placeholder until the real handle is confirmed. */
export const INSTAGRAM_HANDLE = 'anbudanbhuvi';
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export const reels: Reel[] = [
  {
    slug: 'emerald-unveiled',
    title: 'The Emerald Edit, unveiled',
    caption:
      'Maang tikka, nath and a whisper of green. Tonight we unveil the Emerald Edit, made for brides who like their gold with a little drama.',
    publishedAt: '2026-11-23T18:00:00+05:30',
    products: ['emerald-dew-choker', 'mayil-pearl-jhumkas'],
  },
  {
    slug: 'maang-tikka-moments',
    title: 'Maang tikka moments',
    caption:
      'One piece, and the whole look comes together. Watch how a single temple tikka frames the face.',
    publishedAt: '2026-11-22T18:00:00+05:30',
    products: ['meenakshi-temple-haaram', 'mayil-pearl-jhumkas'],
  },
  {
    slug: 'hand-jewels',
    title: 'Hand jewels, hand-finished',
    caption:
      'Haathphool and stacked rings, every stone set by hand, styled tonight with our mint bangle stack.',
    publishedAt: '2026-11-21T18:00:00+05:30',
    products: ['kanchana-bangle-stack', 'aadhya-emerald-ring'],
  },
  {
    slug: 'festive-mornings',
    title: 'Festive mornings in mint',
    caption: 'Marigolds, diyas and a mint drape. Our easiest festive look, ready in five minutes.',
    publishedAt: '2026-11-20T18:00:00+05:30',
    products: ['thendral-kurta-set', 'rani-embroidered-potli'],
  },
  {
    slug: 'teal-and-gold',
    title: 'Teal drapes, gold details',
    caption:
      'Sea-green silk with antique gold at the throat. A pairing we will never get tired of.',
    publishedAt: '2026-11-19T18:00:00+05:30',
    products: ['vanya-anarkali', 'nila-sapphire-pendant'],
  },
  {
    slug: 'grace-in-motion',
    title: 'Grace in motion',
    caption: 'Jewellery that moves with you. Watch the jhumkas catch the light with every turn.',
    publishedAt: '2026-11-18T18:00:00+05:30',
    products: ['mallika-bridal-lehenga', 'mayil-pearl-jhumkas'],
  },
  {
    slug: 'pearls-poured-slowly',
    title: 'Pearls, poured slowly',
    caption: 'A little ASMR from the studio: sorting pearls for the Pavizham clutch.',
    publishedAt: '2026-11-17T18:00:00+05:30',
    products: ['pavizham-pearl-clutch', 'nila-sapphire-pendant'],
  },
  {
    slug: 'tote-day-out',
    title: 'A day out with the Bhuvi tote',
    caption: 'Market runs, coffee dates and everything in between. The tote that does it all.',
    publishedAt: '2026-11-16T18:00:00+05:30',
    products: ['bhuvi-everyday-tote', 'malar-bucket-bag'],
  },
];

export const reelVideo = (slug: string) => `/reels/${slug}.mp4`;
export const reelPoster = (slug: string) => `/reels/${slug}.jpg`;

const IST = 'Asia/Kolkata';
const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: IST });

/** Stable absolute label, safe to render on the server. */
export function reelDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    timeZone: IST,
    day: 'numeric',
    month: 'short',
  });
}

/** Relative label ("Today", "Yesterday", "Fri"), computed in the browser only. */
export function reelRelativeLabel(iso: string, now: Date): string {
  const d = new Date(iso);
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 86_400_000));
  if (dayKey(d) === today) return 'Today, 6 PM';
  if (dayKey(d) === yesterday) return 'Yesterday';
  const diffDays = (now.getTime() - d.getTime()) / 86_400_000;
  if (diffDays < 7) return d.toLocaleDateString('en-IN', { timeZone: IST, weekday: 'long' });
  return reelDateLabel(iso);
}

/** Milliseconds until the next 6 PM IST drop. */
export function msUntilNextDrop(now: Date): number {
  // IST is UTC+5:30 with no daylight saving, so 6 PM IST is 12:30 UTC.
  const next = new Date(now);
  next.setUTCHours(12, 30, 0, 0);
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
  return next.getTime() - now.getTime();
}
