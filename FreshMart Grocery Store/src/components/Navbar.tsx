import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User, ShieldCheck, Clock, MapPin, Truck, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const Navbar: React.FC = () => {
  const {
    cartItemsCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminModalOpen,
    setIsOrderTrackingOpen,
    currentUser,
    logout,
    activeView,
    setActiveView,
    authNotification,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useGrocery();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Slim Top Bar: Trust markers & Log In / Log Out Quick Action */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <span className="flex items-center gap-1 font-medium text-emerald-200">
              <MapPin className="w-3.5 h-3.5" />
              Kolkata, WB
            </span>
            <span className="text-emerald-400/60 hidden sm:inline">·</span>
            <span className="flex items-center gap-1 text-emerald-300 hidden sm:flex">
              <Clock className="w-3.5 h-3.5" />
              8:00 AM – 10:00 PM
            </span>
            <span className="text-emerald-400/60 hidden md:inline">·</span>
            <span className="hidden md:inline truncate text-emerald-200">
              Your Daily Needs, Delivered Fresh!
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-200 text-[11px] hidden sm:inline">
                  Hi, {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-rose-300 hover:text-white transition-colors font-medium text-[11px]"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('auth')}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-semibold text-[11px]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In / Sign Up</span>
              </button>
            )}
            <span className="text-emerald-400/60">|</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Store Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Auth Notification Toast */}
      {authNotification && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{authNotification}</span>
        </div>
      )}

      {/* Main Navigation Bar complying with Section 2 Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('store');
              setSelectedCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-emerald-950 font-display shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <span className="font-extrabold text-lg">F</span>
            </div>
            <span>
              Fresh<span className="text-emerald-600">Mart</span>
            </span>
          </a>

          {/* Search Input on Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'store') setActiveView('store');
              }}
              placeholder="Search Shimla apples, milk, basmati rice, potatoes..."
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-stone-100/80 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => {
                setActiveView('store');
                setSelectedCategory('All');
                const el = document.getElementById('products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'store' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('categories');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              Categories
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('offers');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 text-emerald-700 font-semibold"
            >
              Today's Offers
            </button>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => setActiveView('auth')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                activeView === 'auth' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <User className="w-4 h-4" />
              <span>{currentUser ? 'My Account' : 'Log In'}</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Interactive Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative p-2 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Log In / User Account Action */}
            {currentUser ? (
              <button
                onClick={() => setActiveView('auth')}
                aria-label="User Account and Log Out"
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg text-stone-700 hover:text-emerald-700 hover:bg-stone-100 border border-stone-200 transition-colors"
                title="Account Settings & Log Out"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold max-w-[85px] truncate hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('auth')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-emerald-800 text-emerald-100 text-xs px-2 py-0.5 rounded-md font-mono font-bold tabular-nums">
                {cartItemsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2.5 lg:hidden relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries (apples, milk, rice)..."
            className="w-full pl-9.5 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>
    </header>
  );
};
