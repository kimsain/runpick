// Home page (Server Component). Composes 5 sections in order:
// Header -> HeroSection -> CategoryNav -> FeaturedShoes -> QuizCTA -> Footer.
// No data fetching needed — child components use static JSON datasets.

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/hero/HeroSection';
import CategoryNav from '@/components/hero/CategoryNav';
import FeaturedShoes from '@/components/hero/FeaturedShoes';
import QuizCTA from '@/components/hero/QuizCTA';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryNav />
        <FeaturedShoes />
        <QuizCTA />
      </main>
      <Footer />
    </>
  );
}
