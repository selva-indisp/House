// Generates the sample product illustrations in public/products (SVG, 4:5).
// Run: node scripts/generate-product-art.mjs
// Each product gets a main view and an alternate "detail" view (zoomed, different backdrop).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'products');
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 1000;

const BACKDROPS = {
  mint: ['#F1F7F2', '#D6E8DC'],
  ivory: ['#FCFAF4', '#EEE7D7'],
  sage: ['#EEF3EC', '#D2DFD0'],
  blush: ['#FBF4F0', '#EEDDD4'],
  fern: ['#E6F0E8', '#BFD6C6'],
};

const GOLD = ['#FBEFC4', '#E2C26E', '#B8913A', '#7E5E1F'];

const r = (n) => Math.round(n * 10) / 10;

/** Points along a quadratic bezier. */
function quad(p0, p1, p2, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
    pts.push([r(x), r(y)]);
  }
  return pts;
}

function sparkle(x, y, s, o = 0.9) {
  return `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z" fill="#fff" opacity="${o}"/>`;
}

function commonDefs(bg) {
  return `
  <radialGradient id="bg" cx="50%" cy="38%" r="75%">
    <stop offset="0" stop-color="${bg[0]}"/>
    <stop offset="1" stop-color="${bg[1]}"/>
  </radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GOLD[0]}"/>
    <stop offset=".35" stop-color="${GOLD[1]}"/>
    <stop offset=".7" stop-color="${GOLD[2]}"/>
    <stop offset="1" stop-color="${GOLD[3]}"/>
  </linearGradient>
  <radialGradient id="goldBall" cx="35%" cy="30%" r="70%">
    <stop offset="0" stop-color="#FFF6D6"/>
    <stop offset=".45" stop-color="${GOLD[1]}"/>
    <stop offset="1" stop-color="${GOLD[3]}"/>
  </radialGradient>
  <radialGradient id="pearl" cx="35%" cy="30%" r="70%">
    <stop offset="0" stop-color="#FFFFFF"/>
    <stop offset=".6" stop-color="#F1ECE2"/>
    <stop offset="1" stop-color="#C9BFAE"/>
  </radialGradient>
  <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#1D3A2C" stop-opacity=".28"/>
    <stop offset="1" stop-color="#1D3A2C" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#173326" flood-opacity=".22"/>
  </filter>`;
}

function gemDefs(id, c) {
  return `<radialGradient id="${id}" cx="35%" cy="30%" r="75%">
    <stop offset="0" stop-color="${c[0]}"/>
    <stop offset=".55" stop-color="${c[1]}"/>
    <stop offset="1" stop-color="${c[2]}"/>
  </radialGradient>`;
}

function fabricDefs(id, c, motif = 'butta') {
  const motifs = {
    butta: `<circle cx="14" cy="14" r="2.4" fill="${c.accent}" opacity=".75"/><circle cx="42" cy="42" r="2.4" fill="${c.accent}" opacity=".75"/><path d="M42 8 q3 6 0 10 q-3 -4 0 -10z" fill="${c.accent}" opacity=".5"/>`,
    floral: `<g fill="${c.accent}" opacity=".55"><circle cx="28" cy="28" r="3"/><circle cx="28" cy="20" r="3"/><circle cx="28" cy="36" r="3"/><circle cx="20" cy="28" r="3"/><circle cx="36" cy="28" r="3"/></g><circle cx="28" cy="28" r="2" fill="${c.base[0]}"/>`,
    stripe: `<rect x="0" y="0" width="6" height="56" fill="${c.accent}" opacity=".22"/><rect x="28" y="0" width="2" height="56" fill="${c.accent}" opacity=".3"/>`,
    lattice: `<path d="M0 28 L28 0 L56 28 L28 56Z" fill="none" stroke="${c.accent}" stroke-width="1.4" opacity=".45"/><circle cx="28" cy="28" r="2.2" fill="${c.accent}" opacity=".7"/>`,
  };
  return `<linearGradient id="${id}Base" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c.base[0]}"/>
    <stop offset="1" stop-color="${c.base[1]}"/>
  </linearGradient>
  <pattern id="${id}Motif" width="56" height="56" patternUnits="userSpaceOnUse">${motifs[motif]}</pattern>
  <linearGradient id="${id}Shade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity=".22"/>
    <stop offset=".25" stop-color="#000" stop-opacity="0"/>
    <stop offset=".7" stop-color="#fff" stop-opacity=".08"/>
    <stop offset="1" stop-color="#000" stop-opacity=".25"/>
  </linearGradient>`;
}

