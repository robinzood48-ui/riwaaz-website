import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import type { Order, Product } from '../types/index.ts';

interface AccountViewProps {
  initialTab?: 'orders' | 'wishlist' | 'addresses' | 'profile';
  onNavigate: (view: string, params?: any) => void;
  onTrackOrder: (orderNumber: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  initialTab = 'orders',
  onNavigate,
  onTrackOrder,
  onSelectProduct,
}) => {
  const { user, login, register, logout, isAdmin, switchAccount, updateUserAddresses } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Auth Form State (when not logged in)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Add Address Modal state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');

  useEffect(() => {
    if (user) {
      async function fetchUserOrders() {
        setLoadingOrders(true);
        try {
          const res = await fetch(`/api/orders?userId=${encodeURIComponent(user?.id || '')}`);
          const data = await res.json();
          if (data.success) {
            setOrders(data.data || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingOrders(false);
        }
      }
      fetchUserOrders();
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    if (authMode === 'login') {
      const ok = await login(authEmail);
      if (ok) {
        showToast('Welcome back', `Signed in as ${authEmail}`, 'success');
      } else {
        showToast('Login Failed', 'Please check your email.', 'error');
      }
    } else {
      const ok = await register(authName, authEmail);
      if (ok) {
        showToast('Account Created', `Welcome to RIWAAZ, ${authName}`, 'success');
      } else {
        showToast('Registration Failed', 'Please try again.', 'error');
      }
    }
    setAuthLoading(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrStreet || !newAddrCity || !newAddrState || !newAddrPin) return;

    await updateUserAddresses({
      fullName: newAddrName,
      phone: newAddrPhone || user?.phone || '',
      address: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      pinCode: newAddrPin,
    });

    setShowAddAddress(false);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrPin('');
    showToast('Address Saved', 'New delivery destination added.', 'success');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#EDE5DA] shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
              RIWAAZ Patron Portal
            </span>
            <h2 className="font-serif text-3xl font-medium text-[#25201C]">
              {authMode === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-[#785A44]">
              {authMode === 'login'
                ? 'Access order tracking, saved wishlist, and addresses.'
                : 'Join the RIWAAZ community for personalized interior styling.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sen"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#785A44] uppercase font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
              />
            </div>

            <div>
              <label className="block text-[#785A44] uppercase font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors"
            >
              {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-[#785A44] pt-2 border-t border-[#EDE5DA]">
            {authMode === 'login' ? (
              <p>
                New to RIWAAZ?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-semibold text-[#25201C] hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-semibold text-[#25201C] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Login Preset */}
          <div className="p-3 bg-[#F5EFEB] rounded-xl text-center text-xs space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#785A44] font-semibold block">
              Quick Test Review Logins
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => switchAccount('customer')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-[#FAF7F2] border border-[#EDE5DA] rounded text-[11px] font-medium text-[#25201C]"
              >
                Log In as Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  switchAccount('admin');
                  onNavigate('admin');
                }}
                className="flex-1 py-1.5 px-2 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] rounded text-[11px] font-medium"
              >
                Log In as Admin
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-[#EDE5DA] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Patron Dashboard
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C] mt-1">
            Hello, {user.name}
          </h1>
          <p className="text-xs text-[#785A44]">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 bg-[#FAF7F2] border border-[#BFA069] text-[#785A44] hover:bg-[#F5EFEB] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#BFA069]" />
              <span>Admin Management</span>
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 border border-[#EDE5DA] bg-[#FAF7F2] hover:bg-[#EDE5DA] text-xs text-rose-800 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs Left (col-span-3) */}
        <aside className="lg:col-span-3 space-y-1 text-xs">
          {[
            { id: 'orders', label: 'Order History', icon: <Package className="w-4 h-4" />, count: orders.length },
            { id: 'wishlist', label: 'Saved Pieces', icon: <Heart className="w-4 h-4" />, count: wishlistItems.length },
            { id: 'addresses', label: 'Delivery Addresses', icon: <MapPin className="w-4 h-4" />, count: user.addresses?.length || 0 },
            { id: 'profile', label: 'Personal Information', icon: <UserIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium ${
                activeTab === tab.id
                  ? 'bg-[#25201C] text-[#FAF7F2]'
                  : 'text-[#4A3B31] hover:bg-[#F5EFEB]'
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-[#3D2D24] text-[#BFA069]' : 'bg-[#EDE5DA] text-[#5E4D40]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Tab Content Right (col-span-9) */}
        <main className="lg:col-span-9 bg-[#FAF7F2] rounded-3xl border border-[#EDE5DA] p-6 sm:p-10 shadow-xs min-h-[450px]">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE5DA] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#25201C]">Order History</h3>
                <span className="text-xs text-[#785A44]">{orders.length} consignments</span>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-[#785A44]">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#785A44]">
                  <p>You have not placed any orders yet.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="mt-4 px-6 py-2.5 bg-[#25201C] text-[#FAF7F2] rounded-lg font-medium"
                  >
                    Explore Décor
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] space-y-4 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EDE5DA]">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#25201C]">{ord.orderNumber}</span>
                          <span className="text-[#785A44] ml-3">
                            Placed {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {ord.status}
                          </span>
                          <button
                            onClick={() => onTrackOrder(ord.orderNumber)}
                            className="px-3 py-1 bg-[#25201C] text-[#FAF7F2] rounded text-[11px] font-medium flex items-center gap-1"
                          >
                            <span>Track</span>
                            <ExternalLink className="w-3 h-3 text-[#BFA069]" />
                          </button>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" className="w-10 h-10 object-cover rounded bg-[#EDE5DA]" />
                              <div>
                                <p className="font-serif font-medium text-[#25201C]">{item.name}</p>
                                <p className="text-[10px] text-[#785A44]">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-[#25201C] tabular-nums font-sans">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#EDE5DA] flex justify-between items-center text-xs">
                        <span className="text-[#785A44]">Total Consignment Value:</span>
                        <span className="font-bold text-sm text-[#25201C] tabular-nums font-sans">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE5DA] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#25201C]">Saved Pieces</h3>
                <span className="text-xs text-[#785A44]">{wishlistItems.length} pieces</span>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#785A44]">
                  <p>Your wishlist is currently empty.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="mt-4 px-6 py-2.5 bg-[#25201C] text-[#FAF7F2] rounded-lg font-medium"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] flex gap-4 items-center"
                    >
                      <img
                        src={prod.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg'}
                        alt=""
                        className="w-16 h-16 object-cover rounded-xl bg-[#EDE5DA] shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-serif font-medium text-[#25201C] truncate">{prod.name}</h4>
                        <p className="font-semibold text-[#25201C] tabular-nums mt-0.5 font-sans">
                          ₹{(prod.salePrice ?? prod.price).toLocaleString('en-IN')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              addToCart(prod, 1);
                              removeFromWishlist(prod.id);
                            }}
                            className="px-2.5 py-1 bg-[#25201C] text-[#FAF7F2] rounded text-[11px] font-medium flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Move to Bag</span>
                          </button>
                          <button
                            onClick={() => removeFromWishlist(prod.id)}
                            className="text-[#A69888] hover:text-rose-700 text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE5DA] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#25201C]">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="px-3.5 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form Modal */}
              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="p-5 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] space-y-4 text-xs">
                  <h4 className="font-semibold text-[#25201C]">Add Delivery Destination</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#785A44] uppercase font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddrName}
                        onChange={(e) => setNewAddrName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#785A44] uppercase font-semibold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[#785A44] uppercase font-semibold mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#785A44] uppercase font-semibold mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#785A44] uppercase font-semibold mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddrState}
                        onChange={(e) => setNewAddrState(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#785A44] uppercase font-semibold mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={newAddrPin}
                        onChange={(e) => setNewAddrPin(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#25201C] text-[#FAF7F2] rounded font-medium"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 border border-[#EDE5DA] rounded text-[#785A44]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.map((addr) => (
                  <div key={addr.id} className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#25201C]">
                      <span>{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-[#BFA069] bg-[#3D2D24] px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[#5E4D40]">{addr.address}</p>
                    <p className="text-[#5E4D40]">{addr.city}, {addr.state} - {addr.pinCode}</p>
                    <p className="text-[#785A44] pt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-md text-xs">
              <div className="border-b border-[#EDE5DA] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#25201C]">Personal Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded text-[#25201C]"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded text-[#25201C]"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    disabled
                    value={user.phone || '+91 98111 22334'}
                    className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded text-[#25201C]"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Account Role</label>
                  <span className="inline-block px-2.5 py-1 bg-[#3D2D24] text-[#BFA069] font-medium rounded text-[11px] uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
