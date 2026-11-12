# FreshMart - Express Grocery & Farm-to-Door Delivery App

A full-stack, rapid-commerce grocery web application built for express doorstep grocery delivery across Kolkata, featuring farm freshness guarantees, 1-click recipe kits, budget basket planner, recurring milk & breakfast subscriptions, live dispatch tracker, user account dashboard, itemized invoices, and product customer reviews.

---

## Folder Structure

```
├── .env.example         # Sample environment configuration
├── .gitignore           # Ignored files (node_modules, dist, logs)
├── index.html           # Main frontend entry point and UI markup
├── package.json         # Dependencies and build scripts
├── server.ts            # Express server (REST APIs, live mock DB, sessions)
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── public/              # Client-side static scripts and assets
│   ├── api.js           # Frontend API client connecting to /api routes
│   └── app.js           # Application logic, UI controllers, and modals
└── src/                 # Modular React & Tailwind components
```

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` (comes with Node.js)

### Installation
1. Clone or download this repository.
2. Open a terminal in the project root directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
Start the full-stack server (runs Express with Vite integration on port 3000):
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build
```bash
npm run build
```

---

## Features

- **Express Delivery by Locality**: Real-time hub selection (Salt Lake, New Town, Park Street, Ballygunge, etc.) with dynamic ETA calculations.
- **Product Details & Customer Reviews**: Click any grocery card to view farm provenance, shelf-life, storage conditions, nutritional profile, star ratings, and verified buyer reviews.
- **Customer Review Submission**: Shoppers can rate (1–5 stars) and write verified reviews with instant calculation and update.
- **1-Click Recipe Kits**: Add all fresh ingredients for popular recipes (e.g. Kosha Mangsho, Shorshe Ilish, Paneer Butter Masala) directly to the cart.
- **Budget Basket Optimizer**: Select your weekly or monthly budget limit (₹300, ₹500, ₹1000) to automatically assemble the highest-nutrition basket.
- **Recurring Subscriptions**: Daily or alternate-day milk and bakery breakfast delivery with automatic 5% subscriber discount.
- **Live Order Tracker**: 4-step real-time progress tracker (Confirmed → Packing → Out for Delivery with rider contact → Delivered).
- **User Account Dashboard**: View lifetime grocery orders, reorder previous baskets with 1 click, print itemized tax invoices, and manage saved delivery addresses.
- **Store Manager Admin Suite**: Live order status manager, stock and price editor, subscription monitor, and test order generator.
