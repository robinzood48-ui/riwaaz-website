export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  room: string;
  collection: string;
  mood: string;
  price: number;
  salePrice?: number;
  inventory: number;
  sku: string;
  material: string;
  color: string;
  dimensions: string;
  description: string;
  shortDescription: string;
  careInstructions: string;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  variants?: ProductVariant[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceDelta: number;
  inStock: boolean;
  colorHex?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  addresses?: Address[];
  passwordHash?: string;
  passwordSalt?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Packed' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  deliveryMethod: string;
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  maxDiscount?: number;
  expiry: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
}
