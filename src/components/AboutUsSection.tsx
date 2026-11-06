import React from 'react';
import { ArrowRight, Sparkles, Compass, Eye, ShieldCheck, Heart, Award, Users, CheckCircle2 } from 'lucide-react';
import { BrandEmblem } from './BrandEmblem.tsx';

interface AboutUsSectionProps {
  onNavigate: (view: string, params?: any) => void;
  className?: string;
  isStandalonePage?: boolean;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  onNavigate,
  className = '',
  isStandalonePage = false,
}) => {
  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 ${className}`}>
      
      {/* 1. BRAND INTRODUCTION & EDITORIAL HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#BFA069] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About RIWAAZ Home Décor</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#25201C] tracking-tight leading-[1.12]">
            Timeless beauty, handcrafted for the soul of modern living.
          </h2>

          <p className="text-base sm:text-lg text-[#5E4D40] font-light leading-relaxed">
            At RIWAAZ, we believe a home is more than an arrangement of furniture—it is a sacred sanctuary where everyday moments find peace, warmth, and enduring character.
          </p>

          <p className="text-xs sm:text-sm text-[#785A44] leading-relaxed font-light">
            Founded with deep reverence for Indian artistry, we bridge centuries-old architectural craft with clean, contemporary silhouettes. Every piece in our collection is thoughtfully sculpted to create spaces that feel calm, sophisticated, and deeply rooted in honest materiality.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Curated Image */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#EDE5DA]">
            <img
              src="/assets/aistudio/rr21_08065242.jpg"
              alt="RIWAAZ warm living room sanctuary with handcrafted furniture"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25201C]/50 via-transparent to-transparent" />
            
            {/* Floating Brand Badge */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-[#EDE5DA] shadow-lg flex items-center gap-3.5">
              <BrandEmblem size={36} variant="gold" className="shrink-0" />
              <div>
                <p className="font-serif text-sm font-medium text-[#25201C]">Artisanal Indian Provenance</p>
                <p className="text-[11px] text-[#785A44] font-light">100% Solid Hardwoods & Natural Minerals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OUR STORY, MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Our Story */}
        <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EDE5DA] shadow-2xs space-y-4 hover:border-[#BFA069]/60 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EFEB] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#BFA069] font-semibold block">
            Provenance
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#25201C]">Our Story</h3>
          <p className="text-xs sm:text-[13px] text-[#5E4D40] leading-relaxed font-light">
            RIWAAZ began with a simple journey through the historic artisan clusters of Saharanpur, Moradabad, and Khurja. Seeing ancient joinery and stonecarving threatened by fleeting mass-market trends, we set out to build an intentional home decor house that honors these living legacies while shaping calming, functional spaces for the modern era.
          </p>
        </div>

        {/* Our Mission */}
        <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EDE5DA] shadow-2xs space-y-4 hover:border-[#BFA069]/60 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EFEB] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#BFA069] font-semibold block">
            Purpose
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#25201C]">Our Mission</h3>
          <p className="text-xs sm:text-[13px] text-[#5E4D40] leading-relaxed font-light">
            To craft honest, heirloom-grade home décor that infuses everyday living with peace, tactile beauty, and cultural resonance. We empower multigenerational artisan guilds through fair patronage, ensuring that every piece brought into your home carries true soul, dignity, and longevity.
          </p>
        </div>

        {/* Our Vision */}
        <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EDE5DA] shadow-2xs space-y-4 hover:border-[#BFA069]/60 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EFEB] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
            <Eye className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#BFA069] font-semibold block">
            Aspiration
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#25201C]">Our Vision</h3>
          <p className="text-xs sm:text-[13px] text-[#5E4D40] leading-relaxed font-light">
            To redefine contemporary interior design globally by establishing timeless Indian craftsmanship as the worldwide standard for quiet luxury, sustainable home sanctuaries, and mindful living where heritage and modernity co-exist in effortless harmony.
          </p>
        </div>
      </div>

      {/* 3. FOUR CORE PILLARS: QUALITY, CREATIVITY, ELEGANCE, CUSTOMER SATISFACTION */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
            Our Guiding Standards
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C]">
            Crafted Upon Four Non-Negotiable Virtues
          </h3>
          <p className="text-xs sm:text-sm text-[#785A44] leading-relaxed font-light">
            Every creation bearing the RIWAAZ mark is guided by four foundational commitments to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quality */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">Uncompromising Quality</h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              We exclusively select kiln-dried seasoned sheesham, plantation teak, pure Moradabad brass, and hand-thrown stoneware. Free of artificial veneers, particle board, or synthetic shortcuts.
            </p>
          </div>

          {/* Creativity */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">Inspiring Creativity</h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              We reinterpret centuries-old jaali geometry, temple stone reliefs, and organic pottery contours into functional modern art that sparks imagination and elevates daily life.
            </p>
          </div>

          {/* Elegance */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">Timeless Elegance</h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              Understated color palettes, tactile unbleached linens, and balanced proportions that transcend short-lived fads, gaining depth and graceful patina with every passing year.
            </p>
          </div>

          {/* Customer Satisfaction */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4C6B7] flex items-center justify-center text-[#BFA069]">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-normal text-[#25201C]">Customer Satisfaction</h4>
            <p className="text-xs text-[#5E4D40] leading-relaxed font-light">
              From bespoke sizing advice and complimentary design consultation to white-glove home delivery across India, your journey with RIWAAZ is personal, respectful, and effortless.
            </p>
          </div>
        </div>
      </div>

      {/* 4. WHY CHOOSE US (SPLIT WITH ARTISAN IMAGERY) */}
      <div className="p-8 sm:p-14 lg:p-16 rounded-3xl bg-[#FAF7F2] border border-[#EDE5DA] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-md border border-[#EDE5DA]">
              <img
                src="/src/assets/images/craftsmanship_artisan_studio_1791889258259.jpg"
                alt="Master Indian artisan shaping clay on potter wheel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25201C]/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 inset-x-5 text-[#FAF7F2]">
                <p className="font-serif text-lg font-normal">Authentic Hand-Sculpted Craft</p>
                <p className="text-xs text-[#D4C6B7] font-light">Direct collaboration with 100+ generational artisan families</p>
              </div>
            </div>
          </div>

          {/* Reasons List */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
                The RIWAAZ Distinction
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#25201C]">
                Why Discerning Homeowners Choose Us
              </h3>
              <p className="text-xs sm:text-sm text-[#785A44] leading-relaxed font-light">
                We craft each creation with the patience, honesty, and care you would expect from family.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                {
                  title: '100% Honest Natural Materials',
                  desc: 'Every table, console, and accent is forged from genuine solid woods, natural stone, and virgin brass without veneer laminates or MDF.',
                },
                {
                  title: 'Direct Artisan Patronage',
                  desc: 'We bypass industrial intermediaries, providing fair dignity, health security, and sustainable livelihoods to traditional Indian craftsman guilds.',
                },
                {
                  title: 'Heirloom Longevity',
                  desc: 'Built with time-tested mortise-and-tenon joinery and durable organic finishes designed to mature gracefully over decades of family living.',
                },
                {
                  title: 'Complimentary White Glove Delivery',
                  desc: 'Carefully packaged in sustainable materials with room-of-choice placement and uncrating on orders across India.',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#25201C] text-[#FAF7F2] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA069]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-[#25201C]">{item.title}</h5>
                    <p className="text-xs text-[#5E4D40] font-light leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="px-8 py-3.5 bg-[#25201C] hover:bg-[#3D2D24] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all duration-300 inline-flex items-center gap-2 group"
              >
                <span>Explore Our Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
