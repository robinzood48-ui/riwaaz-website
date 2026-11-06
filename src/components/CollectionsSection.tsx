import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RIWAAZ_COLLECTIONS, CuratedCollectionItem } from '../data/collectionsData.ts';

interface CollectionsSectionProps {
  onNavigate: (view: string, params?: any) => void;
  showSectionHeader?: boolean;
  className?: string;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  onNavigate,
  showSectionHeader = true,
  className = '',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'rooms' | 'decor' | 'highlights'>('all');

  const filteredCollections = RIWAAZ_COLLECTIONS.filter((col) => {
    if (activeFilter === 'rooms') {
      return ['living-room', 'bedroom', 'dining'].includes(col.id);
    }
    if (activeFilter === 'decor') {
      return ['wall-decor', 'lighting', 'home-accessories'].includes(col.id);
    }
    if (activeFilter === 'highlights') {
      return ['new-arrivals', 'best-sellers'].includes(col.id);
    }
    return true;
  });

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {showSectionHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#EDE5DA] gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#BFA069] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Design Sanctuaries</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#25201C] tracking-tight">
              Explore Our Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#785A44] leading-relaxed font-light">
              Eight distinct chapters of Indian craftsmanship, architectural warmth, and contemporary luxury tailored for every room in your sanctuary.
            </p>
          </div>

          {/* Filter segment tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F5EFEB] rounded-xl border border-[#EDE5DA] self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Collections (8)' },
              { id: 'rooms', label: 'Living & Dining' },
              { id: 'decor', label: 'Art & Lighting' },
              { id: 'highlights', label: 'Curator Highlights' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-[#25201C] text-[#FAF7F2] shadow-xs'
                    : 'text-[#5E4D40] hover:text-[#25201C] hover:bg-[#EFE9DF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 8 Collection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {filteredCollections.map((col: CuratedCollectionItem, idx: number) => (
          <article
            key={col.id}
            className="group flex flex-col bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] hover:border-[#BFA069]/70 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 ease-out"
          >
            {/* Card Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFEB]">
              <img
                src={col.image}
                alt={col.name}
                loading={idx < 4 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.97] group-hover:brightness-100"
              />
              
              {/* Subtle scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#25201C]/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Number Kicker / Badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#25201C]/75 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#FAF7F2] font-semibold border border-white/10">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {col.badge && (
                  <span className="px-2.5 py-1 rounded-md bg-[#BFA069] text-[10px] uppercase tracking-wider text-[#25201C] font-semibold shadow-xs">
                    {col.badge}
                  </span>
                )}
              </div>

              {/* Piece count indicator */}
              <div className="absolute bottom-3 right-3">
                <span className="text-[11px] font-medium text-[#FAF7F2] bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  {col.itemCountText}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#BFA069] font-semibold block">
                  {col.subtitle}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#25201C] group-hover:text-[#8C6D3B] transition-colors leading-tight">
                  {col.name}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5E4D40] leading-relaxed font-light line-clamp-3">
                  {col.description}
                </p>
              </div>

              {/* “Explore Collection” Button */}
              <div className="pt-2 border-t border-[#EDE5DA]/80">
                <button
                  type="button"
                  onClick={() => onNavigate('shop', col.navParams)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F5EFEB] hover:bg-[#25201C] text-[#25201C] hover:text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-between group/btn border border-[#EDE5DA] hover:border-[#25201C] shadow-2xs hover:shadow-md"
                >
                  <span>Explore Collection</span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] group-hover/btn:bg-[#BFA069] text-[#25201C] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
