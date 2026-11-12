export type ProductCategory = 
  | 'Fresh Fruits'
  | 'Vegetables'
  | 'Dairy Products'
  | 'Rice & Pulses'
  | 'Snacks & Bakery'
  | 'Household Essentials';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  unit: string; // e.g. "1 kg", "1 dozen", "500 g", "1 litre"
  image: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isBestOffer?: boolean;
  discountPercent?: number;
  origin?: string;
  shelfLife?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  location: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  locality: string;
  pinCode: string;
  paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card';
  paymentStatus: 'Paid' | 'Pending on Delivery';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: {
    id: string;
    label: string;
    address: string;
    locality: string;
    pinCode: string;
  }[];
}
