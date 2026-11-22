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

export default function Home() {
  return (
    <>
      <Hero />
      <WordMarquee />
      <CategoryTrio />
      <CraftedTabs />
      <EditBanner />
      <NewArrivals />
      <Story />
      <Promises />
      <Testimonials />
    </>
  );
}
