import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Share2,
  Check,
  MessageSquare,
} from 'lucide-react';
import type { Product, Review } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

interface ProductDetailViewProps {
  productId: string;
  onNavigate: (view: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  onNavigate,
  onSelectProduct,
  onQuickView,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'materials' | 'dimensions' | 'care' | 'shipping'>('description');

  // Review form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          setReviews(data.data.reviews || []);
          setRelated(data.data.related || []);
          if (data.data.variants && data.data.variants.length > 0) {
            setSelectedVariant(data.data.variants[0]);
          } else {
            setSelectedVariant(undefined);
          }
          setSelectedImage(0);
          setQuantity(1);
        }
      } catch (e) {
        console.error('Failed to load product details', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-xs text-[#785A44]">
        Loading handcrafted details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl text-[#25201C]">Piece Not Found</h2>
        <p className="text-xs text-[#785A44] mt-2 mb-6">The requested home décor piece is currently unavailable.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#25201C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-lg"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentPrice = (product.salePrice ?? product.price) + (selectedVariant?.priceDelta || 0);
  const images = product.images?.length > 0 ? product.images : ['/src/assets/images/hero_indian_living_room_1791889255407.jpg'];

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    onNavigate('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard', 'info');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newReviewAuthor.trim(),
          rating: newReviewRating,
          title: newReviewTitle.trim() || 'Exceptional craftsmanship',
          comment: newReviewComment.trim(),
          verifiedPurchase: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews([data.data, ...reviews]);
        setNewReviewAuthor('');
        setNewReviewTitle('');
        setNewReviewComment('');
        showToast('Review Published', 'Thank you for reviewing your RIWAAZ piece.', 'success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#785A44] uppercase tracking-wider">
        <button onClick={() => onNavigate('home')} className="hover:text-[#25201C] transition-colors">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-[#D4C6B7]" />
        <button onClick={() => onNavigate('shop')} className="hover:text-[#25201C] transition-colors">
          Shop
        </button>
        <ChevronRight className="w-3 h-3 text-[#D4C6B7]" />
        <button onClick={() => onNavigate('shop', { category: product.category })} className="hover:text-[#25201C] transition-colors">
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-[#D4C6B7]" />
        <span className="text-[#25201C] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery Left + Sticky Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* LEFT GALLERY (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Frame */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EFE9DF] border border-[#EDE5DA] shadow-xs flex items-center justify-center p-4">
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#25201C] text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded">
                New Arrival
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2]/80 hover:bg-[#FAF7F2] text-[#4A3B31] shadow-xs transition-colors"
              title="Share piece"
              aria-label="Share piece"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === idx ? 'border-[#BFA069] scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Artisanal Heritage Note under gallery */}
          <div className="p-4 bg-[#F5EFEB] rounded-xl border border-[#EDE5DA] flex items-center gap-3 text-xs text-[#5E4D40]">
            <ShieldCheck className="w-5 h-5 text-[#BFA069] shrink-0" />
            <div>
              <p className="font-semibold text-[#25201C]">Direct From Indian Artisan Collectives</p>
              <p className="text-[11px] text-[#785A44]">Every purchase preserves generational craft traditions across Rajasthan, Kutch, and Uttar Pradesh.</p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTIGUOUS PURCHASE MODULE (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs text-[#785A44] uppercase tracking-wider mb-2">
              <span>{product.collection}</span>
              <span aria-hidden="true">·</span>
              <span>{product.room}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C] leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 mt-3 pb-4 border-b border-[#EDE5DA] text-xs">
              <div className="flex items-center text-[#BFA069]">
                <Star className="w-4 h-4 fill-current stroke-current" />
                <span className="font-medium text-[#25201C] ml-1.5 tabular-nums">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-[#9E8F80]">({product.reviewCount} verified reviews)</span>
              <span className="text-[#D4C6B7]">|</span>
              <span className="text-emerald-800 font-medium">In Stock ({product.inventory} units)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-[#25201C] tabular-nums font-sans">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {product.salePrice && (
              <span className="text-sm text-[#9E8F80] line-through tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-[#785A44]">(Includes all taxes)</span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#5E4D40] leading-relaxed font-light">
            {product.shortDescription || product.description}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs uppercase tracking-wider text-[#785A44] font-semibold">
                Finish / Material Variant: <span className="text-[#25201C]">{selectedVariant?.name}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-[#25201C] text-[#FAF7F2] border-[#25201C] shadow-xs'
                        : 'bg-[#F7F2EC] text-[#4A3B31] border-[#EDE5DA] hover:border-[#D4C6B7]'
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.name}</span>
                    {v.priceDelta > 0 && (
                      <span className="text-[10px] opacity-80">(+₹{v.priceDelta})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & CTAs */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#EDE5DA] bg-[#F7F2EC] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-sm text-[#5E4D40] hover:bg-[#EDE5DA] rounded-l-lg transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold tabular-nums text-[#25201C]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-sm text-[#5E4D40] hover:bg-[#EDE5DA] rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={() => addToCart(product, quantity, selectedVariant)}
                className="flex-1 py-3.5 px-6 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3.5 border border-[#EDE5DA] bg-[#F7F2EC] hover:bg-[#FAF7F2] rounded-lg text-[#25201C] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#BFA069] stroke-[#BFA069]' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-[#BFA069] hover:bg-[#A6834A] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-xs transition-colors"
            >
              Buy Now with 1-Click
            </button>
          </div>

          {/* Reassurance Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EDE5DA] text-xs text-[#5E4D40]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#BFA069] shrink-0" />
              <span>Complimentary White Glove Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#BFA069] shrink-0" />
              <span>14-Day Seamless Inspection & Returns</span>
            </div>
          </div>

        </div>

      </div>

      {/* TABS SECTION: Description, Materials, Dimensions, Care, Shipping */}
      <div className="pt-10 border-t border-[#EDE5DA]">
        
        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 border-b border-[#EDE5DA] pb-3 text-xs uppercase tracking-wider font-semibold">
          {[
            { id: 'description', label: 'Detailed Description' },
            { id: 'materials', label: 'Materials & Craft' },
            { id: 'dimensions', label: 'Dimensions & Specs' },
            { id: 'care', label: 'Care Instructions' },
            { id: 'shipping', label: 'Shipping & White Glove' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#25201C] text-[#FAF7F2]'
                  : 'text-[#785A44] hover:text-[#25201C] hover:bg-[#F5EFEB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="py-8 text-xs sm:text-sm text-[#4A3B31] leading-relaxed max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p className="text-xs text-[#785A44]">
                Rooted in authentic Indian sensibilities, this piece balances monumental spatial presence with delicate tactile restraint. Crafted in small batches to maintain uncompromising artisanal fidelity.
              </p>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-3">
              <p><strong className="text-[#25201C]">Primary Composition:</strong> {product.material}</p>
              <p><strong className="text-[#25201C]">Finish:</strong> {product.color}</p>
              <p className="text-xs text-[#785A44] pt-2">
                All hardwoods are seasoned in computer-controlled kilns to 8–10% moisture content, preventing thermal warp in Indian seasons. Natural plant oils and beeswax finishes are 100% VOC-free.
              </p>
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="space-y-3">
              <p><strong className="text-[#25201C]">Measurements:</strong> {product.dimensions}</p>
              <p><strong className="text-[#25201C]">SKU Reference:</strong> <span className="font-mono">{product.sku}</span></p>
              <p className="text-xs text-[#785A44] pt-2">
                Please measure doorways, stairwells, and passageways prior to delivery for large furniture pieces.
              </p>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3">
              <p>{product.careInstructions}</p>
              <p className="text-xs text-[#785A44]">
                To maintain the integrity of handcrafted timber and natural ceramics, avoid direct thermal heat sources or chemical aerosol sprays.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <p><strong className="text-[#25201C]">White Glove Logistics:</strong> Delivered by our specialized furniture logistics team with room-of-choice placement and packaging removal.</p>
              <p><strong className="text-[#25201C]">Dispatch Window:</strong> In-stock pieces ship within 48 hours. Transit time 3–5 business days across tier-1 Indian metros.</p>
            </div>
          )}
        </div>

      </div>

      {/* CUSTOMER REVIEWS SECTION */}
      <div className="pt-10 border-t border-[#EDE5DA] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
              Patron Testimonials
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#25201C] mt-1">
              Customer Reviews ({reviews.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#25201C] font-semibold">
            <Star className="w-5 h-5 fill-[#BFA069] stroke-[#BFA069]" />
            <span>{product.rating.toFixed(1)} out of 5</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 bg-[#F5EFEB] rounded-2xl border border-[#EDE5DA] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#BFA069]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current stroke-current" />
                  ))}
                </div>
                {rev.verifiedPurchase && (
                  <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <h4 className="font-serif text-base font-medium text-[#25201C]">{rev.title}</h4>
              <p className="text-xs text-[#5E4D40] leading-relaxed">{rev.comment}</p>
              <div className="pt-2 text-[11px] text-[#785A44] flex items-center justify-between">
                <span className="font-medium text-[#25201C]">{rev.userName}</span>
                <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Form */}
        <div className="p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] max-w-2xl">
          <h4 className="font-serif text-xl font-medium text-[#25201C] mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#BFA069]" /> Write a Review
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded focus:outline-none focus:border-[#785A44]"
                />
              </div>
              <div>
                <label className="block text-[#785A44] uppercase font-semibold mb-1">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded focus:outline-none focus:border-[#785A44]"
                >
                  <option value={5}>5 Stars - Exceptional</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#785A44] uppercase font-semibold mb-1">Review Headline</label>
              <input
                type="text"
                placeholder="e.g. Magnificent proportions and beautiful finish"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded focus:outline-none focus:border-[#785A44]"
              />
            </div>

            <div>
              <label className="block text-[#785A44] uppercase font-semibold mb-1">Your Feedback</label>
              <textarea
                required
                rows={3}
                placeholder="Share your experience with the craftsmanship, texture, and presence in your space..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F2EC] border border-[#EDE5DA] rounded focus:outline-none focus:border-[#785A44]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-[#EDE5DA]">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
              Harmonious Complements
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#25201C] mt-1">
              Pieces Designed to Pair
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
