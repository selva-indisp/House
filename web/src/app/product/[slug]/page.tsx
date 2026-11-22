import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { ProductDetail } from '@/components/product-detail';
import { Reveal, SplitHeading } from '@/components/reveal';
import { getProduct, products, related } from '@/lib/products';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.short } : {};
}

export default async function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  return (
    <>
      <ProductDetail product={product} />
      <section className="bg-mint-50 py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Pairs beautifully with</p>
          </Reveal>
          <SplitHeading
            text="You may also love"
            className="mt-3 font-display text-5xl text-forest-900"
          />
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {related(product).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
