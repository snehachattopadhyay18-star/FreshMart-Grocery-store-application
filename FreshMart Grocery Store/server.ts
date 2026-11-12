import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  unit: string;
  image: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isBestOffer?: boolean;
  discountPercent?: number;
  origin: string;
  shelfLife: string;
}

interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  locality?: string;
}

const REVIEWS: ProductReview[] = [
  {
    id: 'rev-app-1',
    productId: 'prod-apple',
    authorName: 'Sneha Chattopadhyay',
    rating: 5,
    date: 'Yesterday',
    comment: 'These Shimla Royal apples are wonderfully crisp with a juicy snap. Arrived ice-cold in 22 mins with zero bruises!',
    verifiedBuyer: true,
    locality: 'Salt Lake City, Sector 1'
  },
  {
    id: 'rev-app-2',
    productId: 'prod-apple',
    authorName: 'Ananya Sen',
    rating: 5,
    date: '3 days ago',
    comment: 'Natural orchard sweetness without any artificial wax coating. Kids love them in their school tiffin.',
    verifiedBuyer: true,
    locality: 'Park Street'
  },
  {
    id: 'rev-app-3',
    productId: 'prod-apple',
    authorName: 'Rahul Roy',
    rating: 4,
    date: '1 week ago',
    comment: 'Great uniform sizing and very fresh. Will definitely order on weekly repeat.',
    verifiedBuyer: true,
    locality: 'Jadavpur'
  },
  {
    id: 'rev-milk-1',
    productId: 'prod-milk',
    authorName: 'Debabrata Mukherjee',
    rating: 5,
    date: 'Today, 7:15 AM',
    comment: 'Thick malai layer after boiling! The daily 6:30 AM delivery slot has made mornings completely hassle-free.',
    verifiedBuyer: true,
    locality: 'New Town Action Area 1'
  },
  {
    id: 'rev-milk-2',
    productId: 'prod-milk',
    authorName: 'Moushumi Banerjee',
    rating: 5,
    date: '4 days ago',
    comment: 'Very pure cow milk taste. Subscribed for everyday delivery with the 5% discount.',
    verifiedBuyer: true,
    locality: 'Ballygunge'
  },
  {
    id: 'rev-pan-1',
    productId: 'prod-paneer',
    authorName: 'Sourav Ganguly',
    rating: 5,
    date: '2 days ago',
    comment: 'Softest paneer in Kolkata. Doesn’t turn rubbery when cooked in shahi gravy. Pure dairy aroma.',
    verifiedBuyer: true,
    locality: 'Behala'
  },
  {
    id: 'rev-pan-2',
    productId: 'prod-paneer',
    authorName: 'Priya Sen',
    rating: 5,
    date: '5 days ago',
    comment: 'Freshly cut and soaked in chilled whey. Melt-in-mouth texture for our Sunday paneer butter masala.',
    verifiedBuyer: true,
    locality: 'Salt Lake Sector V'
  },
  {
    id: 'rev-ban-1',
    productId: 'prod-banana',
    authorName: 'Ritu Datta',
    rating: 5,
    date: 'Yesterday',
    comment: 'Spot-on ripeness, sweet and clean. None of the black overripe spots you get in local bazaars.',
    verifiedBuyer: true,
    locality: 'Gariahat'
  },
  {
    id: 'rev-spin-1',
    productId: 'prod-spinach',
    authorName: 'Arjun Bose',
    rating: 5,
    date: '3 days ago',
    comment: 'Dewy, tender leaves with roots trimmed cleanly. Perfect for palak paneer.',
    verifiedBuyer: true,
    locality: 'Alipore'
  },
  {
    id: 'rev-rice-1',
    productId: 'prod-rice',
    authorName: 'Amitava Roy',
    rating: 5,
    date: 'Last week',
    comment: 'Long, aromatic grains that cook up separate and fragrant. Ideal for Kolkata style chicken biryani.',
    verifiedBuyer: true,
    locality: 'Dum Dum'
  }
];

function getFallbackReviewsForProduct(p: Product): ProductReview[] {
  return [
    {
      id: `rev-${p.id}-fb1`,
      productId: p.id,
      authorName: 'Pooja Dutta',
      rating: 5,
      date: '2 days ago',
      comment: `Consistently farm fresh quality. Ordered ${p.name} and was impressed by the prompt 25-minute dispatch and clean packaging.`,
      verifiedBuyer: true,
      locality: 'Salt Lake City'
    },
    {
      id: `rev-${p.id}-fb2`,
      productId: p.id,
      authorName: 'Subhashish Mitra',
      rating: 4,
      date: '5 days ago',
      comment: `Very good value for ₹${p.price}. Freshness matches or beats our local morning market with doorstep convenience.`,
      verifiedBuyer: true,
      locality: 'Ballygunge'
    }
  ];
}

