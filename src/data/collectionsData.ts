export interface CuratedCollectionItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  badge?: string;
  itemCountText: string;
  navParams: {
    room?: string;
    category?: string;
    filter?: 'new' | 'bestseller';
  };
}

export const RIWAAZ_COLLECTIONS: CuratedCollectionItem[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    subtitle: 'Quiet Leisure & Grand Hosting',
    description: 'Handcrafted solid timber seating, raw linen sofas, and sculpted brass accents designed for restful conversations and effortless hosting.',
    image: '/assets/aistudio/rr21_08065242.jpg',
    itemCountText: '30+ Curated Pieces',
    navParams: { room: 'Living Room' }
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    subtitle: 'Restorative Twilight Sanctuaries',
    description: 'Serene platform beds, ethereal gossamer canopies, and breathable organic cotton linens crafted to create a restorative private sanctuary.',
    image: '/assets/aistudio/bb13_e1c43a33.jpg',
    itemCountText: '24+ Curated Pieces',
    navParams: { room: 'Bedroom' }
  },
  {
    id: 'wall-decor',
    name: 'Wall Decor',
    subtitle: 'Sculptural Relief & Jaali Art',
    description: 'Architectural jaali panels, repoussé brass installations, and heritage relief murals that bring soulful depth to expansive wallscapes.',
    image: '/assets/aistudio/ww10_tree.jpg',
    itemCountText: '28+ Statement Panels',
    navParams: { category: 'Wall Décor' }
  },
  {
    id: 'lighting',
    name: 'Lighting',
    subtitle: 'Ambient Luminaires & Jaali Lanterns',
    description: 'Mouth-blown crystal cascades, perforated Moradabad brass pendants, and warm ambient floor lamps that sculpt twilight serenity.',
    image: '/assets/aistudio/ll8_f4388aa3.jpg',
    itemCountText: '22+ Artisanal Fixtures',
    navParams: { category: 'Lighting' }
  },
  {
    id: 'dining',
    name: 'Dining',
    subtitle: 'Heirloom Tables & Stone Centerpieces',
    description: 'Honest solid teak tables, sculpted stone centerpieces, and artisanal stoneware designed to elevate every feast and family gathering.',
    image: '/assets/aistudio/dd17_ca68cf99.jpg',
    itemCountText: '26+ Dining Ensembles',
    navParams: { room: 'Dining Room' }
  },
  {
    id: 'home-accessories',
    name: 'Home Accessories',
    subtitle: 'Tactile Vessels, Urns & Accents',
    description: 'Wheel-thrown studio ceramics, hand-hammered brass vessels, and handwoven textiles that infuse quiet luxury into every corner.',
    image: '/assets/aistudio/aa20_664be128.jpg',
    itemCountText: '35+ Home Accents',
    navParams: { category: 'Accessories' }
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    subtitle: 'Fresh Seasonal Atelier Creations',
    description: 'Freshly unveiled atelier creations, limited season curations, and innovative contemporary craft from our master artisan studios.',
    image: '/assets/aistudio/EE18_73cef766.jpg',
    badge: 'Seasonal Unveiling',
    itemCountText: 'Just Released',
    navParams: { filter: 'new' }
  },
  {
    id: 'best-sellers',
    name: 'Best Sellers',
    subtitle: 'Most Cherished Heritage Silhouettes',
    description: 'Our most coveted heirloom silhouettes and timeless crowd favorites, cherished for exceptional craftsmanship and lasting beauty.',
    image: '/assets/aistudio/fur_05d745f0.jpg',
    badge: 'Atelier Icons',
    itemCountText: 'Most Loved',
    navParams: { filter: 'bestseller' }
  }
];
