import React, { useState } from 'react';
import { X, ShieldCheck, Package, ShoppingCart, Plus, Edit2, TrendingUp, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { ProductCategory, Product, OrderStatus } from '../types/grocery';

export const AdminPortalModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    products,
    orders,
    categories,
    addProduct,
    updateProduct,
    toggleProductStock,
    updateOrderStatus
  } = useGrocery();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics'>('orders');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Fresh Fruits');
  const [newProdPrice, setNewProdPrice] = useState(80);
  const [newProdUnit, setNewProdUnit] = useState('1 kg');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('Freshly harvested local produce for FreshMart Kolkata customers.');

  if (!isAdminModalOpen) return null;

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount === 0).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice),
      originalPrice: Number(newProdPrice) + 20,
      unit: newProdUnit,
      image: '/src/assets/images/fruits_showcase_1793432152742.jpg',
      description: newProdDesc,
      inStock: true,
      stockCount: Number(newProdStock),
      rating: 4.8,
      reviewsCount: 1,
      origin: 'Kolkata Sourcing Hub',
      shelfLife: '5 days'
    });

    setShowAddModal(false);
    setNewProdName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display">
                  FreshMart Store Administration Portal
                </h3>
                <span className="text-[10px] font-mono bg-stone-800 text-emerald-400 px-2 py-0.5 rounded">
                  Merchant Console
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Salt Lake Central Distribution Hub · Kolkata, West Bengal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Quick Stats */}
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1.5 bg-stone-200/70 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'orders' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Order Dispatch ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'inventory' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Product Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'analytics' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Store Metrics & Analytics
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-stone-500 mr-1 text-[11px]">Revenue:</span>
              <strong className="text-emerald-700 font-bold tabular-nums">₹{totalRevenue}</strong>
            </div>
            <div>
              <span className="text-stone-500 mr-1 text-[11px]">Orders:</span>
              <strong className="text-stone-900 font-bold tabular-nums">{totalOrdersCount}</strong>
            </div>
            {outOfStockCount > 0 && (
              <span className="text-amber-600 flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {outOfStockCount} Low Stock
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Customer Orders & Live Fulfillment</h4>
                  <p className="text-xs text-stone-500">Advance order status to demonstrate real-time tracking</p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 bg-white shadow-2xs">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-stone-50/50 transition-colors space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-800 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {order.orderNumber}
                        </span>
                        <span className="font-semibold text-stone-900 text-xs">
                          {order.customerName}
                        </span>
                        <span className="text-stone-400 text-xs">· {order.locality}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                          ₹{order.total} ({order.paymentMethod})
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2">
                      <div className="truncate max-w-md">
                        {order.items.map(it => `${it.quantity}x ${it.productName}`).join(', ')}
                      </div>

                      {/* Status advancement buttons */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-stone-400 mr-1">Update Status:</span>
                        {(['Placed', 'Packed', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateOrderStatus(order.id, st)}
                            className={`px-2 py-0.5 text-[10px] rounded font-semibold border transition-colors ${
                              order.status === st
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
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Product Inventory Catalog</h4>
                  <p className="text-xs text-stone-500">Edit prices, adjust available quantity, or toggle stock</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Table */}
              <div className="border border-stone-200 rounded-xl overflow-x-auto bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/60">
                        <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                          <img
                            src={p.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover bg-stone-100 shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span className="truncate max-w-[180px]">{p.name}</span>
                        </td>
                        <td className="p-3 text-stone-600">{p.category}</td>
                        <td className="p-3 font-mono text-stone-600">{p.unit}</td>
                        <td className="p-3 font-mono font-bold text-stone-900">
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                            className="w-16 px-1.5 py-0.5 border border-stone-200 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="p-3 font-mono">
                          <input
                            type="number"
                            value={p.stockCount}
                            onChange={(e) => updateProduct(p.id, { stockCount: Number(e.target.value) })}
                            className="w-14 px-1.5 py-0.5 border border-stone-200 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleProductStock(p.id)}
                            className="text-stone-500 hover:text-emerald-700 font-semibold text-[11px]"
                          >
                            Toggle Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS & STORE PERFORMANCE */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Store Performance & Sales Analytics</h4>
                <p className="text-xs text-stone-500">Business overview of FreshMart Kolkata operations</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Revenue</span>
                  <span className="text-xl font-bold font-mono text-emerald-950 tabular-nums">₹{totalRevenue}</span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">UPI & COD Settlements</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Fulfilled Orders</span>
                  <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">{totalOrdersCount}</span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Kolkata Municipal Area</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Catalog SKUs</span>
                  <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">{products.length}</span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Across 6 Categories</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Avg Order Value</span>
                  <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                    ₹{totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Per Transaction</span>
                </div>
              </div>

              {/* Operations Overview */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <h5 className="font-bold text-stone-900">Store Operations & Stock Control:</h5>
                <p className="text-stone-600 leading-relaxed">
                  Changes made in this management portal immediately update live customer catalog prices, inventory counts, and fulfillment statuses across all connected active sessions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add New Product Form */}
        {showAddModal && (
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-20">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h4 className="font-bold text-stone-900 text-sm">Add New Grocery Product</h4>
                <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Fresh Sweet Papaya"
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-stone-900"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Package Unit</label>
                    <input
                      type="text"
                      required
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      placeholder="e.g. 1 kg, 500 g"
                      className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Stock Count</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
