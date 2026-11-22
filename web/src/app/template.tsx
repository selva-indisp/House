'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Re-mounts on every navigation, giving each page a soft fade-and-rise entrance. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
