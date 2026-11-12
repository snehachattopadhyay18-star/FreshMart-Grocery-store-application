import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem, Order, UserProfile, OrderStatus } from '../types/grocery';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEMO_USERS, AVAILABLE_COUPONS } from '../data/initialData';

interface GroceryContextType {
  products: Product[];
  categories: ProductCategory[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentUser: UserProfile | null;
  activeView: 'store' | 'auth';
  authNotification: string | null;
  appliedCoupon: { code: string; discount: number; description: string } | null;
  searchQuery: string;
  selectedCategory: ProductCategory | 'All';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
  
  // Modals & Panels state
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isCheckoutOpen: boolean;
  isAdminModalOpen: boolean;
  isOrderTrackingOpen: boolean;
  trackingOrderId: string | null;
  quickViewProduct: Product | null;
  lastConfirmedOrder: Order | null;
  activeOrderFilter: 'All' | OrderStatus;
  
  // Setters
  setActiveView: (view: 'store' | 'auth') => void;
  setAuthNotification: (msg: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'rating') => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setIsOrderTrackingOpen: (open: boolean) => void;
  setTrackingOrderId: (id: string | null) => void;
  setQuickViewProduct: (prod: Product | null) => void;
  setLastConfirmedOrder: (order: Order | null) => void;
  setCurrentUser: (user: UserProfile | null) => void;
  login: (email: string) => { success: boolean; message: string };
  logout: () => void;
  register: (data: { name: string; email: string; phone: string; address: string; locality: string; pinCode: string }) => { success: boolean; message: string };
  
  // Actions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Cart Calculations
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  cartItemsCount: number;
  freeDeliveryThreshold: number;
  freeDeliveryRemaining: number;
  
  // Checkout & Order Actions
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    locality: string;
    pinCode: string;
    timeSlot: string;
    paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleProductStock: (id: string) => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 299;
const STANDARD_DELIVERY_FEE = 30;

export const GroceryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Shimla Apple
      { product: INITIAL_PRODUCTS[5], quantity: 2 }, // Jyoti Potato
      { product: INITIAL_PRODUCTS[10], quantity: 1 } // Farm Fresh Milk
    ];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['prod-mango', 'prod-paneer'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // User profile with persistence & logout support
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('freshmart_current_user');
      if (saved === 'null') return null;
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS[0];
  });

  // Current main view: 'store' or dedicated 'auth' (Log In / Log Out page)
  const [activeView, setActiveView] = useState<'store' | 'auth'>('store');
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('freshmart_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.setItem('freshmart_current_user', 'null');
    }
  }, [currentUser]);

  // Auth Operations
  const login = (email: string) => {
    const clean = email.trim().toLowerCase();
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === clean || u.phone.includes(clean));
    if (found) {
      setCurrentUser(found);
      const greeting = `Welcome back, ${found.name.split(' ')[0]}!`;
      setAuthNotification(greeting);
      setTimeout(() => setAuthNotification(null), 4000);
      return { success: true, message: `Logged in as ${found.name}` };
    }
    
    // Create session for user
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ') || 'FreshMart Customer',
      email: clean,
      phone: '+91 98300 12345',
      role: 'customer',
      savedAddresses: [
        {
          id: 'addr-default',
          label: 'Home Address',
          address: 'Flat 3B, Lake Gardens Enclave',
          locality: 'Jadavpur & Dhakuria',
          pinCode: '700032'
        }
      ]
    };
    setCurrentUser(newUser);
    setAuthNotification(`Welcome to FreshMart, ${newUser.name}!`);
    setTimeout(() => setAuthNotification(null), 4000);
    return { success: true, message: `Logged in as ${newUser.name}` };
  };

  const logout = () => {
    const name = currentUser?.name?.split(' ')[0] || 'User';
    setCurrentUser(null);
    setAuthNotification(`You have successfully logged out.`);
    setTimeout(() => setAuthNotification(null), 4000);
  };

  const register = (data: { name: string; email: string; phone: string; address: string; locality: string; pinCode: string }) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'customer',
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Primary Home',
          address: data.address.trim(),
          locality: data.locality,
          pinCode: data.pinCode
        }
      ]
    };
    setCurrentUser(newUser);
    setAuthNotification(`Account created successfully! Welcome, ${newUser.name.split(' ')[0]}.`);
    setTimeout(() => setAuthNotification(null), 4000);
    return { success: true, message: 'Account registered successfully!' };
  };

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [activeOrderFilter, setActiveOrderFilter] = useState<'All' | OrderStatus>('All');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('freshmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('freshmart_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart operations
  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.stockCount || 99) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stockCount || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartDeliveryFee = cartSubtotal >= FREE_DELIVERY_THRESHOLD || cartSubtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);

  // Re-calculate coupon discount if cart changes
  const calculateCouponDiscount = (subtotal: number, coupon: typeof appliedCoupon) => {
    if (!coupon) return 0;
    const rule = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (!rule || subtotal < rule.minAmount) return 0;
    if (rule.type === 'percent') {
      const disc = Math.round((subtotal * rule.value) / 100);
      return rule.maxDiscount ? Math.min(disc, rule.maxDiscount) : disc;
    }
    return rule.value;
  };

  const cartDiscount = calculateCouponDiscount(cartSubtotal, appliedCoupon);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === cleanCode);
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try FRESH20 or SAVE75.' };
    }
    if (cartSubtotal < coupon.minAmount) {
      return { success: false, message: `Minimum order amount of ₹${coupon.minAmount} required for coupon ${cleanCode}.` };
    }
    const discountAmount = calculateCouponDiscount(cartSubtotal, { code: coupon.code, discount: 0, description: coupon.description });
    setAppliedCoupon({
      code: coupon.code,
      discount: discountAmount,
      description: coupon.description
    });
    return { success: true, message: `Coupon ${coupon.code} applied successfully! You saved ₹${discountAmount}.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order
  const placeOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    locality: string;
    pinCode: string;
    timeSlot: string;
    paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card';
  }): Order => {
    const orderNum = `FM-KOL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      timeSlot: orderData.timeSlot,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      locality: orderData.locality,
      pinCode: orderData.pinCode,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending on Delivery' : 'Paid',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.image
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      total: cartTotal,
      status: 'Placed',
      deliveryPartner: {
        name: 'Sourav Ganguly (FreshMart Fleet)',
        phone: '+91 98300 11223',
        vehicle: 'Ather 450X (WB-01-BK-3341)'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
    if (lastConfirmedOrder?.id === orderId) {
      setLastConfirmedOrder(prev => (prev ? { ...prev, status } : null));
    }
  };

  // Admin Actions
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProd: Product = { ...prodData, id: newId };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const categories: ProductCategory[] = [
    'Fresh Fruits',
    'Vegetables',
    'Dairy Products',
    'Rice & Pulses',
    'Snacks & Bakery',
    'Household Essentials'
  ];

  return (
    <GroceryContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        currentUser,
        activeView,
        authNotification,
        setActiveView,
        setAuthNotification,
        login,
        logout,
        register,
        appliedCoupon,
        searchQuery,
        selectedCategory,
        sortBy,
        isCartOpen,
        isWishlistOpen,
        isCheckoutOpen,
        isAdminModalOpen,
        isOrderTrackingOpen,
        trackingOrderId,
        quickViewProduct,
        lastConfirmedOrder,
        activeOrderFilter,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsCheckoutOpen,
        setIsAdminModalOpen,
        setIsOrderTrackingOpen,
        setTrackingOrderId,
        setQuickViewProduct,
        setLastConfirmedOrder,
        setCurrentUser,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDeliveryFee,
        cartDiscount,
        cartTotal,
        cartItemsCount,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        freeDeliveryRemaining,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        toggleProductStock
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
