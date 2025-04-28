import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 1,
    name: 'Engine Parts',
    description: 'Pistons, valves, and more',
    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    link: '/category/engine-parts',
    color: 'bg-blue-700',
  },
  {
    id: 2,
    name: 'Brakes',
    description: 'Pads, rotors, and calipers',
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg',
    link: '/category/brakes',
    color: 'bg-red-600',
  },
  {
    id: 3,
    name: 'Suspension',
    description: 'Shocks, struts, and springs',
    imageUrl: 'https://images.pexels.com/photos/2555544/pexels-photo-2555544.jpeg',
    link: '/category/suspension',
    color: 'bg-amber-500',
  },
  {
    id: 4,
    name: 'Electrical',
    description: 'Alternators, starters, and sensors',
    imageUrl: 'https://images.pexels.com/photos/8793744/pexels-photo-8793744.jpeg',
    link: '/category/electrical',
    color: 'bg-emerald-600',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
        <Link 
          href="/categories"
          className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 font-medium"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={category.link}
            className="group relative overflow-hidden rounded-xl shadow-md transition-transform hover:-translate-y-2"
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className={cn(
                "absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white rounded-full",
                category.color
              )}>
                Popular
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                <p className="text-sm text-white/90">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}