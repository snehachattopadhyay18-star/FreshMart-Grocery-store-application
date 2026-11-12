import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Clock, CreditCard, CheckCircle2, QrCode, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGrocery } from '../context/GroceryContext';
import { KOLKATA_LOCALITIES } from '../data/initialData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    currentUser,
    placeOrder,
    setActiveView
  } = useGrocery();

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [locality, setLocality] = useState(KOLKATA_LOCALITIES[0].name);
  const [pinCode, setPinCode] = useState(KOLKATA_LOCALITIES[0].pin);
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.savedAddresses?.[0]?.address || 'Flat 4B, Greenfield Enclave'
  );
  const [timeSlot, setTimeSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash on Delivery' | 'Card'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm'>('GPay');
  const [upiId, setUpiId] = useState('9830567890@okaxis');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when user changes or logs in
  React.useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phone);
      setCustomerEmail(currentUser.email);
      if (currentUser.savedAddresses?.[0]) {
        setDeliveryAddress(currentUser.savedAddresses[0].address);
        setLocality(currentUser.savedAddresses[0].locality);
        setPinCode(currentUser.savedAddresses[0].pinCode);
      }
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  const handleLocalityChange = (locName: string) => {
    setLocality(locName);
    const matched = KOLKATA_LOCALITIES.find(l => l.name === locName);
    if (matched) {
      setPinCode(matched.pin);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = placeOrder({
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        locality,
        pinCode,
        timeSlot,
        paymentMethod
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                FreshMart Checkout
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Kolkata Home Delivery · 8 AM – 10 PM
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6">
          {!currentUser && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">
                Checking out as Guest. Have an existing account?
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveView('auth');
                }}
                className="font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 ml-2"
              >
                Log In
              </button>
            </div>
          )}

          {/* Section 1: Customer & Delivery Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>1. Delivery Details (Kolkata Region)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Mobile Phone (for delivery SMS/call)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-medium mb-1">Street Address, Flat / House No.</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Flat 3A, Sukriti Residency, 14 Lake Road"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Kolkata Locality / Hub</label>
                <select
                  value={locality}
                  onChange={(e) => handleLocalityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  {KOLKATA_LOCALITIES.map(loc => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} (Pin: {loc.pin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">PIN Code</label>
                <input
                  type="text"
                  readOnly
                  value={pinCode}
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Preferred Delivery Slot */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>2. Select Delivery Slot (Operating Hours: 8 AM - 10 PM)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Express (Within 90 Minutes)',
                'Morning (8:00 AM - 11:00 AM)',
                'Afternoon (12:00 PM - 4:00 PM)',
                'Evening (6:00 PM - 9:00 PM)'
              ].map((slot) => (
                <label
                  key={slot}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    timeSlot === slot
                      ? 'border-emerald-600 bg-emerald-50/60 font-semibold text-emerald-950'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{slot}</span>
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={timeSlot === slot}
                    onChange={() => setTimeSlot(slot)}
                    className="accent-emerald-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>3. Payment Method (Supported: UPI, COD, Cards)</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
                <span className="block text-xs font-bold text-stone-900">UPI Instant</span>
                <span className="block text-[10px] text-stone-500">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
                <span className="block text-xs font-bold text-stone-900">Cash on Delivery</span>
                <span className="block text-[10px] text-stone-500">Pay at doorstep</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
                <span className="block text-xs font-bold text-stone-900">Credit/Debit</span>
                <span className="block text-[10px] text-stone-500">Visa, RuPay, MC</span>
              </button>
            </div>

            {/* UPI App selector simulation */}
            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-700 font-medium">Select UPI Provider:</span>
                  <div className="flex gap-2">
                    {(['GPay', 'PhonePe', 'Paytm'] as const).map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          upiApp === app
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-stone-700 border-stone-200'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Virtual Payment Address (VPA):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded text-stone-900 font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary Snapshot */}
          <div className="p-3.5 bg-stone-100/70 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
              <span className="font-mono tabular-nums text-stone-900">₹{cartSubtotal}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span className="font-mono tabular-nums">-₹{cartDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charges</span>
              <span className="font-mono tabular-nums">
                {cartDeliveryFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${cartDeliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-200">
              <span>Net Payable</span>
              <span className="font-mono text-base text-emerald-700 tabular-nums">₹{cartTotal}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Order · Pay ₹{cartTotal}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
