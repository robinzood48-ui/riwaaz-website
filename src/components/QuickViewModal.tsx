import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewDetails,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const images = product.images?.length > 0 ? product.images : ['/src/assets/images/hero_indian_living_room_1791889255407.jpg'];
  const price = (product.salePrice ?? product.price) + (selectedVariant?.priceDelta || 0);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-[#FAF7F2] p-6 sm:p-8 text-left shadow-2xl border border-[#EDE5DA] transition-all animate-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#785A44] hover:text-[#25201C] rounded-full transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Left */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE9DF] border border-[#EDE5DA] flex items-center justify-center p-3">
                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-[#BFA069]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#785A44] uppercase tracking-wider mb-2">
                  <span>{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.room}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#25201C] leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2 mb-3 text-xs">
                  <div className="flex items-center text-[#BFA069]">
                    <Star className="w-4 h-4 fill-current stroke-current" />
                    <span className="font-medium text-[#25201C] ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[#9E8F80]">({product.reviewCount} customer reviews)</span>
                  <span className="text-[#D4C6B7]">|</span>
                  <span className="text-emerald-800 font-medium">In Stock</span>
                </div>

                <div className="text-2xl font-semibold text-[#25201C] tabular-nums font-sans mb-4">
                  ₹{price.toLocaleString('en-IN')}
                </div>

                <p className="text-xs text-[#5E4D40] leading-relaxed mb-4">
                  {product.shortDescription || (product.description ? product.description.slice(0, 160) + '...' : '')}
                </p>

                {/* Variant Selector */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Finish / Variant: <span className="text-[#25201C] font-semibold">{selectedVariant?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                            selectedVariant?.id === v.id
                              ? 'border-[#25201C] bg-[#25201C] text-[#FAF7F2]'
                              : 'border-[#EDE5DA] bg-[#F7F2EC] text-[#4A3B31] hover:border-[#D4C6B7]'
                          }`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Specs */}
                <div className="text-[11px] text-[#785A44] space-y-1 mb-6 border-t border-b border-[#EDE5DA] py-3">
                  <div><span className="font-medium text-[#25201C]">Material:</span> {product.material}</div>
                  <div><span className="font-medium text-[#25201C]">Dimensions:</span> {product.dimensions}</div>
                  <div><span className="font-medium text-[#25201C]">SKU:</span> {product.sku}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#EDE5DA] bg-[#F7F2EC] rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-sm text-[#5E4D40] hover:bg-[#EDE5DA] rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums text-[#25201C]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-sm text-[#5E4D40] hover:bg-[#EDE5DA] rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-3 border border-[#EDE5DA] bg-[#F7F2EC] hover:bg-[#FAF7F2] rounded-lg text-[#25201C] transition-colors"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#BFA069] stroke-[#BFA069]' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onViewDetails(product);
                  }}
                  className="w-full text-center text-xs text-[#785A44] hover:text-[#25201C] font-medium py-1 flex items-center justify-center gap-1 group"
                >
                  <span>View Complete Specifications & Craftsmanship</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
