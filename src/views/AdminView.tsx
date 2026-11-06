import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  Tag,
  AlertTriangle,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Lock,
  LogOut,
  Shield,
  Database,
  CheckCircle2,
  RefreshCw,
  Copy,
  Server,
  Github,
  FolderGit2,
  GitCommit,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import type { Product, Order, Coupon, OrderStatus } from '../types/index.ts';
import { useToast } from '../context/ToastContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { AdminLoginModal } from '../components/AdminLoginModal.tsx';

interface AdminViewProps {
  onNavigate: (view: string, params?: any) => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onNavigate,
  onTrackOrder,
}) => {
  const { isAdmin, adminToken, adminLogout, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'products' | 'orders' | 'coupons' | 'supabase' | 'github'>('metrics');
  
  // GitHub Sync state
  const [ghToken, setGhToken] = useState('');
  const [ghRepoName, setGhRepoName] = useState('riwaaz-website');
  const [ghCommitMsg, setGhCommitMsg] = useState('Update website: Riwaaz luxury home decor store');
  const [ghShowToken, setGhShowToken] = useState(false);
  const [ghValidating, setGhValidating] = useState(false);
  const [ghDetectedUser, setGhDetectedUser] = useState<any>(null);
  const [ghPushing, setGhPushing] = useState(false);
  const [ghProgress, setGhProgress] = useState<{ step: string; percent: number }>({ step: 'Idle', percent: 0 });
  const [ghResult, setGhResult] = useState<any>(null);
  const [ghError, setGhError] = useState<{ error: string; guidance?: string } | null>(null);
  
  // Data state
  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase state
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Product Form Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Furniture');
  const [prodRoom, setProdRoom] = useState('Living Room');
  const [prodCollection, setProdCollection] = useState('Modern Heritage');
  const [prodMood, setProdMood] = useState('Warm Minimal');
  const [prodPrice, setProdPrice] = useState(12900);
  const [prodInventory, setProdInventory] = useState(10);
  const [prodSku, setProdSku] = useState('RWZ-NEW-001');
  const [prodMaterial, setProdMaterial] = useState('Solid Oak & Brass');
  const [prodColor, setProdColor] = useState('Natural Sand');
  const [prodDimensions, setProdDimensions] = useState('100cm × 50cm × 45cm');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('/src/assets/images/hero_indian_living_room_1791889255407.jpg');

  // Coupon Form Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [cpCode, setCpCode] = useState('');
  const [cpDiscount, setCpDiscount] = useState(10);
  const [cpMinOrder, setCpMinOrder] = useState(5000);
  const [cpExpiry, setCpExpiry] = useState('2027-12-31');

  const { showToast } = useToast();

  const loadAllData = async () => {
    setLoading(true);
    try {
      const authHeaders: Record<string, string> = {};
      if (adminToken) {
        authHeaders['Authorization'] = `Bearer ${adminToken}`;
      }

      const [metRes, prodRes, ordRes, cpRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers: authHeaders }),
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/coupons'),
      ]);

      const metData = await metRes.json();
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();
      const cpData = await cpRes.json();

      if (metData.success) setMetrics(metData.data);
      if (prodData.success) setProducts(prodData.data);
      if (ordData.success) setOrders(ordData.data);
      if (cpData.success) setCoupons(cpData.data);

      // Check Supabase connection
      fetch('/api/supabase/status')
        .then((res) => res.json())
        .then((sbData) => {
          if (sbData.success) setSupabaseStatus(sbData);
        })
        .catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkSupabaseStatus = async () => {
    setTestingSupabase(true);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      if (data.success) {
        setSupabaseStatus(data);
        showToast(
          'Supabase Connection',
          data.connection?.message || 'Supabase status loaded',
          data.connection?.connected ? 'success' : 'info'
        );
      }
    } catch (e: any) {
      showToast('Connection Error', e?.message || 'Failed to check Supabase status', 'error');
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSyncAllOrders = async () => {
    setSyncingSupabase(true);
    try {
      const res = await fetch('/api/supabase/sync-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(
          'Supabase Sync',
          `Processed ${data.total} orders (${data.synced} directly saved in Supabase)`,
          data.synced > 0 ? 'success' : 'info'
        );
      } else {
        showToast('Sync Error', data.error || 'Failed to sync orders', 'error');
      }
    } catch (e: any) {
      showToast('Sync Failed', e?.message || 'Network error syncing orders', 'error');
    } finally {
      setSyncingSupabase(false);
    }
  };


  const handleValidateGitHub = async () => {
    if (!ghToken.trim()) {
      setGhError({ error: 'Please enter your GitHub Personal Access Token.' });
      return;
    }
    setGhValidating(true);
    setGhError(null);
    try {
      const res = await fetch('/api/github/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: ghToken.trim(), repoName: ghRepoName.trim() }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setGhDetectedUser(data.user);
        showToast('GitHub Authenticated', `Connected as @${data.user.login}`, 'success');
      } else {
        setGhDetectedUser(null);
        setGhError({ error: data.error || 'Failed to authenticate token', guidance: data.guidance });
      }
    } catch (err: any) {
      setGhError({ error: `Connection error: ${err.message}` });
    } finally {
      setGhValidating(false);
    }
  };

  const handlePushGitHub = async () => {
    if (!ghToken.trim()) {
      setGhError({ error: 'GitHub Personal Access Token is required.' });
      return;
    }
    if (!ghRepoName.trim()) {
      setGhError({ error: 'Repository name is required.' });
      return;
    }
    setGhPushing(true);
    setGhError(null);
    setGhResult(null);
    setGhProgress({ step: 'Validating token & detecting GitHub user...', percent: 20 });

    try {
      setTimeout(() => setGhProgress({ step: 'Collecting clean source files & excluding secrets...', percent: 45 }), 700);
      setTimeout(() => setGhProgress({ step: 'Staging, committing and rebasing main branch...', percent: 70 }), 1600);
      setTimeout(() => setGhProgress({ step: 'Pushing changes to GitHub repository...', percent: 85 }), 2500);

      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: ghToken.trim(),
          repoName: ghRepoName.trim(),
          commitMessage: ghCommitMsg.trim() || 'Update website',
        }),
      });
      const data = await res.json();
      setGhToken(''); // Wiped immediately from memory

      if (data.success) {
        setGhProgress({ step: 'Completed successfully!', percent: 100 });
        setGhResult(data);
        showToast('Push Succeeded', `Pushed to ${data.repoUrl}`, 'success');
      } else {
        setGhError({ error: data.error || 'Push failed', guidance: data.guidance });
        showToast('Push Failed', data.error || 'Check permissions', 'error');
      }
    } catch (err: any) {
      setGhToken('');
      setGhError({ error: `Network error: ${err.message}` });
    } finally {
      setGhPushing(false);
    }
  };

  useEffect(() => {

    loadAllData();
  }, []);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Furniture');
    setProdRoom('Living Room');
    setProdCollection('Modern Heritage');
    setProdMood('Warm Minimal');
    setProdPrice(12900);
    setProdInventory(10);
    setProdSku(`RWZ-ART-${Date.now().toString().slice(-4)}`);
    setProdMaterial('Solid Oak & Brass');
    setProdColor('Warm Sand');
    setProdDimensions('100cm × 50cm × 45cm');
    setProdDescription('Handcrafted with natural materials and traditional Indian joinery.');
    setProdImage('/src/assets/images/hero_indian_living_room_1791889255407.jpg');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdRoom(p.room);
    setProdCollection(p.collection);
    setProdMood(p.mood);
    setProdPrice(p.price);
    setProdInventory(p.inventory);
    setProdSku(p.sku);
    setProdMaterial(p.material);
    setProdColor(p.color);
    setProdDimensions(p.dimensions);
    setProdDescription(p.description);
    setProdImage(p.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg');
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku) return;

    const payload = {
      name: prodName,
      category: prodCategory,
      room: prodRoom,
      collection: prodCollection,
      mood: prodMood,
      price: Number(prodPrice),
      inventory: Number(prodInventory),
      sku: prodSku,
      material: prodMaterial,
      color: prodColor,
      dimensions: prodDimensions,
      description: prodDescription,
      shortDescription: prodDescription.slice(0, 100),
      careInstructions: 'Dust with soft dry cloth.',
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      images: [prodImage],
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Product Updated', `${prodName} saved successfully`, 'success');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Product Created', `${prodName} added to catalogue`, 'success');
        }
      }
      setShowProductModal(false);
      loadAllData();
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product Deleted', name, 'info');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: `Status updated by curator admin to ${status}.` }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order Status Updated', `Set to ${status}`, 'success');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cpCode.trim().toUpperCase(),
          discountPercent: Number(cpDiscount),
          minOrder: Number(cpMinOrder),
          expiry: cpExpiry,
          usageLimit: 500,
          active: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Coupon Created', `Code ${cpCode.toUpperCase()} is active`, 'success');
        setShowCouponModal(false);
        setCpCode('');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#FAF7F2] border border-[#D4C6B7] shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#25201C] text-[#BFA069] flex items-center justify-center mb-6 shadow-md border border-[#BFA069]/30">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#BFA069]">
            Restricted Curator Sanctuary
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C] mt-2 mb-3">
            Administrative Authentication Required
          </h2>
          <p className="text-sm text-[#785A44] max-w-lg leading-relaxed mb-8">
            Access to inventory curation, customer consignments, and atelier KPI metrics is strictly restricted to authenticated administrators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3 rounded-xl bg-[#25201C] text-[#FAF7F2] hover:bg-[#BFA069] hover:text-[#25201C] text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In as Admin</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 rounded-xl border border-[#D4C6B7] text-[#785A44] hover:bg-[#EDE5DA] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>

        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => loadAllData()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EDE5DA] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Administrative Console
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C] mt-1">
            RIWAAZ Atelier Operations
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDE5DA] border border-[#D4C6B7] text-xs text-[#523F32]">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-medium text-[#25201C]">{user?.name || 'Admin'}</span>
            <span className="text-[10px] text-[#785A44]">({user?.email})</span>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="px-4 py-2 border border-[#EDE5DA] bg-[#FAF7F2] hover:bg-[#EDE5DA] text-xs text-[#25201C] rounded-lg transition-colors"
          >
            Storefront View
          </button>
          <button
            onClick={async () => {
              await adminLogout();
              onNavigate('home');
            }}
            className="px-3.5 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-xs text-red-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Bar */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
        {[
          { id: 'metrics', label: 'Storefront KPI Metrics' },
          { id: 'products', label: `Catalogue Inventory (${products.length})` },
          { id: 'orders', label: `Customer Consignments (${orders.length})` },
          { id: 'coupons', label: `Promotions & Codes (${coupons.length})` },
          { id: 'supabase', label: 'Supabase DB (qlddjxornxfeudavzoff)' },
          { id: 'github', label: 'Push to GitHub (riwaaz-website)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#25201C] text-[#FAF7F2]'
                : 'bg-[#F5EFEB] text-[#4A3B31] hover:bg-[#EDE5DA]'
            }`}
          >
            {tab.id === 'supabase' && <Database className="w-3.5 h-3.5 text-[#BFA069]" />}
            {tab.id === 'github' && <Github className="w-3.5 h-3.5 text-[#BFA069]" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>


      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && metrics && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA]">
              <span className="text-[11px] uppercase tracking-wider text-[#785A44] font-medium">Total Gross Revenue</span>
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#25201C] mt-1 tabular-nums">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-800 font-medium">Verified Paid Volume</span>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA]">
              <span className="text-[11px] uppercase tracking-wider text-[#785A44] font-medium">Consignments Logged</span>
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#25201C] mt-1 tabular-nums">
                {metrics.totalOrders}
              </p>
              <span className="text-[10px] text-[#785A44] font-medium">{metrics.pendingOrders} in active fulfillment</span>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA]">
              <span className="text-[11px] uppercase tracking-wider text-[#785A44] font-medium">Catalogue Products</span>
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#25201C] mt-1 tabular-nums">
                {metrics.totalProducts}
              </p>
              <span className="text-[10px] text-[#785A44] font-medium">Live across 8 home departments</span>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA]">
              <span className="text-[11px] uppercase tracking-wider text-[#785A44] font-medium">Low Stock Alerts</span>
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-amber-700 mt-1 tabular-nums">
                {metrics.lowStockProducts.length}
              </p>
              <span className="text-[10px] text-amber-800 font-medium">Require atelier batch run</span>
            </div>
          </div>

          {/* Low Stock Warning List */}
          {metrics.lowStockProducts.length > 0 && (
            <div className="p-6 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] space-y-3">
              <h3 className="font-serif text-lg font-medium text-[#25201C] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Low Stock Workshop Attention</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {metrics.lowStockProducts.map((p: Product) => (
                  <div key={p.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] text-xs flex justify-between items-center">
                    <div>
                      <p className="font-serif font-medium text-[#25201C]">{p.name}</p>
                      <p className="text-[10px] text-[#785A44]">{p.sku}</p>
                    </div>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {p.inventory} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
            <div>
              <h3 className="font-serif text-2xl font-medium text-[#25201C]">Catalogue Pieces</h3>
              <p className="text-xs text-[#785A44]">Create, edit pricing, and calibrate inventory counts.</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-[#25201C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Piece</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#EDE5DA] bg-[#FAF7F2]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EFEB] border-b border-[#EDE5DA] text-[#785A44] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Piece</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE5DA]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5EFEB]/50 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover rounded bg-[#EDE5DA]" />
                      <div>
                        <span className="font-serif font-medium text-sm text-[#25201C] block">{p.name}</span>
                        <span className="text-[10px] text-[#785A44]">{p.material.slice(0, 30)}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#5E4D40]">{p.category}</td>
                    <td className="p-3.5 font-semibold text-[#25201C] tabular-nums font-sans">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.inventory <= 5 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {p.inventory} units
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-[#785A44]">{p.sku}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 text-[#785A44] hover:text-[#25201C] hover:bg-[#EDE5DA] rounded"
                        title="Edit piece"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 text-[#A69888] hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Delete piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EDE5DA] gap-4">
            <div>
              <h3 className="font-serif text-2xl font-medium text-[#25201C]">Customer Consignments</h3>
              <p className="text-xs text-[#785A44]">Track packages and update statuses from atelier to doorstep.</p>
            </div>
            <button
              onClick={() => setActiveTab('supabase')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium hover:bg-[#BFA069] hover:text-[#25201C] transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#BFA069]" />
              <span>Supabase Backend (qlddjxornxfeudavzoff)</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-[#25201C] to-[#382E26] text-[#FAF7F2] border border-[#BFA069]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#BFA069]/20 flex items-center justify-center shrink-0 border border-[#BFA069]/40">
                <Database className="w-4 h-4 text-[#E5B869]" />
              </div>
              <div>
                <p className="font-medium text-[#FAF7F2]">
                  Supabase Live Backend: <span className="text-[#E5B869] font-mono">qlddjxornxfeudavzoff</span>
                </p>
                <p className="text-[11px] text-[#D8C7B5]">
                  Order forms submitted on the storefront automatically push records to your Supabase <code className="font-mono text-[#E5B869]">public.orders</code> table.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSyncAllOrders}
                disabled={syncingSupabase}
                className="px-3 py-1 rounded bg-[#BFA069] text-[#25201C] hover:bg-[#d6b77e] font-semibold text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncingSupabase ? 'animate-spin' : ''}`} />
                <span>{syncingSupabase ? 'Syncing...' : 'Sync All Orders'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE5DA]">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#25201C]">{ord.orderNumber}</span>
                    <span className="text-[#785A44] ml-2 font-sans font-medium">Customer: {ord.customer.fullName} ({ord.customer.email})</span>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#785A44]">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1 bg-[#F5EFEB] border border-[#EDE5DA] rounded text-xs font-semibold text-[#25201C]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => onTrackOrder(ord.orderNumber)}
                      className="p-1 text-[#785A44] hover:text-[#25201C]"
                      title="View public tracking timeline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-[#785A44] uppercase tracking-wider text-[10px] mb-1">Items:</h5>
                    <div className="space-y-1">
                      {ord.items.map((i, idx) => (
                        <p key={idx} className="text-[#25201C]">
                          {i.name} × {i.quantity} (₹{i.price.toLocaleString('en-IN')})
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#785A44] uppercase tracking-wider text-[10px] mb-1">Destination:</h5>
                    <p className="text-[#5E4D40]">{ord.shippingAddress.address}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pinCode}</p>
                    <p className="text-[#785A44] mt-1 font-semibold">Total: ₹{ord.total.toLocaleString('en-IN')} ({ord.paymentMethod.toUpperCase()})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
            <div>
              <h3 className="font-serif text-2xl font-medium text-[#25201C]">Promotional Codes</h3>
              <p className="text-xs text-[#785A44]">Create discounts for seasonal celebrations and architectural campaigns.</p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-[#25201C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#25201C] bg-[#F5EFEB] px-2 py-0.5 rounded border border-[#EDE5DA]">
                    {c.code}
                  </span>
                  <span className="font-bold text-emerald-800">{c.discountPercent}% OFF</span>
                </div>
                <p className="text-[#785A44]">Min Order: ₹{c.minOrder.toLocaleString('en-IN')}</p>
                <p className="text-[#785A44]">Used: {c.timesUsed} times</p>
                <p className="text-[10px] text-[#A69888]">Expires: {c.expiry}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE BACKEND */}
      {activeTab === 'supabase' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EDE5DA] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#BFA069] font-semibold">
                  Relational PostgreSQL Cloud Database
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  Project Linked
                </span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-1">
                Supabase Backend Operations
              </h3>
              <p className="text-xs text-[#785A44]">
                Whenever someone fills the checkout order form, their order records are saved to your Supabase backend table.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={checkSupabaseStatus}
                disabled={testingSupabase}
                className="px-3.5 py-2 rounded-xl border border-[#D4C6B7] bg-[#FAF7F2] hover:bg-[#EDE5DA] text-xs font-medium text-[#25201C] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin text-[#BFA069]' : 'text-[#785A44]'}`} />
                <span>{testingSupabase ? 'Checking...' : 'Test Connection'}</span>
              </button>
              <button
                onClick={handleSyncAllOrders}
                disabled={syncingSupabase}
                className="px-4 py-2 rounded-xl bg-[#25201C] text-[#FAF7F2] hover:bg-[#BFA069] hover:text-[#25201C] text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Database className="w-3.5 h-3.5 text-[#BFA069]" />
                <span>{syncingSupabase ? 'Syncing...' : 'Sync All Orders'}</span>
              </button>
            </div>
          </div>

          {/* Configuration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Project Config */}
            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5DA]">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#BFA069]" />
                  <span className="font-semibold text-[#25201C]">Project Credentials</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EFE9DF] text-[#785A44]">
                  PostgreSQL
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] text-[#785A44] uppercase font-semibold">Supabase Project ID</span>
                  <div className="font-mono text-xs font-bold text-[#25201C] bg-[#F5EFEB] px-2.5 py-1.5 rounded border border-[#EDE5DA] mt-0.5 select-all">
                    qlddjxornxfeudavzoff
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#785A44] uppercase font-semibold">API Endpoint</span>
                  <div className="font-mono text-[11px] text-[#5E4D40] bg-[#F5EFEB] px-2.5 py-1.5 rounded border border-[#EDE5DA] mt-0.5 break-all select-all">
                    https://qlddjxornxfeudavzoff.supabase.co
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#785A44] uppercase font-semibold">Destination Table</span>
                  <div className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200 mt-0.5">
                    public.orders
                  </div>
                </div>
              </div>
            </div>

            {/* Live Order Capture Flow */}
            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5DA]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-[#25201C]">Order Capture Pipeline</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                  Active
                </span>
              </div>
              <div className="space-y-3 text-[11px] text-[#5E4D40]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#25201C] text-[#FAF7F2] flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
                  <span>Customer fills name, phone, address, and payment at checkout.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#25201C] text-[#FAF7F2] flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
                  <span>Order reference (e.g. RIW-2026-XXXXX) generated with items and totals.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#BFA069] text-[#25201C] flex items-center justify-center shrink-0 text-[10px] font-bold">3</span>
                  <span className="font-medium text-[#25201C]">Directly inserted into Supabase <code className="font-mono text-[#785A44]">public.orders</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-[#FAF7F2] flex items-center justify-center shrink-0 text-[10px] font-bold">4</span>
                  <span>Instant customer confirmation & order tracking available immediately.</span>
                </div>
              </div>
            </div>

            {/* Connection Diagnostics */}
            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5DA]">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#BFA069]" />
                  <span className="font-semibold text-[#25201C]">Backend Status</span>
                </div>
                {supabaseStatus?.connection?.connected ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Connected & Ready</span>
                  </span>
                ) : supabaseStatus?.connection?.message?.includes('orders') ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-750 text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Run SQL Script</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#785A44]">
                    <span className="w-2 h-2 rounded-full bg-[#BFA069]" />
                    <span>Target: qlddjxornxfeudavzoff</span>
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs text-[#5E4D40]">
                <p className="leading-relaxed">
                  {supabaseStatus?.connection?.message || 'Supabase integration is active. New orders from the storefront will automatically sync to your Supabase project (qlddjxornxfeudavzoff).'}
                </p>
                <div className="pt-2 border-t border-[#EDE5DA]">
                  <a
                    href="https://supabase.com/dashboard/project/qlddjxornxfeudavzoff"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BFA069] hover:underline"
                  >
                    <span>Open Supabase Project Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Supabase SQL Schema Box */}
          <div className="p-6 bg-[#25201C] text-[#FAF7F2] rounded-2xl border border-[#BFA069]/30 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3D342D]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#E5B869] font-semibold">
                  Database Table Setup (SQL Script)
                </span>
                <h4 className="font-serif text-lg font-medium text-[#FAF7F2] mt-0.5">
                  SQL Schema for `public.orders`
                </h4>
                <p className="text-xs text-[#D8C7B5] font-light">
                  If you haven't created the table in Supabase yet, copy this script and run it in the Supabase SQL Editor.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://supabase.com/dashboard/project/qlddjxornxfeudavzoff/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-[#BFA069]/40 bg-[#352B23] text-xs text-[#E5B869] hover:bg-[#43372D] flex items-center gap-1.5 transition-colors"
                >
                  <span>Open SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const sqlScript = `-- RIWAAZ ORDER MANAGEMENT SYSTEM - SUPABASE SQL SCHEMA
-- Project ID: qlddjxornxfeudavzoff

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_pincode text not null,
  delivery_method text default 'Standard White Glove',
  payment_method text not null,
  payment_status text not null default 'paid',
  status text not null default 'Confirmed',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  coupon_code text,
  raw_order jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Enable insert for all clients" on public.orders for insert with check (true);
create policy "Enable read access for all clients" on public.orders for select using (true);`;
                    navigator.clipboard.writeText(sqlScript);
                    setSqlCopied(true);
                    showToast('SQL Copied', 'SQL schema copied to clipboard!', 'success');
                    setTimeout(() => setSqlCopied(false), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#BFA069] text-[#25201C] hover:bg-[#d6b77e] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{sqlCopied ? 'Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-[#181412] rounded-xl border border-[#352B23] overflow-x-auto text-[11px] font-mono text-[#D8C7B5] leading-relaxed max-h-56">
{`create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_pincode text not null,
  delivery_method text default 'Standard White Glove',
  payment_method text not null,
  payment_status text not null default 'paid',
  status text not null default 'Confirmed',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  coupon_code text,
  raw_order jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Enable insert for all clients" on public.orders for insert with check (true);
create policy "Enable read access for all clients" on public.orders for select using (true);`}
            </pre>
          </div>

          {/* Synced Orders Table */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#EDE5DA] flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-medium text-[#25201C]">
                  Storefront Orders ({orders.length})
                </h4>
                <p className="text-xs text-[#785A44]">
                  Every completed checkout form generates an entry targeted for your Supabase backend.
                </p>
              </div>
              <button
                onClick={loadAllData}
                className="p-1.5 text-[#785A44] hover:text-[#25201C] rounded hover:bg-[#EDE5DA] transition-colors"
                title="Refresh Orders"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFEB] text-[#785A44] uppercase tracking-wider text-[10px] border-b border-[#EDE5DA]">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone / City</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Supabase Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE5DA]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F5EFEB]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#25201C]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#25201C]">
                        <p className="font-medium">{ord.customer.fullName}</p>
                        <p className="text-[11px] text-[#785A44]">{ord.customer.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#5E4D40]">
                        <p>{ord.customer.phone}</p>
                        <p className="text-[11px] text-[#785A44]">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#25201C]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#BFA069] bg-[#25201C] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>public.orders</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#785A44]">
                        No orders recorded yet. Place an order on the storefront checkout page to test Supabase sync!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GITHUB SYNC */}
      {activeTab === 'github' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EDE5DA] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#BFA069] font-semibold">
                  Official GitHub REST API Integration
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  Zero CLI Required
                </span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-1">
                GitHub Repository Push & Version Control
              </h3>
              <p className="text-xs text-[#785A44]">
                Directly commit and push all website files to your existing or new GitHub repository with automatic username detection and secret filtering.
              </p>
            </div>
          </div>

          {/* Main GitHub Control Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Form Column (2 spans) */}
            <div className="lg:col-span-2 p-6 sm:p-8 bg-[#FAF7F2] rounded-3xl border border-[#EDE5DA] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE5DA] pb-3">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-[#BFA069]" />
                  <span className="font-semibold text-sm text-[#25201C]">Repository Push Configuration</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#EFE9DF] text-[#785A44] font-medium">
                  main branch
                </span>
              </div>

              {/* Success Result Box */}
              {ghResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 space-y-3 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-base">Successfully Pushed to GitHub!</h4>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        All files and components have been synchronized to your repository.
                      </p>
                      {ghResult.repoUrl && (
                        <div className="mt-3 flex items-center justify-between bg-white/90 p-3 rounded-xl border border-emerald-200">
                          <span className="font-mono text-xs font-semibold text-emerald-900 truncate">
                            {ghResult.repoUrl}
                          </span>
                          <a
                            href={ghResult.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 transition-colors shadow-xs"
                          >
                            <span>Open Repository</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Box */}
              {ghError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 space-y-2 animate-fade-in">
                  <div className="flex items-start gap-2.5 font-semibold text-xs">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{ghError.error}</span>
                  </div>
                  {ghError.guidance && (
                    <div className="mt-2 pt-2 border-t border-rose-200/80 text-[11px] text-rose-800 bg-white/60 p-3 rounded-xl whitespace-pre-line leading-relaxed">
                      <strong>Resolution:</strong>
                      <div className="mt-1">{ghError.guidance}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Input 1: Personal Access Token */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3B31] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#BFA069]" /> GitHub Personal Access Token
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#BFA069] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Generate token on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={ghShowToken ? 'text' : 'password'}
                    value={ghToken}
                    onChange={(e) => {
                      setGhToken(e.target.value);
                      setGhError(null);
                    }}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    disabled={ghPushing}
                    className="w-full bg-white border border-[#EDE5DA] rounded-xl pl-3 pr-24 py-3 text-xs font-mono text-[#25201C] focus:outline-none focus:ring-2 focus:ring-[#BFA069] focus:border-transparent transition-all shadow-inner disabled:bg-gray-100"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGhShowToken(!ghShowToken)}
                      className="p-1 text-[#785A44] hover:text-[#25201C] transition-colors"
                      title={ghShowToken ? 'Hide token' : 'Show token'}
                    >
                      {ghShowToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleValidateGitHub}
                      disabled={ghValidating || !ghToken.trim() || ghPushing}
                      className="px-2.5 py-1.5 bg-[#25201C] text-[#FAF7F2] text-[10px] font-semibold rounded-lg hover:bg-[#3D2D24] transition-colors disabled:opacity-50"
                    >
                      {ghValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Detect User'}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-[#785A44] mt-1">
                  Ensure the token has the <strong className="text-[#25201C]">repo</strong> scope checked so it can push code.
                </p>
              </div>

              {/* Detected User Badge */}
              {ghDetectedUser && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center gap-3">
                    {ghDetectedUser.avatarUrl && (
                      <img
                        src={ghDetectedUser.avatarUrl}
                        alt={ghDetectedUser.login}
                        className="w-9 h-9 rounded-full border border-emerald-300"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
                        <span>@{ghDetectedUser.login}</span>
                        {ghDetectedUser.name && (
                          <span className="text-[11px] font-normal text-emerald-700">({ghDetectedUser.name})</span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 block">
                        ✓ Authenticated owner automatically detected via GitHub API
                      </span>
                    </div>
                  </div>
                  <a
                    href={ghDetectedUser.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Input 2: Repository Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3B31] mb-1.5 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#BFA069]" /> Target Repository Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#785A44]/70">
                    {ghDetectedUser ? `${ghDetectedUser.login}/` : 'github.com/.../'}
                  </span>
                  <input
                    type="text"
                    value={ghRepoName}
                    onChange={(e) => setGhRepoName(e.target.value)}
                    placeholder="riwaaz-website"
                    disabled={ghPushing}
                    className="w-full bg-white border border-[#EDE5DA] rounded-xl pl-28 pr-3 py-3 text-xs font-mono text-[#25201C] focus:outline-none focus:ring-2 focus:ring-[#BFA069] focus:border-transparent transition-all shadow-inner disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Input 3: Commit Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3B31] mb-1.5 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#BFA069]" /> Commit Message
                </label>
                <input
                  type="text"
                  value={ghCommitMsg}
                  onChange={(e) => setGhCommitMsg(e.target.value)}
                  placeholder="Update website: Riwaaz luxury home decor store"
                  disabled={ghPushing}
                  className="w-full bg-white border border-[#EDE5DA] rounded-xl px-3 py-2.5 text-xs text-[#25201C] focus:outline-none focus:ring-2 focus:ring-[#BFA069] focus:border-transparent transition-all shadow-inner disabled:bg-gray-100"
                />
              </div>

              {/* Progress Bar (when pushing) */}
              {ghPushing && (
                <div className="space-y-3 bg-[#FAF7F2] border border-[#EDE5DA] rounded-2xl p-5 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#25201C]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#BFA069]" />
                      <span>{ghProgress.step}</span>
                    </div>
                    <span className="font-mono text-[#BFA069]">{ghProgress.percent}%</span>
                  </div>
                  <div className="w-full bg-[#EDE5DA] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#BFA069] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${ghProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePushGitHub}
                  disabled={ghPushing || !ghToken.trim() || !ghRepoName.trim()}
                  className="w-full py-3.5 bg-[#25201C] text-[#FAF7F2] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#3D2D24] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ghPushing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pushing Website to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 text-[#BFA069]" />
                      <span>Push All Files to GitHub</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar Security & Features Info Card */}
            <div className="space-y-6">
              {/* Security Card */}
              <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-[#EDE5DA] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EDE5DA]">
                  <Shield className="w-4 h-4 text-[#BFA069]" />
                  <span className="font-semibold text-xs text-[#25201C]">Automated Security Checks</span>
                </div>
                <div className="space-y-2.5 text-[11px] text-[#5E4D40]">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Excluded:</strong> node_modules & build artifacts</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Excluded:</strong> .env files, secrets & private tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Ephemeral:</strong> Tokens cleared from memory immediately</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Auto-Detect:</strong> GitHub username detected from token</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Sync:</strong> Preserves main branch & handles existing files</span>
                  </div>
                </div>
              </div>

              {/* Quick instructions card */}
              <div className="p-6 bg-[#25201C] text-[#FAF7F2] rounded-3xl border border-[#3D2D24] shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#BFA069] text-xs font-semibold">
                  <Github className="w-4 h-4" />
                  <span>How to Get Your Token</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-[#FAF7F2]/80 leading-relaxed">
                  <li>Visit <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-[#BFA069] underline">GitHub Token Settings</a>.</li>
                  <li>Click <strong>Generate new token (classic)</strong>.</li>
                  <li>Check the <strong className="text-white">repo</strong> scope checkbox.</li>
                  <li>Copy and paste the token here to push.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT CREATE/EDIT MODAL */}

      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs" onClick={() => setShowProductModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#EDE5DA] shadow-2xl text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE5DA] pb-3">
                <h3 className="font-serif text-xl font-medium text-[#25201C]">
                  {editingProduct ? 'Edit Piece' : 'Add New Atelier Piece'}
                </h3>
                <button onClick={() => setShowProductModal(false)}>
                  <X className="w-5 h-5 text-[#785A44]" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Piece Name</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    >
                      {['Furniture', 'Lighting', 'Wall Décor', 'Tables', 'Seating', 'Vases', 'Mirrors', 'Accessories'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Room</label>
                    <select
                      value={prodRoom}
                      onChange={(e) => setProdRoom(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    >
                      {['Living Room', 'Bedroom', 'Dining Room', 'Entryway', 'Workspace', 'Outdoor'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Inventory (Units)</label>
                    <input
                      type="number"
                      required
                      value={prodInventory}
                      onChange={(e) => setProdInventory(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Materials Used</label>
                    <input
                      type="text"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Image Asset Path / URL</label>
                    <input
                      type="text"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded font-mono text-[11px]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Description & Story</label>
                    <textarea
                      rows={3}
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE5DA]">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 border border-[#EDE5DA] rounded text-[#785A44]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#25201C] text-[#FAF7F2] rounded font-semibold"
                  >
                    Save Piece
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs" onClick={() => setShowCouponModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#FAF7F2] p-6 rounded-3xl border border-[#EDE5DA] shadow-2xl text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE5DA] pb-3">
                <h3 className="font-serif text-xl font-medium text-[#25201C]">Create Promotion Code</h3>
                <button onClick={() => setShowCouponModal(false)}>
                  <X className="w-5 h-5 text-[#785A44]" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Code (Uppercase)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20"
                    value={cpCode}
                    onChange={(e) => setCpCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="90"
                    value={cpDiscount}
                    onChange={(e) => setCpDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={cpMinOrder}
                    onChange={(e) => setCpMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE5DA]">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="px-4 py-2 border border-[#EDE5DA] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#25201C] text-[#FAF7F2] rounded font-semibold"
                  >
                    Activate Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
