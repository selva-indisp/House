'use client';

import { type RefObject, useEffect } from 'react';

/**
 * Drives a progress element (scaleX) from a video's playback position on every animation
 * frame, without re-rendering React.
 */
export function useVideoProgress(
  video: RefObject<HTMLVideoElement | null>,
  bar: RefObject<HTMLElement | null>,
  active = true,
) {
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const v = video.current;
      const b = bar.current;
      if (v && b && v.duration) b.style.transform = `scaleX(${v.currentTime / v.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [video, bar, active]);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/*
 * Whether the full-screen reel player is open. Cards pause while it is, so only one video
 * decodes at a time.
 */
let playerOpen = false;
const listeners = new Set<(open: boolean) => void>();

export function setReelPlayerOpen(open: boolean) {
  playerOpen = open;
  for (const l of listeners) l(open);
}

export function isReelPlayerOpen() {
  return playerOpen;
}

export function onReelPlayerChange(listener: (open: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