function getProductSpecs(p: Product) {
  let nutrition = 'Rich in natural nutrients and essential vitamins.';
  let storage = 'Store in a cool, dry place away from direct sunlight.';
  
  if (p.category === 'Fruits') {
    nutrition = 'Approx. 52-85 kcal per serving · High in dietary fiber & Vitamin C · 100% naturally sweet';
    storage = 'Store at room temperature until ripe, then refrigerate below 5°C.';
  } else if (p.category === 'Vegetables') {
    nutrition = 'Low calorie, nutrient-dense · Rich in iron, folate & potassium · Pesticide-residue inspected';
    storage = 'Keep chilled in vegetable crisper drawer for up to 5-7 days.';
  } else if (p.category === 'Dairy') {
    nutrition = 'High quality dairy protein & calcium · 100% pure milk without synthetic preservatives';
    storage = 'Keep refrigerated at 2°C - 4°C at all times. Consume within shelf life.';
  } else if (p.category === 'Staples') {
    nutrition = 'Complex carbohydrates & essential dietary fiber · Low glycemic index · Unpolished whole grains';
    storage = 'Store in an airtight container in a dry, ventilated pantry.';
  } else if (p.category === 'Snacks' || p.category === 'Beverages') {
    nutrition = 'Premium ingredients · No added artificial colors or harmful chemical preservatives';
    storage = 'Keep sealed in a cool, dry place. Consume beverages chilled.';
  }

  return {
    origin: p.origin || 'Certified FreshMart Partner Farm, Bengal / India',
    shelfLife: p.shelfLife || '3 to 7 days from harvest dispatch',
    storage,
    nutrition,
    freshnessGuarantee: '100% Instant Freshness Guarantee: If not satisfied upon delivery, get an instant replacement or refund.'
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  savedAddress?: any;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  landmark?: string;
  locality?: string;
  city: string;
  pinCode: string;
  paymentMethod: string;
  paymentStatus: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

// In-Memory Database
const PRODUCTS: Product[] = [
  // 1. Fresh Fruits
  {
    id: 'prod-apple',
    name: 'Fresh Apples (Shimla Royal)',
    category: 'Fruits',
    price: 160,
    originalPrice: 190,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, sweet, and juiciest hand-selected Shimla apples, rich in dietary fiber and vitamin C.',
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewsCount: 38,
    isPopular: true,
    isBestOffer: true,
    discountPercent: 15,
    origin: 'Shimla, Himachal Pradesh',
    shelfLife: '7 days from delivery'
  },
  {
    id: 'prod-banana',
    name: 'Fresh Bananas (Robusta)',
    category: 'Fruits',
    price: 60,
    originalPrice: 70,
    unit: '1 dozen',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally ripened, nutrient-dense bananas packed with potassium. Perfect for breakfast smoothies.',
    inStock: true,
    stockCount: 60,
    rating: 4.7,
    reviewsCount: 52,
    isPopular: true,
    isBestOffer: false,
    origin: 'Hooghly, West Bengal',
    shelfLife: '3-4 days at room temperature'
  },
  {
    id: 'prod-orange',
    name: 'Nagpur Sweet Oranges',
    category: 'Fruits',
    price: 100,
    originalPrice: 130,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy, fragrant Nagpur oranges bursting with citrus flavor and natural immune-boosting Vitamin C.',
    inStock: true,
    stockCount: 30,
    rating: 4.6,
    reviewsCount: 29,
    isPopular: false,
    isBestOffer: true,
    discountPercent: 23,
    origin: 'Nagpur, Maharashtra',
    shelfLife: '6 days'
  },
  {
    id: 'prod-grapes',
    name: 'Seedless Black Grapes',
    category: 'Fruits',
    price: 90,
    originalPrice: 110,
    unit: '500 g',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    description: 'Plump, crispy, sweet black seedless grapes. Washed and packed in protective clamshell punnet.',
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviewsCount: 19,
    origin: 'Nashik, Maharashtra',
    shelfLife: '5 days refrigerated'
  },
  {
    id: 'prod-mango',
    name: 'Himsagar Mango (Seasonal Premium)',
    category: 'Fruits',
    price: 180,
    originalPrice: 220,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    description: 'Famous Bengal royal Himsagar mangoes with melt-in-mouth pulp and rich fragrant sweetness.',
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewsCount: 64,
    isPopular: true,
    isBestOffer: true,
    discountPercent: 18,
    origin: 'Malda, West Bengal',
    shelfLife: '4-5 days'
  },

  // 2. Vegetables
  {
    id: 'prod-potato',
    name: 'Fresh Jyoti Potato',
    category: 'Vegetables',
    price: 30,
    originalPrice: 35,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Firm, cleaned earthy potatoes ideal for aloo dum, fries, curries, and daily kitchen dishes.',
    inStock: true,
    stockCount: 120,
    rating: 4.7,
    reviewsCount: 44,
    isPopular: true,
    origin: 'Burdwan, West Bengal',
    shelfLife: '14 days'
  },
  {
    id: 'prod-tomato',
    name: 'Country Red Tomatoes',
    category: 'Vegetables',
    price: 40,
    originalPrice: 50,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Vine-ripened, tangy red tomatoes packed with antioxidants and juicy flavor for curries and salads.',
    inStock: true,
    stockCount: 75,
    rating: 4.8,
    reviewsCount: 39,
    isPopular: true,
    isBestOffer: true,
    discountPercent: 20,
    origin: 'Nadia, West Bengal',
    shelfLife: '6 days'
  },
  {
    id: 'prod-onion',
    name: 'Red Nashik Onions',
    category: 'Vegetables',
    price: 35,
    originalPrice: 45,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp and pungent red onions with tight skins, long storage life, and balanced culinary flavor.',
    inStock: true,
    stockCount: 90,
    rating: 4.6,
    reviewsCount: 51,
    origin: 'Nashik, Maharashtra',
    shelfLife: '14 days in dry area'
  },
  {
    id: 'prod-carrot',
    name: 'Fresh Orange Carrots',
    category: 'Vegetables',
    price: 45,
    originalPrice: 55,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80',
    description: 'Crunchy sweet carrots harvested fresh, rich in Beta Carotene and Vitamin A.',
    inStock: true,
    stockCount: 40,
    rating: 4.5,
    reviewsCount: 22,
    origin: 'Ranchi, Jharkhand',
    shelfLife: '7 days'
  },
  {
    id: 'prod-spinach',
    name: 'Tender Green Spinach (Palak)',
    category: 'Vegetables',
    price: 25,
    originalPrice: 30,
    unit: '1 bunch (250g)',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    description: 'Tender, farm-cut green spinach leaves washed clean, loaded with iron and folic acid.',
    inStock: true,
    stockCount: 35,
    rating: 4.7,
    reviewsCount: 28,
    origin: 'Barasat, West Bengal',
    shelfLife: '2-3 days refrigerated'
  },

  // 3. Dairy Products
  {
    id: 'prod-milk',
    name: 'Farm Fresh Toned Milk',
    category: 'Dairy',
    price: 60,
    originalPrice: 65,
    unit: '1 litre',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: 'Pasteurized, homogenized pure cow milk with 3.0% fat. Chilled delivery guarantee.',
    inStock: true,
    stockCount: 80,
    rating: 4.9,
    reviewsCount: 95,
    isPopular: true,
    origin: 'Local Dairy Cooperative, Haringhata',
    shelfLife: '2 days refrigerated'
  },
  {
    id: 'prod-paneer',
    name: 'Fresh Malai Paneer',
    category: 'Dairy',
    price: 90,
    originalPrice: 105,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    description: 'Soft, melt-in-mouth creamy paneer made from fresh cow milk. No preservatives or starch added.',
    inStock: true,
    stockCount: 40,
    rating: 4.8,
    reviewsCount: 67,
    isPopular: true,
    isBestOffer: true,
    discountPercent: 14,
    origin: 'FreshMart Artisanal Creamery',
    shelfLife: '4 days refrigerated'
  },
  {
    id: 'prod-butter',
    name: 'Salted Table Butter',
    category: 'Dairy',
    price: 55,
    originalPrice: 60,
    unit: '100 g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    description: 'Rich, creamy golden butter churned from pure cream. Perfect for toast, parathas, and cooking.',
    inStock: true,
    stockCount: 50,
    rating: 4.7,
    reviewsCount: 33,
    origin: 'Amul Dairy Hub',
    shelfLife: '6 months refrigerated'
  },
  {
    id: 'prod-cheese',
    name: 'Cheddar Cheese Slices',
    category: 'Dairy',
    price: 120,
    originalPrice: 140,
    unit: '200 g (10 slices)',
    image: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&w=600&q=80',
    description: 'Individually wrapped creamy cheddar slices for burgers, sandwiches, and quick snacks.',
    inStock: true,
    stockCount: 28,
    rating: 4.6,
    reviewsCount: 26,
    origin: 'Britannia Dairy Unit',
    shelfLife: '9 months'
  },
  {
    id: 'prod-curd',
    name: 'Artisanal Thick Dahi (Curd)',
    category: 'Dairy',
    price: 35,
    originalPrice: 40,
    unit: '400 g tub',
    image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80',
    description: 'Set natural curd with smooth texture and pleasant mild sourness, packed with healthy probiotics.',
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewsCount: 37,
    origin: 'Mother Dairy Kolkata',
    shelfLife: '7 days'
  },

  // 4. Rice & Pulses
  {
    id: 'prod-rice',
    name: 'Premium Basmati Rice (Long Grain)',
    category: 'Staples',
    price: 65,
    originalPrice: 85,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Aged long-grain basmati with delicate aroma and fluffy non-sticky grains upon cooking.',
    inStock: true,
    stockCount: 70,
    rating: 4.7,
    reviewsCount: 48,
    isPopular: true,
    isBestOffer: true,
    discountPercent: 24,
    origin: 'Karnal, Haryana',
    shelfLife: '12 months'
  },
  {
    id: 'prod-moong-dal',
    name: 'Yellow Moong Dal (Unpolished)',
    category: 'Staples',
    price: 120,
    originalPrice: 140,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Nutritious split yellow lentils without artificial polish. High in plant protein and easy to digest.',
    inStock: true,
    stockCount: 55,
    rating: 4.8,
    reviewsCount: 35,
    isPopular: true,
    origin: 'Indore, Madhya Pradesh',
    shelfLife: '12 months'
  },
  {
    id: 'prod-flour',
    name: 'Chakki Fresh Whole Wheat Atta',
    category: 'Staples',
    price: 48,
    originalPrice: 56,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: '100% whole grain wheat stoneground flour for soft, fluffy rotis and nutritious chapatis.',
    inStock: true,
    stockCount: 85,
    rating: 4.8,
    reviewsCount: 42,
    origin: 'Aashirvaad Unit, Howrah',
    shelfLife: '3 months'
  },
  {
    id: 'prod-chana',
    name: 'Desi Brown Chana',
    category: 'Staples',
    price: 95,
    originalPrice: 110,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    description: 'Fiber-rich desi chickpeas suitable for ghugni, sprouting, and savory breakfast chaats.',
    inStock: true,
    stockCount: 35,
    rating: 4.6,
    reviewsCount: 20,
    origin: 'Rajasthan',
    shelfLife: '12 months'
  },
  {
    id: 'prod-rajma',
    name: 'Chitra Red Kidney Beans (Rajma)',
    category: 'Staples',
    price: 130,
    originalPrice: 155,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=600&q=80',
    description: 'Plump Himalayan Chitra rajma that cooks soft and velvety for authentic delicious curries.',
    inStock: true,
    stockCount: 40,
    rating: 4.7,
    reviewsCount: 31,
    origin: 'Jammu & Kashmir',
    shelfLife: '12 months'
  },

  // 5. Snacks & Bakery
  {
    id: 'prod-bread',
    name: 'White Sandwich Bread (Fresh Sliced)',
    category: 'Snacks',
    price: 40,
    originalPrice: 45,
    unit: '1 packet (400g)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'Freshly baked soft white sandwich loaf delivered same day from local bakery.',
    inStock: true,
    stockCount: 50,
    rating: 4.6,
    reviewsCount: 33,
    isPopular: true,
    origin: 'Bakehouse Kolkata',
    shelfLife: '4 days'
  },
  {
    id: 'prod-biscuits',
    name: 'Marie Gold Tea Biscuits',
    category: 'Snacks',
    price: 30,
    originalPrice: 35,
    unit: '1 packet (250g)',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp tea-time wheat biscuits enriched with 10 essential vitamins, ideal for chai dunking.',
    inStock: true,
    stockCount: 65,
    rating: 4.8,
    reviewsCount: 50,
    origin: 'Britannia Kolkata Plant',
    shelfLife: '6 months'
  },
  {
    id: 'prod-chips',
    name: 'Classic Salted Potato Crisps',
    category: 'Snacks',
    price: 20,
    originalPrice: 20,
    unit: '1 packet (50g)',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy wafer thin golden potato chips lightly seasoned with rock salt.',
    inStock: true,
    stockCount: 80,
    rating: 4.5,
    reviewsCount: 27,
    origin: 'Frito-Lay India',
    shelfLife: '4 months'
  },
  {
    id: 'prod-cakes',
    name: 'Rich Fruit Cake Slices',
    category: 'Snacks',
    price: 60,
    originalPrice: 75,
    unit: '1 pack (150g)',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    description: 'Soft butter cake packed with candied fruit, cherries, and raisins. A Kolkata favorite.',
    inStock: true,
    stockCount: 30,
    rating: 4.7,
    reviewsCount: 18,
    origin: 'Flurys Heritage Kitchens, Kolkata',
    shelfLife: '20 days'
  },

  // 6. Beverages
  {
    id: 'prod-juice',
    name: 'Cold Pressed Orange Juice',
    category: 'Beverages',
    price: 95,
    originalPrice: 120,
    unit: '1 litre bottle',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    description: '100% pure cold-pressed Valencia orange juice without added sugar or preservatives.',
    inStock: true,
    stockCount: 35,
    rating: 4.8,
    reviewsCount: 41,
    isPopular: true,
    origin: 'FreshMart Fresh Juice Bar',
    shelfLife: '3 days refrigerated'
  },
  {
    id: 'prod-coconut',
    name: 'Natural Tender Coconut Water',
    category: 'Beverages',
    price: 50,
    originalPrice: 60,
    unit: '1 bottle (300ml)',
    image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=600&q=80',
    description: 'Pure isotonic natural coconut water harvested directly from coastal Bengal green coconuts.',
    inStock: true,
    stockCount: 50,
    rating: 4.9,
    reviewsCount: 62,
    isPopular: true,
    origin: 'South 24 Parganas, WB',
    shelfLife: '5 days refrigerated'
  },

  // 7. Household Essentials
  {
    id: 'prod-detergent',
    name: 'Surf Active Matic Detergent',
    category: 'Household',
    price: 110,
    originalPrice: 135,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    description: 'Advanced stain removal enzyme formula safe for top and front load washing machines.',
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviewsCount: 36,
    isPopular: true,
    isBestOffer: true,
    discountPercent: 18,
    origin: 'Hindustan Unilever Ltd',
    shelfLife: '24 months'
  },
  {
    id: 'prod-soap',
    name: 'Neem & Aloe Herbal Bath Soap',
    category: 'Household',
    price: 35,
    originalPrice: 40,
    unit: '1 bar (125g)',
    image: 'https://images.unsplash.com/photo-1607006314644-8d9620d4370a?auto=format&fit=crop&w=600&q=80',
    description: 'Natural antiseptic bathing bar enriched with pure neem leaf extract and moisturizing aloe vera.',
    inStock: true,
    stockCount: 60,
    rating: 4.6,
    reviewsCount: 22,
    origin: 'Godrej Consumer Products',
    shelfLife: '36 months'
  },
  {
    id: 'prod-cleaner',
    name: 'Citrus Floor Disinfectant',
    category: 'Household',
    price: 85,
    originalPrice: 99,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=600&q=80',
    description: 'Kills 99.9% germs, leaves long-lasting fresh citrus aroma, and is safe on marble and tiles.',
    inStock: true,
    stockCount: 35,
    rating: 4.7,
    reviewsCount: 19,
    origin: 'Reckitt Benckiser India',
    shelfLife: '24 months'
  },
  {
    id: 'prod-tissue',
    name: '2-Ply Kitchen Paper Towel Roll',
    category: 'Household',
    price: 45,
    originalPrice: 55,
    unit: '1 roll (60 pulls)',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
    description: 'Extra absorbent 100% virgin pulp embossed sheets for drying greens and wiping kitchen spills.',
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewsCount: 24,
    origin: 'Origami Hygiene',
    shelfLife: 'No expiry'
  }
];

// Users and Sessions
const USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Rahul Roy',
    email: 'rahul.roy@gmail.com',
    password: 'password123',
    phone: '9830567890',
    savedAddress: {
      fullName: 'Rahul Roy',
      phone: '9830567890',
      addressLine: 'Flat 302, Green View Residency, Jadavpur',
      landmark: 'Near 8B Bus Stand',
      city: 'Kolkata',
      pinCode: '700032'
    }
  },
  {
    id: 'usr-2',
    name: 'Priya Sen',
    email: 'priya@freshmart.com',
    password: 'password123',
    phone: '9830112233',
    savedAddress: {
      fullName: 'Priya Sen',
      phone: '9830112233',
      addressLine: 'Tower 4, Flat 701, Rosedale Gardens',
      landmark: 'Near Eco Park Gate 2',
      city: 'Kolkata',
      pinCode: '700156'
    }
  },
  {
    id: 'usr-3',
    name: 'Sneha Chattopadhyay',
    email: 'snehachattopadhyay18@gmail.com',
    password: 'password123',
    phone: '9830887766',
    savedAddress: {
      fullName: 'Sneha Chattopadhyay',
      phone: '9830887766',
      addressLine: 'Block CD, Sector 1, Salt Lake City',
      landmark: 'Near City Centre 1',
      city: 'Kolkata',
      pinCode: '700064'
    }
  }
];

