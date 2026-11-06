import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, Coupon } from '../types/index.ts';
import { useToast } from './ToastContext.tsx';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: { id: string; name: string; priceDelta?: number }
  ) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  couponError: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  totalItems: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_FEE = 499;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('riwaaz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('riwaaz_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('riwaaz_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('riwaaz_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('riwaaz_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variant?: { id: string; name: string; priceDelta?: number }
  ) => {
    const itemPrice = (product.salePrice ?? product.price) + (variant?.priceDelta || 0);

    setItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.productId === product.id && item.variantId === variant?.id
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            variantId: variant?.id,
            variantName: variant?.name,
            quantity,
            price: itemPrice,
          },
        ];
      }
    });

    showToast(
      'Added to Bag',
      `${product.name}${variant ? ` (${variant.name})` : ''} × ${quantity}`,
      'success'
    );
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems(prev =>
      prev.filter(item => !(item.productId === productId && item.variantId === variantId))
    );
    showToast('Removed from Bag', undefined, 'info');
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = appliedCoupon
    ? Math.min(
        Math.round((subtotal * appliedCoupon.discountPercent) / 100),
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAppliedCoupon(data.data);
        showToast('Coupon Applied', `Code ${data.data.code} (-${data.data.discountPercent}%)`, 'success');
        return true;
      } else {
        setCouponError(data.error || 'Invalid promotional code');
        showToast('Coupon Error', data.error || 'Invalid promotional code', 'error');
        return false;
      }
    } catch (e: any) {
      setCouponError('Unable to apply coupon. Please try again.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('Coupon Removed', undefined, 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        subtotal,
        discount,
        shipping,
        total,
        totalItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
