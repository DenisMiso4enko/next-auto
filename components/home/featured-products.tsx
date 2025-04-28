'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const products = [
  {
    id: 1,
    name: 'Premium Brake Pads',
    description: 'High-performance ceramic brake pads for ultimate stopping power',
    price: 79.99,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://images.pexels.com/photos/4489794/pexels-photo-4489794.jpeg',
    isSale: true,
    inStock: true,
  },
  {
    id: 2,
    name: 'Synthetic Motor Oil',
    description: 'Full synthetic 5W-30 motor oil for superior engine protection',
    price: 42.99,
    rating: 4.9,
    reviewCount: 86,
    imageUrl: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg',
    isSale: false,
    inStock: true,
  },
  {
    id: 3,
    name: 'Performance Air Filter',
    description: 'High-flow air filter for improved horsepower and acceleration',
    price: 38.95,
    rating: 4.7,
    reviewCount: 52,
    imageUrl: 'https://images.pexels.com/photos/9800002/pexels-photo-9800002.jpeg',
    isSale: false,
    inStock: true,
  },
  {
    id: 4,
    name: 'LED Headlight Kit',
    description: 'Ultra-bright LED headlight bulbs with 6000K white light',
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviewCount: 38,
    imageUrl: 'https://images.pexels.com/photos/9818667/pexels-photo-9818667.jpeg',
    isSale: true,
    inStock: true,
  },
];

export default function FeaturedProducts() {
  const { toast } = useToast();

  const handleAddToCart = (productId: number, productName: string) => {
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
        <Link 
          href="/shop"
          className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 font-medium"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <div className="relative">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              
              {product.isSale && (
                <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">
                  Sale
                </Badge>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                onClick={() => toast({ title: "Added to wishlist" })}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <CardHeader className="pt-4 pb-2">
              <div className="flex items-center text-sm mb-1 text-amber-500">
                {'★'.repeat(Math.floor(product.rating))}
                <span className="text-muted-foreground ml-1">
                  ({product.reviewCount})
                </span>
              </div>
              <CardTitle className="text-lg">
                <Link 
                  href={`/product/${product.id}`}
                  className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {product.name}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {product.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleAddToCart(product.id, product.name)}
                className="w-full"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}