// In-memory sessions token -> userId
const SESSIONS = new Map<string, string>();
// Pre-populate a session for demo testing if needed
SESSIONS.set('demo_token_rahul', 'usr-1');
SESSIONS.set('demo_token_sneha', 'usr-3');

// In-memory cart store: sessionOrUserId -> CartItem[]
const CARTS = new Map<string, CartItem[]>();

// In-memory wishlist store: sessionOrUserId -> Set of productIds
const WISHLISTS = new Map<string, Set<string>>();

// In-memory orders store
const ORDERS: Order[] = [
  {
    id: 'FM-KOL-9104',
    userId: 'usr-3',
    customerName: 'Sneha Chattopadhyay',
    customerPhone: '9830887766',
    shippingAddress: 'Block CD, Sector 1, Salt Lake City',
    landmark: 'Near City Centre 1',
    locality: 'Salt Lake Sector V',
    city: 'Kolkata',
    pinCode: '700064',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending on Delivery',
    items: [
      {
        productId: 'prod-apple',
        productName: 'Fresh Apples (Shimla Royal)',
        price: 160,
        quantity: 1,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-paneer',
        productName: 'Fresh Malai Paneer',
        price: 95,
        quantity: 2,
        unit: '200g pack',
        image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-milk',
        productName: 'Farm Fresh Toned Milk',
        price: 60,
        quantity: 1,
        unit: '1 litre',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 410,
    deliveryFee: 0,
    total: 410,
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    estimatedDelivery: 'Arriving in ~15 mins'
  },
  {
    id: 'FM-KOL-8750',
    userId: 'usr-3',
    customerName: 'Sneha Chattopadhyay',
    customerPhone: '9830887766',
    shippingAddress: 'Block CD, Sector 1, Salt Lake City',
    landmark: 'Near City Centre 1',
    locality: 'Salt Lake Sector V',
    city: 'Kolkata',
    pinCode: '700064',
    paymentMethod: 'UPI (GPay)',
    paymentStatus: 'Paid',
    items: [
      {
        productId: 'prod-rice',
        productName: 'Fortune Biryani Basmati Rice',
        price: 195,
        quantity: 2,
        unit: '1 kg pack',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-banana',
        productName: 'Fresh Bananas (Robusta)',
        price: 55,
        quantity: 1,
        unit: '1 dozen (12 pcs)',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 445,
    deliveryFee: 0,
    total: 445,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    estimatedDelivery: 'Delivered on March 2nd'
  },
  {
    id: 'FM-KOL-8921',
    userId: 'usr-1',
    customerName: 'Rahul Roy',
    customerPhone: '9830567890',
    shippingAddress: 'Flat 302, Green View Residency, Jadavpur',
    landmark: 'Near 8B Bus Stand',
    locality: 'Jadavpur & Dhakuria',
    city: 'Kolkata',
    pinCode: '700032',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending on Delivery',
    items: [
      {
        productId: 'prod-apple',
        productName: 'Fresh Apples (Shimla Royal)',
        price: 160,
        quantity: 1,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-milk',
        productName: 'Farm Fresh Toned Milk',
        price: 60,
        quantity: 2,
        unit: '1 litre',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 280,
    deliveryFee: 0,
    total: 280,
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    estimatedDelivery: 'Today within 30 mins'
  }
];

// Recipes data for 1-Click Recipe-to-Cart
interface Recipe {
  id: string;
  name: string;
  tagline: string;
  category: string;
  prepTime: string;
  servings: string;
  difficulty: string;
  image: string;
  ingredients: Array<{
    productId: string;
    productName: string;
    price: number;
    unit: string;
    image: string;
  }>;
  totalPrice: number;
  instructions: string[];
}

const RECIPES: Recipe[] = [
  {
    id: 'rec-paneer',
    name: 'Royal Shahi Paneer Delight',
    tagline: 'Rich creamy paneer in velvety tomato & onion gravy',
    category: 'Dinner Specials',
    prepTime: '25 mins',
    servings: '3-4 persons',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { productId: 'prod-paneer', productName: 'Fresh Malai Paneer', price: 90, unit: '200 g', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-tomato', productName: 'Country Red Tomatoes', price: 40, unit: '1 kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-onion', productName: 'Red Nashik Onions', price: 35, unit: '1 kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-butter', productName: 'Salted Table Butter', price: 55, unit: '100 g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80' }
    ],
    totalPrice: 220,
    instructions: [
      'Gently sauté sliced onions in butter until golden brown.',
      'Blend country red tomatoes into a smooth purée and simmer with spices.',
      'Add freshly diced malai paneer cubes and simmer on low flame for 6 minutes.',
      'Serve hot with fresh rotis or steaming basmati rice.'
    ]
  },
  {
    id: 'rec-aloo-dum',
    name: 'Kolkata Breakfast Aloo Dum Feast',
    tagline: 'Spicy baby potato curry with fluffy whole wheat rotis',
    category: 'Breakfast & Lunch',
    prepTime: '20 mins',
    servings: '4 persons',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { productId: 'prod-potato', productName: 'Fresh Jyoti Potato', price: 30, unit: '1 kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-flour', productName: 'Chakki Fresh Whole Wheat Atta', price: 48, unit: '1 kg', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-tomato', productName: 'Country Red Tomatoes', price: 40, unit: '1 kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-curd', productName: 'Artisanal Thick Dahi (Curd)', price: 35, unit: '400 g tub', image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80' }
    ],
    totalPrice: 153,
    instructions: [
      'Parboil Jyoti potatoes and lightly fry until golden crisp.',
      'Whisk thick dahi with turmeric, cumin, and ginger-chili paste.',
      'Simmer potatoes in aromatic yogurt-tomato sauce till thick and glistening.',
      'Knead fresh wheat atta and prepare hot, puffed rotis or luchis.'
    ]
  },
  {
    id: 'rec-smoothie',
    name: 'Sunrise Vitality Fruit & Milk Bowl',
    tagline: 'Nutrient-rich power breakfast with fresh orchard fruits',
    category: 'Healthy Living',
    prepTime: '10 mins',
    servings: '2 persons',
    difficulty: 'Super Quick',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { productId: 'prod-apple', productName: 'Fresh Apples (Shimla Royal)', price: 160, unit: '1 kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-banana', productName: 'Fresh Bananas (Robusta)', price: 60, unit: '1 dozen', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-orange', productName: 'Nagpur Sweet Oranges', price: 100, unit: '1 kg', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80' },
      { productId: 'prod-milk', productName: 'Farm Fresh Toned Milk', price: 60, unit: '1 litre', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' }
    ],
    totalPrice: 380,
    instructions: [
      'Dice Shimla apples and slice ripe Robusta bananas.',
      'Extract freshly squeezed Nagpur orange juice.',
      'Blend banana slices with chilled farm fresh milk until thick and frothy.',
      'Top with diced apples and orange segments for an energizing start.'
    ]
  }
];

// Subscriptions data
interface Subscription {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  frequency: string;
  timeSlot: string;
  price: number;
  discountedPrice: number;
  status: string;
  nextDelivery: string;
  createdAt: string;
}

const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-101',
    userId: 'usr-1',
    productId: 'prod-milk',
    productName: 'Farm Fresh Toned Milk (1 Litre)',
    frequency: 'Daily',
    timeSlot: 'Morning (6:30 AM - 7:30 AM)',
    price: 60,
    discountedPrice: 57,
    status: 'Active',
    nextDelivery: 'Tomorrow at 7:00 AM',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sub-102',
    userId: 'usr-3',
    productId: 'prod-milk',
    productName: 'Farm Fresh Toned Milk (1 Litre)',
    frequency: 'Daily',
    timeSlot: 'Morning (6:30 AM - 7:30 AM)',
    price: 60,
    discountedPrice: 57,
    status: 'Active',
    nextDelivery: 'Tomorrow at 7:00 AM',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sub-103',
    userId: 'usr-3',
    productId: 'prod-bread',
    productName: 'White Sandwich Bread',
    frequency: 'Every 2 Days',
    timeSlot: 'Morning (7:30 AM - 8:30 AM)',
    price: 40,
    discountedPrice: 38,
    status: 'Active',
    nextDelivery: 'Tomorrow at 8:00 AM',
    createdAt: new Date().toISOString()
  }
];

// Express Delivery Localities in Kolkata
const LOCALITIES = [
  { id: 'loc-saltlake', name: 'Salt Lake Sector V', pin: '700091', eta: '20-25 mins', hub: 'Salt Lake Central Hub', freeDeliveryAbove: 149, isExpress: true },
  { id: 'loc-newtown', name: 'New Town Action Area I & II', pin: '700156', eta: '25-30 mins', hub: 'Rajarhat Express Hub', freeDeliveryAbove: 149, isExpress: true },
  { id: 'loc-parkst', name: 'Park Street & Camac Street', pin: '700016', eta: '30-35 mins', hub: 'Central Kolkata Hub', freeDeliveryAbove: 199, isExpress: true },
  { id: 'loc-ballygunge', name: 'Ballygunge & Gariahat', pin: '700019', eta: '30-35 mins', hub: 'South Kolkata Hub', freeDeliveryAbove: 199, isExpress: true },
  { id: 'loc-jadavpur', name: 'Jadavpur & Dhakuria', pin: '700032', eta: '35-40 mins', hub: 'Jadavpur Hub', freeDeliveryAbove: 199, isExpress: false },
  { id: 'loc-behala', name: 'Behala & Tollygunge', pin: '700034', eta: '40-45 mins', hub: 'Behala Chowrasta Hub', freeDeliveryAbove: 199, isExpress: false },
  { id: 'loc-dumdum', name: 'Dum Dum & Nagerbazar', pin: '700028', eta: '30-35 mins', hub: 'North Kolkata Hub', freeDeliveryAbove: 199, isExpress: true },
  { id: 'loc-howrah', name: 'Howrah Station & Shibpur', pin: '711101', eta: '45 mins', hub: 'Howrah Hub', freeDeliveryAbove: 199, isExpress: false }
];

// Helper to extract user ID from Authorization header or session cookie
function getSessionKey(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (SESSIONS.has(token)) {
      return SESSIONS.get(token)!;
    }
    return token;
  }
  const clientKey = req.headers['x-session-id'] as string;
  if (clientKey) return clientKey;
  return 'guest-default';
}

function getUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  const userId = SESSIONS.get(token);
  if (!userId) return null;
  return USERS.find(u => u.id === userId) || null;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Log requests for debugging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // ==================== API ENDPOINTS ====================

  // 1. Products API
  app.get('/api/products', (req: Request, res: Response) => {
    let list = [...PRODUCTS];
    const category = req.query.category as string;
    const search = req.query.search as string;
    const sort = req.query.sort as string;

    if (category && category !== 'all' && category !== 'All') {
      const catLower = category.toLowerCase();
      list = list.filter(p => {
        const pCat = p.category.toLowerCase();
        if (pCat === catLower) return true;
        if (catLower === 'fruits' && pCat.includes('fruit')) return true;
        if (catLower === 'vegetables' && pCat.includes('veg')) return true;
        if (catLower === 'dairy' && pCat.includes('dairy')) return true;
        if (catLower === 'snacks' && (pCat.includes('snack') || pCat.includes('bakery'))) return true;
        if (catLower === 'beverages' && (pCat.includes('beverage') || pCat.includes('drink'))) return true;
        if (catLower === 'staples' && (pCat.includes('staple') || pCat.includes('rice') || pCat.includes('pulse'))) return true;
        if (catLower === 'household' && pCat.includes('house')) return true;
        return false;
      });
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      );
    }

    if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'high') {
      list.sort((a, b) => b.price - a.price);
    }

    res.json({
      success: true,
      count: list.length,
      products: list
    });
  });

  // Single Product with Reviews & Specs
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const p = PRODUCTS.find(prod => prod.id === req.params.id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let prodReviews = REVIEWS.filter(r => r.productId === p.id);
    if (prodReviews.length === 0) {
      prodReviews = getFallbackReviewsForProduct(p);
    }

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    prodReviews.forEach(r => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating)));
      distribution[star] = (distribution[star] || 0) + 1;
    });

    const total = prodReviews.length;
    const percentages = {
      5: total > 0 ? Math.round((distribution[5] / total) * 100) : 75,
      4: total > 0 ? Math.round((distribution[4] / total) * 100) : 18,
      3: total > 0 ? Math.round((distribution[3] / total) * 100) : 5,
      2: total > 0 ? Math.round((distribution[2] / total) * 100) : 1,
      1: total > 0 ? Math.round((distribution[1] / total) * 100) : 1
    };

    const specs = getProductSpecs(p);

    res.json({
      success: true,
      product: p,
      reviews: prodReviews,
      stats: {
        averageRating: p.rating,
        totalReviews: p.reviewsCount || prodReviews.length,
        distribution,
        percentages
      },
      specs
    });
  });

  // Post Review
  app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
    const { authorName, rating, comment, locality } = req.body;
    const prod = PRODUCTS.find(p => p.id === req.params.id);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (!comment || !rating) {
      return res.status(400).json({ success: false, message: 'Rating and review comment are required' });
    }

    const user = getUser(req);
    const newRev: ProductReview = {
      id: 'rev-' + Date.now(),
      productId: prod.id,
      authorName: (authorName && authorName.trim()) || (user ? user.name : 'Verified Customer'),
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      date: 'Just now',
      comment: comment.trim(),
      verifiedBuyer: true,
      locality: locality || (user && user.savedAddress ? user.savedAddress.city : 'Kolkata')
    };

    REVIEWS.unshift(newRev);

    // Recalculate product rating & count
    const prodReviews = REVIEWS.filter(r => r.productId === prod.id);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avgRating.toFixed(1));
    prod.reviewsCount = prodReviews.length;

    res.json({
      success: true,
      message: 'Thank you! Your verified review has been posted.',
      review: newRev,
      product: prod,
      reviews: prodReviews
    });
  });

  // Fresh Picks (Auto-scroller marquee items)
  app.get('/api/picks', (_req: Request, res: Response) => {
    const picks = PRODUCTS.filter(p => p.isPopular || p.isBestOffer).slice(0, 8);
    res.json({ success: true, picks });
  });

  // Categories list with counts
  app.get('/api/categories', (_req: Request, res: Response) => {
    const cats = [
      { id: 'all', name: 'All Products', icon: '🛒', count: PRODUCTS.length },
      { id: 'Fruits', name: 'Fruits', icon: '🍎', count: PRODUCTS.filter(p => p.category === 'Fruits').length },
      { id: 'Vegetables', name: 'Vegetables', icon: '🥕', count: PRODUCTS.filter(p => p.category === 'Vegetables').length },
      { id: 'Dairy', name: 'Dairy', icon: '🥛', count: PRODUCTS.filter(p => p.category === 'Dairy').length },
      { id: 'Snacks', name: 'Snacks & Bakery', icon: '🍪', count: PRODUCTS.filter(p => p.category === 'Snacks').length },
      { id: 'Beverages', name: 'Beverages', icon: '🥤', count: PRODUCTS.filter(p => p.category === 'Beverages').length },
      { id: 'Staples', name: 'Rice & Pulses', icon: '🌾', count: PRODUCTS.filter(p => p.category === 'Staples').length },
      { id: 'Household', name: 'Household Essentials', icon: '🧼', count: PRODUCTS.filter(p => p.category === 'Household').length }
    ];
    res.json({ success: true, categories: cats });
  });

  // 2. Authentication API
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = USERS.find(u => u.email === cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: (name && name.trim()) || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: password,
      phone: phone || ''
    };
    USERS.push(newUser);

    const token = 'fm_tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    SESSIONS.set(token, newUser.id);

    res.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        savedAddress: newUser.savedAddress
      }
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = USERS.find(u => u.email === cleanEmail);

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = 'fm_tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    SESSIONS.set(token, user.id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedAddress: user.savedAddress
      }
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not logged in' });
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedAddress: user.savedAddress
      }
    });
  });

  app.put('/api/auth/me', (req: Request, res: Response) => {
    const user = getUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not logged in' });
    }
    const { name, phone, savedAddress } = req.body;
    if (name && name.trim()) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (savedAddress) {
      user.savedAddress = {
        fullName: savedAddress.fullName || user.name,
        phone: savedAddress.phone || user.phone,
        addressLine: savedAddress.addressLine || '',
        landmark: savedAddress.landmark || '',
        city: savedAddress.city || 'Kolkata',
        pinCode: savedAddress.pinCode || ''
      };
    }
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedAddress: user.savedAddress
      }
    });
  });

  app.get('/api/user/dashboard', (req: Request, res: Response) => {
    const user = getUser(req);
    const userOrders = user ? ORDERS.filter(o => o.userId === user.id) : ORDERS.slice(0, 3);
    const userSubs = user ? SUBSCRIPTIONS.filter(s => s.userId === user.id) : [];

    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    const totalSaved = Math.round(totalSpent * 0.12) + (userSubs.length * 60);
    const rewardPoints = Math.floor(totalSpent / 10);

    res.json({
      success: true,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedAddress: user.savedAddress,
        memberSince: 'March 2026',
        tier: totalOrders >= 2 ? 'Gold Shopper' : 'Fresh Starter',
        activeHub: 'Salt Lake Central Hub (Express 20m)'
      } : null,
      stats: {
        totalOrders,
        totalSpent,
        totalSaved,
        rewardPoints,
        activeSubscriptions: userSubs.length
      },
      orders: userOrders,
      subscriptions: userSubs
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      SESSIONS.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // 3. Cart API
  app.get('/api/cart', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const cart = CARTS.get(key) || [];

    let subtotal = 0;
    const items = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      const price = product ? product.price : 0;
      subtotal += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        product
      };
    }).filter(i => i.product != null);

    const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 30;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee,
      total
    });
  });

  app.post('/api/cart', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const { productId, quantity = 1, setExact = false } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = CARTS.get(key) || [];
    const existingIndex = cart.findIndex(i => i.productId === productId);

    if (existingIndex > -1) {
      if (setExact) {
        if (quantity <= 0) {
          cart.splice(existingIndex, 1);
        } else {
          cart[existingIndex].quantity = quantity;
        }
      } else {
        cart[existingIndex].quantity += quantity;
        if (cart[existingIndex].quantity <= 0) {
          cart.splice(existingIndex, 1);
        }
      }
    } else if (quantity > 0) {
      cart.push({ productId, quantity });
    }

    CARTS.set(key, cart);

    // Return updated cart summary
    let subtotal = 0;
    const items = cart.map(item => {
      const p = PRODUCTS.find(prod => prod.id === item.productId);
      const pr = p ? p.price : 0;
      subtotal += pr * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: p
      };
    });

    const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 30;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      cart: items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee,
      total
    });
  });

  app.delete('/api/cart/:productId', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const { productId } = req.params;
    let cart = CARTS.get(key) || [];
    cart = cart.filter(i => i.productId !== productId);
    CARTS.set(key, cart);
    res.json({ success: true, message: 'Item removed from cart' });
  });

  app.delete('/api/cart', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    CARTS.set(key, []);
    res.json({ success: true, message: 'Cart cleared' });
  });

  // 4. Wishlist API
  app.get('/api/wishlist', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const wishlistSet = WISHLISTS.get(key) || new Set<string>();
    const productIds = Array.from(wishlistSet);
    const products = PRODUCTS.filter(p => wishlistSet.has(p.id));

    res.json({
      success: true,
      productIds,
      items: products,
      count: products.length
    });
  });

  app.post('/api/wishlist/toggle', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    let wishlistSet = WISHLISTS.get(key);
    if (!wishlistSet) {
      wishlistSet = new Set<string>();
      WISHLISTS.set(key, wishlistSet);
    }

    let inWishlist = false;
    if (wishlistSet.has(productId)) {
      wishlistSet.delete(productId);
      inWishlist = false;
    } else {
      wishlistSet.add(productId);
      inWishlist = true;
    }

    const products = PRODUCTS.filter(p => wishlistSet!.has(p.id));

    res.json({
      success: true,
      inWishlist,
      count: wishlistSet.size,
      productIds: Array.from(wishlistSet),
      items: products
    });
  });

  // 5. Delivery Address API
  app.post('/api/address', (req: Request, res: Response) => {
    const user = getUser(req);
    const { fullName, phone, addressLine, landmark, city, pinCode } = req.body;

    if (!fullName || !phone || !addressLine || !city || !pinCode) {
      return res.status(400).json({ success: false, message: 'Please fill all required address fields' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }

    const cleanPin = pinCode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit PIN code' });
    }

    const address = {
      fullName,
      phone: cleanPhone,
      addressLine,
      landmark: landmark || '',
      city,
      pinCode: cleanPin
    };

    if (user) {
      user.savedAddress = address;
    }

    res.json({ success: true, address });
  });

  // 6. Orders API
  app.post('/api/orders', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const user = getUser(req);
    const {
      customerName,
      customerPhone,
      shippingAddress,
      landmark,
      locality,
      city,
      pinCode,
      paymentMethod = 'Cash on Delivery',
      items: directItems
    } = req.body;

    // Validate phone and address
    if (!customerName || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Customer name and delivery address are required' });
    }

    // Determine items: either from payload or from session cart
    let orderItems: Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      unit: string;
      image: string;
    }> = [];

    if (Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems.map(item => {
        const prod = PRODUCTS.find(p => p.id === item.productId) || {
          name: item.name || 'Grocery Item',
          price: item.price || 50,
          unit: item.unit || '1 unit',
          image: item.image || ''
        };
        return {
          productId: item.productId,
          productName: prod.name,
          price: prod.price,
          quantity: item.quantity || 1,
          unit: prod.unit,
          image: prod.image
        };
      });
    } else {
      const cart = CARTS.get(key) || [];
      if (cart.length === 0) {
        return res.status(400).json({ success: false, message: 'Your cart is empty. Please add items before ordering.' });
      }
      orderItems = cart.map(item => {
        const prod = PRODUCTS.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: prod ? prod.name : 'Grocery Item',
          price: prod ? prod.price : 0,
          quantity: item.quantity,
          unit: prod ? prod.unit : '1 pc',
          image: prod ? prod.image : ''
        };
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const deliveryFee = subtotal > 199 ? 0 : 30;
    const total = subtotal + deliveryFee;

    const orderId = 'FM-KOL-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: orderId,
      userId: user ? user.id : 'guest',
      customerName,
      customerPhone: customerPhone || (user ? user.phone || '' : ''),
      shippingAddress,
      landmark: landmark || '',
      locality: locality || 'Kolkata Central',
      city: city || 'Kolkata',
      pinCode: pinCode || '700001',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending on Delivery' : 'Paid',
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'Order Confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '30-45 minutes'
    };

    ORDERS.unshift(newOrder);

    // Clear user cart
    CARTS.set(key, []);

    res.json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  });

  app.get('/api/orders', (req: Request, res: Response) => {
    const user = getUser(req);
    if (!user) {
      // Return recent sample orders if guest
      return res.json({ success: true, orders: ORDERS.slice(0, 5) });
    }
    const userOrders = ORDERS.filter(o => o.userId === user.id);
    res.json({ success: true, orders: userOrders });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = ORDERS.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  app.post('/api/orders/:id/reorder', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const order = ORDERS.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const cart = CARTS.get(key) || [];
    for (const item of order.items) {
      const existing = cart.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push({
          productId: item.productId,
          quantity: item.quantity
        });
      }
    }
    CARTS.set(key, cart);
    res.json({ success: true, message: `Added ${order.items.length} items from Order #${order.id} to cart!` });
  });

  // 7. Recipes API (1-Click Recipe-to-Cart)
  app.get('/api/recipes', (_req: Request, res: Response) => {
    res.json({ success: true, recipes: RECIPES });
  });

  app.post('/api/recipes/:id/add-to-cart', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const recipe = RECIPES.find(r => r.id === req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    let cart = CARTS.get(key) || [];
    recipe.ingredients.forEach(ing => {
      const existing = cart.find(i => i.productId === ing.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ productId: ing.productId, quantity: 1 });
      }
    });
    CARTS.set(key, cart);

    res.json({
      success: true,
      message: `Added all ingredients for "${recipe.name}" to your cart!`,
      cartCount: cart.reduce((sum, i) => sum + i.quantity, 0)
    });
  });

  // 8. Localities & Express Delivery ETA API
  app.get('/api/localities', (_req: Request, res: Response) => {
    res.json({ success: true, localities: LOCALITIES });
  });

  // 9. Budget Basket Builder API
  app.post('/api/budget-basket', (req: Request, res: Response) => {
    const key = getSessionKey(req);
    const { budget = 250, autoAdd = false } = req.body;
    const targetBudget = Math.max(100, Math.min(1000, Number(budget) || 250));

    // Smart greedy algorithm: pick high-utility essentials that fit within budget
    const available = PRODUCTS.filter(p => p.inStock);
    // Sort by popular and reasonable price
    const sorted = [...available].sort((a, b) => (b.rating * 10 - b.price) - (a.rating * 10 - a.price));

    const selected: Array<{ product: Product; quantity: number }> = [];
    let currentTotal = 0;

    for (const item of sorted) {
      if (currentTotal + item.price <= targetBudget) {
        selected.push({ product: item, quantity: 1 });
        currentTotal += item.price;
      }
      if (selected.length >= 5 || targetBudget - currentTotal < 20) break;
    }

    if (autoAdd) {
      let cart = CARTS.get(key) || [];
      selected.forEach(s => {
        const existing = cart.find(i => i.productId === s.product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ productId: s.product.id, quantity: 1 });
        }
      });
      CARTS.set(key, cart);
    }

    res.json({
      success: true,
      budget: targetBudget,
      total: currentTotal,
      savings: targetBudget - currentTotal,
      items: selected,
      addedToCart: autoAdd
    });
  });

  // 10. Subscriptions (Subscribe & Save 5%)
  app.get('/api/subscriptions', (req: Request, res: Response) => {
    const user = getUser(req);
    const list = user ? SUBSCRIPTIONS.filter(s => s.userId === user.id) : SUBSCRIPTIONS;
    res.json({ success: true, subscriptions: list });
  });

  app.post('/api/subscriptions', (req: Request, res: Response) => {
    const user = getUser(req);
    const { productId, frequency = 'Daily', timeSlot = 'Morning (7:00 AM)' } = req.body;

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const discountedPrice = Math.round(product.price * 0.95); // 5% discount
    const newSub: Subscription = {
      id: 'sub-' + Date.now(),
      userId: user ? user.id : 'guest',
      productId: product.id,
      productName: `${product.name} (${product.unit})`,
      frequency,
      timeSlot,
      price: product.price,
      discountedPrice,
      status: 'Active',
      nextDelivery: frequency === 'Daily' ? 'Tomorrow at 7:00 AM' : 'Every Saturday at 8:00 AM',
      createdAt: new Date().toISOString()
    };

    SUBSCRIPTIONS.unshift(newSub);
    res.json({ success: true, message: 'Subscription activated! 5% discount applied.', subscription: newSub });
  });

  app.delete('/api/subscriptions/:id', (req: Request, res: Response) => {
    const idx = SUBSCRIPTIONS.findIndex(s => s.id === req.params.id);
    if (idx > -1) {
      SUBSCRIPTIONS.splice(idx, 1);
      return res.json({ success: true, message: 'Subscription cancelled' });
    }
    res.status(404).json({ success: false, message: 'Subscription not found' });
  });

  // 11. Live Order Tracker API
  app.get('/api/orders/:id/track', (req: Request, res: Response) => {
    const order = ORDERS.find(o => o.id === req.params.id) || ORDERS[0];
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const timeline = [
      { step: 1, title: 'Order Placed & Confirmed', time: 'Just now', completed: true },
      { step: 2, title: 'Packed at FreshMart Hub', time: '10 mins ago', completed: true },
      { step: 3, title: 'Out for Delivery (Rider en route)', time: 'En route', completed: order.status === 'Out for Delivery' || order.status === 'Delivered' },
      { step: 4, title: 'Delivered to Doorstep', time: 'Estimated 20 mins', completed: order.status === 'Delivered' }
    ];

    res.json({
      success: true,
      orderId: order.id,
      status: order.status,
      customerName: order.customerName,
      address: `${order.shippingAddress}, ${order.city}`,
      total: order.total,
      deliveryPartner: {
        name: 'Subrata Das',
        phone: '+91 98310 99881',
        vehicle: 'Ather 450X Electric (WB-02-AK-9812)',
        rating: 4.9,
        etaMinutes: 18
      },
      timeline
    });
  });

  // 12. Admin Management API
  app.get('/api/admin/dashboard', (_req: Request, res: Response) => {
    const totalRevenue = ORDERS.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = ORDERS.filter(o => o.status !== 'Delivered').length;
    const outOfStock = PRODUCTS.filter(p => !p.inStock).length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: ORDERS.length,
        activeOrders,
        totalProducts: PRODUCTS.length,
        outOfStockCount: outOfStock,
        totalSubscriptions: SUBSCRIPTIONS.length
      },
      recentOrders: ORDERS.slice(0, 10),
      products: PRODUCTS
    });
  });

  app.put('/api/admin/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const order = ORDERS.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.status = status;
    res.json({ success: true, message: `Order status updated to ${status}`, order });
  });

  app.put('/api/admin/products/:id/stock', (req: Request, res: Response) => {
    const { inStock } = req.body;
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.inStock = typeof inStock === 'boolean' ? inStock : !product.inStock;
    res.json({ success: true, message: `Product stock updated`, product });
  });

  // Admin Product Creation
  app.post('/api/admin/products', (req: Request, res: Response) => {
    const { name, category, price, originalPrice, unit, image, description } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      unit: unit ? unit.trim() : '1 unit',
      image: image ? image.trim() : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      description: description ? description.trim() : 'Fresh quality grocery essential from local vendors.',
      inStock: true,
      stockCount: 50,
      rating: 4.8,
      reviewsCount: 1,
      origin: 'Kolkata Wholesale Mandi',
      shelfLife: '5 days'
    };

    PRODUCTS.unshift(newProd);
    res.json({ success: true, message: `Product "${newProd.name}" added successfully!`, product: newProd });
  });

  // Admin Product Update (Price, stock count, inStock)
  app.put('/api/admin/products/:id', (req: Request, res: Response) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { price, inStock, stockCount, name } = req.body;
    if (price !== undefined) product.price = Number(price);
    if (name !== undefined) product.name = name.trim();
    if (inStock !== undefined) product.inStock = Boolean(inStock);
    if (stockCount !== undefined) product.stockCount = Number(stockCount);

    res.json({ success: true, message: 'Product updated successfully', product });
  });

  // Admin Product Deletion
  app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
    const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const deleted = PRODUCTS.splice(idx, 1)[0];
    res.json({ success: true, message: `Product "${deleted.name}" removed from catalog` });
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      store: 'FreshMart Grocery Store',
      location: 'Kolkata, West Bengal',
      productsCount: PRODUCTS.length,
      ordersCount: ORDERS.length
    });
  });

  // ==================== VITE MIDDLEWARE / STATIC ASSETS ====================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FreshMart Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
