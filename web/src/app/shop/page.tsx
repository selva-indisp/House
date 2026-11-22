import type { Metadata } from 'next';
import { ShopView } from '@/components/shop-view';

export const metadata: Metadata = {
  title: 'Shop all',
  description: 'Handcrafted jewels, dresses and bags from House of AB.',
};

export default function ShopPage() {
  return <ShopView />;
}
