import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, Truck, Package, MapPin, Phone } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { OrderStatus } from '../types/grocery';

export const OrderTrackingModal: React.FC = () => {
  const {
    orders,
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    trackingOrderId,
    setTrackingOrderId,
    updateOrderStatus
  } = useGrocery();

  const [inputSearch, setInputSearch] = useState('');

  if (!isOrderTrackingOpen) return null;

  // Selected or active order
  const selectedOrder =
    orders.find(o => o.id === trackingOrderId) ||
    orders.find(o => o.orderNumber.toLowerCase() === inputSearch.trim().toLowerCase()) ||
    orders[0];

  const stages: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
    { key: 'Placed', label: 'Order Placed', icon: Clock, desc: 'Received & sent to Kolkata warehouse' },
    { key: 'Packed', label: 'Packed & Quality Checked', icon: Package, desc: 'Fruits & vegetables packed in chilled boxes' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, desc: 'Assigned to delivery fleet rider' },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle, desc: 'Handed over at doorstep' }
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Packed': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentStageIndex = selectedOrder ? getStageIndex(selectedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                FreshMart Live Order Tracking
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Real-time grocery dispatch tracker for Kolkata metropolitan area
            </p>
          </div>
          <button
            onClick={() => {
              setIsOrderTrackingOpen(false);
              setTrackingOrderId(null);
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Order Selection Bar */}
        <div className="p-4 bg-emerald-50/50 border-b border-stone-200 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              placeholder="Search by Order # (e.g. FM-KOL-8921)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-stone-500 shrink-0 text-[11px]">Recent:</span>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                onClick={() => setTrackingOrderId(ord.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors shrink-0 ${
                  selectedOrder?.id === ord.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details */}
        {selectedOrder ? (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Status card */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Live Dispatch Status
                </span>
                <h4 className="text-lg font-bold text-stone-900 mt-0.5">
                  {selectedOrder.status}
                </h4>
                <p className="text-xs text-stone-500">
                  Order {selectedOrder.orderNumber} · Scheduled for {selectedOrder.timeSlot}
                </p>
              </div>

              {/* Interactive status transition */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-400 block mb-1">Interactive Dispatch Stage:</span>
                <div className="flex gap-1.5">
                  {(['Placed', 'Packed', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                      className={`px-2 py-0.5 text-[10px] rounded font-medium border transition-colors ${
                        selectedOrder.status === st
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = stage.icon;

                return (
                  <div key={stage.key} className="relative flex items-start gap-4">
                    {/* Step Icon Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    <div className="pt-0.5">
                      <h5 className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-emerald-900 font-extrabold' : isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                        {stage.label}
                      </h5>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rider & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-100">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Delivery Destination</span>
                <p className="font-semibold text-stone-900">{selectedOrder.customerName}</p>
                <p className="text-stone-600">{selectedOrder.deliveryAddress}</p>
                <p className="text-stone-500 font-medium">{selectedOrder.locality} – {selectedOrder.pinCode}</p>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">Rider on Route</span>
                <p className="font-semibold text-stone-900">{selectedOrder.deliveryPartner?.name || 'Assigned Fleet Partner'}</p>
                <p className="text-stone-600">{selectedOrder.deliveryPartner?.vehicle || 'Electric Scooter'}</p>
                <p className="text-emerald-700 font-mono font-medium mt-1">{selectedOrder.deliveryPartner?.phone}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 text-xs">
            No order found matching your inquiry.
          </div>
        )}
      </div>
    </div>
  );
};
