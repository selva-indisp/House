export type CategorySlug = 'jewels' | 'dresses' | 'bags';

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  cover: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  mrp?: number;
  badge?: 'New' | 'Bestseller' | 'Limited';
  rating: number;
  reviews: number;
  colour: string;
  short: string;
  description: string;
  details: string[];
  sizes?: string[];
};

export const categories: Category[] = [
  {
    slug: 'jewels',
    name: 'Jewels',
    tagline: 'Heirlooms in the making',
    description:
      'Temple haarams, pearl jhumkas and emerald-kissed pieces, hand-finished in gold plating to be worn, gifted and passed on.',
    cover: 'meenakshi-temple-haaram',
  },
  {
    slug: 'dresses',
    name: 'Dresses',
    tagline: 'Draped in quiet grace',
    description:
      'Anarkalis, lehengas and easy kurta sets in breathable silks and cottons, cut for celebrations and slow Sundays alike.',
    cover: 'vanya-anarkali',
  },
  {
    slug: 'bags',
    name: 'Bags',
    tagline: 'Little luxuries to carry',
    description:
      'Embroidered potlis, pearl clutches and everyday totes, handcrafted to finish every look with a flourish.',
    cover: 'rani-embroidered-potli',
  },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const products: Product[] = [
  // Jewels
  {
    slug: 'meenakshi-temple-haaram',
    name: 'Meenakshi Temple Haaram',
    category: 'jewels',
    price: 4499,
    mrp: 5299,
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 212,
    colour: 'Antique gold & ruby',
    short: 'A two-layer temple haaram with a ruby drop pendant and pearl fringe.',
    description:
      'Inspired by the temple jewellery of Madurai, the Meenakshi haaram layers a fine bead chain over a longer strand of lotus charms, meeting at a ruby-red drop pendant finished with a fringe of pearls.',
    details: [
      'Brass base with 1-micron antique gold plating',
      'Hand-set synthetic rubies and shell pearls',
      'Long strand: 28 in · short strand: 18 in',
      'Adjustable dori closure',
    ],
  },
  {
    slug: 'emerald-dew-choker',
    name: 'Emerald Dew Choker',
    category: 'jewels',
    price: 2799,
    mrp: 3199,
    badge: 'New',
    rating: 4.8,
    reviews: 64,
    colour: 'Gold & emerald',
    short: 'A sculpted choker of alternating emerald and crystal stones.',
    description:
      'Our signature green, set close to the collarbone. Alternating emerald-toned and clear stones catch the light, while a soft fringe of pearls sways with every turn.',
    details: [
      'Brass base with high-polish gold plating',
      'Emerald-toned glass and cubic zirconia',
      'Fits 12–14 in with adjustable chain',
      'Nickel and lead free',
    ],
  },
  {
    slug: 'nila-sapphire-pendant',
    name: 'Nila Sapphire Pendant',
    category: 'jewels',
    price: 1899,
    rating: 4.7,
    reviews: 88,
    colour: 'Gold & sapphire blue',
    short: 'A sapphire-blue drop on a delicate bead chain, for everyday shine.',
    description:
      'Named after the moon, Nila is a quiet everyday piece: a marquise sapphire-blue stone framed in gold, finished with a single pearl and strung on a fine bead chain.',
    details: [
      '925 silver with 18k gold vermeil',
      'Lab-created sapphire',
      'Chain length 18 in with 2 in extender',
      'Comes in a gift-ready keepsake box',
    ],
  },
  {
    slug: 'mayil-pearl-jhumkas',
    name: 'Mayil Pearl Jhumkas',
    category: 'jewels',
    price: 1299,
    mrp: 1599,
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 341,
    colour: 'Gold, emerald & pearl',
    short: 'Classic bell jhumkas with a floral stud and pearl fringe.',
    description:
      'Light enough to dance in. A floral stud with an emerald centre leads to a hand-engraved bell, edged with a row of swinging pearls.',
    details: [
      'Lightweight hollow-cast brass, gold plated',
      'Shell pearls and emerald-toned stones',
      'Drop length 2.2 in · 11 g per earring',
      'Push-back closure',
    ],
  },
  {
    slug: 'kanchana-bangle-stack',
    name: 'Kanchana Bangle Stack',
    category: 'jewels',
    price: 1699,
    rating: 4.6,
    reviews: 97,
    colour: 'Gold & mint enamel',
    short: 'A set of four: two gold bands and two mint enamel bangles.',
    description:
      'Four bangles made to be worn together: two polished gold bands bookending a pair of mint enamel bangles studded with tiny stones.',
    details: [
      'Set of 4 bangles',
      'Gold-plated brass with hand-painted enamel',
      'Sizes 2.4, 2.6 and 2.8',
      'Wipe clean with a soft cloth',
    ],
    sizes: ['2.4', '2.6', '2.8'],
  },
  {
    slug: 'aadhya-emerald-ring',
    name: 'Aadhya Emerald Ring',
    category: 'jewels',
    price: 999,
    mrp: 1199,
    badge: 'New',
    rating: 4.7,
    reviews: 45,
    colour: 'Gold & emerald',
    short: 'A cocktail ring with a faceted emerald-cut stone and side accents.',
    description:
      'A statement in one gesture: a faceted emerald-toned centre stone held by four claws and flanked by tiny crystals on a polished band.',
    details: [
      'Adjustable band, fits sizes 10–16',
      'Gold-plated brass',
      'Emerald-toned cubic zirconia',
      'Anti-tarnish coating',
    ],
  },

  // Dresses
  {
    slug: 'vanya-anarkali',
    name: 'Vanya Emerald Anarkali',
    category: 'dresses',
    price: 5999,
    mrp: 7499,
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 158,
    colour: 'Emerald green',
    short: 'A floor-grazing anarkali with gold butta and a zari hem.',
    description:
      'Twenty-four kalis of soft chanderi fall from a fitted bodice into a full, swishing silhouette. Scattered gold butta and a broad zari hem make Vanya ready for every festive evening.',
    details: [
      'Chanderi silk with cotton lining',
      'Hand-embroidered zari hem and cuffs',
      'Length 54 in · three-quarter sleeves',
      'Dry clean only',
    ],
    sizes: SIZES,
  },
  {
    slug: 'mallika-bridal-lehenga',
    name: 'Mallika Ivory Lehenga Set',
    category: 'dresses',
    price: 14999,
    mrp: 17999,
    badge: 'Limited',
    rating: 5,
    reviews: 37,
    colour: 'Ivory with sage dupatta',
    short: 'An ivory lehenga with floral embroidery and a sage net dupatta.',
    description:
      'For the moments you will remember. An ivory raw-silk lehenga embroidered with tiny jasmine florals, paired with a cropped blouse and a sage-green net dupatta with a gold scalloped border.',
    details: [
      'Raw silk lehenga and blouse, soft net dupatta',
      'Hand-done resham and sequin work',
      'Can-can included · 4.5 m flare',
      'Made to order in 3 weeks · dry clean only',
    ],
    sizes: SIZES,
  },
  {
    slug: 'thendral-kurta-set',
    name: 'Thendral Mint Kurta Set',
    category: 'dresses',
    price: 3299,
    badge: 'New',
    rating: 4.7,
    reviews: 73,
    colour: 'Mint & white',
    short: 'A breezy mint kurta with a gold yoke and white straight pants.',
    description:
      'Named after the southern breeze. A straight mint kurta in pin-stripe cotton with a gold-edged yoke and side slits, paired with crisp white pants.',
    details: [
      '100% cotton, pre-washed',
      'Kurta length 42 in',
      'Pants with elasticated back waist',
      'Machine wash cold',
    ],
    sizes: SIZES,
  },
  {
    slug: 'poovai-tiered-maxi',
    name: 'Poovai Tiered Maxi',
    category: 'dresses',
    price: 3799,
    rating: 4.6,
    reviews: 59,
    colour: 'Blush pink',
    short: 'A three-tier blush maxi with a scalloped hem and tie waist.',
    description:
      'Soft as a flower, as the name says. Three flowing tiers of blush mul cotton printed with tiny florals, cinched with a white tie at the waist.',
    details: [
      'Mul cotton with slip lining',
      'Flutter sleeves · tie waist',
      'Length 52 in',
      'Hand wash cold',
    ],
    sizes: SIZES,
  },
  {
    slug: 'kadal-silk-kaftan',
    name: 'Kadal Silk Kaftan',
    category: 'dresses',
    price: 4199,
    mrp: 4999,
    rating: 4.8,
    reviews: 41,
    colour: 'Sea teal',
    short: 'A relaxed teal kaftan with a lattice print and gold trims.',
    description:
      'The colour of the sea at dusk. An easy, flowing kaftan in modal silk with a lattice print, gold-trimmed sleeves and a tie belt to shape the waist.',
    details: ['Modal silk', 'Free size, fits XS–XL', 'Removable tie belt', 'Gentle hand wash'],
  },

  // Bags
  {
    slug: 'rani-embroidered-potli',
    name: 'Rani Embroidered Potli',
    category: 'bags',
    price: 1499,
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 184,
    colour: 'Bottle green & gold',
    short: 'A velvet potli with a zardozi sunburst and pearl handle.',
    description:
      'Fit for a queen, and for your phone, lipstick and keys. Bottle-green velvet with a hand-worked zardozi sunburst, a beaded pearl handle and silk tassels.',
    details: [
      'Velvet with satin lining',
      'Hand zardozi embroidery',
      '8 × 10 in · drawstring closure',
      'Pearl wrist handle',
    ],
  },
  {
    slug: 'pavizham-pearl-clutch',
    name: 'Pavizham Pearl Clutch',
    category: 'bags',
    price: 2299,
    mrp: 2699,
    rating: 4.7,
    reviews: 66,
    colour: 'Ivory & gold',
    short: 'A quilted ivory clutch with a gold frame and crystal clasp.',
    description:
      'A structured envelope clutch in quilted ivory faux leather, outlined in gold with a crystal diamond clasp and a detachable chain.',
    details: [
      'Vegan leather with suede lining',
      '9 × 6 in',
      'Detachable 22 in gold chain',
      'Magnetic flap closure',
    ],
  },
  {
    slug: 'bhuvi-everyday-tote',
    name: 'Bhuvi Everyday Tote',
    category: 'bags',
    price: 1999,
    badge: 'New',
    rating: 4.8,
    reviews: 92,
    colour: 'Sage stripe',
    short: 'A roomy sage canvas tote with an AB monogram patch.',
    description:
      'Our everyday companion. Heavy cotton canvas in a soft sage stripe, with a stitched AB monogram, an inner zip pocket and a little gold charm.',
    details: [
      '14 oz cotton canvas',
      '15 × 14 × 5 in · fits a 14 in laptop',
      'Inner zip pocket',
      'Spot clean',
    ],
  },
  {
    slug: 'chandra-half-moon-bag',
    name: 'Chandra Half-Moon Bag',
    category: 'bags',
    price: 2499,
    rating: 4.6,
    reviews: 38,
    colour: 'Emerald',
    short: 'A half-moon shoulder bag in emerald with gold hardware.',
    description:
      'A crescent of emerald with gold hardware and topstitching. Sized for the essentials and shaped to sit neatly under the arm.',
    details: ['Vegan leather', '11 × 7 in', 'Adjustable shoulder strap', 'Twist-lock closure'],
  },
  {
    slug: 'malar-bucket-bag',
    name: 'Malar Bucket Bag',
    category: 'bags',
    price: 2199,
    mrp: 2599,
    rating: 4.7,
    reviews: 51,
    colour: 'Marigold',
    short: 'A marigold bucket bag with floral print and a tassel charm.',
    description:
      'Bright as a marigold garland. A soft bucket bag with a printed floral body, gold eyelets, a chain-link handle and a tassel charm.',
    details: [
      'Printed cotton with PU base',
      '10 × 11 in',
      'Drawstring with eyelets',
      'Detachable tassel charm',
    ],
  },
];

export function productImage(slug: string, alt = false): string {
  return `/products/${slug}${alt ? '-alt' : ''}.svg`;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsIn(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function discountPercent(p: Product): number | null {
  if (!p.mrp || p.mrp <= p.price) return null;
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function related(p: Product, count = 4): Product[] {
  const same = products.filter((x) => x.category === p.category && x.slug !== p.slug);
  const others = products.filter((x) => x.category !== p.category);
  return [...same, ...others].slice(0, count);
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(n: number): string {
  return inr.format(n);
}

export const FREE_SHIPPING_THRESHOLD = 1999;
