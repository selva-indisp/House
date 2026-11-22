import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShopView } from '@/components/shop-view';
import { categories, getCategory } from '@/lib/products';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/shop/[category]'>): Promise<Metadata> {
  const c = getCategory((await params).category);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params }: PageProps<'/shop/[category]'>) {
  const c = getCategory((await params).category);
  if (!c) notFound();
  return <ShopView category={c.slug} />;
}
