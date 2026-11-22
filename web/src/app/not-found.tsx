import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-4 font-display text-7xl text-forest-900 sm:text-8xl">Lost, but loved.</h1>
      <p className="mt-5 max-w-md text-muted">
        The page you are looking for has wandered off. Let us take you somewhere beautiful instead.
      </p>
      <Link href="/shop" className="btn btn-primary mt-10">
        Back to the shop
      </Link>
    </section>
  );
}
