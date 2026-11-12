import React from 'react';
import { MapPin, Clock, Phone, Mail, CreditCard, ShieldCheck, Truck, Heart, User, LogIn } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const Footer: React.FC = () => {
  const { setIsAdminModalOpen, setIsOrderTrackingOpen, setSelectedCategory, setActiveView, currentUser } = useGrocery();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800 text-xs">
          {/* Col 1: Brand & Business Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                F
              </div>
              <span>
                Fresh<span className="text-emerald-400">Mart</span>
              </span>
            </div>
            <p className="text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
              YOUR DAILY NEEDS, DELIVERED FRESH!
            </p>
            <p className="text-stone-400 leading-relaxed">
              FreshMart is an online grocery store delivering fresh fruits, vegetables, dairy, unpolished pulses, snacks, and household essentials at affordable prices across Kolkata.
            </p>
            <div className="pt-1 text-[11px] text-stone-500 font-mono">
              B2C E-Commerce Model · Operating Hours: 8 AM – 10 PM
            </div>
          </div>

          {/* Col 2: Quick Links & Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Product Categories
            </h4>
            <ul className="space-y-2 text-stone-400">
              {['Fresh Fruits', 'Vegetables', 'Dairy Products', 'Rice & Pulses', 'Snacks & Bakery', 'Household Essentials'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat as any);
                      const el = document.getElementById('products');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Kolkata Hub & Operating Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Store & Delivery Details
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Salt Lake Sector V Central Hub, Kolkata, West Bengal - 700091</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Delivery: 8:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">+91 33 2289 9000 / +91 98305 67890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">support@freshmartkolkata.in</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-stone-300 block mb-1">Supported Payments:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-stone-400">
                <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700">UPI (GPay / PhonePe)</span>
                <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700">Cash on Delivery</span>
                <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700">Visa / RuPay</span>
              </div>
            </div>
          </div>

          {/* Col 4: Customer Services & Store Tools */}
          <div className="space-y-3 bg-stone-800/40 p-4 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Customer Services & Tools</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Real-time dispatch tracking, safe contactless doorstep delivery, and dedicated merchant store administration.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveView('auth');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                {currentUser ? <User className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                <span>{currentUser ? 'My Account & Log Out' : 'Customer Log In / Sign Up'}</span>
              </button>

              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Your Grocery Order</span>
              </button>

              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="w-full py-2 px-3 bg-stone-700/50 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Store Manager Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 FreshMart Grocery Store. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">About Us</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">Contact</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
