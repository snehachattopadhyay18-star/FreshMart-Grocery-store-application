import React from 'react';
import { CheckCircle, X, Printer, Truck, MapPin, Phone, Calendar, ArrowRight } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const OrderConfirmationModal: React.FC = () => {
  const { lastConfirmedOrder, setLastConfirmedOrder, setIsOrderTrackingOpen, setTrackingOrderId } = useGrocery();

  if (!lastConfirmedOrder) return null;

  const handleTrackThisOrder = () => {
    setTrackingOrderId(lastConfirmedOrder.id);
    setIsOrderTrackingOpen(true);
    setLastConfirmedOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Success Header */}
        <div className="bg-emerald-700 text-white p-6 text-center relative">
          <button
            onClick={() => setLastConfirmedOrder(null)}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Order Placed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Thank you, {lastConfirmedOrder.customerName}. Your groceries are being prepared at our Salt Lake Hub.
          </p>
        </div>

        {/* Invoice Summary Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-stone-700">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Order Number</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{lastConfirmedOrder.orderNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Scheduled Slot</span>
              <span className="font-semibold text-stone-900 truncate block">{lastConfirmedOrder.timeSlot}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Payment Method</span>
              <span className="font-semibold text-emerald-700">{lastConfirmedOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Delivery Location & Partner */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900">Delivery Address:</p>
                <p className="text-stone-600">{lastConfirmedOrder.deliveryAddress}, {lastConfirmedOrder.locality} – {lastConfirmedOrder.pinCode}</p>
              </div>
            </div>

            {lastConfirmedOrder.deliveryPartner && (
              <div className="flex items-center gap-2 text-stone-600 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-[11px]">
                  Assigned Rider: <strong className="text-stone-900">{lastConfirmedOrder.deliveryPartner.name}</strong> ({lastConfirmedOrder.deliveryPartner.vehicle})
                </span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-stone-900 mb-2">Order Items:</h4>
            <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 overflow-hidden">
              {lastConfirmedOrder.items.map((it) => (
                <div key={it.productId} className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center font-mono font-bold text-stone-600 text-[10px]">
                      {it.quantity}x
                    </span>
                    <span className="font-medium text-stone-800">{it.productName}</span>
                    <span className="text-stone-400 text-[11px]">({it.unit})</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-stone-900">
                    ₹{it.price * it.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="space-y-1 pt-2 border-t border-stone-200 text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">₹{lastConfirmedOrder.subtotal}</span>
            </div>
            {lastConfirmedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({lastConfirmedOrder.couponCode})</span>
                <span className="font-mono tabular-nums">-₹{lastConfirmedOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-mono tabular-nums">
                {lastConfirmedOrder.deliveryFee === 0 ? 'FREE' : `₹${lastConfirmedOrder.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-200">
              <span>Total Paid</span>
              <span className="font-mono text-base text-emerald-700 tabular-nums">
                ₹{lastConfirmedOrder.total}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={handleTrackThisOrder}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
