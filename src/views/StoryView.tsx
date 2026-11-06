import React from 'react';
import { BrandEmblem } from '../components/BrandEmblem.tsx';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { AboutUsSection } from '../components/AboutUsSection.tsx';

interface StoryViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      
      {/* Editorial Story Hero Banner */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/editorial_spaces_living_1791889257281.jpg"
            alt="RIWAAZ Timeless Living Interior Setting"
            className="w-full h-full object-cover object-center brightness-[0.88]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#25201C]/90 via-[#25201C]/45 to-black/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center text-[#FAF7F2] space-y-6">
          <BrandEmblem size={52} variant="gold" className="mx-auto" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FAF7F2]/10 backdrop-blur-md rounded-full border border-white/10 text-[11px] uppercase tracking-[0.25em] text-[#E5B869] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The RIWAAZ Philosophy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight leading-[1.1] max-w-3xl mx-auto">
            “Living with beauty is not an occasional ceremony—it is an everyday rhythm.”
          </h1>
          <p className="text-xs sm:text-base text-[#EDE5DA] max-w-2xl mx-auto font-light leading-relaxed">
            Honoring generational Indian craftsmanship, unvarnished natural materials, and the quiet dignity of timeless architectural spaces.
          </p>
        </div>
      </section>

      {/* Main Comprehensive About Us Section */}
      <AboutUsSection onNavigate={onNavigate} isStandalonePage={true} />

      {/* Flagship Atelier Experience Invitation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#25201C] text-[#FAF7F2] rounded-3xl p-8 sm:p-14 lg:p-16 text-center space-y-6 border border-[#BFA069]/30 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E5B869] uppercase tracking-widest font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>The Design Atelier • New Delhi</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#FAF7F2]">
            Experience RIWAAZ in Person
          </h2>

          <p className="text-xs sm:text-sm text-[#D4C6B7] max-w-xl mx-auto leading-relaxed font-light">
            Visit our design gallery in Mehrauli, New Delhi. Touch the hand-loomed linens, run your fingers over seasoned teak grains, and collaborate with our interior curators to shape your personal sanctuary.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-[#FAF7F2] hover:bg-[#F5EFEB] text-[#25201C] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all duration-300 inline-flex items-center gap-2 group"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
