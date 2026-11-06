import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const mainImage = product.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg';

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className={`group relative flex flex-col bg-[#F7F2EC] rounded-xl overflow-hidden border border-[#EDE5DA]/80 transition-all duration-300 ${
      product.category === 'Lighting'
        ? 'hover:shadow-[0_14px_32px_-6px_rgba(191,160,105,0.25)] hover:border-[#BFA069]/50'
        : (product.category === 'Wall Décor' || product.category === 'Wall Decor')
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(74,59,49,0.22)] hover:border-[#8C7355]/60 hover:-translate-y-1'
        : product.category === 'Furniture'
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(60,45,34,0.24)] hover:border-[#BFA069]/60 hover:-translate-y-1'
        : product.category === 'Tables'
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(92,68,48,0.25)] hover:border-[#BFA069]/70 hover:-translate-y-1'
        : product.category === 'Seating'
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(82,60,42,0.25)] hover:border-[#BFA069]/70 hover:-translate-y-1'
        : product.category === 'Vases'
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(191,160,105,0.28)] hover:border-[#BFA069]/70 hover:-translate-y-1'
        : product.category === 'Mirrors'
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(191,160,105,0.32)] hover:border-[#BFA069]/80 hover:-translate-y-1'
        : product.category === 'Accessories'
        ? 'hover:shadow-[0_16px_36px_-6px_rgba(191,160,105,0.32)] hover:border-[#BFA069]/80 hover:-translate-y-1'
        : 'hover:shadow-md hover:border-[#D4C6B7]'
    }`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFEB] flex items-center justify-center p-2.5">
        {!imageError ? (
          <img
            src={mainImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EDE5DA]">
            <span className="font-serif text-lg text-[#785A44]">{product.name}</span>
            <span className="text-xs text-[#9E8F80] mt-1">{product.material}</span>
          </div>
        )}

        {/* Subtle Category/Status Tag */}
        {product.category === 'Lighting' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/90 text-[#F5DEB3] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/35 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
            <span>
              {product.name.toLowerCase().includes('nakshatra') || product.name.toLowerCase().includes('crystal ring')
                ? 'K9 Crystal Halo Chandelier'
                : product.name.toLowerCase().includes('ananta') || product.name.toLowerCase().includes('triple-tier')
                ? 'Triple-Ring Crystal Cascade'
                : product.name.toLowerCase().includes('pushpa') || product.name.toLowerCase().includes('scalloped glass')
                ? 'Mouth-Blown Glass Trio'
                : product.name.toLowerCase().includes('moresque') || product.name.toLowerCase().includes('filigree')
                ? 'Pierced Jaali Brass Lamp'
                : product.name.toLowerCase().includes('diya')
                ? 'Hand-Pleated Diya Curtain'
                : product.name.toLowerCase().includes('star')
                ? 'Celestial Star Luminaire'
                : product.name.toLowerCase().includes('vriksha') || product.name.toLowerCase().includes('botanical')
                ? 'Botanical Vine Canopy'
                : product.name.toLowerCase().includes('pavilion') || product.name.toLowerCase().includes('mandap')
                ? 'IP65 Waterfall Fairy Curtain'
                : product.name.toLowerCase().includes('willow') || product.name.toLowerCase().includes('kanan')
                ? 'Twilight Willow Chandelier'
                : product.name.toLowerCase().includes('wheel') || product.name.toLowerCase().includes('chakra')
                ? 'Spiral Tree Chandelier'
                : product.name.toLowerCase().includes('ribbon') || product.name.toLowerCase().includes('tarang')
                ? 'Floating Luminous Ribbon'
                : product.isNew
                ? 'New · 2700K Ambient Glow'
                : 'Warm Ambient'}
            </span>
          </div>
        ) : (product.category === 'Wall Décor' || product.category === 'Wall Decor') ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/90 text-[#EBDBC8] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/35 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
            <span>
              {product.name.toLowerCase().includes('tree') || product.name.toLowerCase().includes('kalpavriksha')
                ? 'Kalpavriksha Crystal Tree'
                : product.name.toLowerCase().includes('macram')
                ? 'Kala Cotton Macramé'
                : product.name.toLowerCase().includes('lotus leaf') || product.name.toLowerCase().includes('kamal patra')
                ? 'Verdigris & Spun Brass'
                : product.name.toLowerCase().includes('kathputli')
                ? 'Cast Brass Shadow Box'
                : product.name.toLowerCase().includes('tile') || product.name.toLowerCase().includes('jaipur')
                ? 'Jaipur Glazed Blue Pottery'
                : product.name.toLowerCase().includes('petal') || product.name.toLowerCase().includes('sunburst')
                ? 'Hammered Brass Sunburst'
                : product.name.toLowerCase().includes('stag') || product.name.toLowerCase().includes('barasingha')
                ? 'Bas-Relief Teak Medallion'
                : product.name.toLowerCase().includes('arched') || product.name.toLowerCase().includes('panel')
                ? 'Arched Canvas Triptych'
                : product.name.includes('Gold') || product.material.includes('Gold')
                ? '24K Gold Leaf Relief'
                : product.name.includes('Marble') || product.material.includes('Marble')
                ? 'Carved Marble Jaali'
                : product.name.includes('Dhokra') || product.material.includes('Dhokra')
                ? 'Lost-Wax Bell Metal'
                : 'Artisan Wall Sculpture'}
            </span>
          </div>
        ) : product.category === 'Furniture' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/90 text-[#EBDBC8] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/35 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
            <span>
              {product.name.toLowerCase().includes('jhula') || product.name.toLowerCase().includes('swing')
                ? 'Royal Heritage Jhula'
                : product.name.toLowerCase().includes('sectional') || product.name.toLowerCase().includes('modular')
                ? 'Curved Modular Suite'
                : product.name.toLowerCase().includes('contour') || product.name.toLowerCase().includes('wave')
                ? 'Contour Sculpted Teak'
                : product.name.toLowerCase().includes('cane') || product.name.toLowerCase().includes('rattan')
                ? 'Woven Cane & Walnut'
                : product.name.toLowerCase().includes('conical') || product.name.toLowerCase().includes('stambh')
                ? 'Honed Marble & Teak'
                : product.name.toLowerCase().includes('conservatory') || product.name.toLowerCase().includes('nalanda')
                ? '5-Piece Artisan Suite'
                : product.name.toLowerCase().includes('almirah')
                ? 'Solid Sheesham Wood'
                : 'Handcrafted Heritage'}
            </span>
          </div>
        ) : product.category === 'Tables' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/92 text-[#F2DFCE] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/40 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
            <span>
              {product.name.toLowerCase().includes('fluted') || product.name.toLowerCase().includes('aarav')
                ? 'Fluted Walnut & Carrara'
                : product.name.toLowerCase().includes('sheesham') || product.name.toLowerCase().includes('baithak')
                ? 'Sheesham 4-Stool Nested'
                : product.name.toLowerCase().includes('pebble') || product.name.toLowerCase().includes('sangam')
                ? 'Organic Walnut & Pebble'
                : product.name.toLowerCase().includes('tufted') || product.name.toLowerCase().includes('chesterfield')
                ? 'Tufted Velvet & Glass'
                : product.name.toLowerCase().includes('slat') || product.name.toLowerCase().includes('zeenat')
                ? 'Brushed Brass & Calacatta'
                : product.name.toLowerCase().includes('yin-yang') || product.name.toLowerCase().includes('duality')
                ? 'Teak & Lacquer Swivel'
                : product.name.toLowerCase().includes('marquina') || product.name.toLowerCase().includes('sheesh-mahal')
                ? 'Nero Marquina & Gold'
                : product.name.toLowerCase().includes('offset') || product.name.toLowerCase().includes('kanan')
                ? 'Geometric Offset Walnut'
                : product.name.toLowerCase().includes('kuber') || product.name.toLowerCase().includes('crescent')
                ? 'Sculpted Calacatta Oval'
                : product.name.toLowerCase().includes('surya') || product.name.toLowerCase().includes('wire cage')
                ? 'Spun Brass & Makrana'
                : product.name.toLowerCase().includes('aangan') || product.name.toLowerCase().includes('dining')
                ? 'Statuario Dining Set'
                : product.name.toLowerCase().includes('console')
                ? 'Tambour Fluted Console'
                : 'Architectural Centerpiece'}
            </span>
          </div>
        ) : product.category === 'Seating' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/92 text-[#F2DFCE] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/40 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
            <span>
              {product.name.toLowerCase().includes('cerulean') || product.name.toLowerCase().includes('salon')
                ? 'Cerulean Grand Salon'
                : product.name.toLowerCase().includes('futon') || product.name.toLowerCase().includes('baithak')
                ? 'Kala Cotton Baithak'
                : product.name.toLowerCase().includes('majlis') || product.name.toLowerCase().includes('flokati')
                ? 'Tufted Majlis Lounge'
                : product.name.toLowerCase().includes('banquette') || product.name.toLowerCase().includes('vihara')
                ? 'Curved Bay Banquette'
                : product.name.toLowerCase().includes('wing') || product.name.toLowerCase().includes('manor')
                ? 'Wing Chair & Ottoman'
                : product.name.toLowerCase().includes('kyoto') || product.name.toLowerCase().includes('sectional')
                ? 'Low-Profile Sectional'
                : product.name.toLowerCase().includes('jharokha') || product.name.toLowerCase().includes('daybed')
                ? 'Bay-Window Daybed'
                : product.name.toLowerCase().includes('hammock') || product.name.toLowerCase().includes('papasan')
                ? 'Hammock Swing & Papasan'
                : product.name.toLowerCase().includes('atelier') || product.name.toLowerCase().includes('leather')
                ? 'Ivory Modular & Leather'
                : product.name.toLowerCase().includes('darbar') || product.name.toLowerCase().includes('banquet')
                ? '3.4m Fluted Banquet Sofa'
                : product.name.toLowerCase().includes('cane')
                ? 'Hand-Woven Cane'
                : 'Artisan Lounge Suite'}
            </span>
          </div>
        ) : product.category === 'Vases' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/92 text-[#F2DFCE] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/40 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
            <span>
              {product.name.toLowerCase().includes('swan') || product.name.toLowerCase().includes('rajhans')
                ? '24K Gold Wing Swan Pair'
                : product.name.toLowerCase().includes('face') || product.name.toLowerCase().includes('devi')
                ? '24K Mirror Gold Bust'
                : product.name.toLowerCase().includes('relief') || product.name.toLowerCase().includes('meenakari')
                ? 'Sculpted Relief Petals'
                : product.name.toLowerCase().includes('floating') || product.name.toLowerCase().includes('amrit')
                ? 'Floating Rose Hurricanes'
                : product.name.toLowerCase().includes('cloche') || product.name.toLowerCase().includes('gulab')
                ? 'Acoustic Preserved Rose'
                : product.name.toLowerCase().includes('enchanted') || product.name.toLowerCase().includes('crimson')
                ? 'Immortal Crimson Cloche'
                : product.name.toLowerCase().includes('porcelain') || product.name.toLowerCase().includes('nirvana')
                ? 'Kaolin Porcelain Trio'
                : product.name.toLowerCase().includes('parijat') || product.name.toLowerCase().includes('botanical')
                ? '3D Floral Biscuit Trio'
                : product.name.toLowerCase().includes('smoked') || product.name.toLowerCase().includes('megh')
                ? 'Mouth-Blown Smoke Glass'
                : product.name.toLowerCase().includes('bear') || product.name.toLowerCase().includes('bhalu')
                ? 'Origami Bear & Brass Tray'
                : product.name.toLowerCase().includes('bicycle') || product.name.toLowerCase().includes('vahan')
                ? 'Forged Iron Carriage'
                : product.name.toLowerCase().includes('lantern') || product.name.toLowerCase().includes('noor')
                ? 'Vintage Lantern Terrarium'
                : product.name.toLowerCase().includes('fairy') || product.name.toLowerCase().includes('deepak')
                ? 'LED Fairy Light Jar'
                : product.name.toLowerCase().includes('fluted') || product.name.toLowerCase().includes('tarang')
                ? 'Fluted Centerpiece Bowl'
                : 'Studio Ceramic & Glass'}
            </span>
          </div>
        ) : product.category === 'Mirrors' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/92 text-[#F2DFCE] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/40 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
            <span>
              {product.name.toLowerCase().includes('rococo') || product.name.toLowerCase().includes('sheesh')
                ? '24K Gold Leaf Carved Crest'
                : product.name.toLowerCase().includes('halo') || product.name.toLowerCase().includes('chandra')
                ? '360° Halo Backlit Glow'
                : product.name.toLowerCase().includes('arch') || product.name.toLowerCase().includes('meera')
                ? 'Satin Brushed Brass Arch'
                : product.name.toLowerCase().includes('jharokha') || product.name.toLowerCase().includes('jaali')
                ? 'Hand-Pierced Jaali Trio'
                : product.name.toLowerCase().includes('hollywood') || product.name.toLowerCase().includes('apsara')
                ? '12 LED Daylight Globes'
                : product.name.toLowerCase().includes('travel') || product.name.toLowerCase().includes('kridhrish')
                ? 'Portable LED Vanity Case'
                : product.name.toLowerCase().includes('lippan') || product.name.toLowerCase().includes('cowrie')
                ? 'Kutch Lippan & Cowrie'
                : product.name.toLowerCase().includes('wavy') || product.name.toLowerCase().includes('tarang')
                ? 'Organic Wavy LED Contour'
                : product.name.toLowerCase().includes('beveled') || product.name.toLowerCase().includes('darpan')
                ? 'Diamond-Beveled Crystal'
                : product.name.toLowerCase().includes('sheesham') || product.name.toLowerCase().includes('kavya')
                ? 'Segmented Rosewood Lathe'
                : product.name.toLowerCase().includes('pair') || product.name.toLowerCase().includes('vana')
                ? 'Twin Floating Glow Sconces'
                : product.name.toLowerCase().includes('wardrobe') || product.name.toLowerCase().includes('padmini')
                ? 'Couture Ribbon Light Suite'
                : product.name.toLowerCase().includes('square') || product.name.toLowerCase().includes('vayu')
                ? 'Dual-Zone Defogger Ring'
                : 'Artisan Glass & Brass Mirror'}
            </span>
          </div>
        ) : product.category === 'Accessories' ? (
          <div className="absolute top-3 left-3 bg-[#25201C]/92 text-[#F2DFCE] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-[#BFA069]/40 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
            <span>
              {product.name.toLowerCase().includes('svarna') || product.name.toLowerCase().includes('ginkgo')
                ? 'Dual-Ring Gilded Ginkgo'
                : product.name.toLowerCase().includes('kalpavriksha') || product.name.toLowerCase().includes('abundance')
                ? 'Kalpavriksha Brass Canopy'
                : product.name.toLowerCase().includes('mayura') || product.name.toLowerCase().includes('mandala')
                ? 'Radial Peacock Mandala'
                : product.name.toLowerCase().includes('neelkanth') || product.name.toLowerCase().includes('branch')
                ? 'Vitreous Enamel Peacocks'
                : product.name.toLowerCase().includes('latika') || product.name.toLowerCase().includes('bracket')
                ? 'Cast Brass Veranda Arms'
                : product.name.toLowerCase().includes('bodhi') || product.name.toLowerCase().includes('bedhead')
                ? 'Backlit Bodhi Sanctuary'
                : product.name.toLowerCase().includes('chitramayura') || product.name.toLowerCase().includes('ring')
                ? 'Jewel-Plumed Peacock Ring'
                : product.name.toLowerCase().includes('himalaya') || product.name.toLowerCase().includes('mountain')
                ? 'Gilded Mountain Panorama'
                : product.name.toLowerCase().includes('vrikshashraya') || product.name.toLowerCase().includes('shelves')
                ? 'Carved Wood Niche Trio'
                : product.name.toLowerCase().includes('suryodaya') || product.name.toLowerCase().includes('feather')
                ? 'Ombre Sunburst Plaque'
                : product.name.toLowerCase().includes('mridanga') || product.name.toLowerCase().includes('chime')
                ? 'Jaipur Terracotta Chimes'
                : product.name.toLowerCase().includes('kuteer') || product.name.toLowerCase().includes('cottage')
                ? 'Jute Bird Cottage Nest'
                : product.name.toLowerCase().includes('shubh') || product.name.toLowerCase().includes('mandala')
                ? 'Double Mandala Sacred Art'
                : product.name.toLowerCase().includes('kapot') || product.name.toLowerCase().includes('lovebird')
                ? 'Macrame Lovebirds (Pair)'
                : product.name.toLowerCase().includes('sangeet') || product.name.toLowerCase().includes('musician')
                ? 'Folk Musicians Trio (Set of 3)'
                : product.name.toLowerCase().includes('padma') || product.name.toLowerCase().includes('lotus drops')
                ? 'Emerald Lotus Bells (Set of 6)'
                : product.name.toLowerCase().includes('suryavanshi') || product.name.toLowerCase().includes('sunburst mirrors')
                ? 'Beaded Sunburst Mirrors (Trio)'
                : product.name.toLowerCase().includes('urli')
                ? 'Hand-Cast Brass Urli'
                : product.name.toLowerCase().includes('cushion')
                ? 'Kala Cotton Diamond Slub'
                : 'Artisan Home Accent'}
            </span>
          </div>
        ) : product.isNew ? (
          <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#25201C] text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded shadow-xs">
            New
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 focus:outline-none ${
            isFavorited
              ? 'bg-[#25201C] text-[#FAF7F2]'
              : 'bg-[#FAF7F2]/80 text-[#4A3B31] hover:bg-[#FAF7F2] hover:text-[#25201C]'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorited ? 'fill-[#BFA069] stroke-[#BFA069]' : 'stroke-current'
            }`}
          />
        </button>

        {/* Quick View & Quick Add Overlays on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-[#FAF7F2]/95 hover:bg-[#FAF7F2] text-[#25201C] text-xs font-medium rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="p-2 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] rounded-lg shadow-sm flex items-center justify-center transition-colors"
            title="Add to Shopping Bag"
            aria-label="Add to Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 cursor-pointer" onClick={() => onSelect(product)}>
        {/* Category & Material Unboxed Text */}
        <div className="flex items-center gap-2 text-[11px] text-[#785A44] mb-1.5">
          <span className="uppercase tracking-wider font-medium">{product.category}</span>
          <span aria-hidden="true" className="text-[#D4C6B7]">·</span>
          <span className="truncate">{product.material.split('&')[0]}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-base sm:text-lg font-medium text-[#25201C] group-hover:text-[#785A44] transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {(product.category === 'Wall Décor' || product.category === 'Wall Decor' || product.category === 'Furniture' || product.category === 'Lighting') && product.dimensions && (
          <p className="text-[11px] text-[#8C7355] mt-1 flex items-center gap-1 font-mono">
            <span className="text-[#BFA069]">✦</span>
            <span>{product.dimensions}</span>
          </p>
        )}

        {/* Color variants indicators if present */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.variants.map((v) => (
              <span
                key={v.id}
                className="w-2.5 h-2.5 rounded-full border border-[#D4C6B7]"
                style={{ backgroundColor: v.colorHex || '#D8C7B4' }}
                title={v.name}
              />
            ))}
            <span className="text-[10px] text-[#9E8F80] ml-1">
              {product.variants.length} finishes
            </span>
          </div>
        )}

        {/* Price & Rating Row */}
        <div className="mt-3 pt-3 border-t border-[#EDE5DA]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-[#25201C] tabular-nums font-sans">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-[#9E8F80] line-through tabular-nums">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#785A44]">
            <Star className="w-3.5 h-3.5 fill-[#BFA069] stroke-[#BFA069]" />
            <span className="font-medium text-[#25201C] tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-[#9E8F80]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Mobile Quick Add */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="mt-3 sm:hidden w-full py-1.5 bg-[#FAF7F2] border border-[#D4C6B7] text-[#25201C] text-xs font-medium rounded flex items-center justify-center gap-1.5 active:bg-[#EDE5DA]"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
