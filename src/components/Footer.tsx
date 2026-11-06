import React from 'react';
import { BrandEmblem } from './BrandEmblem.tsx';
import { ShieldCheck, Truck, RefreshCw, Sparkles, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenTrackOrder: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTrackOrder, onOpenAdminLogin }) => {
  return (
    <footer className="bg-[#25201C] text-[#FAF7F2] border-t border-[#3D2D24]">
      {/* Brand Values Strip */}
      <div className="border-b border-[#3D2D24] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <Truck className="w-5 h-5 text-[#BFA069] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-serif font-medium text-[#FAF7F2]">White Glove Delivery</h4>
              <p className="text-xs text-[#A69888] mt-1">Complimentary room-of-choice placement on orders over ₹5,000.</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-[#BFA069] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-serif font-medium text-[#FAF7F2]">Indian Craftsmanship</h4>
              <p className="text-xs text-[#A69888] mt-1">Honouring generational woodcarvers, potters, and pit-loom weavers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#BFA069] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-serif font-medium text-[#FAF7F2]">Ten-Year Timber Warranty</h4>
              <p className="text-xs text-[#A69888] mt-1">Sustainably kiln-dried solid hardwoods built for generational heirloom living.</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <RefreshCw className="w-5 h-5 text-[#BFA069] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-serif font-medium text-[#FAF7F2]">Effortless Returns</h4>
              <p className="text-xs text-[#A69888] mt-1">14-day dedicated white glove inspection and seamless return guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandEmblem size={44} variant="gold" />
              <div>
                <span className="font-serif text-2xl tracking-[0.18em] uppercase text-[#FAF7F2] font-semibold leading-none">
                  RIWAAZ
                </span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-[#BFA069] font-medium mt-1">
                  Timeless Indian Living
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A69888] leading-relaxed max-w-sm">
              RIWAAZ brings together the soul of Indian craftsmanship and the simplicity of contemporary interior architecture. Every piece is made to imbue homes with warmth, texture, and quiet character.
            </p>
            <div className="pt-2 text-xs text-[#BFA069] flex items-center gap-2">
              <span>Atelier & Flagship: Mehrauli, New Delhi 110030</span>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold mb-4">Shop</h4>
            <ul className="space-y-2.5 text-xs text-[#D4C6B7]">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#FAF7F2] transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filter: 'new' })} className="hover:text-[#FAF7F2] transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filter: 'bestseller' })} className="hover:text-[#FAF7F2] transition-colors">
                  Bestsellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-[#FAF7F2] transition-colors">
                  Collections
                </button>
              </li>
            </ul>
          </div>

          {/* ROOMS */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold mb-4">Rooms</h4>
            <ul className="space-y-2.5 text-xs text-[#D4C6B7]">
              {['Living Room', 'Bedroom', 'Dining Room', 'Entryway', 'Workspace'].map((room) => (
                <li key={room}>
                  <button
                    onClick={() => onNavigate('shop', { room })}
                    className="hover:text-[#FAF7F2] transition-colors"
                  >
                    {room}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ABOUT & CRAFT */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold mb-4">About</h4>
            <ul className="space-y-2.5 text-xs text-[#D4C6B7]">
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-[#FAF7F2] transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story', { section: 'craft' })} className="hover:text-[#FAF7F2] transition-colors">
                  Craftsmanship
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story', { section: 'lookbook' })} className="hover:text-[#FAF7F2] transition-colors">
                  RIWAAZ at Home
                </button>
              </li>
              <li>
                <a href="mailto:care@riwaaz.in" className="hover:text-[#FAF7F2] transition-colors">
                  Contact & Atelier
                </a>
              </li>
            </ul>
          </div>

          {/* HELP & ORDERS */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-[#D4C6B7]">
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-[#FAF7F2] transition-colors text-left flex items-center gap-1.5 font-medium text-[#FAF7F2]">
                  <span>Track Order</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFA069]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#FAF7F2] transition-colors">
                  Account Dashboard
                </button>
              </li>
              <li>
                <span className="text-[#A69888] cursor-default">Shipping Information</span>
              </li>
              <li>
                <span className="text-[#A69888] cursor-default">Returns & Exchanges</span>
              </li>
              <li>
                <span className="text-[#A69888] cursor-default">Material Care Guide</span>
              </li>
              {onOpenAdminLogin && (
                <li className="pt-1.5">
                  <button
                    type="button"
                    onClick={onOpenAdminLogin}
                    className="hover:text-[#BFA069] transition-colors flex items-center gap-1.5 text-xs text-[#A69888] font-medium"
                  >
                    <Lock className="w-3 h-3 text-[#BFA069]" />
                    <span>Admin Login</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-16 pt-8 border-t border-[#3D2D24] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7969] gap-4">
          <p>© {new Date().getFullYear()} RIWAAZ Décor & Lifestyle Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 text-[11px] flex-wrap justify-center sm:justify-end">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Refund Policy</span>
            <span aria-hidden="true">·</span>
            <span>GST Registered (07AAACR1924L1Z8)</span>
            {onOpenAdminLogin && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 text-[#BFA069] hover:text-[#FAF7F2] font-medium transition-colors border border-[#BFA069]/30 hover:border-[#BFA069] px-2.5 py-1 rounded bg-[#2E241E]/60 shadow-xs"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
