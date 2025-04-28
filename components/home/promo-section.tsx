import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PromoSection() {
  return (
    <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative rounded-xl overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg"
          alt="Summer Sale"
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
          <span className="text-white font-semibold text-sm uppercase tracking-wider">Limited Time</span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">Summer Sale</h3>
          <p className="text-white/90 my-3">Save up to 30% on brake parts and service kits</p>
          <Button 
            variant="secondary" 
            className="w-fit mt-2" 
            asChild
          >
            <Link href="/deals/summer-sale">
              Shop Sale
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/9912918/pexels-photo-9912918.jpeg"
          alt="Premium Brands"
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
          <span className="text-white font-semibold text-sm uppercase tracking-wider">Featured Collection</span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">Premium Brands</h3>
          <p className="text-white/90 my-3">Discover top-quality parts from leading manufacturers</p>
          <Button 
            variant="secondary" 
            className="w-fit mt-2" 
            asChild
          >
            <Link href="/brands">
              Explore Brands
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}