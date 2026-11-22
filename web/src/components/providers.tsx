'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { MotionConfig } from 'motion/react';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { CartDrawer } from './cart-drawer';
import { StoreProvider } from './store';

function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  // biome-ignore lint/correctness/useExhaustiveDependencies: run on every route change
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSmooth(!mq.matches);
    const onChange = () => setSmooth(!mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const content = (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <StoreProvider>
        {children}
        <CartDrawer />
      </StoreProvider>
    </MotionConfig>
  );

  if (!smooth) return content;

  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true }}>
      <ScrollToTopOnNavigate />
      {content}
    </ReactLenis>
  );
}
