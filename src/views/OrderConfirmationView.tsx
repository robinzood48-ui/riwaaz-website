import React from 'react';
import { CheckCircle, Truck, Package, ArrowRight, Printer, Sparkles } from 'lucide-react';
import type { Order } from '../types/index.ts';
import { BrandEmblem } from '../components/BrandEmblem.tsx';

interface OrderConfirmationViewProps {
  order: Order;
  onNavigate: (view: string, params?: any) => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onNavigate,
  onTrackOrder,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      
      {/* Success Badge & Headline */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F5EFEB] border border-[#BFA069] text-[#BFA069] mx-auto flex items-center justify-center">
          <CheckCircle className="w-8 h-8 stroke-[1.75]" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#BFA069] font-semibold">
          Order Confirmed & Logged
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#25201C]">
          Thank You for Welcoming RIWAAZ Home
        </h1>
        <p className="text-xs sm:text-sm text-[#785A44] max-w-lg mx-auto leading-relaxed">
          Your order has been allocated to our master artisan packing atelier. We have dispatched a confirmation SMS and receipt to <strong className="text-[#25201C]">{order.customer.email}</strong>.
        </p>

        {/* Order Reference Box */}
        <div className="inline-block p-4 bg-[#F5EFEB] border border-[#EDE5DA] rounded-xl text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#785A44] block">Consignment Reference</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#25201C] tracking-wide mt-0.5 block">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#EDE5DA] p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EDE5DA] gap-4">
          <div className="flex items-center gap-3">
            <BrandEmblem size={36} variant="gold" />
            <div>
              <span className="font-serif text-lg font-semibold tracking-wider uppercase text-[#25201C]">RIWAAZ</span>
              <p className="text-[10px] uppercase tracking-widest text-[#785A44]">Timeless Indian Living</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-[#EDE5DA] bg-[#F7F2EC] hover:bg-[#EDE5DA] text-[#25201C] rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => onTrackOrder(order.orderNumber)}
              className="px-4 py-2 bg-[#25201C] text-[#FAF7F2] hover:bg-[#3D2D24] rounded-lg flex items-center gap-1.5 font-medium transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#BFA069]" />
              <span>Track Consignment</span>
            </button>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#5E4D40] pb-6 border-b border-[#EDE5DA]">
          <div>
            <h4 className="font-semibold text-[#25201C] uppercase tracking-wider text-[11px] mb-1.5">Shipping Destination</h4>
            <p className="font-medium text-[#25201C]">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
            <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#25201C] uppercase tracking-wider text-[11px] mb-1.5">Delivery Method</h4>
            <p className="font-medium text-[#25201C]">{order.deliveryMethod}</p>
            <p className="text-[11px] text-[#785A44] mt-1">Estimated Arrival: 3–5 Business Days</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#25201C] uppercase tracking-wider text-[11px] mb-1.5">Payment Status</h4>
            <p className="font-medium text-[#25201C] uppercase tracking-wider">
              {order.paymentMethod} · {order.paymentStatus === 'paid' ? 'Paid & Verified' : 'Cash on Delivery'}
            </p>
            <p className="text-[11px] text-[#785A44] mt-1">Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div>
          <h4 className="font-serif text-lg font-medium text-[#25201C] mb-4">Ordered Pieces</h4>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-[#EDE5DA] text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="w-14 h-14 object-cover rounded-lg bg-[#EDE5DA]"
                  />
                  <div>
                    <h5 className="font-serif text-sm font-medium text-[#25201C]">{item.name}</h5>
                    <p className="text-[11px] text-[#785A44]">
                      Quantity: {item.quantity} {item.variantName ? `· ${item.variantName}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#25201C] tabular-nums font-sans">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-6 max-w-xs ml-auto space-y-2 text-xs text-[#5E4D40]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#25201C] tabular-nums font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Promotional Discount</span>
                <span className="tabular-nums font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>White Glove Delivery</span>
              <span className="text-[#25201C] tabular-nums font-semibold">
                {order.shipping === 0 ? <span className="text-emerald-800">FREE</span> : `₹${order.shipping.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#25201C] pt-3 border-t border-[#EDE5DA]">
              <span className="font-serif">Total Paid</span>
              <span className="tabular-nums font-sans">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Return Home Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <span>Continue Exploring Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
