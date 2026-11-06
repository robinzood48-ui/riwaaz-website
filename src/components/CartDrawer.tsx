import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onCheckout,
  onContinueShopping,
}) => {
  const {
    isOpen,
    closeCart,
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
    setCouponInput('');
  };

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EDE5DA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#EDE5DA] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#25201C] font-semibold">Your Shopping Bag</h2>
              <p className="text-xs text-[#785A44] mt-0.5">
                {items.length === 0
                  ? 'Your bag is empty'
                  : `${items.reduce((s, i) => s + i.quantity, 0)} ${items.length === 1 ? 'item' : 'items'} selected`}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#785A44] hover:text-[#25201C] rounded-full transition-colors focus:outline-none"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="px-6 py-3.5 bg-[#F5EFEB] border-b border-[#EDE5DA] text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-[#5E4D40]">
                Add <span className="font-semibold text-[#25201C]">{formatPrice(amountNeededForFreeShipping)}</span> more for <span className="text-[#785A44] font-medium">Complimentary Delivery</span>
              </p>
            ) : (
              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>You qualify for Complimentary White Glove Delivery!</span>
              </p>
            )}
            <div className="w-full bg-[#EDE5DA] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#BFA069] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EDE5DA] flex items-center justify-center text-[#785A44] mb-4">
                  <Tag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-xl text-[#25201C] font-medium">Your bag is empty</h3>
                <p className="text-xs text-[#785A44] max-w-xs mt-1 mb-6">
                  Explore our curated collections of artisanal home pieces and handcrafted furniture.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium rounded-lg transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'default'}`}
                  className="flex gap-4 pb-5 border-b border-[#EDE5DA]/80 last:border-0"
                >
                  {/* Image */}
                  <img
                    src={item.product.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-[#EFE9DF] shrink-0 border border-[#EDE5DA]"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-medium text-[#25201C] leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-[#A69888] hover:text-rose-700 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <p className="text-xs text-[#785A44] mt-0.5">{item.variantName}</p>
                      )}

                      <p className="text-xs font-semibold text-[#25201C] tabular-nums mt-1 font-sans">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#EDE5DA] bg-[#F7F2EC] rounded">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="p-1 hover:bg-[#EDE5DA] text-[#5E4D40] transition-colors focus:outline-none"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#25201C] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="p-1 hover:bg-[#EDE5DA] text-[#5E4D40] transition-colors focus:outline-none"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#EDE5DA] bg-[#FAF7F2] space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#F5EFEB] rounded border border-[#EDE5DA] text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#BFA069]" />
                      <span className="font-semibold text-[#25201C]">{appliedCoupon.code}</span>
                      <span className="text-[#785A44]">({appliedCoupon.discountPercent}% off)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#A69888] hover:text-rose-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. RIWAAZ10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-[#F7F2EC] border border-[#EDE5DA] rounded focus:outline-none focus:border-[#785A44] uppercase tracking-wider text-[#25201C] placeholder:text-[#9E8F80]"
                    />
                    <button
                      type="submit"
                      disabled={applying || !couponInput.trim()}
                      className="px-4 py-2 bg-[#25201C] hover:bg-[#3D2D24] disabled:opacity-50 text-[#FAF7F2] text-xs font-medium rounded transition-colors"
                    >
                      {applying ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-700 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#5E4D40] pt-2 border-t border-[#EDE5DA]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#25201C] tabular-nums font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Promotional Discount</span>
                    <span className="tabular-nums font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White Glove Delivery</span>
                  <span className="text-[#25201C] tabular-nums font-medium">
                    {shipping === 0 ? <span className="text-emerald-800 font-semibold">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#25201C] pt-2 border-t border-[#EDE5DA]">
                  <span className="font-serif text-base">Estimated Total</span>
                  <span className="tabular-nums font-sans">{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-[#9E8F80] italic">Includes all applicable GST & handcrafted handling.</p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                className="w-full py-3.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
