'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Check,
  X,
  ChevronDown,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

// Mock product data
const products = [
  {
    id: '1',
    name: 'Premium Brake Pad Set',
    description: 'High-performance ceramic brake pads for ultimate stopping power',
    price: 79.99,
    originalPrice: 99.99,
    images: ['https://images.pexels.com/photos/4489794/pexels-photo-4489794.jpeg'],
    rating: 4.8,
    reviewCount: 124,
    brand: 'BrakeMaster',
    categories: ['Brakes', 'Brake Pads'],
    isSale: true,
    isNew: false,
    inStock: true,
  },
  {
    id: '2',
    name: 'Synthetic Motor Oil',
    description: 'Full synthetic 5W-30 motor oil for superior engine protection',
    price: 42.99,
    images: ['https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg'],
    rating: 4.9,
    reviewCount: 86,
    brand: 'PurePower',
    categories: ['Engine', 'Fluids'],
    isSale: false,
    isNew: false,
    inStock: true,
  },
  {
    id: '3',
    name: 'Performance Air Filter',
    description: 'High-flow air filter for improved horsepower and acceleration',
    price: 38.95,
    images: ['https://images.pexels.com/photos/9800002/pexels-photo-9800002.jpeg'],
    rating: 4.7,
    reviewCount: 52,
    brand: 'AirFlow',
    categories: ['Engine', 'Air Intake'],
    isSale: false,
    isNew: true,
    inStock: true,
  },
  {
    id: '4',
    name: 'LED Headlight Kit',
    description: 'Ultra-bright LED headlight bulbs with 6000K white light',
    price: 129.99,
    originalPrice: 149.99,
    images: ['https://images.pexels.com/photos/9818667/pexels-photo-9818667.jpeg'],
    rating: 4.6,
    reviewCount: 38,
    brand: 'LuminoTech',
    categories: ['Lighting', 'Exterior'],
    isSale: true,
    isNew: false,
    inStock: true,
  },
  {
    id: '5',
    name: 'Shock Absorber Set',
    description: 'Premium quality shock absorbers for a smooth, comfortable ride',
    price: 189.99,
    images: ['https://images.pexels.com/photos/5264425/pexels-photo-5264425.jpeg'],
    rating: 4.5,
    reviewCount: 45,
    brand: 'RideSmooth',
    categories: ['Suspension', 'Shocks'],
    isSale: false,
    isNew: true,
    inStock: true,
  },
  {
    id: '6',
    name: 'Spark Plug Set',
    description: 'Iridium spark plugs for better fuel efficiency and performance',
    price: 58.75,
    originalPrice: 64.99,
    images: ['https://images.pexels.com/photos/5835359/pexels-photo-5835359.jpeg'],
    rating: 4.7,
    reviewCount: 33,
    brand: 'SparkTech',
    categories: ['Engine', 'Ignition'],
    isSale: true,
    isNew: false,
    inStock: false,
  },
  {
    id: '7',
    name: 'Transmission Fluid',
    description: 'Premium synthetic automatic transmission fluid',
    price: 29.99,
    images: ['https://images.pexels.com/photos/3943913/pexels-photo-3943913.jpeg'],
    rating: 4.5,
    reviewCount: 27,
    brand: 'ShiftMaster',
    categories: ['Transmission', 'Fluids'],
    isSale: false,
    isNew: false,
    inStock: true,
  },
  {
    id: '8',
    name: 'Car Battery',
    description: '550 CCA high-performance automotive battery',
    price: 152.99,
    originalPrice: 179.99,
    images: ['https://images.pexels.com/photos/8793744/pexels-photo-8793744.jpeg'],
    rating: 4.8,
    reviewCount: 64,
    brand: 'PowerCell',
    categories: ['Electrical', 'Batteries'],
    isSale: true,
    isNew: false,
    inStock: true,
  },
];

// Filter categories
const categories = [
  { id: 'brakes', name: 'Brakes', count: 42 },
  { id: 'engine', name: 'Engine', count: 76 },
  { id: 'suspension', name: 'Suspension', count: 31 },
  { id: 'electrical', name: 'Electrical', count: 54 },
  { id: 'transmission', name: 'Transmission', count: 28 },
  { id: 'fluids', name: 'Fluids', count: 35 },
  { id: 'lighting', name: 'Lighting', count: 23 },
  { id: 'accessories', name: 'Accessories', count: 47 },
];

// Brands
const brands = [
  { id: 'brakemaster', name: 'BrakeMaster', count: 15 },
  { id: 'purepower', name: 'PurePower', count: 22 },
  { id: 'airflow', name: 'AirFlow', count: 8 },
  { id: 'luminotech', name: 'LuminoTech', count: 12 },
  { id: 'ridesmooth', name: 'RideSmooth', count: 9 },
  { id: 'sparktech', name: 'SparkTech', count: 14 },
  { id: 'shiftmaster', name: 'ShiftMaster', count: 6 },
  { id: 'powercell', name: 'PowerCell', count: 11 },
];

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sort, setSort] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showInStock, setShowInStock] = useState(true);
  const [showOnSale, setShowOnSale] = useState(false);
  const { toast } = useToast();

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setShowInStock(true);
    setShowOnSale(false);
    toast({
      title: "Filters cleared",
      description: "All product filters have been reset.",
    });
  };

  const addToCart = (productId: string, productName: string) => {
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  return (
    <div className="container py-8 max-w-[1280px] mx-auto">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Shop Auto Parts</h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {products.length} results
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:w-auto w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <div className="flex justify-between items-center">
                    <SheetTitle>Filters</SheetTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </SheetHeader>

                <div className="py-6 space-y-8">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Price Range</h3>
                      <span className="text-sm">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      max={200}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({category.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Brands</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand.id}`}
                              checked={selectedBrands.includes(brand.id)}
                              onCheckedChange={() => toggleBrand(brand.id)}
                            />
                            <label
                              htmlFor={`brand-${brand.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {brand.name}
                            </label>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({brand.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={showInStock}
                          onCheckedChange={() => setShowInStock(!showInStock)}
                        />
                        <label htmlFor="in-stock" className="text-sm cursor-pointer">
                          In Stock Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="on-sale"
                          checked={showOnSale}
                          onCheckedChange={() => setShowOnSale(!showOnSale)}
                        />
                        <label htmlFor="on-sale" className="text-sm cursor-pointer">
                          On Sale
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <form className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full"
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden h-full flex flex-col">
            <div className="relative">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.images[0]}
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

              {product.isNew && (
                <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">
                  New
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

            <CardContent className="pt-4 pb-2 flex-grow">
              <div className="flex items-center text-sm mb-1 text-amber-500">
                {'★'.repeat(Math.floor(product.rating))}
                <span className="text-muted-foreground ml-1">
                  ({product.reviewCount})
                </span>
              </div>
              <h3 className="text-lg font-medium mb-1">
                <Link
                  href={`/product/${product.id}`}
                  className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {product.name}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className={`text-sm mt-1 ${
                product.inStock 
                  ? 'text-emerald-600 dark:text-emerald-500' 
                  : 'text-red-600 dark:text-red-500'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                onClick={() => addToCart(product.id, product.name)}
                className="w-full"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}