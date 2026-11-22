'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ArrowIcon, CheckIcon } from './icons';

/** Front-end only for now: nothing is sent anywhere until a backend is wired up. */
export function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <div className="mt-8 max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-full border border-ivory/20 px-5 py-4 text-sm"
          >
            <span className="grid size-7 place-items-center rounded-full bg-gold text-forest-950">
              <CheckIcon size={16} />
            </span>
            Thank you! Your first letter is on its way.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="group flex items-center rounded-full border border-ivory/25 p-1.5 pl-5 transition-colors focus-within:border-gold"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/45 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid size-11 place-items-center rounded-full bg-ivory text-forest-900 transition-transform duration-500 ease-silk hover:scale-105 group-focus-within:bg-gold"
            >
              <ArrowIcon size={18} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
