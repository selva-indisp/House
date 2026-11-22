import type { Metadata } from 'next';
import { ReelsWall } from '@/components/reels/reels-wall';

export const metadata: Metadata = {
  title: '6 PM Reels',
  description:
    'A new look every evening at 6 PM. Watch the House of AB reels and shop every piece.',
};

export default function ReelsPage() {
  return <ReelsWall />;
}
