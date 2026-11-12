import React, { useState } from 'react';
import {
  LogIn,
  LogOut,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  Package,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { DEMO_USERS, KOLKATA_LOCALITIES } from '../data/initialData';

export const AuthPage: React.FC = () => {
  const {
    currentUser,
    login,
    logout,
    register,
    setActiveView,
    orders,
    setIsOrderTrackingOpen,
    setTrackingOrderId,
    setIsAdminModalOpen
  } = useGrocery();

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regLocality, setRegLocality] = useState(KOLKATA_LOCALITIES[0].name);
  const [regPinCode, setRegPinCode] = useState(KOLKATA_LOCALITIES[0].pin);
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // New Address form within account
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Office');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrLocality, setNewAddrLocality] = useState(KOLKATA_LOCALITIES[0].name);

  const handleLocalityChange = (locName: string) => {
    setRegLocality(locName);
    const found = KOLKATA_LOCALITIES.find(l => l.name === locName);
    if (found) setRegPinCode(found.pin);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or phone number.');
      return;
    }
    const res = login(loginEmail);
    if (res.success) {
      setLoginError(null);
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleQuickDemoLogin = (email: string) => {
    login(email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regAddress.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }
    const res = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      locality: regLocality,
      pinCode: regPinCode
    });
    if (res.success) {
      setRegError(null);
    }
  };

  // Filter orders for logged in user
  const userOrders = currentUser
    ? orders.filter(
        o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
             o.customerPhone === currentUser.phone ||
             o.customerName.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
      )
    : [];

  return (
    <div className="min-h-[85vh] bg-stone-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation back to store */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('store')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping at FreshMart</span>
          </button>

          <span className="text-xs text-stone-500 font-medium">
            Kolkata Online Grocery Store
          </span>
        </div>

        {/* VIEW A: USER IS LOGGED IN (Show Account Details & Log Out Button) */}
        {currentUser ? (
          <div className="space-y-6">
            {/* User Profile Header Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm font-display">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                      {currentUser.name}
                    </h1>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {currentUser.role === 'admin' ? 'Store Manager' : 'Verified Customer'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      {currentUser.email}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {currentUser.phone}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Log Out */}
              <div className="flex items-center gap-3 shrink-0">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    className="px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Store Admin</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 hover:border-rose-300 transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Grid: Saved Addresses & Order History */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Saved Addresses (5 cols) */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Saved Delivery Addresses</span>
                  </h3>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAddress ? 'Close' : 'Add New'}</span>
                  </button>
                </div>

                {/* Add new address quick form */}
                {showAddAddress && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Work, Apartment)"
                      value={newAddrLabel}
                      onChange={(e) => setNewAddrLabel(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded text-stone-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Flat & Street Address"
                      value={newAddrText}
                      onChange={(e) => setNewAddrText(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded text-stone-900 text-xs"
                    />
                    <select
                      value={newAddrLocality}
                      onChange={(e) => setNewAddrLocality(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded text-stone-900 text-xs"
                    >
                      {KOLKATA_LOCALITIES.map(l => (
                        <option key={l.name} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (!newAddrText.trim()) return;
                        const match = KOLKATA_LOCALITIES.find(l => l.name === newAddrLocality);
                        currentUser.savedAddresses.push({
                          id: `addr-${Date.now()}`,
                          label: newAddrLabel,
                          address: newAddrText,
                          locality: newAddrLocality,
                          pinCode: match?.pin || '700091'
                        });
                        setNewAddrText('');
                        setShowAddAddress(false);
                      }}
                      className="w-full py-1.5 bg-emerald-600 text-white font-semibold rounded text-xs"
                    >
                      Save Address
                    </button>
                  </div>
                )}

                {/* Addresses List */}
                <div className="space-y-3">
                  {currentUser.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-[11px] uppercase tracking-wider text-emerald-900">
                          {addr.label}
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-medium">
                          Active
                        </span>
                      </div>
                      <p className="text-stone-700 leading-snug">{addr.address}</p>
                      <p className="text-stone-500 font-mono text-[11px]">
                        {addr.locality} – {addr.pinCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Order History (7 cols) */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>Your Order History ({userOrders.length})</span>
                  </h3>
                  <span className="text-xs text-stone-400">Doorstep Delivery</span>
                </div>

                {userOrders.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-emerald-900 text-xs">
                            {ord.orderNumber}
                          </span>
                          <span className="text-stone-500 text-[11px]">{ord.date}</span>
                        </div>

                        <div className="text-stone-600 truncate">
                          {ord.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 font-mono tabular-nums text-sm">
                              ₹{ord.total}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {ord.status}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setTrackingOrderId(ord.id);
                              setIsOrderTrackingOpen(true);
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                          >
                            Live Status →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-500 text-xs">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-stone-700">No orders placed yet</p>
                    <p className="text-stone-400 mt-0.5">Explore our catalog and place your first grocery order!</p>
                    <button
                      onClick={() => setActiveView('store')}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Browse Groceries
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW B: USER IS LOGGED OUT (Show Log In & Sign Up Form) */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200/90 shadow-md overflow-hidden">
            {/* Header Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50/70 text-xs font-bold">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3.5 text-center transition-colors flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'border-b-2 border-emerald-600 text-emerald-800 bg-white'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3.5 text-center transition-colors flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'border-b-2 border-emerald-600 text-emerald-800 bg-white'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Brand wordmark & subtitle */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <span className="font-extrabold text-2xl font-display">F</span>
                </div>
                <h2 className="text-xl font-extrabold text-stone-900 font-display">
                  {authMode === 'login' ? 'Log in to FreshMart' : 'Create FreshMart Account'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Your Daily Needs, Delivered Fresh in Kolkata
                </p>
              </div>

              {/* 1-Click Fast Login / Demo Accounts */}
              {authMode === 'login' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs space-y-2">
                  <span className="text-[11px] font-bold text-emerald-950 block">
                    Quick Demo Accounts (1-Click Login):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_USERS.map((usr) => (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(usr.email)}
                        className="p-2 bg-white rounded-lg border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-2xs transition-all"
                      >
                        <span className="block font-bold text-[11px] text-stone-900 truncate">
                          {usr.name.split(' ')[0]}
                        </span>
                        <span className="block text-[10px] text-stone-500 capitalize">
                          {usr.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {(loginError || regError) && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {loginError || regError}
                </div>
              )}

              {/* FORM: LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. rahul.roy@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-stone-700 font-semibold">Password</label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link simulated to your registered email.')}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      defaultChecked
                      className="accent-emerald-600 rounded"
                    />
                    <label htmlFor="rememberMe" className="text-stone-600 cursor-pointer text-xs">
                      Remember me on this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to FreshMart</span>
                  </button>
                </form>
              )}

              {/* FORM: REGISTER */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Sneha Chattopadhyay"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="sneha@example.com"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98301 23456"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Kolkata Locality</label>
                    <select
                      value={regLocality}
                      onChange={(e) => handleLocalityChange(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    >
                      {KOLKATA_LOCALITIES.map(loc => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name} (PIN: {loc.pin})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Street Address, Flat / House No.</label>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="e.g. Flat 4B, Greenfield Enclave"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Create Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create FreshMart Account</span>
                  </button>
                </form>
              )}

              {/* Bottom toggle between Login and Register */}
              <div className="pt-2 text-center text-xs text-stone-500">
                {authMode === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      Sign Up Now
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      Log In to your Account
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
