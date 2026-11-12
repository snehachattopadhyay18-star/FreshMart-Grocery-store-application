import { Product, ProductCategory, CustomerReview, Order, UserProfile } from '../types/grocery';

export const CATEGORIES: {
  id: ProductCategory;
  name: string;
  image: string;
  itemCount: number;
  highlight: string;
}[] = [
  {
    id: 'Fresh Fruits',
    name: 'Fresh Fruits',
    image: '/src/assets/images/fruits_showcase_1793432152742.jpg',
    itemCount: 5,
    highlight: 'Handpicked daily from local orchards'
  },
  {
    id: 'Vegetables',
    name: 'Vegetables',
    image: '/src/assets/images/vegetables_showcase_1793432156490.jpg',
    itemCount: 5,
    highlight: 'Farm-fresh greens and root veggies'
  },
  {
    id: 'Dairy Products',
    name: 'Dairy Products',
    image: '/src/assets/images/dairy_showcase_1793432155264.jpg',
    itemCount: 5,
    highlight: 'Pure farm milk, fresh paneer & curd'
  },
  {
    id: 'Rice & Pulses',
    name: 'Rice & Pulses',
    image: '/src/assets/images/staples_showcase_1793432156128.jpg',
    itemCount: 5,
    highlight: 'Aromatic basmati, unpolished dals & flours'
  },
  {
    id: 'Snacks & Bakery',
    name: 'Snacks & Bakery',
    image: 'https://images.openai.com/static-rsc-4/pv_D8y6OZrRTf7MyKroQT3HUKeb1jLtSIwOIBJ8ivVxTRVRCK5yY1Cpi1UIsGMuJlk3ZjeRhir5XCIOJQc4HDSxmNA_9w72Zr4Jj7MafYFnEzuoIeQC-dZfodZW5Bi1siWkF8_19ecIHHD9XEeLzJNem77RUr0oja_wzFVzD9Xsfqu3nUpR60aN863uyYjqR?purpose=fullsize',
    itemCount: 4,
    highlight: 'Daily baked bread, tea-time biscuits & cakes'
  },
  {
    id: 'Household Essentials',
    name: 'Household Essentials',
    image: 'https://images.openai.com/static-rsc-4/5oQ5XrGrKKNxg54OK-PBcDYyIzFWBZWPhwH7qD3HrzUI8peyyBjgxpPf-qWi-lcXGC5MY7sDBgFPvo7GhmNm9tPi7UDd9iBNrYqpFFNM8bICgmtwntYqXv6BF7eKg0fxzm1XkUVU7QiE5K3VcjrziHg7lbfh-HfHUbRkQcKA0RF9RHuQ3kgbiGyWyDImw-Xz?purpose=fullsize',
    itemCount: 4,
    highlight: 'Detergents, soaps, cleaners & paper towels'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Fresh Fruits
  {
    id: 'prod-apple',
    name: 'Fresh Apples (Shimla Royal)',
    category: 'Fresh Fruits',
    price: 160,
    originalPrice: 190,
    unit: '1 kg',
    image: 'https://images.openai.com/static-rsc-4/hZ9jFal6RrHjyir140Xe92bx3WAkX1GH9zNN4ejpLKNTtmFesG-fMp7MUWx0n9rI6kghppgRMk2EY6kyGf4D8NyOraatHRE8JHpDODp-9ds2L4nDPiiQWkb4iI2O9m4VGLYLiN2EYZ-ZXWVYO6wXOWleG_dEsnyEMH5uQ_OJX3lUaLt-toUV3TEvabjD6--E?purpose=fullsize',
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
    category: 'Fresh Fruits',
    price: 60,
    originalPrice: 70,
    unit: '1 dozen',
    image: 'https://images.openai.com/static-rsc-4/iDNPxF4FtFSTNFVq1VaNOb-1v_ZyBeGX4kAUeQOw8UBn5M-RSGDjVQMxQgWvRbcQRTFHlDenO1Ri_THhkt82bic_a81SHP7JWn1aGQIx2mgdJCq7Gh37YYOVqKVWjGZ16ugaNomc2lgM8SFHk1TltTRi8xn0gpLNZ9g0QKvyjkiUJ1DeIB9neCcEzE5U0m9k?purpose=fullsize',
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
    category: 'Fresh Fruits',
    price: 100,
    originalPrice: 130,
    unit: '1 kg',
    image: '/src/assets/images/fruits_showcase_1793432152742.jpg',
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
    category: 'Fresh Fruits',
    price: 90,
    originalPrice: 110,
    unit: '500 g',
    image: '/src/assets/images/fruits_showcase_1793432152742.jpg',
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
    category: 'Fresh Fruits',
    price: 180,
    originalPrice: 220,
    unit: '1 kg',
    image: 'https://images.openai.com/static-rsc-4/hnOxC2D3iRKve3YC5LvaN09kPDCmpmeH1rq_3fFh8noUc-hENPOfanGs5irA9J0HOJLTZSvKMACo6wcSOwPRd5SJ_zr-njQ1Xq21mzxD-BmjG1bYyNiip1a38Cd_c9uMi0poSTyj_qau-6MSAsU5s2EdDV5nsNTdwZ-Z7Cp--j_nVUC0j6rtyL33mCSWkwK_?purpose=fullsize',
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
    image: '/src/assets/images/vegetables_showcase_1793432156490.jpg',
    description: 'Firm, cleaned earthy potatoes ideal for aloo dum, fries, curries, and daily Bengali kitchen dishes.',
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
    image: 'https://images.openai.com/static-rsc-4/xZJZr7ygOVWmnZSo4ca7UDupyTUZwdclvrLC5_DjE92yb-Dl_5IMf8Wq40jrHx7DR9oXfwal5L75ALzvpYR4kagJMmAY2qzrYZwRyldF5aKoJpXiiFU3XzL8eaKiMscGsO-JLmStXC_qlax4XaYdi4P5daYxz5KKdtszwDQ9IrlDU-_NpshjbZ_VtSVkwHN-?purpose=fullsize',
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
    image: '/src/assets/images/vegetables_showcase_1793432156490.jpg',
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
    image: '/src/assets/images/vegetables_showcase_1793432156490.jpg',
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
    image: '/src/assets/images/vegetables_showcase_1793432156490.jpg',
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
    category: 'Dairy Products',
    price: 60,
    originalPrice: 64,
    unit: '1 litre',
    image: '/src/assets/images/dairy_showcase_1793432155264.jpg',
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
    category: 'Dairy Products',
    price: 90,
    originalPrice: 105,
    unit: '200 g',
    image: '/src/assets/images/dairy_showcase_1793432155264.jpg',
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
    category: 'Dairy Products',
    price: 55,
    originalPrice: 60,
    unit: '100 g',
    image: '/src/assets/images/dairy_showcase_1793432155264.jpg',
    description: 'Rich, creamy golden butter churned from pure cream. Perfect for toast, parathas, and baking.',
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
    category: 'Dairy Products',
    price: 120,
    originalPrice: 140,
    unit: '200 g (10 slices)',
    image: 'https://images.openai.com/static-rsc-4/WV1GRGfJnsTxe-kW5J5mb1i3EE-N8FlIGCzgOBnUwSsIHWJowiI44DM0zDVUnii0W9Xq1J9PD10A9bfceiCnnqREPmecinnWXuc22FwUkwvdty-fT9MgvgsJxu-BvzYa0NR9A-BAdRKthvrQpM0MKK3Flr3FBY6sDPJHbChOw4I0N0Wn77UzQpuTpC4cRaKO?purpose=fullsize',
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
    category: 'Dairy Products',
    price: 35,
    originalPrice: 40,
    unit: '400 g tub',
    image: '/src/assets/images/dairy_showcase_1793432155264.jpg',
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
    category: 'Rice & Pulses',
    price: 65,
    originalPrice: 85,
    unit: '1 kg',
    image: '/src/assets/images/staples_showcase_1793432156128.jpg',
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
    category: 'Rice & Pulses',
    price: 120,
    originalPrice: 140,
    unit: '1 kg',
    image: '/src/assets/images/staples_showcase_1793432156128.jpg',
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
    category: 'Rice & Pulses',
    price: 48,
    originalPrice: 56,
    unit: '1 kg',
    image: '/src/assets/images/staples_showcase_1793432156128.jpg',
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
    category: 'Rice & Pulses',
    price: 95,
    originalPrice: 110,
    unit: '1 kg',
    image: 'https://images.openai.com/static-rsc-4/G6De4OkjfpiMWVkq4prD-VQKR2zH0lcRmYGeWZduLXSg-rRlQHBwAabbgt6ragC4qnsj_XycxUnLrZP0KI3w601I8ER8LL5x2J0IT5rwy_1fvMV12iND6pNBUTn5yFhW1zTjeP4vfDYo-6NGwDkEwavPJKbbITARNmVi1BWQV2i1PVlXrIxCxsYiWxXnWOrq?purpose=fullsize',
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
    category: 'Rice & Pulses',
    price: 130,
    originalPrice: 155,
    unit: '1 kg',
    image: '/src/assets/images/staples_showcase_1793432156128.jpg',
    description: 'Plump Himalayan Chitra rajma that cooks soft and velvety for authentic Punjabi rajma chawal.',
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
    category: 'Snacks & Bakery',
    price: 40,
    originalPrice: 45,
    unit: '1 packet (400g)',
    image: 'https://images.openai.com/static-rsc-4/pv_D8y6OZrRTf7MyKroQT3HUKeb1jLtSIwOIBJ8ivVxTRVRCK5yY1Cpi1UIsGMuJlk3ZjeRhir5XCIOJQc4HDSxmNA_9w72Zr4Jj7MafYFnEzuoIeQC-dZfodZW5Bi1siWkF8_19ecIHHD9XEeLzJNem77RUr0oja_wzFVzD9Xsfqu3nUpR60aN863uyYjqR?purpose=fullsize',
    description: 'Freshly baked soft white sandwich loaf delivered same day from local Kolkata bakery.',
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
    category: 'Snacks & Bakery',
    price: 30,
    originalPrice: 35,
    unit: '1 packet (250g)',
    image: 'https://images.openai.com/static-rsc-4/pv_D8y6OZrRTf7MyKroQT3HUKeb1jLtSIwOIBJ8ivVxTRVRCK5yY1Cpi1UIsGMuJlk3ZjeRhir5XCIOJQc4HDSxmNA_9w72Zr4Jj7MafYFnEzuoIeQC-dZfodZW5Bi1siWkF8_19ecIHHD9XEeLzJNem77RUr0oja_wzFVzD9Xsfqu3nUpR60aN863uyYjqR?purpose=fullsize',
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
    category: 'Snacks & Bakery',
    price: 20,
    originalPrice: 20,
    unit: '1 packet (50g)',
    image: 'https://images.openai.com/static-rsc-4/pv_D8y6OZrRTf7MyKroQT3HUKeb1jLtSIwOIBJ8ivVxTRVRCK5yY1Cpi1UIsGMuJlk3ZjeRhir5XCIOJQc4HDSxmNA_9w72Zr4Jj7MafYFnEzuoIeQC-dZfodZW5Bi1siWkF8_19ecIHHD9XEeLzJNem77RUr0oja_wzFVzD9Xsfqu3nUpR60aN863uyYjqR?purpose=fullsize',
    description: 'Crispy wafer thin golden potato chips lightly seasoned with rock salt for study snacks.',
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
    category: 'Snacks & Bakery',
    price: 60,
    originalPrice: 75,
    unit: '1 pack (150g)',
    image: 'https://images.openai.com/static-rsc-4/pv_D8y6OZrRTf7MyKroQT3HUKeb1jLtSIwOIBJ8ivVxTRVRCK5yY1Cpi1UIsGMuJlk3ZjeRhir5XCIOJQc4HDSxmNA_9w72Zr4Jj7MafYFnEzuoIeQC-dZfodZW5Bi1siWkF8_19ecIHHD9XEeLzJNem77RUr0oja_wzFVzD9Xsfqu3nUpR60aN863uyYjqR?purpose=fullsize',
    description: 'Soft butter cake packed with candied papaya, cherries, and raisins. A Kolkata favorite.',
    inStock: true,
    stockCount: 30,
    rating: 4.7,
    reviewsCount: 18,
    origin: 'Flurys Heritage Kitchens, Kolkata',
    shelfLife: '20 days'
  },

  // 6. Household Essentials
  {
    id: 'prod-detergent',
    name: 'Surf Active Matic Detergent Powder',
    category: 'Household Essentials',
    price: 110,
    originalPrice: 135,
    unit: '1 kg',
    image: 'https://images.openai.com/static-rsc-4/5oQ5XrGrKKNxg54OK-PBcDYyIzFWBZWPhwH7qD3HrzUI8peyyBjgxpPf-qWi-lcXGC5MY7sDBgFPvo7GhmNm9tPi7UDd9iBNrYqpFFNM8bICgmtwntYqXv6BF7eKg0fxzm1XkUVU7QiE5K3VcjrziHg7lbfh-HfHUbRkQcKA0RF9RHuQ3kgbiGyWyDImw-Xz?purpose=fullsize',
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
    category: 'Household Essentials',
    price: 35,
    originalPrice: 40,
    unit: '1 bar (125g)',
    image: 'https://images.openai.com/static-rsc-4/5oQ5XrGrKKNxg54OK-PBcDYyIzFWBZWPhwH7qD3HrzUI8peyyBjgxpPf-qWi-lcXGC5MY7sDBgFPvo7GhmNm9tPi7UDd9iBNrYqpFFNM8bICgmtwntYqXv6BF7eKg0fxzm1XkUVU7QiE5K3VcjrziHg7lbfh-HfHUbRkQcKA0RF9RHuQ3kgbiGyWyDImw-Xz?purpose=fullsize',
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
    name: 'Citrus Floor & Surface Disinfectant',
    category: 'Household Essentials',
    price: 85,
    originalPrice: 99,
    unit: '500 ml',
    image: 'https://images.openai.com/static-rsc-4/5oQ5XrGrKKNxg54OK-PBcDYyIzFWBZWPhwH7qD3HrzUI8peyyBjgxpPf-qWi-lcXGC5MY7sDBgFPvo7GhmNm9tPi7UDd9iBNrYqpFFNM8bICgmtwntYqXv6BF7eKg0fxzm1XkUVU7QiE5K3VcjrziHg7lbfh-HfHUbRkQcKA0RF9RHuQ3kgbiGyWyDImw-Xz?purpose=fullsize',
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
    category: 'Household Essentials',
    price: 45,
    originalPrice: 55,
    unit: '1 roll (60 pulls)',
    image: 'https://images.openai.com/static-rsc-4/5oQ5XrGrKKNxg54OK-PBcDYyIzFWBZWPhwH7qD3HrzUI8peyyBjgxpPf-qWi-lcXGC5MY7sDBgFPvo7GhmNm9tPi7UDd9iBNrYqpFFNM8bICgmtwntYqXv6BF7eKg0fxzm1XkUVU7QiE5K3VcjrziHg7lbfh-HfHUbRkQcKA0RF9RHuQ3kgbiGyWyDImw-Xz?purpose=fullsize',
    description: 'Extra absorbent 100% virgin pulp embossed sheets for drying greens, wiping spills, and oil blotting.',
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewsCount: 24,
    origin: 'Origami Hygiene',
    shelfLife: 'No expiry'
  }
];

export const KOLKATA_LOCALITIES = [
  { name: 'Salt Lake Sector V / Karunamoyee', pin: '700091' },
  { name: 'New Town Action Area I & II', pin: '700156' },
  { name: 'Park Street & Camac Street', pin: '700016' },
  { name: 'Ballygunge & Gariahat', pin: '700019' },
  { name: 'Jadavpur & Dhakuria', pin: '700032' },
  { name: 'Behala & Tollygunge', pin: '700034' },
  { name: 'Dum Dum & Nagerbazar', pin: '700028' },
  { name: 'Howrah Station / Shibpur', pin: '711101' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1042',
    orderNumber: 'FM-KOL-8921',
    date: '2026-10-30',
    timeSlot: 'Morning (8:00 AM - 11:00 AM)',
    customerName: 'Ananya Mukherjee',
    customerPhone: '+91 98301 23456',
    customerEmail: 'ananya.m@gmail.com',
    deliveryAddress: 'Flat 4B, Greenfield Heights, Major Arterial Road',
    locality: 'New Town Action Area I & II',
    pinCode: '700156',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    items: [
      { productId: 'prod-apple', productName: 'Fresh Apples (Shimla Royal)', price: 160, quantity: 1, unit: '1 kg', image: 'https://images.openai.com/static-rsc-4/hZ9jFal6RrHjyir140Xe92bx3WAkX1GH9zNN4ejpLKNTtmFesG-fMp7MUWx0n9rI6kghppgRMk2EY6kyGf4D8NyOraatHRE8JHpDODp-9ds2L4nDPiiQWkb4iI2O9m4VGLYLiN2EYZ-ZXWVYO6wXOWleG_dEsnyEMH5uQ_OJX3lUaLt-toUV3TEvabjD6--E?purpose=fullsize' },
      { productId: 'prod-milk', productName: 'Farm Fresh Toned Milk', price: 60, quantity: 2, unit: '1 litre', image: '/src/assets/images/dairy_showcase_1793432155264.jpg' },
      { productId: 'prod-paneer', productName: 'Fresh Malai Paneer', price: 90, quantity: 1, unit: '200 g', image: '/src/assets/images/dairy_showcase_1793432155264.jpg' }
    ],
    subtotal: 370,
    deliveryFee: 0,
    discount: 50,
    couponCode: 'WELCOME50',
    total: 320,
    status: 'Out for Delivery',
    deliveryPartner: {
      name: 'Subrata Das',
      phone: '+91 98310 99881',
      vehicle: 'Electric Scooter (WB-02-AK-9812)'
    }
  },
  {
    id: 'ord-1041',
    orderNumber: 'FM-KOL-8890',
    date: '2026-10-29',
    timeSlot: 'Evening (6:00 PM - 9:00 PM)',
    customerName: 'Rohit Sen',
    customerPhone: '+91 94330 87654',
    customerEmail: 'rohit.sen@outlook.com',
    deliveryAddress: 'Block CF-180, Near Swimming Pool',
    locality: 'Salt Lake Sector V / Karunamoyee',
    pinCode: '700091',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending on Delivery',
    items: [
      { productId: 'prod-rice', productName: 'Premium Basmati Rice (Long Grain)', price: 65, quantity: 2, unit: '1 kg', image: '/src/assets/images/staples_showcase_1793432156128.jpg' },
      { productId: 'prod-moong-dal', productName: 'Yellow Moong Dal (Unpolished)', price: 120, quantity: 1, unit: '1 kg', image: '/src/assets/images/staples_showcase_1793432156128.jpg' },
      { productId: 'prod-potato', productName: 'Fresh Jyoti Potato', price: 30, quantity: 2, unit: '1 kg', image: '/src/assets/images/vegetables_showcase_1793432156490.jpg' }
    ],
    subtotal: 310,
    deliveryFee: 0,
    discount: 0,
    total: 310,
    status: 'Delivered',
    deliveryPartner: {
      name: 'Manoj Mondal',
      phone: '+91 98322 44321',
      vehicle: 'Hero Electric (WB-01-EE-4521)'
    }
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-student',
    name: 'Rahul Roy (College Student)',
    email: 'rahul.roy@gmail.com',
    phone: '+91 98305 67890',
    role: 'customer',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Student PG / Hostel',
        address: 'Room 302, Green View PG, Anandapur Main Road',
        locality: 'Jadavpur & Dhakuria',
        pinCode: '700032'
      }
    ]
  },
  {
    id: 'usr-pro',
    name: 'Debasmita Roy (Software Professional)',
    email: 'debasmita.roy@tcs.com',
    phone: '+91 98741 23098',
    role: 'customer',
    savedAddresses: [
      {
        id: 'addr-2',
        label: 'Apartment',
        address: 'Tower 6, Flat 1204, Rosedale Garden Complex',
        locality: 'New Town Action Area I & II',
        pinCode: '700156'
      }
    ]
  },
  {
    id: 'usr-admin',
    name: 'FreshMart Store Manager (Admin)',
    email: 'admin@freshmartkolkata.in',
    phone: '+91 33 2289 9000',
    role: 'admin',
    savedAddresses: [
      {
        id: 'addr-hq',
        label: 'FreshMart Distribution Hub',
        address: 'Plot 14, Salt Lake Sector V, Near College More',
        locality: 'Salt Lake Sector V / Karunamoyee',
        pinCode: '700091'
      }
    ]
  }
];

