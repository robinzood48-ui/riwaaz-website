import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Product, Category, Collection } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { CollectionsSection } from '../components/CollectionsSection.tsx';
import { AboutUsSection } from '../components/AboutUsSection.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface HomeViewProps {
  onNavigate: (view: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectProduct,
  onQuickView,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [bestsellerIndex, setBestsellerIndex] = useState(0);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, colRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/collections'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const colData = await colRes.json();

        if (prodData.success && Array.isArray(prodData.data)) setProducts(prodData.data);
        if (catData.success && Array.isArray(catData.data)) setCategories(catData.data);
        if (colData.success && Array.isArray(colData.data)) setCollections(colData.data);
      } catch (e) {
        console.error('Failed to load home data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const popularProducts = (products || []).slice(0, 8);
  const newArrivals = (products || []).filter(p => p.isNew).slice(0, 4);
  const bestsellers = (products || []).filter(p => p.bestseller);

  const rooms = [
    { name: 'Living Room', desc: 'Sanctuaries of quiet leisure and hosting', image: '/assets/aistudio/rr1_3269170f.jpg' },
    { name: 'Dining Room', desc: 'Gathering around honest wood and stone', image: '/assets/aistudio/dd17_ca68cf99.jpg' },
    { name: 'Bedroom', desc: 'Restful textures, ethereal canopies and artisanal suites', image: '/assets/aistudio/bb13_e1c43a33.jpg' },
    { name: 'Entryway', desc: 'Welcoming consoles, mirrors, and illuminated dressers', image: '/images/table_2.jpg' },
    { name: 'Workspace', desc: 'Minimal surfaces for focused contemplation', image: '/src/assets/images/editorial_spaces_living_1791889257281.jpg' },
    { name: 'Verandah', desc: 'Stone plinths and teak accents for shaded verandahs', image: '/images/chair.jpg' },
  ];

  const moods = [
    {
      title: 'Warm Minimal',
      description: 'Clean architectural lines softened by natural plaster, unvarnished oak, and organic pottery.',
      image: '/src/assets/images/mood_warm_minimal_decor_1791889258080.jpg',
      mood: 'Warm Minimal'
    },
    {
      title: 'Modern Heritage',
      description: 'Centuries of Indian jharokha geometry and hammered brass re-cast for contemporary apartments.',
      image: '/src/assets/images/hero_indian_living_room_1791889255407.jpg',
      mood: 'Modern Heritage'
    },
    {
      title: 'Earthy Living',
      description: 'Sun-baked terracotta, raw desert sand slips, and tactile Kala cotton weaves that ground the spirit.',
      image: '/src/assets/images/craftsmanship_artisan_studio_1791889258259.jpg',
      mood: 'Earthy Living'
    },
    {
      title: 'Quiet Luxury',
      description: 'Understated solid hardwoods, brushed satin brass, and pure European slub flax upholstery.',
      image: '/src/assets/images/editorial_spaces_living_1791889257281.jpg',
      mood: 'Quiet Luxury'
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    showToast('Welcome to the RIWAAZ Journal', 'You will receive seasonal updates and interior stories.', 'success');
  };

  const nextBestseller = () => {
    if (bestsellers.length > 0) {
      setBestsellerIndex((prev) => (prev + 1) % Math.max(1, bestsellers.length - 2));
    }
  };

  const prevBestseller = () => {
    if (bestsellers.length > 0) {
      setBestsellerIndex((prev) => (prev - 1 + Math.max(1, bestsellers.length - 2)) % Math.max(1, bestsellers.length - 2));
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      
      {/* 4. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_indian_living_room_1791889255407.jpg"
            alt="RIWAAZ Timeless Indian Living Interior"
            className="w-full h-full object-cover object-center brightness-[0.92]"
            fetchPriority="high"
          />
          {/* Subtle Warm Editorial Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#25201C]/80 via-[#25201C]/35 to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center text-[#FAF7F2] space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2]/15 backdrop-blur-md border border-[#FAF7F2]/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA069]" />
            <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#FAF7F2]">
              Modern Indian Living
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FAF7F2] leading-[1.08] max-w-4xl mx-auto">
            Timeless Indian Living
          </h1>

          <p className="text-sm sm:text-lg text-[#EDE5DA] max-w-2xl mx-auto font-light leading-relaxed">
            Thoughtfully designed décor that brings warmth, character and timeless beauty into your home.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF7F2] hover:bg-[#F5EFEB] text-[#25201C] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 group"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('shop', { filter: 'new' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-[#FAF7F2]/10 text-[#FAF7F2] border border-[#FAF7F2]/40 text-xs uppercase tracking-widest font-semibold rounded-lg backdrop-blur-xs transition-colors"
            >
              Explore New Arrivals
            </button>
          </div>
        </div>

        {/* Scroll indicator strip */}
        <div className="absolute bottom-6 inset-x-0 z-10 text-center">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4C6B7] font-medium opacity-80">
            Scroll to Discover
          </span>
        </div>
      </section>

      {/* 5. CATEGORY SECTION: "Curate Your Space" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Architectural Elements
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
            Curate Your Space
          </h2>
        </div>

        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.name })}
              className="flex flex-col items-center gap-3 shrink-0 group focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#EFE9DF] p-1 border-2 border-[#EDE5DA] transition-all duration-300 group-hover:border-[#BFA069] group-hover:scale-105 shadow-xs">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-center">
                <span className="font-serif text-sm font-medium text-[#25201C] group-hover:text-[#785A44] transition-colors block">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#9E8F80] block">
                  {cat.itemCount} pieces
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. POPULAR PRODUCTS: "Popular Pieces" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#EDE5DA]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
              The Essentials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
              Popular Pieces
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs uppercase tracking-wider font-semibold text-[#785A44] hover:text-[#25201C] flex items-center gap-1 group transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 cols Desktop, 3 Tablet, 2 Mobile Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 8. EDITORIAL COLLECTION SECTION: "The RIWAAZ Edit" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center bg-[#F5EFEB] rounded-3xl p-6 sm:p-12 border border-[#EDE5DA]">
          {/* LEFT: Large Premium Interior Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
            <img
              src="/src/assets/images/editorial_spaces_living_1791889257281.jpg"
              alt="Spaces Made for Living"
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT: Editorial Content */}
          <div className="space-y-6 lg:py-8">
            <div className="inline-block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#BFA069] font-semibold">
                THE RIWAAZ EDIT
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#25201C] leading-[1.15]">
              Spaces Made for Living
            </h2>

            <p className="text-sm sm:text-base text-[#5E4D40] leading-relaxed font-light">
              Natural materials, thoughtful forms and timeless details designed to bring warmth and character into everyday spaces.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop', { collection: 'Natural Living' })}
                className="px-8 py-3.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. COLLECTIONS SECTION */}
      <CollectionsSection onNavigate={onNavigate} />

      {/* 10. SHOP BY ROOM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Sanctuary By Sanctuary
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
            Shop By Room
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {rooms.map((room) => (
            <div
              key={room.name}
              onClick={() => onNavigate('shop', { room: room.name })}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-[#EDE5DA]"
            >
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25201C]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-3 text-center text-[#FAF7F2]">
                <h3 className="font-serif text-base font-medium">{room.name}</h3>
                <span className="text-[10px] text-[#BFA069] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider block mt-1">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#EDE5DA]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
                Just Unveiled
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', { filter: 'new' })}
              className="text-xs uppercase tracking-wider font-semibold text-[#785A44] hover:text-[#25201C] flex items-center gap-1 group transition-colors"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 12. ABOUT US & BRAND STORY */}
      <AboutUsSection onNavigate={onNavigate} />

      {/* 13. SHOP BY MOOD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Atmospheric Curations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
            Shop By Mood
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moods.map((m) => (
            <div
              key={m.title}
              onClick={() => onNavigate('shop', { mood: m.mood })}
              className="group bg-[#F5EFEB] rounded-2xl overflow-hidden border border-[#EDE5DA] cursor-pointer flex flex-col hover:border-[#D4C6B7] transition-all"
            >
              <div className="aspect-[1/1] overflow-hidden bg-[#EDE5DA]">
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#25201C] mb-1.5">{m.title}</h3>
                  <p className="text-xs text-[#5E4D40] leading-relaxed line-clamp-3">{m.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EDE5DA] flex items-center justify-between text-xs text-[#785A44] font-medium group-hover:text-[#25201C]">
                  <span>Explore Mood</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 14. BESTSELLERS CAROUSEL */}
      {bestsellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#EDE5DA]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
                Customer Favorites
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
                Bestsellers
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevBestseller}
                className="p-2 rounded-full border border-[#EDE5DA] bg-[#FAF7F2] hover:bg-[#EDE5DA] text-[#25201C] transition-colors"
                aria-label="Previous bestsellers"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextBestseller}
                className="p-2 rounded-full border border-[#EDE5DA] bg-[#FAF7F2] hover:bg-[#EDE5DA] text-[#25201C] transition-colors"
                aria-label="Next bestsellers"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {(bestsellers || []).slice(bestsellerIndex, bestsellerIndex + 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 15. LOOKBOOK: "RIWAAZ at Home" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Visual Journal
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#25201C] mt-1">
            RIWAAZ at Home
          </h2>
          <p className="text-xs text-[#785A44] max-w-md mx-auto mt-2">
            Living spaces shaped by our patrons across Bangalore, Mumbai, Delhi and Jaipur.
          </p>
        </div>

        {/* Editorial Masonry Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-[#EDE5DA]">
            <img
              src="/images/images_6.jpg"
              alt="Cloud Sectional in Modern Living Room"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 text-white text-xs">
              <span>Arched Courtyard Sanctuary · New Delhi</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-[#EDE5DA]">
              <img
                src="/images/table_2.jpg"
                alt="Fluted Console Table & Vanity"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 text-white text-xs">
                <span>Morning Light Foyer · Gurugram</span>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-[#EDE5DA]">
              <img
                src="/images/table.jpg"
                alt="Solid Dining Table Gathering"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 text-white text-xs">
                <span>Contemplative Dining Alcove · Bengaluru</span>
              </div>
            </div>
          </div>
          <div
            onClick={() => onNavigate('shop', { category: 'Wall Décor' })}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-[#EDE5DA] cursor-pointer"
          >
            <img
              src="/assets/aistudio/ww10_tree.jpg"
              alt="Kalpavriksha Brass & Crystal Tree Wall Art in Salon"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] text-[#E5B869] uppercase tracking-widest font-semibold">Wall Décor Spotlight</span>
              <span className="text-sm font-serif font-medium">Kalpavriksha Salon · Mumbai Penthouse</span>
              <span className="text-[11px] text-[#EDE5DA] opacity-80 mt-1 flex items-center gap-1 group-hover:text-[#E5B869] transition-colors">
                Explore Wall Décor Collection →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 16. NEWSLETTER: "Bring timeless design home." */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#EDE5DA]/60 border border-[#D4C6B7] rounded-3xl p-8 sm:p-14 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            The RIWAAZ Gazette
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C]">
            Bring timeless design home.
          </h2>
          <p className="text-xs sm:text-sm text-[#5E4D40] max-w-md mx-auto leading-relaxed">
            Get new collection updates, styling inspiration and stories from RIWAAZ.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#D4C6B7] rounded-lg text-xs text-[#25201C] placeholder:text-[#9E8F80] focus:outline-none focus:border-[#785A44]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#F5EFEB] rounded-lg text-xs text-emerald-800 font-medium inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Thank you for subscribing to the RIWAAZ Journal.</span>
            </div>
          )}

          <p className="text-[10px] text-[#8A7969]">
            We respect your sanctuary. Unsubscribe anytime with one click.
          </p>
        </div>
      </section>

    </div>
  );
};