/** Fill a path with base gradient + motif + shading. */
function fabric(id, d, extra = '') {
  return `<path d="${d}" fill="url(#${id}Base)" ${extra}/><path d="${d}" fill="url(#${id}Motif)"/><path d="${d}" fill="url(#${id}Shade)"/>`;
}

function stage({ arch = true, floorY = 900, floorW = 260 } = {}) {
  return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${arch ? `<path d="M150 ${H} V360 A250 250 0 0 1 650 360 V${H}Z" fill="#fff" opacity=".42"/><path d="M170 ${H} V362 A230 230 0 0 1 630 362 V${H}" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>` : ''}
  <ellipse cx="400" cy="${floorY}" rx="${floorW}" ry="34" fill="url(#shadow)"/>`;
}

// ---------- Jewellery ----------

const BUST =
  'M330 110 L470 110 L470 380 C520 420 690 455 735 610 L770 1000 L30 1000 L65 610 C110 455 280 420 330 380 Z';

function bust(c) {
  return `<linearGradient id="velvet" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/>
    </linearGradient>
    <radialGradient id="velvetHi" cx="45%" cy="45%" r="55%">
      <stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>`;
}

function bustShape() {
  return `<g filter="url(#soft)"><path d="${BUST}" fill="url(#velvet)"/><path d="${BUST}" fill="url(#velvetHi)"/></g>
  <path d="M330 380 C360 400 440 400 470 380" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>`;
}

function beadChain(p0, p1, p2, n, size, fill = 'url(#goldBall)') {
  return quad(p0, p1, p2, n)
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${size}" fill="${fill}"/>`)
    .join('');
}