export const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-apple',
    authorName: 'Dr. Arindam Bose',
    rating: 5,
    date: '2026-10-28',
    comment: 'Extremely fresh and crisp Shimla apples! Delivered within 2 hours in Salt Lake. Much better than regular local bazaars.',
    location: 'Salt Lake, Sector 2'
  },
  {
    id: 'rev-2',
    productId: 'prod-milk',
    authorName: 'Moumita Chatterjee',
    rating: 5,
    date: '2026-10-27',
    comment: 'Chilled delivery packaging was top notch. Milk was pure and had that authentic creamy flavor my children love.',
    location: 'Ballygunge'
  },
  {
    id: 'rev-3',
    productId: 'prod-paneer',
    authorName: 'Saurav Banerjee',
    rating: 5,
    date: '2026-10-26',
    comment: 'The softest malai paneer! Did not get rubbery at all after frying for matar paneer. Will reorder every weekend.',
    location: 'New Town'
  },
  {
    id: 'rev-4',
    productId: 'prod-banana',
    authorName: 'Priya Mukherjee',
    rating: 4,
    date: '2026-10-25',
    comment: 'Great uniform bananas with no bruises. Very economical at ₹60 a dozen for our daily breakfast smoothies.',
    location: 'Jadavpur'
  }
];

export const AVAILABLE_COUPONS = [
  { code: 'FRESH20', description: '20% discount on orders above ₹200 (Max ₹100 off)', minAmount: 200, type: 'percent', value: 20, maxDiscount: 100 },
  { code: 'SAVE75', description: '₹75 Flat Savings on orders above ₹250', minAmount: 250, type: 'flat', value: 75 },
  { code: 'WELCOME50', description: '₹50 Flat discount on your first grocery delivery', minAmount: 199, type: 'flat', value: 50 },
];
