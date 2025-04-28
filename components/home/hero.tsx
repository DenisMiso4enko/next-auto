'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    imageUrl: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg',
    title: 'Quality Parts for Every Vehicle',
    subtitle: 'Find the perfect match for your car',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  {
    id: 2,
    imageUrl: 'https://images.pexels.com/photos/4489731/pexels-photo-4489731.jpeg',
    title: 'Premium Brake Systems',
    subtitle: 'For safety and performance',
    buttonText: 'View Collection',
    buttonLink: '/category/brakes',
  },
  {
    id: 3, 
    imageUrl: 'https://images.pexels.com/photos/5835359/pexels-photo-5835359.jpeg',
    title: 'Engine Components',
    subtitle: 'Keep your engine running smoothly',
    buttonText: 'Explore',
    buttonLink: '/category/engine',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="container relative z-20 h-full flex flex-col justify-center">
            <div className="max-w-xl">
              <h1 
                className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              >
                {slide.title}
              </h1>
              <p 
                className="text-xl text-white/90 mb-6 animate-fade-in-up"
                style={{ animationDelay: '400ms' }}
              >
                {slide.subtitle}
              </p>
              <Button 
                size="lg" 
                asChild
                className="animate-fade-in-up"
                style={{ animationDelay: '600ms' }}
              >
                <Link href={slide.buttonLink}>
                  {slide.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentSlide 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}