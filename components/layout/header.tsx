'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'Brands', href: '/brands' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md dark:bg-slate-900'
          : 'bg-transparent'
      )}
    >
      <div className="bg-blue-800 text-white py-1">
        <div className="container flex justify-between items-center text-sm">
          <div>Free shipping on orders over $75</div>
          <div className="hidden md:flex gap-4">
            <Link href="/support" className="hover:text-blue-200 transition">Support</Link>
            <Link href="/track-order" className="hover:text-blue-200 transition">Track Order</Link>
          </div>
        </div>
      </div>

      <div className="container max-w-[1280px] mx-auto flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-lg py-2 border-b border-gray-200 hover:text-blue-700 transition-colors",
                      pathname === item.href ? "text-blue-700 font-medium" : ""
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Car className="size-8 text-blue-700" />
            <span className="text-xl font-bold">AutoParts</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-700",
                pathname === item.href ? "text-blue-700" : "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center w-1/3 max-w-md">
          <form className="flex w-full">
            <Input
              type="search"
              placeholder="Search for parts..."
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="size-4" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5 md:hidden" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}