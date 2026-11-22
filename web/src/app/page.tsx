import { Hero } from '@/components/home/hero';
import {
  CategoryTrio,
  CraftedTabs,
  EditBanner,
  NewArrivals,
  Promises,
  Story,
  Testimonials,
  WordMarquee,
} from '@/components/home/sections';
import { ReelsRail } from '@/components/reels/reels-rail';

export default function Home() {
  return (
    <>
      <Hero />
      <WordMarquee />
      <CategoryTrio />
      <ReelsRail />
      <CraftedTabs />
      <EditBanner />
      <NewArrivals />
      <Story />
      <Promises />
      <Testimonials />
    </>
  );
}
