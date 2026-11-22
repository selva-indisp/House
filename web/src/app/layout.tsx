import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Cormorant_Garamond, Manrope } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Providers } from '@/components/providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const bodoni = Bodoni_Moda({
  variable: '--font-bodoni',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'House of AB · Jewels, Dresses & Bags made with love',
    template: '%s · House of AB',
  },
  description:
    'House of AB (Anbudan Bhuvi) is a boutique of handcrafted jewels, dresses and bags, made with love in India.',
};

export const viewport: Viewport = {
  themeColor: '#0f3d2b',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${bodoni.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