const jewellery = {
  haaram({ gem, velvet }) {
    const defs = bust(velvet) + gemDefs('gem', gem);
    const body = `${bustShape()}
      <path d="M318 410 Q400 760 482 410" fill="none" stroke="url(#gold)" stroke-width="3"/>
      ${beadChain([318, 410], [400, 760], [482, 410], 34, 7)}
      ${beadChain([300, 440], [400, 960], [500, 440], 46, 8)}
      ${quad([300, 440], [400, 960], [500, 440], 12)
        .slice(1, -1)
        .map(
          ([x, y]) =>
            `<g transform="translate(${x} ${y + 10})"><path d="M0 0 C10 8 10 22 0 30 C-10 22 -10 8 0 0Z" fill="url(#gold)"/><circle cy="15" r="6" fill="url(#gem)"/></g>`,
        )
        .join('')}
      <g transform="translate(400 700)">
        <path d="M0 -10 C55 0 70 60 0 120 C-70 60 -55 0 0 -10Z" fill="url(#gold)"/>
        <path d="M0 8 C38 16 46 58 0 100 C-46 58 -38 16 0 8Z" fill="url(#gem)"/>
        <ellipse cx="-12" cy="38" rx="9" ry="16" fill="#fff" opacity=".35"/>
        ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${-40 + i * 20}" cy="${132 + Math.abs(2 - i) * -4}" r="8" fill="url(#pearl)"/>`).join('')}
      </g>
      ${sparkle(470, 640, 16)}${sparkle(330, 520, 10)}${sparkle(520, 760, 12, 0.7)}`;
    return { defs, body };
  },

  choker({ gem, velvet }) {
    const defs = bust(velvet) + gemDefs('gem', gem);
    const pts = quad([326, 300], [400, 470], [474, 300], 12);
    const body = `${bustShape()}
      <path d="M326 300 Q400 470 474 300" fill="none" stroke="url(#gold)" stroke-width="38" stroke-linecap="round" opacity=".95"/>
      ${pts
        .map(
          ([x, y], i) =>
            `<rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="4" transform="rotate(45 ${x} ${y})" fill="${i % 2 ? 'url(#gem)' : '#fff'}" opacity="${i % 2 ? 1 : 0.85}"/>`,
        )
        .join('')}
      ${pts
        .filter((_, i) => i > 0 && i < pts.length - 1)
        .map(
          ([x, y]) =>
            `<line x1="${x}" y1="${y + 18}" x2="${x}" y2="${y + 44}" stroke="url(#gold)" stroke-width="2"/><circle cx="${x}" cy="${y + 50}" r="7" fill="url(#pearl)"/>`,
        )
        .join('')}
      ${sparkle(450, 330, 14)}${sparkle(350, 360, 9)}`;
    return { defs, body };
  },

  pendant({ gem, velvet }) {
    const defs = bust(velvet) + gemDefs('gem', gem);
    const body = `${bustShape()}
      <path d="M322 400 Q400 640 478 400" fill="none" stroke="url(#gold)" stroke-width="3.5"/>
      ${beadChain([322, 400], [400, 640], [478, 400], 60, 2.6)}
      <g transform="translate(400 520)">
        <circle r="14" fill="url(#gold)"/>
        <path d="M0 14 C40 30 48 90 0 140 C-48 90 -40 30 0 14Z" fill="url(#gold)"/>
        <path d="M0 30 C28 42 34 86 0 124 C-34 86 -28 42 0 30Z" fill="url(#gem)"/>
        <ellipse cx="-9" cy="62" rx="6" ry="13" fill="#fff" opacity=".4"/>
        <circle cy="156" r="10" fill="url(#pearl)"/>
      </g>
      ${sparkle(440, 580, 14)}${sparkle(352, 620, 8)}`;
    return { defs, body };
  },

  jhumka({ gem }) {
    const defs = gemDefs('gem', gem);
    const one = (cx) => {
      const pearls = Array.from({ length: 9 }, (_, i) => {
        const x = cx - 80 + i * 20;
        return `<line x1="${x}" y1="602" x2="${x}" y2="630" stroke="url(#gold)" stroke-width="2"/><circle cx="${x}" cy="640" r="9" fill="url(#pearl)"/>`;
      }).join('');
      const petals = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return `<circle cx="${r(cx + Math.cos(a) * 26)}" cy="${r(300 + Math.sin(a) * 26)}" r="13" fill="url(#gold)"/>`;
      }).join('');
      return `<g filter="url(#soft)">
        ${petals}<circle cx="${cx}" cy="300" r="20" fill="url(#gem)"/>
        <circle cx="${cx - 6}" cy="294" r="6" fill="#fff" opacity=".45"/>
        <rect x="${cx - 4}" y="326" width="8" height="74" rx="4" fill="url(#gold)"/>
        <circle cx="${cx}" cy="408" r="14" fill="url(#gem)"/>
        <path d="M${cx - 90} 600 C${cx - 90} 470 ${cx - 44} 420 ${cx} 420 C${cx + 44} 420 ${cx + 90} 470 ${cx + 90} 600 Z" fill="url(#gold)"/>
        <path d="M${cx - 70} 540 Q${cx} 510 ${cx + 70} 540" fill="none" stroke="${GOLD[3]}" stroke-width="3" opacity=".6"/>
        <path d="M${cx - 80} 570 Q${cx} 545 ${cx + 80} 570" fill="none" stroke="${GOLD[3]}" stroke-width="3" opacity=".6"/>
        ${[-40, -13, 13, 40].map((dx) => `<circle cx="${cx + dx}" cy="${490 + Math.abs(dx) * 0.5}" r="7" fill="url(#gem)"/>`).join('')}
        <ellipse cx="${cx}" cy="600" rx="92" ry="14" fill="${GOLD[2]}"/>
        ${pearls}
      </g>`;
    };
    return {
      defs,
      body: `${one(275)}${one(525)}${sparkle(380, 470, 16)}${sparkle(640, 360, 10)}${sparkle(170, 560, 9, 0.7)}`,
    };
  },

  bangles({ gem }) {
    const defs = gemDefs('gem', gem);
    const ys = [440, 500, 560, 620];
    const body = `<g filter="url(#soft)">${ys
      .map((y, i) => {
        const enamel = i === 1 || i === 2;
        const stones = enamel
          ? Array.from({ length: 11 }, (_, k) => {
              const a = Math.PI * (0.1 + (k / 10) * 0.8);
              return `<circle cx="${r(400 - Math.cos(a) * 230)}" cy="${r(y + Math.sin(a) * 74)}" r="7" fill="${k % 2 ? '#fff' : 'url(#gem)'}"/>`;
            }).join('')
          : '';
        return `<ellipse cx="400" cy="${y}" rx="230" ry="74" fill="none" stroke="${enamel ? gem[2] : GOLD[3]}" stroke-width="30"/>
          <ellipse cx="400" cy="${y}" rx="230" ry="74" fill="none" stroke="${enamel ? 'url(#gem)' : 'url(#gold)'}" stroke-width="24"/>
          <ellipse cx="400" cy="${y - 6}" rx="226" ry="70" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>${stones}`;
      })
      .join('')}</g>${sparkle(600, 470, 16)}${sparkle(220, 610, 10)}`;
    return { defs, body };
  },

  ring({ gem }) {
    const defs = gemDefs('gem', gem);
    const body = `<g filter="url(#soft)">
      <ellipse cx="400" cy="640" rx="150" ry="170" fill="none" stroke="${GOLD[3]}" stroke-width="30"/>
      <ellipse cx="400" cy="640" rx="150" ry="170" fill="none" stroke="url(#gold)" stroke-width="24"/>
      <path d="M330 470 L470 470 L440 520 L360 520Z" fill="url(#gold)"/>
      <g transform="translate(400 420)">
        <path d="M-70 0 L-40 -55 L40 -55 L70 0 L0 80Z" fill="url(#gem)"/>
        <path d="M-70 0 L70 0 M-40 -55 L-20 0 L0 80 L20 0 L40 -55 M-20 0 L0 -55 L20 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>
        ${[-60, -30, 30, 60].map((x) => `<circle cx="${x}" cy="${x < 0 ? -40 + Math.abs(x) * 0.2 : -40 + x * 0.2}" r="6" fill="url(#gold)"/>`).join('')}
      </g>
      ${[-1, 1].map((s) => `<circle cx="${400 + s * 92}" cy="480" r="12" fill="#fff" opacity=".9"/><circle cx="${400 + s * 112}" cy="500" r="9" fill="#fff" opacity=".85"/>`).join('')}
    </g>${sparkle(500, 360, 22)}${sparkle(300, 400, 12)}${sparkle(560, 560, 9, 0.7)}`;
    return { defs, body };
  },
};

// ---------- Dresses ----------

function hanger() {
  return `<path d="M400 120 q0 -34 26 -34 q26 0 26 26 q0 22 -30 32 L400 160" fill="none" stroke="#8E7A55" stroke-width="7" stroke-linecap="round"/>
    <path d="M400 160 L250 222 M400 160 L550 222" stroke="#8E7A55" stroke-width="9" stroke-linecap="round"/>`;
}

function border(d, w = 18) {
  return `<path d="${d}" fill="none" stroke="url(#gold)" stroke-width="${w}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 12" stroke-linecap="round" opacity=".9"/>`;
}

const dresses = {
  anarkali({ fab }) {
    const defs = fabricDefs('f', fab, 'butta');
    const skirt =
      'M330 420 L470 420 C560 600 640 760 690 890 Q400 950 110 890 C160 760 240 600 330 420Z';
    const pleats = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      const top = 335 + t * 130;
      const bot = 130 + t * 540;
      return `<path d="M${r(top)} 425 L${r(bot)} ${r(890 + Math.sin(t * Math.PI) * 50)}" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`;
    }).join('');
    const body = `<g filter="url(#soft)">
      ${fabric('f', 'M300 222 L500 222 L560 470 L520 480 L480 300 L470 420 L330 420 L320 300 L280 480 L240 470 Z')}
      ${fabric('f', skirt)}${pleats}
      ${border('M120 885 Q400 948 680 885')}
      ${border('M330 420 L470 420', 12)}
      <path d="M360 222 L400 290 L440 222" fill="${fab.base[1]}" stroke="url(#gold)" stroke-width="6"/>
      ${border('M250 474 L280 480', 10)}${border('M520 480 L550 474', 10)}
    </g>${hanger()}`;
    return { defs, body };
  },

  lehenga({ fab, dup }) {
    const defs = fabricDefs('f', fab, 'floral') + fabricDefs('d', dup, 'lattice');
    const skirt =
      'M310 470 L490 470 C600 640 680 790 720 900 Q400 975 80 900 C120 790 200 640 310 470Z';
    const body = `<g filter="url(#soft)">
      ${fabric('f', 'M300 222 L500 222 L520 300 L500 410 L300 410 L280 300 Z')}
      <path d="M360 222 Q400 280 440 222" fill="${fab.base[1]}" stroke="url(#gold)" stroke-width="6"/>
      ${border('M300 408 L500 408', 10)}
      ${fabric('f', skirt)}
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${330 + i * 17.5} 475 Q${200 + i * 50} 700 ${110 + i * 72} 920" stroke="#000" stroke-opacity=".1" stroke-width="3" fill="none"/>`).join('')}
      ${border('M90 895 Q400 968 710 895', 26)}
      ${border('M310 470 L490 470', 12)}
      <path d="M470 222 C560 360 600 520 560 760 L500 790 C530 560 480 380 420 240Z" fill="url(#dBase)" opacity=".72"/>
      <path d="M470 222 C560 360 600 520 560 760 L500 790 C530 560 480 380 420 240Z" fill="url(#dMotif)" opacity=".8"/>
      ${border('M560 760 L500 790', 8)}
    </g>${hanger()}`;
    return { defs, body };
  },

  kurta({ fab, pant }) {
    const defs = fabricDefs('f', fab, 'stripe') + fabricDefs('p', pant, 'butta');
    const body = `<g filter="url(#soft)">
      ${fabric('p', 'M330 700 L470 700 L480 940 L410 940 L400 760 L390 940 L320 940Z')}
      ${fabric('f', 'M290 222 L510 222 L580 520 L535 532 L510 360 L520 780 L470 790 L455 700 L345 700 L330 790 L280 780 L290 360 L265 532 L220 520Z')}
      <path d="M370 222 L370 320 L430 320 L430 222" fill="none" stroke="url(#gold)" stroke-width="7"/>
      ${[250, 275, 300].map((y) => `<circle cx="400" cy="${y}" r="6" fill="url(#gold)"/>`).join('')}
      ${border('M280 780 L330 790', 10)}${border('M470 790 L520 780', 10)}
      ${border('M222 520 L265 532', 8)}${border('M535 532 L578 520', 8)}
    </g>${hanger()}`;
    return { defs, body };
  },

  tiered({ fab }) {
    const defs = fabricDefs('f', fab, 'floral');
    const tiers = [
      [420, 560, 300, 500, 270, 530],
      [560, 720, 260, 540, 200, 600],
      [720, 900, 200, 600, 120, 680],
    ];
    const body = `<g filter="url(#soft)">
      ${fabric('f', 'M310 222 L490 222 L500 420 L300 420 Z')}
      <path d="M300 222 Q290 270 320 300 M500 222 Q510 270 480 300" stroke="${fab.base[1]}" stroke-width="20" stroke-linecap="round"/>
      <path d="M360 222 Q400 262 440 222" fill="none" stroke="${fab.accent}" stroke-width="5"/>
      ${tiers
        .map(([y0, y1, x0, x1, b0, b1]) => {
          const wave = Array.from({ length: 9 }, (_, i) => {
            const x = b0 + ((b1 - b0) / 8) * i;
            return `${i === 0 ? 'L' : 'Q'}${i === 0 ? `${b0} ${y1}` : `${r(x - (b1 - b0) / 16)} ${y1 + 18} ${r(x)} ${y1}`}`;
          }).join(' ');
          return (
            fabric(
              'f',
              `M${x0 + 10} ${y0} L${x1 - 10} ${y0} L${b1} ${y1} ${wave.replace(/^L[^Q]*/, '')} L${b0} ${y1}Z`,
            ) +
            `<path d="M${x0 + 10} ${y0} L${x1 - 10} ${y0}" stroke="#000" stroke-opacity=".15" stroke-width="4"/>`
          );
        })
        .join('')}
      <path d="M300 420 Q400 440 500 420" fill="none" stroke="${fab.accent}" stroke-width="10" stroke-linecap="round"/>
    </g>${hanger()}`;
    return { defs, body };
  },

  kaftan({ fab }) {
    const defs = fabricDefs('f', fab, 'lattice');
    const body = `<g filter="url(#soft)">
      ${fabric('f', 'M260 222 L540 222 L700 470 L640 520 L560 420 L590 900 L210 900 L240 420 L160 520 L100 470Z')}
      <path d="M360 222 L400 330 L440 222" fill="${fab.base[1]}" stroke="url(#gold)" stroke-width="6"/>
      ${border('M215 895 L585 895', 16)}
      ${border('M102 470 L160 520', 10)}${border('M640 520 L698 470', 10)}
      <path d="M240 520 Q400 560 560 520" fill="none" stroke="url(#gold)" stroke-width="10"/>
      <path d="M392 540 l-26 70 M408 540 l26 70" stroke="url(#gold)" stroke-width="6" stroke-linecap="round"/>
    </g>${hanger()}`;
    return { defs, body };
  },
};

// ---------- Bags ----------

const bags = {
  potli({ fab }) {
    const defs = fabricDefs('f', fab, 'floral');
    const body = `<path d="M330 330 C300 170 500 170 470 330" fill="none" stroke="url(#gold)" stroke-width="8"/>
      ${beadChain([330, 330], [400, 120], [470, 330], 20, 7, 'url(#pearl)')}
      <g filter="url(#soft)">
      <path d="M330 340 C300 300 320 270 340 300 C350 260 380 270 380 300 C395 262 420 262 425 300 C440 268 470 270 462 302 C490 280 500 310 470 342Z" fill="url(#fBase)"/>
      ${fabric('f', 'M340 360 C170 420 190 790 400 800 C610 790 630 420 460 360 Z')}
      <path d="M338 352 Q400 372 462 352" stroke="url(#gold)" stroke-width="14" fill="none" stroke-linecap="round"/>
      <g transform="translate(400 590)">
        ${Array.from({ length: 12 }, (_, i) => `<ellipse rx="16" ry="44" transform="rotate(${i * 30}) translate(0 -46)" fill="url(#gold)" opacity=".9"/>`).join('')}
        <circle r="34" fill="${fab.base[1]}"/><circle r="22" fill="url(#gold)"/><circle r="10" fill="#fff" opacity=".8"/>
      </g>
      </g>
      ${[-1, 1]
        .map(
          (
            s,
          ) => `<path d="M${400 + s * 50} 356 Q${400 + s * 120} 420 ${400 + s * 130} 500" stroke="url(#gold)" stroke-width="3" fill="none"/>
        <g transform="translate(${400 + s * 130} 500)"><circle r="12" fill="url(#gold)"/>${Array.from({ length: 7 }, (_, i) => `<line x1="${-9 + i * 3}" y1="10" x2="${-12 + i * 4}" y2="70" stroke="${fab.accent}" stroke-width="3"/>`).join('')}</g>`,
        )
        .join('')}
      ${sparkle(560, 380, 12)}`;
    return { defs, body };
  },

  clutch({ fab }) {
    const defs = fabricDefs('f', fab, 'lattice');
    const body = `<path d="M240 460 C220 260 580 260 560 460" fill="none" stroke="url(#gold)" stroke-width="6" stroke-dasharray="14 6"/>
      <g filter="url(#soft)">
      ${fabric('f', 'M200 440 Q200 420 220 420 L580 420 Q600 420 600 440 L600 690 Q600 710 580 710 L220 710 Q200 710 200 690Z')}
      ${fabric('f', 'M200 440 Q200 420 220 420 L580 420 Q600 420 600 440 L600 520 L400 600 L200 520Z')}
      <path d="M200 520 L400 600 L600 520" fill="none" stroke="url(#gold)" stroke-width="8"/>
      <g transform="translate(400 600)"><path d="M0 -34 L30 0 L0 34 L-30 0Z" fill="url(#gold)"/><path d="M0 -20 L18 0 L0 20 L-18 0Z" fill="#fff" opacity=".85"/></g>
      <rect x="200" y="420" width="400" height="290" rx="20" fill="none" stroke="url(#gold)" stroke-width="5"/>
      </g>${sparkle(590, 440, 16)}${sparkle(240, 690, 9)}`;
    return { defs, body };
  },

  tote({ fab }) {
    const defs = fabricDefs('f', fab, 'stripe');
    const body = `<path d="M300 420 C300 220 500 220 500 420" fill="none" stroke="${fab.base[1]}" stroke-width="22" stroke-linecap="round"/>
      <path d="M300 420 C300 220 500 220 500 420" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 8" opacity=".7"/>
      <g filter="url(#soft)">
      ${fabric('f', 'M210 410 L590 410 L640 860 Q640 880 620 880 L180 880 Q160 880 160 860Z')}
      <path d="M215 430 L585 430 M175 860 L625 860" stroke="#fff" stroke-width="2" stroke-dasharray="7 7" opacity=".7"/>
      <rect x="320" y="560" width="160" height="110" rx="10" fill="${fab.accent}" opacity=".9"/>
      <text x="400" y="628" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-style="italic" fill="${fab.base[0]}">AB</text>
      </g>
      <g transform="translate(560 430)"><path d="M0 0 L0 50" stroke="url(#gold)" stroke-width="3"/><circle cy="62" r="13" fill="url(#gold)"/></g>`;
    return { defs, body };
  },

  halfmoon({ fab }) {
    const defs = fabricDefs('f', fab, 'butta');
    const body = `<path d="M230 470 C200 120 600 120 570 470" fill="none" stroke="${fab.base[1]}" stroke-width="16" stroke-linecap="round"/>
      <g filter="url(#soft)">
      ${fabric('f', 'M190 470 L610 470 A210 230 0 0 1 190 470Z')}
      <path d="M190 470 L610 470" stroke="url(#gold)" stroke-width="10" stroke-linecap="round"/>
      <path d="M220 500 A180 196 0 0 0 580 500" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 7" opacity=".7"/>
      ${[230, 570].map((x) => `<rect x="${x - 14}" y="456" width="28" height="30" rx="6" fill="url(#gold)"/>`).join('')}
      <circle cx="400" cy="560" r="26" fill="url(#gold)"/><circle cx="400" cy="560" r="12" fill="${fab.base[1]}"/>
      </g>${sparkle(600, 420, 12)}`;
    return { defs, body };
  },

  bucket({ fab }) {
    const defs = fabricDefs('f', fab, 'floral');
    const body = `<path d="M290 400 C240 150 560 150 510 400" fill="none" stroke="url(#gold)" stroke-width="8" stroke-dasharray="16 6"/>
      <g filter="url(#soft)">
      ${fabric('f', 'M250 400 L550 400 L590 830 Q400 880 210 830Z')}
      <ellipse cx="400" cy="400" rx="150" ry="34" fill="${fab.base[1]}"/>
      <ellipse cx="400" cy="400" rx="150" ry="34" fill="none" stroke="url(#gold)" stroke-width="6"/>
      ${Array.from({ length: 10 }, (_, i) => `<circle cx="${r(266 + i * 29.6)}" cy="${r(438 + Math.sin((i / 9) * Math.PI) * 16)}" r="6" fill="url(#gold)"/>`).join('')}
      <path d="M210 830 Q400 880 590 830" fill="none" stroke="url(#gold)" stroke-width="10"/>
      </g>
      <path d="M520 430 Q560 520 540 560" stroke="url(#gold)" stroke-width="3" fill="none"/>
      <g transform="translate(540 570)"><circle r="10" fill="url(#gold)"/>${Array.from({ length: 6 }, (_, i) => `<line x1="${-7 + i * 3}" y1="8" x2="${-9 + i * 4}" y2="60" stroke="${fab.accent}" stroke-width="3"/>`).join('')}</g>`;
    return { defs, body };
  },
};

// ---------- Palettes ----------

const EMERALD = ['#8FE3B9', '#1E8A5A', '#0B3D27'];
const RUBY = ['#FFB3C0', '#C2284A', '#5E0A1E'];
const SAPPHIRE = ['#B9D4FF', '#2F5FB8', '#0E2458'];
const MINT_GEM = ['#E8FFF4', '#8ED6B4', '#3E8E6C'];
const VELVET_GREEN = ['#2C5E47', '#0F3326'];
const VELVET_IVORY = ['#F4EFE4', '#CFC4AE'];

const fabrics = {
  emerald: { base: ['#2F7A55', '#0F3D2B'], accent: '#E7C979' },
  ivory: { base: ['#FFFDF7', '#E9E1CF'], accent: '#B8913A' },
  sage: { base: ['#C9DCC8', '#8FB096'], accent: '#FFFFFF' },
  blush: { base: ['#F7D9D3', '#D9A79C'], accent: '#FFFFFF' },
  mint: { base: ['#DDF1E6', '#A9D3BD'], accent: '#2F7A55' },
  bottle: { base: ['#1E4D3A', '#0A2419'], accent: '#C9DCC8' },
  teal: { base: ['#3D8C8A', '#174746'], accent: '#F3E2B3' },
  mustard: { base: ['#E9C46A', '#B8862B'], accent: '#FFFFFF' },
  white: { base: ['#FFFFFF', '#ECEEE8'], accent: '#2F7A55' },
};

// slug -> [kind, variant, params, mainBackdrop, altBackdrop, focus [x,y,scale]]
const PRODUCTS = {
  'meenakshi-temple-haaram': [
    'j',
    'haaram',
    { gem: RUBY, velvet: VELVET_GREEN },
    'ivory',
    'mint',
    [400, 680, 1.6],
  ],
  'emerald-dew-choker': [
    'j',
    'choker',
    { gem: EMERALD, velvet: VELVET_IVORY },
    'mint',
    'sage',
    [400, 380, 1.8],
  ],
  'nila-sapphire-pendant': [
    'j',
    'pendant',
    { gem: SAPPHIRE, velvet: VELVET_GREEN },
    'blush',
    'ivory',
    [400, 600, 1.8],
  ],
  'mayil-pearl-jhumkas': ['j', 'jhumka', { gem: EMERALD }, 'ivory', 'fern', [275, 470, 1.7]],
  'kanchana-bangle-stack': ['j', 'bangles', { gem: MINT_GEM }, 'sage', 'blush', [400, 530, 1.5]],
  'aadhya-emerald-ring': ['j', 'ring', { gem: EMERALD }, 'blush', 'mint', [400, 440, 1.7]],
  'vanya-anarkali': ['d', 'anarkali', { fab: fabrics.emerald }, 'ivory', 'mint', [400, 360, 1.6]],
  'mallika-bridal-lehenga': [
    'd',
    'lehenga',
    { fab: fabrics.ivory, dup: fabrics.sage },
    'fern',
    'blush',
    [400, 720, 1.5],
  ],
  'thendral-kurta-set': [
    'd',
    'kurta',
    { fab: fabrics.mint, pant: fabrics.white },
    'ivory',
    'sage',
    [400, 300, 1.7],
  ],
  'poovai-tiered-maxi': ['d', 'tiered', { fab: fabrics.blush }, 'mint', 'ivory', [400, 650, 1.5]],
  'kadal-silk-kaftan': ['d', 'kaftan', { fab: fabrics.teal }, 'ivory', 'fern', [400, 420, 1.6]],
  'rani-embroidered-potli': [
    'b',
    'potli',
    { fab: fabrics.bottle },
    'ivory',
    'blush',
    [400, 590, 1.6],
  ],
  'pavizham-pearl-clutch': ['b', 'clutch', { fab: fabrics.ivory }, 'fern', 'mint', [400, 560, 1.6]],
  'bhuvi-everyday-tote': ['b', 'tote', { fab: fabrics.sage }, 'blush', 'ivory', [400, 620, 1.6]],
  'chandra-half-moon-bag': [
    'b',
    'halfmoon',
    { fab: fabrics.emerald },
    'mint',
    'ivory',
    [400, 540, 1.6],
  ],
  'malar-bucket-bag': ['b', 'bucket', { fab: fabrics.mustard }, 'sage', 'blush', [400, 560, 1.6]],
};

const KIND = { j: jewellery, d: dresses, b: bags };

function svg({ defs, body }, backdrop, focus) {
  const bg = BACKDROPS[backdrop];
  const content = `${stage()}${body}`;
  const inner = focus
    ? `<rect width="${W}" height="${H}" fill="url(#bg)"/><g transform="translate(${W / 2} ${H / 2}) scale(${focus[2]}) translate(${-focus[0]} ${-focus[1]})">${content}</g>`
    : content;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${commonDefs(bg)}${defs}</defs>${inner}</svg>\n`;
}

let count = 0;
for (const [slug, [kind, variant, params, main, alt, focus]] of Object.entries(PRODUCTS)) {
  const art = KIND[kind][variant](params);
  writeFileSync(join(OUT, `${slug}.svg`), svg(art, main));
  writeFileSync(join(OUT, `${slug}-alt.svg`), svg(art, alt, focus));
  count += 2;
}
console.log(`Wrote ${count} SVGs to ${OUT}`);
