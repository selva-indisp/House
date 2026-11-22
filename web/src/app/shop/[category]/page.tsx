import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
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

function CategoryContent({ slug }: { slug: string }) {
  const c = getCategory(slug);
  if (!c) notFound();
  return <ShopView category={c.slug} />;
}

export default function CategoryPage({ params }: PageProps<'/shop/[category]'>) {
  // Every category is prerendered via generateStaticParams, so this boundary never shows in practice.
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      {params.then(({ category }) => (
        <CategoryContent slug={category} />
      ))}
    </Suspense>
  );
}
