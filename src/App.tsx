import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { CartProvider } from './context/CartContext.tsx';

import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { QuickViewModal } from './components/QuickViewModal.tsx';
import { TrackOrderModal } from './components/TrackOrderModal.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';

import { HomeView } from './views/HomeView.tsx';
import { ShopView } from './views/ShopView.tsx';
import { ProductDetailView } from './views/ProductDetailView.tsx';
import { CollectionsView } from './views/CollectionsView.tsx';
import { StoryView } from './views/StoryView.tsx';
import { CheckoutView } from './views/CheckoutView.tsx';
import { OrderConfirmationView } from './views/OrderConfirmationView.tsx';
import { AccountView } from './views/AccountView.tsx';
import { AdminView } from './views/AdminView.tsx';

import type { Product, Order } from './types/index.ts';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [shopFilterParams, setShopFilterParams] = useState<any>(undefined);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [trackOrderInitialNumber, setTrackOrderInitialNumber] = useState<string>('');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  const navigate = (view: string, params?: any) => {
    if (view === 'shop') {
      setShopFilterParams(params || undefined);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    navigate('product');
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTrackOrder = (orderNumber: string = '') => {
    setTrackOrderInitialNumber(orderNumber);
    setTrackOrderOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#25201C] selection:bg-[#EDE5DA] selection:text-[#25201C]">
      {/* Sticky Header */}
      <Header
        currentView={currentView}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            initialFilter={shopFilterParams}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
          />
        )}

        {currentView === 'product' && selectedProductId && (
          <ProductDetailView
            productId={selectedProductId}
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
          />
        )}

        {currentView === 'collections' && (
          <CollectionsView onNavigate={navigate} />
        )}

        {currentView === 'story' && (
          <StoryView onNavigate={navigate} />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onOrderSuccess={handleOrderSuccess}
            onNavigate={navigate}
          />
        )}

        {currentView === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationView
            order={confirmedOrder}
            onNavigate={navigate}
            onTrackOrder={handleOpenTrackOrder}
          />
        )}

        {currentView === 'account' && (
          <AccountView
            initialTab={shopFilterParams?.tab || 'orders'}
            onNavigate={navigate}
            onTrackOrder={handleOpenTrackOrder}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            onNavigate={navigate}
            onTrackOrder={handleOpenTrackOrder}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigate}
        onOpenTrackOrder={() => handleOpenTrackOrder('')}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onCheckout={() => navigate('checkout')}
        onContinueShopping={() => navigate('shop')}
      />

      {/* Global Live Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onNavigateToCategory={(cat) => navigate('shop', { category: cat })}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={handleSelectProduct}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={trackOrderOpen}
        onClose={() => setTrackOrderOpen(false)}
        initialOrderNumber={trackOrderInitialNumber}
      />

      {/* Secure Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => navigate('admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
