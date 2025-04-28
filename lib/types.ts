// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'billing' | 'shipping';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  images: string[];
  categories: Category[];
  brand: Brand;
  brandId: string;
  sku: string;
  stock: number;
  specifications?: Specification[];
  compatibility?: VehicleCompatibility[];
  rating?: number;
  reviewCount?: number;
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface Specification {
  name: string;
  value: string;
}

export interface VehicleCompatibility {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'successful'
  | 'failed'
  | 'refunded';

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  image: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}