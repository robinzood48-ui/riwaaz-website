import React from 'react';
import { ArrowRight, Compass, Sparkles, Shield, HeartHandshake } from 'lucide-react';
import { CollectionsSection } from '../components/CollectionsSection.tsx';

interface CollectionsViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      
      {/* Editorial Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#25201C] text-[#FAF7F2] p-8 sm:p-14 lg:p-20 border border-[#BFA069]/30 shadow-xl">
          {/* Subtle Ambient Background Texture */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src="/src/assets/images/hero_indian_living_room_1791889255407.jpg"
              alt="RIWAAZ Collections Atmosphere"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E1916] via-[#25201C]/90 to-transparent z-0" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2]/10 backdrop-blur-md rounded-full border border-white/10 text-[11px] uppercase tracking-[0.25em] text-[#E5B869] font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Architectural Living Series</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#FAF7F2] leading-[1.08] tracking-tight">
              The RIWAAZ Collections
            </h1>

            <p className="text-sm sm:text-base text-[#D4C6B7] leading-relaxed font-light max-w-2xl">
              Each collection is conceived as an architectural sanctuary—balancing the time-honored soul of Indian stonemasons, woodcarvers, and brass smiths with contemporary restraint and quiet luxury.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="px-6 py-3 rounded-xl bg-[#FAF7F2] text-[#25201C] hover:bg-[#BFA069] hover:text-[#25201C] transition-all duration-300 shadow-md flex items-center gap-2 group"
              >
                <span>Browse Entire Catalogue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('story')}
                className="px-6 py-3 rounded-xl border border-white/20 hover:border-white/50 text-[#FAF7F2] hover:bg-white/5 transition-colors"
              >
                <span>Our Artisan Guilds</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Curated Collection Cards Section */}
      <CollectionsSection onNavigate={onNavigate} />

      {/* Artisan Heritage & Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-8 sm:p-12 rounded-3xl bg-[#F5EFEB] border border-[#EDE5DA]">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">
              Heirloom Materiality
            </h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              We exclusively specify seasoned sheesham, plantation teak, hand-chiseled Jodhpur sandstone, and forged brass built to age gracefully over generations.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">
              Direct Artisan Guilds
            </h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              Crafted in collaboration with multigenerational craft communities across Moradabad, Saharanpur, and Kutch with fair-trade patronage.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">
              White Glove Delivery
            </h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              Every substantial furniture and lighting creation arrives with room-of-choice placement, uncrating, and expert debris removal across India.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
