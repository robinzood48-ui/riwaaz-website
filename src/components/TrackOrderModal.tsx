import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, PackageCheck, Truck, Home } from 'lucide-react';
import type { Order, OrderStatus } from '../types/index.ts';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setError(data.error || 'No matching order found for this reference.');
        setOrder(null);
      }
    } catch {
      setError('Unable to reach order tracking service. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps: OrderStatus[] = [
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStatusIndex = (currentStatus: OrderStatus) => {
    return statusSteps.indexOf(currentStatus);
  };

  const getStepIcon = (step: OrderStatus) => {
    switch (step) {
      case 'Confirmed': return <Clock className="w-4 h-4" />;
      case 'Packed': return <PackageCheck className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Out for Delivery': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <Home className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-[#FAF7F2] p-6 sm:p-8 text-left shadow-2xl border border-[#EDE5DA] transition-all animate-in zoom-in-95 duration-200">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#785A44] hover:text-[#25201C] rounded-full transition-colors"
            aria-label="Close track dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
              Live Consignment Tracking
            </span>
            <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-1">
              Track Your RIWAAZ Order
            </h3>
            <p className="text-xs text-[#785A44] mt-1">
              Enter your order reference code (e.g. <span className="font-mono font-medium text-[#25201C]">RIW-2026-00001</span>)
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#785A44] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. RIW-2026-00001"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#F7F2EC] border border-[#EDE5DA] rounded-lg text-xs font-mono uppercase tracking-wider text-[#25201C] placeholder:text-[#9E8F80] focus:outline-none focus:border-[#785A44]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderQuery.trim()}
              className="px-5 py-2.5 bg-[#25201C] hover:bg-[#3D2D24] disabled:opacity-50 text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors shrink-0"
            >
              {loading ? 'Locating...' : 'Track'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs mb-4">
              {error}
            </div>
          )}

          {/* Order Result Card */}
          {order && (
            <div className="space-y-6 pt-4 border-t border-[#EDE5DA]">
              {/* Order summary header */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F5EFEB] rounded-lg text-xs">
                <div>
                  <span className="text-[#785A44]">Order Ref:</span>{' '}
                  <span className="font-mono font-semibold text-[#25201C]">{order.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[#785A44]">Current Status:</span>{' '}
                  <span className="font-semibold text-[#BFA069] uppercase tracking-wider ml-1">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Milestones Bar */}
              <div className="relative py-4">
                <div className="hidden sm:block absolute top-7 left-5 right-5 h-0.5 bg-[#EDE5DA]" />
                <div
                  className="hidden sm:block absolute top-7 left-5 h-0.5 bg-[#BFA069] transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      0,
                      (getStatusIndex(order.status) / (statusSteps.length - 1)) * 90
                    )}%`,
                  }}
                />

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStatusIndex(order.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = order.status === step;

                    return (
                      <div key={step} className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1 text-left sm:text-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isCurrent
                              ? 'bg-[#25201C] text-[#FAF7F2] ring-4 ring-[#EDE5DA]'
                              : isPassed
                              ? 'bg-[#BFA069] text-white'
                              : 'bg-[#EDE5DA] text-[#9E8F80]'
                          }`}
                        >
                          {getStepIcon(step)}
                        </div>
                        <span
                          className={`text-[11px] leading-tight font-medium ${
                            isCurrent ? 'text-[#25201C] font-semibold' : isPassed ? 'text-[#4A3B31]' : 'text-[#A69888]'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chronological Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold">
                  Activity Timeline
                </h4>
                <div className="space-y-2 text-xs">
                  {order.timeline?.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded bg-[#F7F2EC]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#BFA069] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-[#25201C]">{entry.note}</p>
                        <p className="text-[10px] text-[#785A44] mt-0.5">
                          {new Date(entry.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in Consignment */}
              <div className="pt-2">
                <h4 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold mb-2">
                  Items in this Order
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 object-cover rounded bg-[#EFE9DF]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-medium text-[#25201C] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#785A44]">
                          Qty: {item.quantity} · {item.variantName || 'Standard'}
                        </p>
                      </div>
                      <span className="font-semibold text-[#25201C] tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="p-3 bg-[#F5EFEB] rounded-lg text-xs text-[#5E4D40]">
                <p className="font-semibold text-[#25201C] mb-1">Shipping Destination:</p>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
