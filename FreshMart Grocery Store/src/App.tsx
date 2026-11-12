/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GroceryProvider, useGrocery } from './context/GroceryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryBar } from './components/CategoryBar';
import { OffersBanner } from './components/OffersBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { AuthPage } from './components/AuthPage';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPortalModal } from './components/AdminPortalModal';

function AppContent() {
  const { activeView } = useGrocery();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Layout */}
      <main className="flex-1">
        {activeView === 'store' ? (
          <>
            <HeroSection />
            <CategoryBar />
            <OffersBanner />
            <ProductCatalog />
          </>
        ) : (
          <AuthPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Slide-overs & Interactive Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />
      <ProductDetailModal />
      <AdminPortalModal />
    </div>
  );
}

export default function App() {
  return (
    <GroceryProvider>
      <AppContent />
    </GroceryProvider>
  );
}
