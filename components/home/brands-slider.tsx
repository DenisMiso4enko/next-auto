'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const brands = [
  { id: 1, name: 'Bosch', logo: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg' },
  { id: 2, name: 'NGK', logo: 'https://images.pexels.com/photos/3814539/pexels-photo-3814539.jpeg' },
  { id: 3, name: 'Denso', logo: 'https://images.pexels.com/photos/92157/pexels-photo-92157.jpeg' },
  { id: 4, name: 'Brembo', logo: 'https://images.pexels.com/photos/212223/pexels-photo-212223.jpeg' },
  { id: 5, name: 'ACDelco', logo: 'https://images.pexels.com/photos/4489731/pexels-photo-4489731.jpeg' },
  { id: 6, name: 'KYB', logo: 'https://images.pexels.com/photos/225841/pexels-photo-225841.jpeg' },
  { id: 7, name: 'Monroe', logo: 'https://images.pexels.com/photos/38637/car-wheel-wheels-black-38637.jpeg' },
  { id: 8, name: 'Bilstein', logo: 'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg' },
];

export default function BrandsSlider() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Popular Brands</h2>
        <Link 
          href="/brands"
          className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 font-medium"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {brands.map((brand) => (
            <CarouselItem key={brand.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link 
                href={`/brand/${brand.id}`}
                className="block h-full"
              >
                <div className="h-full rounded-lg border bg-card p-4 transition-all hover:border-blue-200 hover:shadow-md dark:hover:border-blue-800">
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="aspect-square w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-center">{brand.name}</span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}