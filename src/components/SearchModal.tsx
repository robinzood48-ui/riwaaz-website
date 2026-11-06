import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import type { Product } from '../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCategory: (category: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigateToCategory,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = ['Dining Table', 'Ceramic Vase', 'Brass Mirror', 'Linen Chair', 'Console', 'Kala Cotton'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 text-center">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#FAF7F2] p-6 text-left shadow-2xl border border-[#EDE5DA] transition-all animate-in slide-in-from-top-4 duration-200">
          
          {/* Search Input Bar */}
          <div className="relative flex items-center border-b border-[#EDE5DA] pb-4">
            <Search className="w-5 h-5 text-[#785A44] shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by piece name, category, wood, brass, linen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-base sm:text-lg text-[#25201C] placeholder:text-[#9E8F80] focus:outline-none font-serif tracking-wide"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#785A44] hover:text-[#25201C] mr-2"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="p-1.5 text-xs text-[#785A44] hover:text-[#25201C] rounded-md border border-[#EDE5DA] bg-[#F7F2EC] flex items-center gap-1"
            >
              <span>ESC</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              /* Popular suggestions when query is empty */
              <div className="py-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#785A44] font-medium mb-2.5">
                    Suggested Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-md bg-[#F7F2EC] hover:bg-[#EDE5DA] text-xs text-[#25201C] border border-[#EDE5DA] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EDE5DA]">
                  <p className="text-xs uppercase tracking-wider text-[#785A44] font-medium mb-2.5">
                    Browse Popular Categories
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['Furniture', 'Lighting', 'Tables', 'Vases'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onClose();
                          onNavigateToCategory(cat);
                        }}
                        className="p-2.5 rounded bg-[#F7F2EC] hover:bg-[#EDE5DA] text-left text-[#25201C] font-medium flex items-center justify-between"
                      >
                        <span>{cat}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#BFA069]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="py-12 text-center text-xs text-[#785A44]">
                Searching the RIWAAZ catalogue...
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-serif text-lg text-[#25201C]">No pieces found for "{query}"</p>
                <p className="text-xs text-[#785A44] mt-1 max-w-sm mx-auto">
                  Try searching with terms like "oak", "stoneware", "brass", or explore our all products page.
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <p className="text-xs text-[#785A44] font-medium mb-2">
                  {results.length} {results.length === 1 ? 'piece' : 'pieces'} found
                </p>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-[#F5EFEB] cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images?.[0] || '/src/assets/images/hero_indian_living_room_1791889255407.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded bg-[#EDE5DA] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-[#785A44] uppercase tracking-wider">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.room}</span>
                      </div>
                      <h4 className="font-serif text-sm font-medium text-[#25201C] group-hover:text-[#785A44] truncate">
                        {product.name}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-[#25201C] tabular-nums font-sans">
                        ₹{(product.salePrice ?? product.price).toLocaleString('en-IN')}
                      </span>
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#BFA069] opacity-0 group-hover:opacity-100 ml-auto mt-1 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
