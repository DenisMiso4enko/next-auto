import Hero from '@/components/home/hero';
import FeaturedCategories from '@/components/home/featured-categories';
import FeaturedProducts from '@/components/home/featured-products';
import VehicleSearch from '@/components/home/vehicle-search';
import BrandsSlider from '@/components/home/brands-slider';
import Testimonials from '@/components/home/testimonials';
import PromoSection from '@/components/home/promo-section';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <Hero />
      <VehicleSearch />
      <div className="container">
        <FeaturedCategories />
        <FeaturedProducts />
        <PromoSection />
        <BrandsSlider />
        <Testimonials />
      </div>
    </div>
  );
}