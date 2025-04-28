'use client';

import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Truck,
    ShieldCheck,
    ArrowLeft,
    Star,
    Heart,
    Share,
    MinusCircle,
    PlusCircle,
    ShoppingCart,
    CheckCircle2
} from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {useToast} from '@/hooks/use-toast';

interface ProductDetailsProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        originalPrice?: number;
        discount?: number;
        rating: number;
        reviewCount: number;
        images: string[];
        stock: number;
        sku: string;
        brand: string;
        categories: string[];
        specifications: Array<{ name: string; value: string }>;
        compatibility: Array<{ make: string; models: string[] }>;
    };
}

export default function ProductDetails({product}: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(product.images[0]);
    const {toast} = useToast();

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const addToCart = () => {
        toast({
            title: "Added to cart",
            description: `${product.name} (Qty: ${quantity}) has been added to your cart.`,
        });
    };

    return (
        <div className="container py-8">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/shop">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back to Shop
                    </Link>
                </Button>
                <Separator orientation="vertical" className="h-4 mx-2"/>
                <div className="text-sm text-muted-foreground">
                    <Link href="/" className="hover:underline">Home</Link>
                    {' / '}
                    <Link href="/shop" className="hover:underline">Shop</Link>
                    {' / '}
                    <Link href={`/categories/${product.categories[0].toLowerCase()}`} className="hover:underline">
                        {product.categories[0]}
                    </Link>
                    {' / '}
                    <span>{product.name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        {product.discount && product.discount > 0 && (
                            <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">
                                {product.discount}% OFF
                            </Badge>
                        )}
                    </div>

                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                                    mainImage === image ? 'border-blue-600' : 'border-transparent'
                                }`}
                                onClick={() => setMainImage(image)}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} - View ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                        <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i < Math.floor(product.rating)
                                                ? 'text-amber-500 fill-amber-500'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                                <span className="ml-2 text-sm font-medium">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
                            </div>
                            <Separator orientation="vertical" className="h-4"/>
                            <div className="text-sm text-muted-foreground">
                                SKU: {product.sku}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
                        )}
                        {product.stock > 0 ? (
                            <Badge variant="outline" className="ml-auto border-green-500 text-green-600">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1"/>
                                In Stock ({product.stock})
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="ml-auto border-red-500 text-red-600">
                                Out of Stock
                            </Badge>
                        )}
                    </div>

                    <Separator/>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="h-5 w-5 text-blue-700"/>
                                <span className="text-sm">Quality Guarantee</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Truck className="h-5 w-5 text-blue-700"/>
                                <span className="text-sm">Fast Shipping</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Brand:</span>
                                <Link
                                    href={`/brands/${product.brand.toLowerCase()}`}
                                    className="text-blue-700 hover:underline"
                                >
                                    {product.brand}
                                </Link>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Categories:</span>
                                <div>
                                    {product.categories.map((category, index) => (
                                        <span key={category}>
                      <Link
                          href={`/categories/${category.toLowerCase()}`}
                          className="text-blue-700 hover:underline"
                      >
                        {category}
                      </Link>
                                            {index < product.categories.length - 1 && ', '}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-md">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                            >
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                            <span className="w-12 text-center">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={increaseQuantity}
                                disabled={quantity >= product.stock}
                            >
                                <PlusCircle className="h-4 w-4"/>
                            </Button>
                        </div>

                        <Button
                            className="flex-1"
                            size="lg"
                            onClick={addToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2"/>
                            Add to Cart
                        </Button>

                        <Button variant="outline" size="icon">
                            <Heart className="h-5 w-5"/>
                        </Button>

                        <Button variant="outline" size="icon">
                            <Share className="h-5 w-5"/>
                        </Button>
                    </div>

                    <Tabs defaultValue="description">
                        <TabsList className="grid grid-cols-3">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="specifications">Specifications</TabsTrigger>
                            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="text-sm leading-relaxed">
                            <p>{product.description}</p>
                        </TabsContent>
                        <TabsContent value="specifications">
                            <div className="space-y-2">
                                {product.specifications.map((spec) => (
                                    <div
                                        key={spec.name}
                                        className="grid grid-cols-2 py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <span className="font-medium">{spec.name}</span>
                                        <span>{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="compatibility">
                            <div className="space-y-4">
                                {product.compatibility.map((item) => (
                                    <div key={item.make}>
                                        <h4 className="font-medium mb-1">{item.make}</h4>
                                        <ul className="list-disc list-inside text-sm pl-2 text-muted-foreground">
                                            {item.models.map((model) => (
                                                <li key={model}>{model}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}