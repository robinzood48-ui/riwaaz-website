import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  Lock,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import type { Order } from '../types/index.ts';

interface CheckoutViewProps {
  onOrderSuccess: (order: Order) => void;
  onNavigate: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onOrderSuccess,
  onNavigate,
}) => {
  const { items, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Step 1: Customer Info
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98111 22334');

  // Step 2: Shipping Address
  const defaultAddr = user?.addresses?.[0];
  const [address, setAddress] = useState(defaultAddr?.address || 'Villa 14, The Palms, Golf Course Road');
  const [city, setCity] = useState(defaultAddr?.city || 'Gurugram');
  const [state, setState] = useState(defaultAddr?.state || 'Haryana');
  const [pinCode, setPinCode] = useState(defaultAddr?.pinCode || '122002');

  // Step 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('White Glove Inside Home Delivery');

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card' | 'cod'>('razorpay');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<number>(1);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#25201C]">Your Bag is Empty</h2>
        <p className="text-xs text-[#785A44] mt-2 mb-6">Please add items to your shopping bag before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-[#25201C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !city || !state || !pinCode) {
      showToast('Incomplete Details', 'Please complete all address and contact fields.', 'error');
      return;
    }

    setProcessing(true);
    try {
      const orderPayload = {
        userId: user?.id,
        customer: { fullName, email, phone },
        shippingAddress: { fullName, phone, address, city, state, pinCode },
        deliveryMethod,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'Confirmed',
        items: items.map(item => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg',
          price: item.price,
          quantity: item.quantity,
          variantName: item.variantName,
        })),
        subtotal,
        discount,
        shipping,
        total,
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        clearCart();
        showToast('Order Confirmed', `Order ${data.data.orderNumber} successfully placed!`, 'success');
        onOrderSuccess(data.data);
      } else {
        showToast('Checkout Error', data.error || 'Failed to place order.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Checkout Failed', 'Network error. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Checkout Header */}
      <div className="mb-10 text-center sm:text-left border-b border-[#EDE5DA] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Secure Sanctuary Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C] mt-1">
            Order Confirmation & Dispatch
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span>256-Bit Encrypted & PCI-DSS Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT STEPS ACCORDION (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Customer Contact */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium text-[#25201C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#25201C] text-[#FAF7F2] text-xs flex items-center justify-center font-sans font-semibold">1</span>
                <span>Contact & Communication</span>
              </h3>
              {step > 1 && (
                <button onClick={() => setStep(1)} className="text-xs text-[#785A44] hover:underline">
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robin Zood"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                />
              </div>
              <div>
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="robinzood48@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                />
              </div>
              <div>
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Contact Phone (for delivery SMS)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98111 22334"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: Shipping Destination */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium text-[#25201C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#25201C] text-[#FAF7F2] text-xs flex items-center justify-center font-sans font-semibold">2</span>
                <span>Delivery Address (India)</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Street Address, Villa, Apartment</label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat No., Building Name, Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Gurugram"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Haryana"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] focus:outline-none focus:border-[#785A44]"
                  />
                </div>
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="122002"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-[#25201C] font-mono focus:outline-none focus:border-[#785A44]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Delivery Method */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs">
            <h3 className="font-serif text-lg font-medium text-[#25201C] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#25201C] text-[#FAF7F2] text-xs flex items-center justify-center font-sans font-semibold">3</span>
              <span>Delivery Service</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label
                onClick={() => setDeliveryMethod('White Glove Inside Home Delivery')}
                className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  deliveryMethod === 'White Glove Inside Home Delivery'
                    ? 'border-[#25201C] bg-[#F5EFEB]'
                    : 'border-[#EDE5DA] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'White Glove Inside Home Delivery'}
                    onChange={() => setDeliveryMethod('White Glove Inside Home Delivery')}
                    className="mt-0.5 accent-[#25201C]"
                  />
                  <div>
                    <span className="font-semibold text-[#25201C]">White Glove Inside Home Delivery</span>
                    <p className="text-[11px] text-[#785A44] mt-0.5">Specialized furniture handlers unpack, inspect and position piece inside your room of choice.</p>
                  </div>
                </div>
                <span className="font-semibold text-emerald-800 uppercase tracking-wider">Included</span>
              </label>

              <label
                onClick={() => setDeliveryMethod('Express Fragile Cargo')}
                className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  deliveryMethod === 'Express Fragile Cargo'
                    ? 'border-[#25201C] bg-[#F5EFEB]'
                    : 'border-[#EDE5DA] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'Express Fragile Cargo'}
                    onChange={() => setDeliveryMethod('Express Fragile Cargo')}
                    className="mt-0.5 accent-[#25201C]"
                  />
                  <div>
                    <span className="font-semibold text-[#25201C]">Dedicated Timber-Crate Express</span>
                    <p className="text-[11px] text-[#785A44] mt-0.5">Reinforced outer timber cage priority express routing for mirrors & large ceramics.</p>
                  </div>
                </div>
                <span className="font-semibold text-[#25201C]">+₹800</span>
              </label>
            </div>
          </div>

          {/* STEP 4: Payment */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] shadow-xs">
            <h3 className="font-serif text-lg font-medium text-[#25201C] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#25201C] text-[#FAF7F2] text-xs flex items-center justify-center font-sans font-semibold">4</span>
              <span>Payment Method</span>
            </h3>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'razorpay', label: 'Razorpay / UPI', icon: <QrCode className="w-4 h-4" /> },
                { id: 'card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'upi', label: 'Direct UPI', icon: <QrCode className="w-4 h-4" /> },
                { id: 'cod', label: 'Pay on Delivery', icon: <Banknote className="w-4 h-4" /> },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
                    paymentMethod === p.id
                      ? 'border-[#25201C] bg-[#25201C] text-[#FAF7F2]'
                      : 'border-[#EDE5DA] bg-[#F7F2EC] text-[#4A3B31] hover:border-[#D4C6B7]'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Payment Form Details */}
            {paymentMethod === 'razorpay' && (
              <div className="p-4 bg-[#F5EFEB] rounded-xl border border-[#EDE5DA] text-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#25201C]">
                  <span>Razorpay Safe Checkout (Test & Live Mode)</span>
                  <span className="text-emerald-800 font-mono">SANDBOX ACTIVE</span>
                </div>
                <p className="text-[#5E4D40]">
                  Supports all Indian Banks, Google Pay, PhonePe, Paytm, CRED, and major international credit cards.
                </p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-[#F5EFEB] rounded-xl border border-[#EDE5DA] text-xs space-y-3">
                <label className="block text-[#785A44] uppercase font-semibold">Enter UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none"
                />
                <p className="text-[11px] text-[#785A44]">A payment request of ₹{total.toLocaleString('en-IN')} will be verified automatically.</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#F5EFEB] rounded-xl border border-[#EDE5DA] text-xs space-y-3">
                <div>
                  <label className="block text-[#785A44] uppercase font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded font-mono text-xs text-[#25201C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded font-mono text-xs text-[#25201C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#785A44] uppercase font-semibold mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE5DA] rounded font-mono text-xs text-[#25201C]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-[#F5EFEB] rounded-xl border border-[#EDE5DA] text-xs space-y-1">
                <p className="font-semibold text-[#25201C]">Cash on White Glove Delivery</p>
                <p className="text-[#5E4D40]">You may inspect the pieces upon room placement and pay via Cash or portable UPI QR with the delivery supervisor.</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full py-4 bg-[#25201C] hover:bg-[#3D2D24] disabled:opacity-50 text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {processing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order & Pay ₹{total.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT SUMMARY (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] space-y-4 sticky top-28">
            <h3 className="font-serif text-xl font-medium text-[#25201C] pb-3 border-b border-[#EDE5DA]">
              Order Summary ({items.length} {items.length === 1 ? 'piece' : 'pieces'})
            </h3>

            {/* List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg'}
                    alt=""
                    className="w-12 h-12 object-cover rounded-md bg-[#EDE5DA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-[#25201C] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-[#785A44]">
                      Qty: {item.quantity} {item.variantName ? `· ${item.variantName}` : ''}
                    </p>
                  </div>
                  <span className="font-semibold text-[#25201C] tabular-nums">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-4 border-t border-[#EDE5DA] space-y-2 text-xs text-[#5E4D40]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#25201C] tabular-nums font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promotional Savings {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                  <span className="tabular-nums font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White Glove Delivery</span>
                <span className="text-[#25201C] tabular-nums font-semibold">
                  {shipping === 0 ? <span className="text-emerald-800">COMPLIMENTARY</span> : `₹${shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#25201C] pt-3 border-t border-[#EDE5DA]">
                <span className="font-serif text-lg">Total Amount</span>
                <span className="tabular-nums font-sans">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#EDE5DA] text-[11px] text-[#785A44] space-y-1">
              <p className="font-semibold text-[#25201C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#BFA069]" /> Authenticity Guarantee
              </p>
              <p>Includes Certificate of Handcrafted Provenance signed by the master artisan collective.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
