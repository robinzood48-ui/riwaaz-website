import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Shield, Sparkles } from 'lucide-react';
import { BrandEmblem } from './BrandEmblem.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { openCart, totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, switchAccount, logout } = useAuth();

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Collections', view: 'collections' },
    { label: 'New Arrivals', view: 'shop', params: { filter: 'new' } },
    { label: 'About', view: 'story' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#25201C] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span>Complimentary White Glove Delivery on orders above ₹5,000 across India</span>
        <span className="hidden md:inline text-[#BFA069] font-normal">| Use code RIWAAZ10 for 10% off</span>
      </div>

      {/* Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE5DA] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: RIWAAZ Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 group text-left focus:outline-none"
              aria-label="RIWAAZ Home"
            >
              <BrandEmblem size={38} variant="gold" className="transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.18em] uppercase text-[#25201C] font-semibold leading-none group-hover:text-[#BFA069] transition-colors">
                  RIWAAZ
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#785A44] font-medium mt-1">
                  Timeless Indian Living
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wider uppercase font-medium text-[#4A3B31]">
            {navLinks.map((link) => {
              const isActive = currentView === link.view && (!link.params || currentView === 'shop');
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.view, link.params)}
                  className={`relative py-1 transition-colors hover:text-[#25201C] ${
                    isActive ? 'text-[#25201C] font-semibold' : 'text-[#5E4D40]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#BFA069]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6 text-[#25201C]">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-[#4A3B31] hover:text-[#25201C] transition-colors flex items-center gap-2 focus:outline-none"
              aria-label="Search décor and furniture"
              title="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
              <span className="hidden xl:inline text-xs tracking-wider text-[#785A44] uppercase font-medium">Search</span>
            </button>

            {/* Account / Admin Trigger */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-1.5 text-[#4A3B31] hover:text-[#25201C] transition-colors flex items-center gap-1.5 focus:outline-none"
                aria-label="User Account"
                title="Account & Portal"
              >
                {isAdmin ? (
                  <Shield className="w-5 h-5 text-[#BFA069] stroke-[1.75]" />
                ) : (
                  <User className="w-5 h-5 stroke-[1.75]" />
                )}
                {user && (
                  <span className="hidden xl:inline text-xs tracking-wider uppercase font-medium text-[#785A44] truncate max-w-[90px]">
                    {isAdmin ? 'Admin' : user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAccountMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-64 bg-[#FAF7F2] border border-[#EDE5DA] rounded-lg shadow-xl py-2 z-20 text-xs">
                    <div className="px-4 py-2 border-b border-[#EDE5DA]">
                      <p className="font-semibold text-[#25201C]">{user ? user.name : 'Welcome to RIWAAZ'}</p>
                      <p className="text-[#785A44] truncate">{user ? user.email : 'Explore curated Indian living'}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-semibold text-[#BFA069] bg-[#3D2D24] px-1.5 py-0.5 rounded">
                          Curator Admin
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      {user ? (
                        <>
                          <button
                            onClick={() => {
                              onNavigate('account');
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#EDE5DA] transition-colors text-[#25201C]"
                          >
                            My Orders & Addresses
                          </button>
                          {isAdmin ? (
                            <button
                              onClick={() => {
                                onNavigate('admin');
                                setAccountMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 font-medium text-[#785A44] hover:bg-[#EDE5DA] transition-colors flex items-center justify-between"
                            >
                              <span>Admin Dashboard</span>
                              <Shield className="w-3.5 h-3.5 text-[#BFA069]" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => {
                              logout();
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-rose-700 hover:bg-[#EDE5DA] transition-colors"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            onNavigate('account');
                            setAccountMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 font-medium hover:bg-[#EDE5DA] text-[#25201C]"
                        >
                          Sign In / Register
                        </button>
                      )}
                    </div>

                    {/* Role Switcher for instant reviewing */}
                    <div className="px-4 py-2 border-t border-[#EDE5DA] bg-[#F5EFEB]">
                      <p className="text-[10px] uppercase tracking-wider text-[#785A44] font-semibold mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#BFA069]" /> Quick Review Mode:
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            switchAccount('customer');
                            setAccountMenuOpen(false);
                          }}
                          className={`flex-1 py-1 px-2 rounded text-[11px] font-medium border text-center transition-colors ${
                            !isAdmin && user
                              ? 'bg-[#25201C] text-[#FAF7F2] border-[#25201C]'
                              : 'bg-white text-[#4A3B31] border-[#EDE5DA] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          Customer
                        </button>
                        <button
                          onClick={() => {
                            switchAccount('admin');
                            onNavigate('admin');
                            setAccountMenuOpen(false);
                          }}
                          className={`flex-1 py-1 px-2 rounded text-[11px] font-medium border text-center transition-colors ${
                            isAdmin
                              ? 'bg-[#25201C] text-[#FAF7F2] border-[#25201C]'
                              : 'bg-white text-[#4A3B31] border-[#EDE5DA] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Trigger */}
            <button
              onClick={() => onNavigate('account', { tab: 'wishlist' })}
              className="p-1.5 text-[#4A3B31] hover:text-[#25201C] transition-colors relative focus:outline-none"
              aria-label="Wishlist"
              title="Saved Pieces"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#BFA069] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="p-1.5 text-[#4A3B31] hover:text-[#25201C] transition-colors relative focus:outline-none"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25201C] text-[#FAF7F2] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#4A3B31] hover:text-[#25201C] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EDE5DA] bg-[#FAF7F2] px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-3 text-sm tracking-wider uppercase font-medium text-[#4A3B31]">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    onNavigate(link.view, link.params);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-[#F0E8DC] hover:text-[#25201C]"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onNavigate('account', { tab: 'orders' });
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 border-b border-[#F0E8DC] hover:text-[#25201C]"
              >
                Track Orders
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 font-semibold text-[#BFA069] flex items-center justify-between"
                >
                  <span>Admin Panel</span>
                  <Shield className="w-4 h-4" />
                </button>
              )}
            </nav>

            <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-between text-xs text-[#785A44]">
              <span>Customer Care: care@riwaaz.in</span>
              <span>Mon - Sat 10am - 7pm IST</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
