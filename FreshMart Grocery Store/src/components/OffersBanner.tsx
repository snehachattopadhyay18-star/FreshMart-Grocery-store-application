import React from 'react';
import { Tag, Sparkles, Copy, Check } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { AVAILABLE_COUPONS } from '../data/initialData';

export const OffersBanner: React.FC = () => {
  const { applyCoupon, appliedCoupon } = useGrocery();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-10 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Coupon Pills */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Seasonal Discounts & Weekly Offers</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
              Today's Best Offers – Up to 30% OFF
            </h2>

            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              Save more on every Kolkata delivery! Apply these promotional codes at checkout or click below to activate instant discounts on fresh fruits, dairy, and household essentials.
            </p>

            {/* Coupons Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {AVAILABLE_COUPONS.map((coupon) => {
                const isApplied = appliedCoupon?.code === coupon.code;

                return (
                  <div
                    key={coupon.code}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
                          {coupon.code}
                        </span>
                        <Tag className="w-3.5 h-3.5 text-emerald-300" />
                      </div>
                      <p className="text-[11px] text-emerald-100 mt-1 line-clamp-2">
                        {coupon.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyAndApply(coupon.code)}
                      className={`w-full py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                        isApplied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Active in Cart</span>
                        </>
                      ) : copiedCode === coupon.code ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied & Applied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Apply Code</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/20 aspect-16/9 bg-emerald-950">
              <img
                src="https://images.openai.com/static-rsc-4/BufDFT4lznJLl58S2jZgi4DIu6zkaBIAzWliQqxfytaVzQNBSmdoWrd_ojIMSL-0TFhjdy13i6CWMe-loIB1fq-Djf_y13tjpxRiIKsZkIDVvZheYZ6FO4uJY2fr10n8VoEP7UlUQFCkYd2JTIknO8ki3bg0dRU6CRUAoDSo2C_cf3jd0saBg27VyDvpnQWy?purpose=fullsize"
                alt="FreshMart promotional offer banner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/hero_fresh_groceries_1793432153489.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs text-white">
                  <p className="font-bold text-amber-300">Free Express Delivery on orders ≥ ₹299</p>
                  <p className="text-emerald-200 text-[11px]">Valid across Salt Lake, New Town, Jadavpur & Kolkata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
