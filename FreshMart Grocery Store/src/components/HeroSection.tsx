import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, CreditCard, Award } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const HeroSection: React.FC = () => {
  const { setSelectedCategory } = useGrocery();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 to-white pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Context kicker without static pill styling */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <span>FreshMart Kolkata</span>
              <span aria-hidden="true">·</span>
              <span>Online Grocery & Daily Essentials</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700">8 AM – 10 PM Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] font-display text-balance">
              Freshness Delivered to Your Doorstep!
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              Your daily needs, delivered fresh across Kolkata. Handpicked farm vegetables, sweet seasonal fruits, pure chilled dairy, unpolished pulses, and household essentials at affordable local bazaar prices.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#products"
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
              >
                <span>Shop Fresh Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#offers"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Today's Offers (Up to 30% OFF)</span>
              </a>
            </div>

            {/* Trust highlights text */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-500">
              <span className="flex items-center gap-1.5 font-medium text-stone-700">
                <Zap className="w-4 h-4 text-emerald-600" /> Express 90-Min Home Delivery
              </span>
              <span className="flex items-center gap-1.5 font-medium text-stone-700">
                <CreditCard className="w-4 h-4 text-emerald-600" /> UPI, Cash on Delivery, Cards
              </span>
              <span className="flex items-center gap-1.5 font-medium text-stone-700">
                <Award className="w-4 h-4 text-emerald-600" /> 100% Quality Guarantee
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 bg-stone-100 aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 group">
              <img
                src="/src/assets/images/hero_fresh_groceries_1793432153489.jpg"
                alt="FreshMart organic grocery delivery tote bag with fresh farm produce"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback image if local image fails
                  const target = e.currentTarget;
                  target.src = 'https://images.openai.com/static-rsc-4/AuxDpaiwrKyfqv-jpUD_FCaafQw_SVOhNTXcyfgTgtONGHLFF98uhkcUxkzaTd4S9SDxwiBhvTyJmmF2slh1pIKff-656Rq8MtnqPgetduTOAPifc1PLsZvCecMDg0w29iR_RfwrBWat-s3GgxL66oehAabL0jlIulcxGxUPyymXjig7xgHcXgvPumUGkphD?purpose=fullsize';
                }}
              />
              
              {/* Subtle scrim overlay with live badge */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent text-white">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">Salt Lake & New Town Delivery Hub</p>
                    <p className="text-stone-300 text-[11px]">Next dispatch slot: within 45 mins</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500 text-white rounded text-[11px] font-bold">
                    8 AM – 10 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Feature Strip below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-stone-200">
          <div className="p-4 bg-white rounded-xl border border-stone-200/70">
            <div className="text-emerald-700 font-semibold text-sm mb-1">Direct Farm Sourcing</div>
            <div className="text-xs text-stone-500">Procured at 4 AM from local Bengal farms and orchards.</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/70">
            <div className="text-emerald-700 font-semibold text-sm mb-1">Flexible Payments</div>
            <div className="text-xs text-stone-500">Pay via Google Pay, PhonePe, Cards, or Cash on Delivery.</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/70">
            <div className="text-emerald-700 font-semibold text-sm mb-1">Zero Cost Delivery</div>
            <div className="text-xs text-stone-500">Free delivery on every order equal to or above ₹299.</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/70">
            <div className="text-emerald-700 font-semibold text-sm mb-1">Hassle-Free Returns</div>
            <div className="text-xs text-stone-500">Not satisfied with freshness? Instant replacement at door.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
