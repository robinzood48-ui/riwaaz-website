import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, RotateCcw, ChevronDown, Sparkles, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface ShopViewProps {
  initialFilter?: {
    category?: string;
    room?: string;
    collection?: string;
    mood?: string;
    filter?: 'new' | 'bestseller';
  };
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialFilter,
  onSelectProduct,
  onQuickView,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter?.category || 'All');
  const [selectedRoom, setSelectedRoom] = useState<string>(initialFilter?.room || 'All');
  const [selectedCollection, setSelectedCollection] = useState<string>(initialFilter?.collection || 'All');
  const [selectedMood, setSelectedMood] = useState<string>(initialFilter?.mood || 'All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>(
    initialFilter?.filter === 'new' ? 'newest' : initialFilter?.filter === 'bestseller' ? 'bestseller' : 'featured'
  );

  // Mobile filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Add Wall Décor Piece modal state
  const [showAddDecorModal, setShowAddDecorModal] = useState(false);
  const [decorTitle, setDecorTitle] = useState('');
  const [decorPrice, setDecorPrice] = useState('28500');
  const [decorMaterial, setDecorMaterial] = useState('Pure Cast Brass & Reclaimed Teak');
  const [decorDimensions, setDecorDimensions] = useState('80cm × 80cm × 5cm');
  const [decorSelectedImage, setDecorSelectedImage] = useState('/assets/aistudio/ww10_tree.jpg');
  const [decorCustomImage, setDecorCustomImage] = useState('');
  const [isSubmittingDecor, setIsSubmittingDecor] = useState(false);

  const { showToast } = useToast();

  const handleAddDecorPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decorTitle.trim()) {
      showToast('Please enter a title for the wall décor piece', 'error');
      return;
    }
    const finalImage = decorCustomImage.trim() || decorSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingDecor(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: decorTitle.trim(),
          category: 'Wall Décor',
          room: 'Living Room',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(decorPrice) || 28500,
          inventory: 10,
          sku: `RWZ-WDC-${Date.now().toString().slice(-4)}`,
          material: decorMaterial.trim() || 'Solid Hardwood & Hand-Cast Brass',
          color: 'Heritage Patina',
          dimensions: decorDimensions.trim() || '80cm × 80cm',
          shortDescription: `Artisanal hand-crafted Indian wall decor panel made with ${decorMaterial.trim() || 'heritage craftsmanship'}.`,
          description: `Exquisitely crafted luxury Indian wall décor designed to bring architectural serenity and timeless grandeur to modern spaces. Ready for installation with reinforced wall mounts.`,
          careInstructions: 'Wipe frame gently with a dry microfiber cloth.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddDecorModal(false);
        setDecorTitle('');
        setDecorCustomImage('');
        showToast('Wall décor piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add wall décor piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding wall décor piece', 'error');
    } finally {
      setIsSubmittingDecor(false);
    }
  };

  // Add Table Piece modal state
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [tableTitle, setTableTitle] = useState('');
  const [tablePrice, setTablePrice] = useState('38900');
  const [tableMaterial, setTableMaterial] = useState('Honed Italian Carrara Marble & Solid Fluted Walnut');
  const [tableDimensions, setTableDimensions] = useState('120cm L × 60cm W × 42cm H');
  const [tableSelectedImage, setTableSelectedImage] = useState('/assets/aistudio/tt1_fa575fea.jpg');
  const [tableCustomImage, setTableCustomImage] = useState('');
  const [isSubmittingTable, setIsSubmittingTable] = useState(false);

  const handleAddTablePiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableTitle.trim()) {
      showToast('Please enter a title for the table', 'error');
      return;
    }
    const finalImage = tableCustomImage.trim() || tableSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingTable(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tableTitle.trim(),
          category: 'Tables',
          room: 'Living Room',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(tablePrice) || 38900,
          inventory: 8,
          sku: `RWZ-TBL-${Date.now().toString().slice(-4)}`,
          material: tableMaterial.trim() || 'Solid Hardwood & Natural Stone',
          color: 'Warm Heritage Finish',
          dimensions: tableDimensions.trim() || '120cm × 60cm × 42cm',
          shortDescription: `Artisan handcrafted luxury table made with ${tableMaterial.trim() || 'seasoned timber and polished marble'}.`,
          description: `Exquisitely engineered luxury Indian designer table crafted to elevate living and dining sanctuaries. Features durable joinery, balanced proportions, and fine materials.`,
          careInstructions: 'Wipe surface with a damp lint-free cloth. Use coasters for hot beverages.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddTableModal(false);
        setTableTitle('');
        setTableCustomImage('');
        showToast('Table piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add table piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding table piece', 'error');
    } finally {
      setIsSubmittingTable(false);
    }
  };

  // Add Seating Piece modal state
  const [showAddSeatingModal, setShowAddSeatingModal] = useState(false);
  const [seatingTitle, setSeatingTitle] = useState('');
  const [seatingPrice, setSeatingPrice] = useState('68000');
  const [seatingMaterial, setSeatingMaterial] = useState('Belgian Linen, Solid Sheesham & Down Cushioning');
  const [seatingDimensions, setSeatingDimensions] = useState('240cm W × 95cm D × 85cm H');
  const [seatingSelectedImage, setSeatingSelectedImage] = useState('/assets/aistudio/ss10_c8705476.jpg');
  const [seatingCustomImage, setSeatingCustomImage] = useState('');
  const [isSubmittingSeating, setIsSubmittingSeating] = useState(false);

  const handleAddSeatingPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seatingTitle.trim()) {
      showToast('Please enter a title for the seating piece', 'error');
      return;
    }
    const finalImage = seatingCustomImage.trim() || seatingSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingSeating(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: seatingTitle.trim(),
          category: 'Seating',
          room: 'Living Room',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(seatingPrice) || 68000,
          inventory: 6,
          sku: `RWZ-STG-${Date.now().toString().slice(-4)}`,
          material: seatingMaterial.trim() || 'Solid Hardwood & Premium Upholstery',
          color: 'Alabaster & Oatmeal',
          dimensions: seatingDimensions.trim() || '240cm × 95cm × 85cm',
          shortDescription: `Hand-tailored luxury seating suite upholstered in ${seatingMaterial.trim() || 'premium breathable textiles'}.`,
          description: `Exquisite architectural seating crafted to bring enduring comfort and refined stillness to modern living spaces. Built with reinforced joinery and multi-layer ergonomic cushioning.`,
          careInstructions: 'Professional upholstery cleaning recommended. Fluff cushions periodically.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddSeatingModal(false);
        setSeatingTitle('');
        setSeatingCustomImage('');
        showToast('Seating piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add seating piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding seating piece', 'error');
    } finally {
      setIsSubmittingSeating(false);
    }
  };

  // Add Vase Piece modal state
  const [showAddVaseModal, setShowAddVaseModal] = useState(false);
  const [vaseTitle, setVaseTitle] = useState('');
  const [vasePrice, setVasePrice] = useState('7800');
  const [vaseMaterial, setVaseMaterial] = useState('Glazed Kaolin Porcelain & 24K Gold Detailing');
  const [vaseDimensions, setVaseDimensions] = useState('28cm H × 14cm Ø');
  const [vaseSelectedImage, setVaseSelectedImage] = useState('/assets/aistudio/vv9_03ea6ed0.jpg');
  const [vaseCustomImage, setVaseCustomImage] = useState('');
  const [isSubmittingVase, setIsSubmittingVase] = useState(false);

  const handleAddVasePiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaseTitle.trim()) {
      showToast('Please enter a title for the vase', 'error');
      return;
    }
    const finalImage = vaseCustomImage.trim() || vaseSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingVase(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vaseTitle.trim(),
          category: 'Vases',
          room: 'Living Room',
          collection: 'Earth & Form',
          mood: 'Warm Minimal',
          price: Number(vasePrice) || 7800,
          inventory: 15,
          sku: `RWZ-VAS-${Date.now().toString().slice(-4)}`,
          material: vaseMaterial.trim() || 'Studio Hand-Blown Glass & Fine Porcelain',
          color: 'Artisan Finish',
          dimensions: vaseDimensions.trim() || '26cm H × 14cm Ø',
          shortDescription: `Artisanal vase vessel handcrafted in ${vaseMaterial.trim() || 'studio ceramic and fine glass'}.`,
          description: `Exquisitely proportioned luxury floral vessel crafted to elevate mantels, consoles, and dining tables with quiet artistic presence.`,
          careInstructions: 'Rinse with warm water. Wipe exterior with soft microfibre cloth.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddVaseModal(false);
        setVaseTitle('');
        setVaseCustomImage('');
        showToast('Vase added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add vase', 'error');
      }
    } catch (err: any) {
      showToast('Error adding vase', 'error');
    } finally {
      setIsSubmittingVase(false);
    }
  };

  // Add Mirror Piece modal state
  const [showAddMirrorModal, setShowAddMirrorModal] = useState(false);
  const [mirrorTitle, setMirrorTitle] = useState('');
  const [mirrorPrice, setMirrorPrice] = useState('26500');
  const [mirrorMaterial, setMirrorMaterial] = useState('Solid Brushed Brass & Shatter-Proof Silver Float Glass');
  const [mirrorDimensions, setMirrorDimensions] = useState('180cm H × 70cm W × 3.5cm D');
  const [mirrorSelectedImage, setMirrorSelectedImage] = useState('/assets/aistudio/mm15_d8590e3e.jpg');
  const [mirrorCustomImage, setMirrorCustomImage] = useState('');
  const [isSubmittingMirror, setIsSubmittingMirror] = useState(false);

  const handleAddMirrorPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mirrorTitle.trim()) {
      showToast('Please enter a title for the mirror', 'error');
      return;
    }
    const finalImage = mirrorCustomImage.trim() || mirrorSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingMirror(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mirrorTitle.trim(),
          category: 'Mirrors',
          room: 'Bedroom',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(mirrorPrice) || 26500,
          inventory: 8,
          sku: `RWZ-MRR-${Date.now().toString().slice(-4)}`,
          material: mirrorMaterial.trim() || 'Handcrafted Frame & Float Glass',
          color: 'Satin Brass & Crystal Reflection',
          dimensions: mirrorDimensions.trim() || '180cm × 70cm',
          shortDescription: `Artisanal heritage mirror crafted in ${mirrorMaterial.trim() || 'solid brass and high-clarity silvering'}.`,
          description: `An exquisite statement mirror designed to amplify natural light and lend quiet architectural grandeur to dressing suites, entry foyers, and living salons.`,
          careInstructions: 'Wipe glass with non-ammonia microfiber cleaner. Polish metallic or timber frame with dry cotton cloth.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddMirrorModal(false);
        setMirrorTitle('');
        setMirrorCustomImage('');
        showToast('Mirror piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add mirror', 'error');
      }
    } catch (err: any) {
      showToast('Error adding mirror piece', 'error');
    } finally {
      setIsSubmittingMirror(false);
    }
  };

  // Add Accessory Piece modal state
  const [showAddAccessoryModal, setShowAddAccessoryModal] = useState(false);
  const [accessoryTitle, setAccessoryTitle] = useState('');
  const [accessoryPrice, setAccessoryPrice] = useState('18500');
  const [accessoryMaterial, setAccessoryMaterial] = useState('Pure Hand-Hammered Brass & Patina Verdigris Lotus Petals');
  const [accessoryDimensions, setAccessoryDimensions] = useState('150cm W × 75cm H × 6cm D');
  const [accessorySelectedImage, setAccessorySelectedImage] = useState('/assets/aistudio/aa20_664be128.jpg');
  const [accessoryCustomImage, setAccessoryCustomImage] = useState('');
  const [isSubmittingAccessory, setIsSubmittingAccessory] = useState(false);

  const handleAddAccessoryPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessoryTitle.trim()) {
      showToast('Please enter a title for the accessory piece', 'error');
      return;
    }
    const finalImage = accessoryCustomImage.trim() || accessorySelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingAccessory(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: accessoryTitle.trim(),
          category: 'Accessories',
          room: 'Living Room',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(accessoryPrice) || 18500,
          inventory: 10,
          sku: `RWZ-ACC-${Date.now().toString().slice(-4)}`,
          material: accessoryMaterial.trim() || 'Solid Forged Brass & Art Metalwork',
          color: 'Artisan Luster & Gold Patina',
          dimensions: accessoryDimensions.trim() || '150cm × 75cm × 6cm',
          shortDescription: `Artisanal heritage home accent handcrafted in ${accessoryMaterial.trim() || 'pure brass and forged metal'}.`,
          description: `An exceptional architectural wall installation designed to infuse living sanctuaries, master suites, and entryways with Indian metallic grandeur and artisanal soul.`,
          careInstructions: 'Dust with soft dry cloth. Avoid abrasive chemical sprays.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddAccessoryModal(false);
        setAccessoryTitle('');
        setAccessoryCustomImage('');
        showToast('Accessory piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add accessory', 'error');
      }
    } catch (err: any) {
      showToast('Error adding accessory piece', 'error');
    } finally {
      setIsSubmittingAccessory(false);
    }
  };

  // Add Living Room Piece modal state
  const [showAddLivingRoomModal, setShowAddLivingRoomModal] = useState(false);
  const [livingRoomTitle, setLivingRoomTitle] = useState('');
  const [livingRoomCategory, setLivingRoomCategory] = useState('Seating');
  const [livingRoomPrice, setLivingRoomPrice] = useState('185000');
  const [livingRoomMaterial, setLivingRoomMaterial] = useState('Cloud Bouclé Upholstery, Kiln-Dried Teak Internal Frame & High-Resilience Ergonomic Multi-Layer Foam');
  const [livingRoomDimensions, setLivingRoomDimensions] = useState('380cm W × 220cm D × 78cm H');
  const [livingRoomSelectedImage, setLivingRoomSelectedImage] = useState('/assets/aistudio/rr12_0e3f4ae3.jpg');
  const [livingRoomCustomImage, setLivingRoomCustomImage] = useState('');
  const [isSubmittingLivingRoom, setIsSubmittingLivingRoom] = useState(false);

  const handleAddLivingRoomPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!livingRoomTitle.trim()) {
      showToast('Please enter a title for the living room piece', 'error');
      return;
    }
    const finalImage = livingRoomCustomImage.trim() || livingRoomSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingLivingRoom(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: livingRoomTitle.trim(),
          category: livingRoomCategory || 'Seating',
          room: 'Living Room',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(livingRoomPrice) || 185000,
          inventory: 6,
          sku: `RWZ-LVR-${Date.now().toString().slice(-4)}`,
          material: livingRoomMaterial.trim() || 'Solid Hardwood & Premium Textiles',
          color: 'Warm Architectural Finish',
          dimensions: livingRoomDimensions.trim() || '320cm × 180cm × 80cm',
          shortDescription: `Artisanal living room centerpiece tailored in ${livingRoomMaterial.trim() || 'architectural materials'}.`,
          description: `Exquisitely proportioned living room centerpiece crafted to elevate grand salons and family gathering spaces with serene composure and timeless tactile warmth.`,
          careInstructions: 'Professional care recommended. Wipe hard surfaces with a damp cloth; vacuum upholstery regularly.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddLivingRoomModal(false);
        setLivingRoomTitle('');
        setLivingRoomCustomImage('');
        showToast('Living room piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add living room piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding living room piece', 'error');
    } finally {
      setIsSubmittingLivingRoom(false);
    }
  };

  // Add Dining Room Piece modal state
  const [showAddDiningRoomModal, setShowAddDiningRoomModal] = useState(false);
  const [diningRoomTitle, setDiningRoomTitle] = useState('');
  const [diningRoomCategory, setDiningRoomCategory] = useState('Tables');
  const [diningRoomPrice, setDiningRoomPrice] = useState('118000');
  const [diningRoomMaterial, setDiningRoomMaterial] = useState('Italian Honed Calacatta Marble, Solid Brass Base & Fluted Walnut Details');
  const [diningRoomDimensions, setDiningRoomDimensions] = useState('240cm L × 110cm W × 76cm H');
  const [diningRoomSelectedImage, setDiningRoomSelectedImage] = useState('/assets/aistudio/dd17_ca68cf99.jpg');
  const [diningRoomCustomImage, setDiningRoomCustomImage] = useState('');
  const [isSubmittingDiningRoom, setIsSubmittingDiningRoom] = useState(false);

  const handleAddDiningRoomPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diningRoomTitle.trim()) {
      showToast('Please enter a title for the dining room piece', 'error');
      return;
    }
    const finalImage = diningRoomCustomImage.trim() || diningRoomSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingDiningRoom(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: diningRoomTitle.trim(),
          category: diningRoomCategory || 'Tables',
          room: 'Dining Room',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(diningRoomPrice) || 118000,
          inventory: 6,
          sku: `RWZ-DNR-${Date.now().toString().slice(-4)}`,
          material: diningRoomMaterial.trim() || 'Solid Hardwood & Natural Marble',
          color: 'Heirloom Heritage Finish',
          dimensions: diningRoomDimensions.trim() || '240cm × 110cm × 76cm',
          shortDescription: `Artisanal dining room centerpiece crafted with ${diningRoomMaterial.trim() || 'seasoned timber and polished stone'}.`,
          description: `Exquisitely proportioned dining room centerpiece designed to anchor memorable gatherings and festive feasts with enduring architectural grandeur.`,
          careInstructions: 'Wipe surface with a damp cotton cloth. Use placemats and coasters for hot and acidic cookware.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddDiningRoomModal(false);
        setDiningRoomTitle('');
        setDiningRoomCustomImage('');
        showToast('Dining room piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add dining room piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding dining room piece', 'error');
    } finally {
      setIsSubmittingDiningRoom(false);
    }
  };

  // Add Bedroom Piece modal state
  const [showAddBedroomModal, setShowAddBedroomModal] = useState(false);
  const [bedroomTitle, setBedroomTitle] = useState('');
  const [bedroomCategory, setBedroomCategory] = useState('Furniture');
  const [bedroomPrice, setBedroomPrice] = useState('168000');
  const [bedroomMaterial, setBedroomMaterial] = useState('Circular Round Bed Platform, Gossamer Domed Canopy & Greenery Fairy Lights');
  const [bedroomDimensions, setBedroomDimensions] = useState('240cm Ø Round Bed × 240cm Canopy Height');
  const [bedroomSelectedImage, setBedroomSelectedImage] = useState('/assets/aistudio/bb13_e1c43a33.jpg');
  const [bedroomCustomImage, setBedroomCustomImage] = useState('');
  const [isSubmittingBedroom, setIsSubmittingBedroom] = useState(false);

  const handleAddBedroomPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedroomTitle.trim()) {
      showToast('Please enter a title for the bedroom piece', 'error');
      return;
    }
    const finalImage = bedroomCustomImage.trim() || bedroomSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingBedroom(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bedroomTitle.trim(),
          category: bedroomCategory || 'Furniture',
          room: 'Bedroom',
          collection: 'Earth & Form',
          mood: 'Warm Minimal',
          price: Number(bedroomPrice) || 168000,
          inventory: 5,
          sku: `RWZ-BDR-${Date.now().toString().slice(-4)}`,
          material: bedroomMaterial.trim() || 'Solid Hardwood & Organic Loomed Linen',
          color: 'Ethereal Serenity Finish',
          dimensions: bedroomDimensions.trim() || 'King 200cm × 210cm',
          shortDescription: `Artisanal bedroom suite crafted with ${bedroomMaterial.trim() || 'seasoned timber and soft tactile weaves'}.`,
          description: `Designed to cultivate tranquil dreams and serene restorative comfort, balancing architectural presence with ambient warm illumination.`,
          careInstructions: 'Spot clean upholstery with mild textile foam. Dust wooden frames with a dry microfiber cloth.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddBedroomModal(false);
        setBedroomTitle('');
        setBedroomCustomImage('');
        showToast('Bedroom piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add bedroom piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding bedroom piece', 'error');
    } finally {
      setIsSubmittingBedroom(false);
    }
  };

  // Add Entryway Piece modal state
  const [showAddEntrywayModal, setShowAddEntrywayModal] = useState(false);
  const [entrywayTitle, setEntrywayTitle] = useState('');
  const [entrywayCategory, setEntrywayCategory] = useState('Furniture');
  const [entrywayPrice, setEntrywayPrice] = useState('86000');
  const [entrywayMaterial, setEntrywayMaterial] = useState('Reclaimed Hardwood, Fluted Panels & Brushed Brass');
  const [entrywayDimensions, setEntrywayDimensions] = useState('140cm L × 45cm W × 85cm H');
  const [entrywaySelectedImage, setEntrywaySelectedImage] = useState('/assets/aistudio/EE18_73cef766.jpg');
  const [entrywayCustomImage, setEntrywayCustomImage] = useState('');
  const [isSubmittingEntryway, setIsSubmittingEntryway] = useState(false);

  const handleAddEntrywayPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entrywayTitle.trim()) {
      showToast('Please enter a title for the entryway piece', 'error');
      return;
    }
    const finalImage = entrywayCustomImage.trim() || entrywaySelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingEntryway(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: entrywayTitle.trim(),
          category: entrywayCategory || 'Furniture',
          room: 'Entryway',
          collection: 'Modern Heritage',
          mood: 'Quiet Luxury',
          price: Number(entrywayPrice) || 86000,
          inventory: 6,
          sku: `RWZ-ENT-${Date.now().toString().slice(-4)}`,
          material: entrywayMaterial.trim() || 'Solid Hardwood, Brass & Natural Fiber',
          color: 'Heritage Warmth Finish',
          dimensions: entrywayDimensions.trim() || '140cm × 45cm × 85cm',
          shortDescription: `Artisanal entryway foyer sanctuary piece crafted with ${entrywayMaterial.trim() || 'seasoned timber and hand-cast details'}.`,
          description: `Designed to create an immediate sense of arrival, warmth, and architectural harmony in entrance foyers and hallways.`,
          careInstructions: 'Dust wood surfaces with a dry microfiber cloth. Nourish timber periodically with natural beeswax.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddEntrywayModal(false);
        setEntrywayTitle('');
        setEntrywayCustomImage('');
        showToast('Entryway piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add entryway piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding entryway piece', 'error');
    } finally {
      setIsSubmittingEntryway(false);
    }
  };

  // Add Workspace Piece modal state
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [workspaceCategory, setWorkspaceCategory] = useState('Tables');
  const [workspacePrice, setWorkspacePrice] = useState('89000');
  const [workspaceMaterial, setWorkspaceMaterial] = useState('Solid Seasoned Walnut, Fluted Slat Acoustic Wall & Brass Fixtures');
  const [workspaceDimensions, setWorkspaceDimensions] = useState('160cm L × 75cm W × 76cm H');
  const [workspaceSelectedImage, setWorkspaceSelectedImage] = useState('/assets/aistudio/ww15_f949cd5f.jpg');
  const [workspaceCustomImage, setWorkspaceCustomImage] = useState('');
  const [isSubmittingWorkspace, setIsSubmittingWorkspace] = useState(false);

  const handleAddWorkspacePiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceTitle.trim()) {
      showToast('Please enter a title for the workspace piece', 'error');
      return;
    }
    const finalImage = workspaceCustomImage.trim() || workspaceSelectedImage;
    if (!finalImage) {
      showToast('Please select or upload an image', 'error');
      return;
    }

    setIsSubmittingWorkspace(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workspaceTitle.trim(),
          category: workspaceCategory || 'Tables',
          room: 'Workspace',
          collection: 'Modern Heritage',
          mood: 'Warm Minimal',
          price: Number(workspacePrice) || 89000,
          inventory: 5,
          sku: `RWZ-WRK-${Date.now().toString().slice(-4)}`,
          material: workspaceMaterial.trim() || 'Solid Hardwood & Acoustic Wall Paneling',
          color: 'Studio Atelier Finish',
          dimensions: workspaceDimensions.trim() || '160cm × 75cm × 76cm',
          shortDescription: `Curated workspace atelier study crafted with ${workspaceMaterial.trim() || 'solid hardwoods and acoustic textures'}.`,
          description: `Engineered for deep focus, creative tranquility, and architectural serenity in executive home offices and reading libraries.`,
          careInstructions: 'Clean wood surfaces with damp lint-free cloth. Dust acoustic panels with soft vacuum brush.',
          featured: true,
          bestseller: false,
          isNew: true,
          rating: 5.0,
          reviewCount: 1,
          images: [finalImage]
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setProducts(prev => [data.data, ...prev]);
        setShowAddWorkspaceModal(false);
        setWorkspaceTitle('');
        setWorkspaceCustomImage('');
        showToast('Workspace piece added to collection!', 'success');
      } else {
        showToast(data.error || 'Failed to add workspace piece', 'error');
      }
    } catch (err: any) {
      showToast('Error adding workspace piece', 'error');
    } finally {
      setIsSubmittingWorkspace(false);
    }
  };

  // Category & Room options
  const categories = ['All', 'Furniture', 'Lighting', 'Wall Décor', 'Tables', 'Seating', 'Vases', 'Mirrors', 'Accessories'];
  const rooms = ['All', 'Living Room', 'Bedroom', 'Dining Room', 'Entryway', 'Workspace', 'Outdoor'];
  const moods = ['All', 'Warm Minimal', 'Modern Heritage', 'Earthy Living', 'Quiet Luxury'];

  useEffect(() => {
    if (initialFilter?.category) setSelectedCategory(initialFilter.category);
    if (initialFilter?.room) setSelectedRoom(initialFilter.room);
    if (initialFilter?.collection) setSelectedCollection(initialFilter.collection);
    if (initialFilter?.mood) setSelectedMood(initialFilter.mood);
    if (initialFilter?.filter === 'new') setSortBy('newest');
    if (initialFilter?.filter === 'bestseller') setSortBy('bestseller');
  }, [initialFilter]);

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedRoom !== 'All') params.append('room', selectedRoom);
        if (selectedCollection !== 'All') params.append('collection', selectedCollection);
        if (selectedMood !== 'All') params.append('mood', selectedMood);
        if (inStockOnly) params.append('inStock', 'true');
        if (priceRange < 100000) params.append('maxPrice', priceRange.toString());
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch filtered products', e);
      } finally {
        setLoading(false);
      }
    }
    fetchFiltered();
  }, [selectedCategory, selectedRoom, selectedCollection, selectedMood, inStockOnly, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedRoom('All');
    setSelectedCollection('All');
    setSelectedMood('All');
    setInStockOnly(false);
    setPriceRange(100000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedRoom !== 'All' ||
    selectedCollection !== 'All' ||
    selectedMood !== 'All' ||
    inStockOnly ||
    priceRange < 100000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left border-b border-[#EDE5DA] pb-8">
        <span className="text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
          The RIWAAZ Catalogue
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#25201C] mt-1">
          {selectedCategory !== 'All'
            ? selectedCategory
            : selectedRoom !== 'All'
            ? `${selectedRoom} Décor`
            : selectedCollection !== 'All'
            ? selectedCollection
            : 'All Collection Pieces'}
        </h1>
        {selectedCategory === 'Lighting' ? (
          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ambient Illumination & Architectural Luminaires</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                K9 faceted crystal ring chandeliers, triple-tier cascades, mouth-blown scalloped glass pendants, pierced Moradabad brass jaali floor lamps, hand-pleated diya light curtains, and IP65 weatherproof waterfall pavilions.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2] shrink-0">
              <span className="px-3 py-1.5 rounded-full bg-[#352B23] border border-[#BFA069]/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                <span>K9 Crystal & Murano Glass</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#352B23] border border-[#BFA069]/40">
                Pierced Jaali Brass
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#352B23] border border-[#BFA069]/40">
                IP65 Weatherproof Cascades
              </span>
            </div>
          </div>
        ) : (selectedCategory === 'Wall Décor' || selectedCategory === 'Wall Decor') ? (
          <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#241E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left text & craft tags */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Architectural Wall Sculptures, Reliefs & Kala Cotton Macramé</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                Heritage Wall Décor Gallery
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                13 museum-grade Indian masterworks — hand-beaten brass Kalpavriksha trees with crystal cluster foliage, turquoise verdigris lotus leaf sculptures, hand-hammered sunburst petal mirrors, Kutch Kala cotton diamond macramé shelves, and Jaipur glazed blue pottery tile galleries.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                  <span>Kalpavriksha Brass & Crystal</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Verdigris & Spun Brass
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Kala Cotton Macramé
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Jaipur Blue Ceramic
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddDecorModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Wall Image / Piece</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Wall Décor Preview Vignette */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                <img
                  src="/assets/aistudio/ww10_tree.jpg"
                  alt="Kalpavriksha Sacred Tree of Life Wall Sculpture"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Piece</span>
                  <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Kalpavriksha Tree</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/ww1_fbea5c60.jpg" alt="Lotus Leaf Sculpture" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/ww2_37808fa1.jpg" alt="Surya Petal Mirrors" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ) : selectedCategory === 'Furniture' ? (
          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#231E1A] text-[#FAF7F2] border border-[#BFA069]/35 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heirloom Architectural & Heritage Furniture</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                Mastercrafted living pieces in kiln-dried Indian Sheesham, reclaimed teak, tactile bouclé, and natural rattan cane. Featuring royal ceiling-hung Darbar jhulas with cast-brass elephant links, curved organic modular suites, and topographical contour tables.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2] shrink-0">
              <span className="px-3.5 py-1.5 rounded-full bg-[#362D25] border border-[#BFA069]/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                <span>Royal Heritage Jhulas</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#362D25] border border-[#BFA069]/40">
                Curved Bouclé Modulars
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#362D25] border border-[#BFA069]/40">
                100% Solid Hardwoods
              </span>
            </div>
          </div>
        ) : selectedCategory === 'Tables' ? (
          <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left text & craft tags */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Honed Carrara, Nero Marquina, Solid Sheesham & Cast Brass</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                Architectural Tables & Centrepieces
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                13 heirloom masterworks — pill-shaped fluted walnut tables with Carrara marble, solid Sheesham baithak tables with 4 nested stools, Spanish Nero Marquina cocktail plinths with hidden storage, biomorphic pebble plinths, and minimalist Statuario dining tables.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                  <span>Carrara & Fluted Walnut</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Sheesham 4-Stool Nested
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Nero Marquina & Gold
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Calacatta Gold Oval
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Statuario Wire Dining
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Table Piece / Image</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Tables Preview Vignette */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                <img
                  src="/assets/aistudio/tt1_fa575fea.jpg"
                  alt="Aarav Fluted Walnut & Honed Carrara Marble Coffee Table"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                  <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Aarav Fluted Walnut</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/tt7_c017338d.jpg" alt="Sheesh-Mahal Nero Marquina Table" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/tt9_e0fd9dd5.jpg" alt="Kuber Sculpted Gold Oval Table" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ) : selectedCategory === 'Seating' ? (
          <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left text & craft tags */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grand Salon Suites, Baithak Daybeds, Floor Futons & Lounge Loungers</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                Artisan Seating & Salon Sanctuary
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                11 mastercrafted seating suites — 3.4-meter fluted linen banquet sofas, neoclassical cerulean grand salon suites, organic Kala cotton floor baithaks with braided jute poufs, tufted majlis lounges, and custom bay-window daybeds with concealed storage.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                  <span>3.4m Fluted Banquet</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Cerulean Salon Suite
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Kala Cotton Baithak
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Tufted Majlis Lounge
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Bay-Window Daybed
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddSeatingModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Seating Piece / Image</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Seating Preview Vignette */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                <img
                  src="/assets/aistudio/ss10_c8705476.jpg"
                  alt="Darbar Extra-Long Fluted Linen Banquet Sofa"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                  <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Darbar Fluted Banquet</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/ss1_55a5ec5d.jpg" alt="Haveli Grand Salon Suite" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/ss6_199dd1e1.jpg" alt="Kyoto Corner Sectional" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ) : selectedCategory === 'Vases' ? (
          <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left text & craft tags */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fine Kaolin Porcelain, 24K Gold Wing Sculptures & Borosilicate Crystal</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                Artisan Vases & Botanical Vessels Gallery
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                17 collectible botanical art vessels — 24K gold wing imperial swans, sculpted gilded bust planters, 3D relief porcelain florals, floating rose crystal hurricanes, smoked teardrop mouth-blown glass, and acoustic preserved rose cloches.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                  <span>24K Gold Wing Swans</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Sculpted Gold Bust
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Mouth-Blown Smoked Glass
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Floating Rose Hurricanes
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Acoustic Cloche Dome
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddVaseModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Vase Piece / Image</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Vases Preview Vignette */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                <img
                  src="/assets/aistudio/vv9_03ea6ed0.jpg"
                  alt="Rajhans Imperial 24K Gold Wing Swan Vase Pair"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                  <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Rajhans Gold Swan Pair</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/vv2_12701ae3.jpg" alt="Devi Sculptural Gold Face Bust" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/vv5_bd4dca3e.jpg" alt="Amrit Floating Rose Hurricanes" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ) : selectedCategory === 'Mirrors' ? (
          <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left text & craft tags */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Architectural Halo Mirrors, Grand Brass Arches & Jharokha Trellis Jaali</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                Artisan Mirrors & Reflective Sanctuaries
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                17 collectible illuminated & heirloom mirrors — floating 360° halo vanities with suspended oak desks, 1.8m satin brass Mughal arch dressing mirrors, carved Sheesham jaali triptychs with shelves, Hollywood 12-globe studio tilt mirrors, and travel LED vanity cases.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                  <span>360° Halo Vanity Mirror</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  1.8m Brass Mughal Arch
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Carved Sheesham Jaali Trio
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Hollywood 12-Globe Studio
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  LED Travel Atelier Case
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddMirrorModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Mirror Piece / Image</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Mirrors Preview Vignette */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                <img
                  src="/assets/aistudio/mm10_5f3ba795.jpg"
                  alt="Chandra Floating Vanity Mirror with Halo Backlight & Oak Shelf"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                  <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Chandra Halo Vanity Suite</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/mm15_d8590e3e.jpg" alt="Meera Grand Brass Arch Floor Mirror" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/mm16_28efb11b.jpg" alt="Jharokha Carved Jaali Trio" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ) : selectedCategory === 'Accessories' ? (
          <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ambient gold glow decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Left text & craft tags */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-Forged Metal Sculptures, Kalpavriksha Trees & Enamelled Peacocks</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                Artisan Wall Accents & Heirlooms Gallery
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                12 museum-grade Indian accent installations — dual-ring gilded ginkgo lotus wall installations, golden Kalpavriksha banyans with songbirds, vitreous enamel royal peacock pairs with halo lighting, cast brass veranda planter arms, and backlit Bodhi tree sanctuary panels.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                  <span>Dual-Ring Ginkgo Lotus</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Kalpavriksha Banyan
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Enamel Royal Peacocks
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Cast Brass Veranda Arms
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                  Backlit Bodhi Sanctuary
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddAccessoryModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Accessory Piece / Image</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Accessories Preview Vignette */}
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                <img
                  src="/assets/aistudio/aa20_664be128.jpg"
                  alt="Svarnamalika Dual-Ring Ginkgo & Lotus Metal Wall Sculpture"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                  <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Svarnamalika Ginkgo Lotus</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/aa17_06aa20d8.jpg" alt="Neelkanth Royal Peacock Pair" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <img src="/assets/aistudio/aa19_170a1e5c.jpg" alt="Kalpavriksha Golden Tree of Abundance" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ) : (selectedRoom === 'Living Room' || selectedCategory === 'Living Room') ? (
          <div>
            <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Ambient gold glow decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Left text & craft tags */}
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Living Environments, Grand Salon Suites & Sculptural Plinths</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                  Living Room Sanctuaries & Salon Suites
                </h3>
                <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                  20 architectural masterworks & living room inspirations — double-height curved bouclé sectional suites, fluted walnut & Calacatta marble cocktail tables, royal emerald velvet sectionals, Kuro obsidian club lounges, K9 crystal triple-halo ring chandeliers, and serene bonsai atrium reading suites.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                    <span>Double-Height Bouclé</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Fluted Walnut Calacatta
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Royal Emerald Velvet
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Kuro Brass & Charcoal
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    3-Halo Crystal Chandelier
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddLivingRoomModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Living Room Piece / Image</span>
                  </button>
                </div>
              </div>

              {/* Right: Featured Living Room Preview Vignette */}
              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                  <img
                    src="/assets/aistudio/rr21_08065242.jpg"
                    alt="Grand Sculptural Brass & Charcoal Living Room Suite"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                    <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Grand Sculptural Suite</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col gap-2">
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/rr12_0e3f4ae3.jpg" alt="Indra Double-Height Curved Bouclé Suite" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/rr1_3269170f.jpg" alt="Malwa Cottage Washed Linen Baithak" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Living Room Select Section: Curated Image Inspirations Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#BFA069]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#25201C]">
                    Living Room Select Inspirations ({[
                      'rr12', 'rr13', 'rr9', 'rr20', 'rr19', 'rr17', 'rr15', 'rr1', 'rr16', 'rr7',
                      'rr2', 'rr3', 'rr4', 'rr5', 'rr6', 'rr8', 'rr10', 'rr14', 'rr18', 'rr21'
                    ].length} Presets Available)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLivingRoomModal(true)}
                  className="text-xs text-[#785A44] hover:text-[#25201C] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Curator Modal</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>

              {/* Horizontal Scrollable Preset Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {[
                  { label: 'Indra Bouclé', url: '/assets/aistudio/rr12_0e3f4ae3.jpg', price: '185000', cat: 'Seating', mat: 'Cloud Bouclé & Teak' },
                  { label: 'Nirvana Calacatta', url: '/assets/aistudio/rr13_3c4da6e3.jpg', price: '42500', cat: 'Tables', mat: 'Calacatta & Fluted Walnut' },
                  { label: 'Emerald Velvet', url: '/assets/aistudio/rr9_a8dbe345.jpg', price: '145000', cat: 'Seating', mat: 'Jewel Cotton Velvet & Brass' },
                  { label: 'Prana Minimal', url: '/assets/aistudio/rr20_5c9173e5.jpg', price: '98000', cat: 'Seating', mat: 'Slub Linen & Solid Oak' },
                  { label: 'Vana Zen Atrium', url: '/assets/aistudio/rr19_ce122d90.jpg', price: '56000', cat: 'Seating', mat: 'Wool Weave & Travertine' },
                  { label: 'Kuro Midnight', url: '/assets/aistudio/rr17_de05b96e.jpg', price: '168000', cat: 'Seating', mat: 'Obsidian Velvet & Beaten Brass' },
                  { label: 'Chandrakanta 3-Halo', url: '/assets/aistudio/rr15_cb4e3471.jpg', price: '89000', cat: 'Lighting', mat: 'K9 Optical Crystal & Brass' },
                  { label: 'Malwa Cottage', url: '/assets/aistudio/rr1_3269170f.jpg', price: '78000', cat: 'Seating', mat: 'Washed Linen & Seagrass' },
                  { label: 'Rajputana Settee', url: '/assets/aistudio/rr16_2827b174.jpg', price: '112000', cat: 'Furniture', mat: 'Teak Jharokha & Bouclé' },
                  { label: 'Mayura Sled Suite', url: '/assets/aistudio/rr7_8af2c8a7.jpg', price: '158000', cat: 'Seating', mat: 'Amber Velvet & Gold Rails' },
                  { label: 'Botanical Sage', url: '/assets/aistudio/rr2_bb8a9b23.jpg', price: '64000', cat: 'Seating', mat: 'Distressed Sage & Linen' },
                  { label: 'Grand Sculptural', url: '/assets/aistudio/rr21_08065242.jpg', price: '195000', cat: 'Furniture', mat: 'Charcoal Suite & Brass' },
                  { label: 'Slatted Timber', url: '/assets/aistudio/rr3_5f48397b.jpg', price: '135000', cat: 'Wall Décor', mat: 'Slatted Oak & Marble' },
                  { label: 'Japandi Baithak', url: '/assets/aistudio/rr4_7131bdbe.jpg', price: '72000', cat: 'Seating', mat: 'Low Platform Teak' },
                  { label: 'Organic Bouclé', url: '/assets/aistudio/rr5_928a3073.jpg', price: '84000', cat: 'Seating', mat: 'Curved Cream Bouclé' },
                  { label: 'Metropolitan Glass', url: '/assets/aistudio/rr6_3aeef0d2.jpg', price: '128000', cat: 'Seating', mat: 'Granite Grey Weave' },
                  { label: 'Travertine Plinth', url: '/assets/aistudio/rr8_ae20b627.jpg', price: '86000', cat: 'Tables', mat: 'Honed Travertine Table' },
                  { label: 'Emerald Fluted', url: '/assets/aistudio/rr10_2f5c6190.jpg', price: '38000', cat: 'Tables', mat: 'Fluted Wood Center Table' },
                  { label: 'Fluted Drum Plinth', url: '/assets/aistudio/rr14_52a50071.jpg', price: '41000', cat: 'Tables', mat: 'White Marble & Tambour' },
                  { label: 'Layered Botanical', url: '/assets/aistudio/rr18_0366e991.jpg', price: '48000', cat: 'Accessories', mat: 'Terracotta & Jute Ensemble' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setLivingRoomSelectedImage(preset.url);
                      setLivingRoomCustomImage('');
                      setLivingRoomTitle(preset.label);
                      setLivingRoomPrice(preset.price);
                      setLivingRoomCategory(preset.cat);
                      setLivingRoomMaterial(preset.mat);
                      setShowAddLivingRoomModal(true);
                    }}
                    className="group flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl bg-white border border-[#EDE5DA] hover:border-[#BFA069] hover:shadow-md transition-all duration-300 w-28 sm:w-32 text-center"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative mb-1.5">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#25201C]/80 text-[#FAF7F2] text-[8px] font-semibold">
                        ₹{Number(preset.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#25201C] group-hover:text-[#BFA069] truncate w-full">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-[#9E8F80] truncate w-full">
                      {preset.cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (selectedRoom === 'Dining Room' || selectedCategory === 'Dining Room') ? (
          <div>
            <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Ambient gold glow decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Left text & craft tags */}
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grand Banquet Suites, Architectural Dining Tables & Feast Sanctuaries</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                  Dining Room Sanctuaries & Banquet Suites
                </h3>
                <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                  20 heirloom dining suites & banquet inspirations — hand-carved solid teak live-edge slab tables, Italian Calacatta marble feast tables, crystal raindrop chandeliers, hammered gold pedestals, tailored velvet banquet armchairs, and breakfast banquette nooks.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                    <span>Royal Lion Ring Banquet</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Live-Edge Teak Slab
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Raindrop Crystal Chandelier
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Calacatta Brass Pedestal
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Bay-Window Breakfast Banquette
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddDiningRoomModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Dining Room Piece / Image</span>
                  </button>
                </div>
              </div>

              {/* Right: Featured Dining Room Preview Vignette */}
              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                  <img
                    src="/assets/aistudio/dd17_ca68cf99.jpg"
                    alt="Royal Circular Live-Edge Dining Suite with Lion Ring Chairs"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                    <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Royal Live-Edge Suite</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col gap-2">
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/dd16_193be8d1.jpg" alt="Raindrop Crystal Chandelier Suite" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/dd4_c82df8eb.jpg" alt="Courtyard Solid Teak Verandah Dining" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dining Room Select Section: Curated Image Inspirations Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#BFA069]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#25201C]">
                    Dining Room Select Inspirations (20 Presets Available)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDiningRoomModal(true)}
                  className="text-xs text-[#785A44] hover:text-[#25201C] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Curator Modal</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>

              {/* Horizontal Scrollable Preset Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {[
                  { label: 'Royal Lion Ring', url: '/assets/aistudio/dd17_ca68cf99.jpg', price: '165000', cat: 'Tables', mat: 'Live-Edge Wood & Crystal' },
                  { label: 'Raindrop Crystal', url: '/assets/aistudio/dd16_193be8d1.jpg', price: '185000', cat: 'Lighting', mat: 'Crystal Raindrop & Obsidian' },
                  { label: 'Courtyard Teak', url: '/assets/aistudio/dd4_c82df8eb.jpg', price: '125000', cat: 'Tables', mat: 'Solid Teak Slab & Brass' },
                  { label: 'Scarlet Penthouse', url: '/assets/aistudio/dd5_e22dc47e.jpg', price: '148000', cat: 'Seating', mat: 'Scarlet Velvet & Linear LED' },
                  { label: 'Mid-Century Cognac', url: '/assets/aistudio/dd6_ade01685.jpg', price: '135000', cat: 'Seating', mat: 'Cognac Velvet & Marble' },
                  { label: 'Rococo Statuario', url: '/assets/aistudio/dd7_4c096321.jpg', price: '198000', cat: 'Tables', mat: 'Statuario Marble & Mirror' },
                  { label: 'Rattan Verandah', url: '/assets/aistudio/dd8_fddff871.jpg', price: '89000', cat: 'Seating', mat: 'Light Oak & Woven Rattan' },
                  { label: 'Charcoal Tiered', url: '/assets/aistudio/dd9_27a41308.jpg', price: '175000', cat: 'Lighting', mat: 'Charcoal Plinths & Brass' },
                  { label: 'Chinoiserie Emerald', url: '/assets/aistudio/dd10_a2054700.jpg', price: '142000', cat: 'Seating', mat: 'Emerald Velvet & Timber' },
                  { label: 'Calacatta Tapered', url: '/assets/aistudio/dd11_5514654f.jpg', price: '115000', cat: 'Tables', mat: 'Calacatta & Bouclé' },
                  { label: 'Lantern Keyhole', url: '/assets/aistudio/dd12_45d57365.jpg', price: '98000', cat: 'Furniture', mat: 'Black Lacquer & Lantern' },
                  { label: 'Walnut Fluted', url: '/assets/aistudio/dd13_28457488.jpg', price: '108000', cat: 'Tables', mat: 'Solid Walnut & Wishbone' },
                  { label: 'Nordic Papercord', url: '/assets/aistudio/dd14_01bc93c7.jpg', price: '92000', cat: 'Seating', mat: 'Teak & Papercord Armchairs' },
                  { label: 'Organic Branch', url: '/assets/aistudio/dd15_7145c9b4.jpg', price: '155000', cat: 'Lighting', mat: 'Gilded Leaf Branches' },
                  { label: 'Trumpet Gold Drum', url: '/assets/aistudio/dd18_a34b8703.jpg', price: '138000', cat: 'Tables', mat: 'Hammered Brass & Marble' },
                  { label: 'Blush Geometric', url: '/assets/aistudio/dd19_6016ca52.jpg', price: '162000', cat: 'Seating', mat: 'Blush Tufting & Ring Rings' },
                  { label: 'Waterfall Quartz', url: '/assets/aistudio/dd20_05430a44.jpg', price: '128000', cat: 'Furniture', mat: 'Bleached Oak & Multi-Bulb' },
                  { label: 'Bay-Window Nook', url: '/assets/aistudio/dd22_2a77805e.jpg', price: '76000', cat: 'Tables', mat: 'Round Pedestal & Bistro' },
                  { label: 'Neoclassical Blue', url: '/assets/aistudio/dd2_3994d807.jpg', price: '145000', cat: 'Seating', mat: 'Polished Mahogany & Damask' },
                  { label: 'Country Ladderback', url: '/assets/aistudio/dd1_43bca05f.jpg', price: '85000', cat: 'Furniture', mat: '8-Seater Weathered Oak' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setDiningRoomSelectedImage(preset.url);
                      setDiningRoomCustomImage('');
                      setDiningRoomTitle(preset.label);
                      setDiningRoomPrice(preset.price);
                      setDiningRoomCategory(preset.cat);
                      setDiningRoomMaterial(preset.mat);
                      setShowAddDiningRoomModal(true);
                    }}
                    className="group flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl bg-white border border-[#EDE5DA] hover:border-[#BFA069] hover:shadow-md transition-all duration-300 w-28 sm:w-32 text-center"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative mb-1.5">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#25201C]/80 text-[#FAF7F2] text-[8px] font-semibold">
                        ₹{Number(preset.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#25201C] group-hover:text-[#BFA069] truncate w-full">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-[#9E8F80] truncate w-full">
                      {preset.cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (selectedRoom === 'Bedroom' || selectedCategory === 'Bedroom') ? (
          <div>
            <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#1F1916] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Ambient rose-gold and starlight glow decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8B482]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/25 rounded-full blur-2xl pointer-events-none" />

              {/* Left text & craft tags */}
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bedroom Sanctuaries, Dream Canopies & Celestial Suites</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                  Bedroom Sanctuaries & Restful Suites
                </h3>
                <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                  10 romantic bedroom suites & bedtime sanctuaries — circular domed canopy beds, royal blue tufted velvet headboards with fiber-optic starlight ceilings, sheer gossamer fairy light curtains, carved four-poster bridal suites, and organic linen floor platforms.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                    <span>Circular Sanctuary Bed</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Starry Sky Velvet Suite
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Boho Fairy Light Canopy
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Royal Bridal Four-Poster
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Blush Garland Alcove
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddBedroomModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bedroom Piece / Image</span>
                  </button>
                </div>
              </div>

              {/* Right: Featured Bedroom Preview Vignette */}
              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                  <img
                    src="/assets/aistudio/bb13_e1c43a33.jpg"
                    alt="Circular Sanctuary Luxury Bed with Domed Curtain Canopy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                    <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Circular Sanctuary Bed</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col gap-2">
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/bb18_b2d2b29f.jpg" alt="Celestial Starry Velvet Suite" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/bb12_5b223105.jpg" alt="Royal Bridal Sheesham Four-Poster" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bedroom Select Section: Curated Image Inspirations Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#BFA069]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#25201C]">
                    Bedroom Select Inspirations (10 Presets Available)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBedroomModal(true)}
                  className="text-xs text-[#785A44] hover:text-[#25201C] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Curator Modal</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>

              {/* Horizontal Scrollable Preset Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {[
                  { label: 'Celestial Velvet Penthouse', url: '/assets/aistudio/bb18_b2d2b29f.jpg', price: '185000', cat: 'Furniture', mat: 'Royal Blue Velvet & Starry Optic Ceiling' },
                  { label: 'Circular Sanctuary Bed', url: '/assets/aistudio/bb13_e1c43a33.jpg', price: '168000', cat: 'Furniture', mat: 'Circular Round Bed & Domed Canopy' },
                  { label: 'Royal Bridal Four-Poster', url: '/assets/aistudio/bb12_5b223105.jpg', price: '145000', cat: 'Furniture', mat: 'Carved Sheesham & Organza Canopy' },
                  { label: 'Champagne Glam Suite', url: '/assets/aistudio/bb11_88456fb7.jpg', price: '138000', cat: 'Furniture', mat: 'Tufted Champagne Silk & Mirrored Stands' },
                  { label: 'Blush Garland Alcove', url: '/assets/aistudio/bb14_65fe7de2.jpg', price: '98000', cat: 'Lighting', mat: 'Rose Floral Framing & Star Lights' },
                  { label: 'Lavender Dream Pavilion', url: '/assets/aistudio/bb19_c92cc82f.jpg', price: '112000', cat: 'Furniture', mat: 'Four-Poster Iron Canopy & Lilac Drapes' },
                  { label: 'Cozy Canopy String Lights', url: '/assets/aistudio/bb20_6c9934da.jpg', price: '72000', cat: 'Lighting', mat: 'Gossamer Canopy & Micro LED Cascades' },
                  { label: 'Boho Floor Bed Sanctuary', url: '/assets/aistudio/bb17_da4ec64a.jpg', price: '64000', cat: 'Furniture', mat: 'Low Platform Pine & Fairy Light Ivy' },
                  { label: 'Twilight Window Nook', url: '/assets/aistudio/bb16_bb849bdb.jpg', price: '58000', cat: 'Accessories', mat: 'Hanging Ivy Vines & Fairy Lights' },
                  { label: 'Organza Alcove Cocoon', url: '/assets/aistudio/bb15_8c48c9a3.jpg', price: '86000', cat: 'Lighting', mat: 'Twin Draped Netting & Amber Lights' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setBedroomSelectedImage(preset.url);
                      setBedroomCustomImage('');
                      setBedroomTitle(preset.label);
                      setBedroomPrice(preset.price);
                      setBedroomCategory(preset.cat);
                      setBedroomMaterial(preset.mat);
                      setShowAddBedroomModal(true);
                    }}
                    className="group flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl bg-white border border-[#EDE5DA] hover:border-[#BFA069] hover:shadow-md transition-all duration-300 w-28 sm:w-32 text-center"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative mb-1.5">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#25201C]/80 text-[#FAF7F2] text-[8px] font-semibold">
                        ₹{Number(preset.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#25201C] group-hover:text-[#BFA069] truncate w-full">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-[#9E8F80] truncate w-full">
                      {preset.cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (selectedRoom === 'Entryway' || selectedCategory === 'Entryway' || selectedCategory === 'Entryway Décor') ? (
          <div>
            <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Ambient gold glow decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Left text & craft tags */}
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Entryway Sanctuaries, Foyer Consoles & Welcome Torans</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                  Entryway Foyers & Arrival Sanctuaries
                </h3>
                <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                  17 architectural masterworks & entryway inspirations — cathedral arched windowpane mirrors, reclaimed timber trestle consoles with blossoming cherry urns, ceremonial floral portal torans, illuminated flagstone garden paths, and sculptural atrium bamboo palms.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                    <span>Cathedral Arch Mirror</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Grand Trestle Console
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Ceremonial Rose Toran
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Atrium Bamboo Palms
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Fluted Slat Wall
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddEntrywayModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Entryway Piece / Image</span>
                  </button>
                </div>
              </div>

              {/* Right: Featured Entryway Preview Vignette */}
              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                  <img
                    src="/assets/aistudio/EE18_73cef766.jpg"
                    alt="Chateau Grand Console & Blossom Urns"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                    <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Chateau Grand Console</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col gap-2">
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/EE19_8c088fc8.jpg" alt="Heritage Arch & Jute Runner Foyer" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/EE17_d0067f2f.jpg" alt="Maharaja Spiral Rotunda Foyer" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Entryway Select Section: Curated Image Inspirations Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#BFA069]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#25201C]">
                    Entryway Select Inspirations (17 Presets Available)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddEntrywayModal(true)}
                  className="text-xs text-[#785A44] hover:text-[#25201C] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Curator Modal</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>

              {/* Horizontal Scrollable Preset Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {[
                  { label: 'Heritage Arch & Jute Runner', url: '/assets/aistudio/EE19_8c088fc8.jpg', price: '68000', cat: 'Wall Décor', mat: 'Arched Windowpane Mirror & Natural Jute' },
                  { label: 'Chateau Grand Console', url: '/assets/aistudio/EE18_73cef766.jpg', price: '124000', cat: 'Furniture', mat: 'Reclaimed Timber Trestle & Oversized Urns' },
                  { label: 'Maharaja Spiral Rotunda', url: '/assets/aistudio/EE17_d0067f2f.jpg', price: '148000', cat: 'Furniture', mat: 'Round Mahogany Center Table & Crystal Chandelier' },
                  { label: 'Autumn Hearth Welcome', url: '/assets/aistudio/EE16_eabec5f7.jpg', price: '54000', cat: 'Accessories', mat: 'Rustic Console, Baskets & Amber Lanterns' },
                  { label: 'Serene Archway Bench Foyer', url: '/assets/aistudio/EE15_9cc66d73.jpg', price: '86000', cat: 'Furniture', mat: 'Arched French Mirror & Bouclé Bench' },
                  { label: 'Illuminated Slate Walkway', url: '/assets/aistudio/ee14_22fd5e29.jpg', price: '76000', cat: 'Lighting', mat: 'Natural Flagstone & Post Lanterns' },
                  { label: 'Rose & Jasmine Toran Portal', url: '/assets/aistudio/ee13_19a6c5fc.jpg', price: '42000', cat: 'Wall Décor', mat: 'Ceremonial Rose & Marigold Floral Archway' },
                  { label: 'Andalusian Carved Stone Portal', url: '/assets/aistudio/ee11_e9329950.jpg', price: '115000', cat: 'Wall Décor', mat: 'Carved Sandstone Arch & Iron Gate' },
                  { label: 'Cathedral Arch Gold Mirror', url: '/assets/aistudio/ee10_59d45bd4.jpg', price: '92000', cat: 'Furniture', mat: 'Cathedral Mirror & Fluted Pedestal' },
                  { label: 'Zen Modern Bamboo Plinths', url: '/assets/aistudio/ee9_4fdb23ab.jpg', price: '64000', cat: 'Accessories', mat: 'Dark Walnut Entry & Tiered Planters' },
                  { label: 'Staircase Botanical Gallery', url: '/assets/aistudio/ee8_ffa57b13.jpg', price: '38000', cat: 'Accessories', mat: 'White Ceramic Pots & Cascading Pothos' },
                  { label: 'Provençal Window Mirror', url: '/assets/aistudio/ee7_9cc66d73.jpg', price: '82000', cat: 'Furniture', mat: 'Windowpane Arch & Linen Bench' },
                  { label: 'Architectural Fluted Slat Wall', url: '/assets/aistudio/ee6_91ffa344.jpg', price: '98000', cat: 'Wall Décor', mat: 'Vertical Oak Slats & Backlit Mirror' },
                  { label: 'Warm Minimalist Pendant Nook', url: '/assets/aistudio/ee4_2e709369.jpg', price: '72000', cat: 'Lighting', mat: 'Arched Mullion Mirror & Glass Orb Pendant' },
                  { label: 'Harvest Double-Door Wreaths', url: '/assets/aistudio/ee3_550a87bb.jpg', price: '46000', cat: 'Accessories', mat: 'Autumn Wreaths & Heirloom Pumpkins' },
                  { label: 'Atrium Majesty Bamboo Palms', url: '/assets/aistudio/ee2_50ea25c8.jpg', price: '84000', cat: 'Accessories', mat: 'Twin Bamboo Palms in Sphere Planters' },
                  { label: 'Parisian Marble Console Settee', url: '/assets/aistudio/EE1_8a8dee9f.jpg', price: '96000', cat: 'Furniture', mat: 'Carrara Marble, Brass Frame & Hydrangea Urn' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setEntrywaySelectedImage(preset.url);
                      setEntrywayCustomImage('');
                      setEntrywayTitle(preset.label);
                      setEntrywayPrice(preset.price);
                      setEntrywayCategory(preset.cat);
                      setEntrywayMaterial(preset.mat);
                      setShowAddEntrywayModal(true);
                    }}
                    className="group flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl bg-white border border-[#EDE5DA] hover:border-[#BFA069] hover:shadow-md transition-all duration-300 w-28 sm:w-32 text-center"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative mb-1.5">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#25201C]/80 text-[#FAF7F2] text-[8px] font-semibold">
                        ₹{Number(preset.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#25201C] group-hover:text-[#BFA069] truncate w-full">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-[#9E8F80] truncate w-full">
                      {preset.cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (selectedRoom === 'Workspace' || selectedCategory === 'Workspace' || selectedCategory === 'Workspace Décor') ? (
          <div>
            <div className="mt-4 p-5 sm:p-7 rounded-3xl bg-[#231E19] text-[#FAF7F2] border border-[#BFA069]/40 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Ambient gold glow decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFA069]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#785A44]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Left text & craft tags */}
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Workspace Studies, Biophilic Moss Walls & Executive Desks</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF7F2] mt-1.5">
                  Workspace Décor & Atelier Study Sanctuaries
                </h3>
                <p className="text-xs sm:text-sm text-[#D8C7B5] mt-1.5 max-w-xl font-light leading-relaxed">
                  20 architectural masterworks & workspace inspirations — acoustic fluted wood slat executive desks, floor-to-ceiling illuminated walnut library studies, living preserved moss art panels, monolithic waterfall quartz stone tables, and botanical garden window nooks.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#FAF7F2]">
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
                    <span>Acoustic Fluted Slat Desk</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Living Moss Art Panel
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Illuminated Library
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Waterfall Stone Desk
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#382E26] border border-[#BFA069]/40">
                    Botanical Window Nook
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddWorkspaceModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#BFA069] text-[#25201C] font-semibold hover:bg-[#d4b476] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Workspace Piece / Image</span>
                  </button>
                </div>
              </div>

              {/* Right: Featured Workspace Preview Vignette */}
              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <div className="relative w-40 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#BFA069]/50 shadow-lg group">
                  <img
                    src="/assets/aistudio/ww15_f949cd5f.jpg"
                    alt="Acoustic Fluted Slat Executive Desk"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-semibold text-[#E5B869] uppercase tracking-wider">Spotlight Design</span>
                    <span className="text-[11px] text-[#FAF7F2] font-medium leading-tight truncate">Acoustic Slat Desk</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col gap-2">
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/ww6_aa4866e9.jpg" alt="Living Moss Wall Studio" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-20 aspect-square rounded-xl overflow-hidden border border-[#EDE5DA]/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/assets/aistudio/ww18_1f1ae22c.jpg" alt="Illuminated Walnut Library" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Workspace Select Section: Curated Image Inspirations Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F5EFEB] border border-[#EDE5DA] shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#BFA069]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#25201C]">
                    Workspace Select Inspirations (20 Presets Available)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddWorkspaceModal(true)}
                  className="text-xs text-[#785A44] hover:text-[#25201C] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Curator Modal</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>

              {/* Horizontal Scrollable Preset Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {[
                  { label: 'Botanical Window Library', url: '/assets/aistudio/ww20_a4a17a7b.jpg', price: '89000', cat: 'Tables', mat: 'Oak Window Desk & Ceramic Lamp' },
                  { label: 'Crittall Glass Atelier', url: '/assets/aistudio/ww19_20a9df89.jpg', price: '195000', cat: 'Furniture', mat: 'Steel Smoked Glass & Bouclé Sectional' },
                  { label: 'Illuminated Walnut Study', url: '/assets/aistudio/ww18_1f1ae22c.jpg', price: '175000', cat: 'Furniture', mat: 'Backlit Walnut Shelving & Emerald Wing' },
                  { label: 'Terrace Penthouse Study', url: '/assets/aistudio/ww17_a12bcf65.jpg', price: '132000', cat: 'Furniture', mat: 'Honed Marble Work Table & Balcony View' },
                  { label: 'Golden Feather Sconce Art', url: '/assets/aistudio/ww16_0ef78177.jpg', price: '48000', cat: 'Wall Décor', mat: 'Sculpted Gold Leaf Feather & Warm LEDs' },
                  { label: 'Acoustic Fluted Slat Desk', url: '/assets/aistudio/ww15_f949cd5f.jpg', price: '118000', cat: 'Tables', mat: 'Charcoal Slat Acoustic Wall & Oak Desk' },
                  { label: 'Triangular Corner Alcove', url: '/assets/aistudio/ww14_5d2701e9.jpg', price: '62000', cat: 'Lighting', mat: 'Floating Triangle Desk & Edge Light' },
                  { label: 'Nordic Trestle & Mountain Art', url: '/assets/aistudio/ww13_0dfe5856.jpg', price: '78000', cat: 'Tables', mat: 'Solid Ash Trestles & Mountain Canvas' },
                  { label: 'Architectural Grid Studio', url: '/assets/aistudio/ww12_1bc9bfeb.jpg', price: '84000', cat: 'Wall Décor', mat: 'Navy Geometric Wall & Walnut Round Table' },
                  { label: 'White Library Landscape Nook', url: '/assets/aistudio/ww11_0d5ca3f6.jpg', price: '112000', cat: 'Tables', mat: 'Built-in Desk & Line Landscape Art' },
                  { label: 'Vintage Executive Heritage', url: '/assets/aistudio/ww10_5702635c.jpg', price: '185000', cat: 'Furniture', mat: 'River Mural, Sheesham & Chesterfield' },
                  { label: 'Emerald Shiplap Botanical Desk', url: '/assets/aistudio/ww9_db4bb014.jpg', price: '74000', cat: 'Tables', mat: 'Forest Green Shiplap & Pothos Shelves' },
                  { label: 'Corner High-Rise Executive', url: '/assets/aistudio/ww8_1ce020b0.jpg', price: '128000', cat: 'Tables', mat: 'Walnut Executive Desk & Leather Lounge' },
                  { label: 'Colonial Peacock Teal Studio', url: '/assets/aistudio/ww7_eb37aecc.jpg', price: '94000', cat: 'Tables', mat: 'Peacock Teal Walls & Cane Pedestal Desk' },
                  { label: 'Living Moss Wall Studio', url: '/assets/aistudio/ww6_aa4866e9.jpg', price: '145000', cat: 'Wall Décor', mat: 'Vertical Living Moss & Maple Study Bench' },
                  { label: 'Waterfall Quartz Stone Desk', url: '/assets/aistudio/ww5_848a319c.jpg', price: '158000', cat: 'Tables', mat: 'Engineered Quartz Stone & Bouclé Swivel' },
                  { label: 'Blush Floating Shelf Studio', url: '/assets/aistudio/ww4_e8f69582.jpg', price: '58000', cat: 'Tables', mat: 'White Gloss Desk & Floral Canvas Art' },
                  { label: 'Aranya Preserved Moss Panel', url: '/assets/aistudio/ww3_aaf598e3.jpg', price: '110000', cat: 'Wall Décor', mat: '3D Topographical Moss & Oak Frame' },
                  { label: 'Prakriti Biophilic Study', url: '/assets/aistudio/ww2_fe415729.jpg', price: '82000', cat: 'Tables', mat: 'Seasoned Sheesham & Live Palms' },
                  { label: 'Himalaya Triptych Matte Desk', url: '/assets/aistudio/ww1_578cc510.jpg', price: '72000', cat: 'Wall Décor', mat: 'Matte Charcoal Desk & Ink Mountain Canvas' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setWorkspaceSelectedImage(preset.url);
                      setWorkspaceCustomImage('');
                      setWorkspaceTitle(preset.label);
                      setWorkspacePrice(preset.price);
                      setWorkspaceCategory(preset.cat);
                      setWorkspaceMaterial(preset.mat);
                      setShowAddWorkspaceModal(true);
                    }}
                    className="group flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl bg-white border border-[#EDE5DA] hover:border-[#BFA069] hover:shadow-md transition-all duration-300 w-28 sm:w-32 text-center"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative mb-1.5">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#25201C]/80 text-[#FAF7F2] text-[8px] font-semibold">
                        ₹{Number(preset.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#25201C] group-hover:text-[#BFA069] truncate w-full">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-[#9E8F80] truncate w-full">
                      {preset.cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#785A44] mt-2 max-w-xl font-light">
            Each piece is crafted by Indian artisans in solid hardwoods, natural brass, wheel-thrown ceramics, and organic loomed fibers.
          </p>
        )}
      </div>

      {/* Controls Bar: Results count, Active tags, Sort & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EDE5DA]">
        
        {/* Left: Filter Toggle & Results Count */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2 bg-[#F5EFEB] border border-[#EDE5DA] rounded-lg text-xs font-medium text-[#25201C] flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA069]" />
            )}
          </button>

          <span className="text-xs text-[#785A44] font-medium">
            Showing <span className="font-semibold text-[#25201C] tabular-nums">{products.length}</span> {products.length === 1 ? 'piece' : 'pieces'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#785A44] hover:text-[#25201C] flex items-center gap-1 underline decoration-dotted transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="sort-select" className="text-[#785A44] whitespace-nowrap">Sort by:</label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#F5EFEB] border border-[#EDE5DA] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#25201C] focus:outline-none focus:border-[#785A44]"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="bestseller">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#785A44] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Main Layout: Sidebar Left (Desktop) + Product Grid Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-4 border-r border-[#EDE5DA]">
          
          {/* Category Filter */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold mb-3">
              Category
            </h3>
            <div className="space-y-1.5 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#25201C] text-[#FAF7F2] font-semibold'
                      : 'text-[#4A3B31] hover:text-[#25201C] hover:bg-[#F5EFEB]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Room Filter */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold mb-3">
              Room
            </h3>
            <div className="space-y-1.5 text-xs">
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                    selectedRoom === room
                      ? 'bg-[#25201C] text-[#FAF7F2] font-semibold'
                      : 'text-[#4A3B31] hover:text-[#25201C] hover:bg-[#F5EFEB]'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold mb-3">
              Atmospheric Mood
            </h3>
            <div className="space-y-1.5 text-xs">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                    selectedMood === mood
                      ? 'bg-[#25201C] text-[#FAF7F2] font-semibold'
                      : 'text-[#4A3B31] hover:text-[#25201C] hover:bg-[#F5EFEB]'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold">
                Maximum Price
              </h3>
              <span className="text-xs font-semibold text-[#25201C] tabular-nums font-sans">
                ₹{priceRange.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#BFA069] cursor-pointer"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3B31]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#EDE5DA] text-[#25201C] focus:ring-0 accent-[#25201C]"
              />
              <span>In-Stock Ready to Dispatch</span>
            </label>
          </div>

        </aside>

        {/* Product Grid (Desktop 3/4 cols, Tablet 3, Mobile 2) */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="py-24 text-center text-xs text-[#785A44]">
              Updating collection...
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#EDE5DA] rounded-2xl p-8 bg-[#F7F2EC]">
              <h3 className="font-serif text-2xl font-medium text-[#25201C]">No pieces found</h3>
              <p className="text-xs text-[#785A44] mt-2 max-w-sm mx-auto">
                No items match your active combination of filters. Try broadening your criteria or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded-lg uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch transition-all duration-300 ${
              selectedCategory === 'Lighting'
                ? 'p-3 sm:p-5.5 rounded-2xl bg-[#F8F4EE]/90 border border-[#E7DDD0] shadow-xs ring-1 ring-[#D8C7B5]/30 gap-6 sm:gap-7'
                : (selectedCategory === 'Wall Décor' || selectedCategory === 'Wall Decor')
                ? 'p-4 sm:p-6 lg:p-7 rounded-3xl bg-gradient-to-b from-[#FAF5EE] via-[#F8F2E8] to-[#F5ECE0] border border-[#E4D7C8] shadow-[0_12px_36px_-10px_rgba(110,85,60,0.09)] ring-1 ring-[#D8C7B5]/40 gap-6 sm:gap-7'
                : selectedCategory === 'Furniture'
                ? 'p-3 sm:p-5.5 rounded-2xl bg-[#F8F3ED]/90 border border-[#E7DDD0] shadow-xs ring-1 ring-[#D8C7B5]/25 gap-6 sm:gap-7'
                : ''
            }`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                />
              ))}

              {/* Add Custom Wall Décor Piece / Upload Image Card */}
              {(selectedCategory === 'Wall Décor' || selectedCategory === 'Wall Decor') && (
                <div
                  onClick={() => setShowAddDecorModal(true)}
                  className="group relative flex flex-col items-center justify-center min-h-[380px] p-6 rounded-xl border-2 border-dashed border-[#D4C6B7] bg-[#F7F2EC]/80 hover:bg-[#FAF7F2] hover:border-[#BFA069] transition-all duration-300 cursor-pointer text-center shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EDE5DA] group-hover:bg-[#25201C] group-hover:text-[#FAF7F2] text-[#785A44] flex items-center justify-center transition-colors duration-300 mb-4 shadow-xs">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#25201C] group-hover:text-[#BFA069] transition-colors">
                    Add Wall Décor Piece
                  </h4>
                  <p className="text-xs text-[#785A44] mt-2 max-w-xs leading-relaxed font-light">
                    Add another wall sculpture or relief art piece with custom image, dimensions, and craft description.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase group-hover:bg-[#BFA069] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}

              {/* Add Custom Living Room Piece Card */}
              {selectedRoom === 'Living Room' && (
                <div
                  onClick={() => setShowAddLivingRoomModal(true)}
                  className="group relative flex flex-col items-center justify-center min-h-[380px] p-6 rounded-xl border-2 border-dashed border-[#D4C6B7] bg-[#F7F2EC]/80 hover:bg-[#FAF7F2] hover:border-[#BFA069] transition-all duration-300 cursor-pointer text-center shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EDE5DA] group-hover:bg-[#25201C] group-hover:text-[#FAF7F2] text-[#785A44] flex items-center justify-center transition-colors duration-300 mb-4 shadow-xs">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#25201C] group-hover:text-[#BFA069] transition-colors">
                    Add Living Room Piece
                  </h4>
                  <p className="text-xs text-[#785A44] mt-2 max-w-xs leading-relaxed font-light">
                    Curate a luxury seating suite, fluted cocktail table, or living room inspiration with custom dimensions & imagery.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase group-hover:bg-[#BFA069] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>
                </div>
              )}

              {/* Add Custom Dining Room Piece Card */}
              {selectedRoom === 'Dining Room' && (
                <div
                  onClick={() => setShowAddDiningRoomModal(true)}
                  className="group relative flex flex-col items-center justify-center min-h-[380px] p-6 rounded-xl border-2 border-dashed border-[#D4C6B7] bg-[#F7F2EC]/80 hover:bg-[#FAF7F2] hover:border-[#BFA069] transition-all duration-300 cursor-pointer text-center shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EDE5DA] group-hover:bg-[#25201C] group-hover:text-[#FAF7F2] text-[#785A44] flex items-center justify-center transition-colors duration-300 mb-4 shadow-xs">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#25201C] group-hover:text-[#BFA069] transition-colors">
                    Add Dining Room Piece
                  </h4>
                  <p className="text-xs text-[#785A44] mt-2 max-w-xs leading-relaxed font-light">
                    Curate a banquet feast table, live-edge teak slab, crystal chandelier, or dining room inspiration with custom imagery.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase group-hover:bg-[#BFA069] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>
                </div>
              )}

              {/* Add Custom Bedroom Piece Card */}
              {selectedRoom === 'Bedroom' && (
                <div
                  onClick={() => setShowAddBedroomModal(true)}
                  className="group relative flex flex-col items-center justify-center min-h-[380px] p-6 rounded-xl border-2 border-dashed border-[#D4C6B7] bg-[#F7F2EC]/80 hover:bg-[#FAF7F2] hover:border-[#BFA069] transition-all duration-300 cursor-pointer text-center shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EDE5DA] group-hover:bg-[#25201C] group-hover:text-[#FAF7F2] text-[#785A44] flex items-center justify-center transition-colors duration-300 mb-4 shadow-xs">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#25201C] group-hover:text-[#BFA069] transition-colors">
                    Add Bedroom Piece
                  </h4>
                  <p className="text-xs text-[#785A44] mt-2 max-w-xs leading-relaxed font-light">
                    Curate a circular canopy bed, starry velvet suite, fairy light drape, or bedroom sanctuary with custom imagery.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase group-hover:bg-[#BFA069] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>
                </div>
              )}

              {/* Add Custom Entryway Piece Card */}
              {selectedRoom === 'Entryway' && (
                <div
                  onClick={() => setShowAddEntrywayModal(true)}
                  className="group relative flex flex-col items-center justify-center min-h-[380px] p-6 rounded-xl border-2 border-dashed border-[#D4C6B7] bg-[#F7F2EC]/80 hover:bg-[#FAF7F2] hover:border-[#BFA069] transition-all duration-300 cursor-pointer text-center shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EDE5DA] group-hover:bg-[#25201C] group-hover:text-[#FAF7F2] text-[#785A44] flex items-center justify-center transition-colors duration-300 mb-4 shadow-xs">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#25201C] group-hover:text-[#BFA069] transition-colors">
                    Add Entryway Piece
                  </h4>
                  <p className="text-xs text-[#785A44] mt-2 max-w-xs leading-relaxed font-light">
                    Curate a fluted console, architectural foyer mirror, brass planter, or welcoming bench with custom imagery.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase group-hover:bg-[#BFA069] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>
                </div>
              )}

              {/* Add Custom Workspace Piece Card */}
              {selectedRoom === 'Workspace' && (
                <div
                  onClick={() => setShowAddWorkspaceModal(true)}
                  className="group relative flex flex-col items-center justify-center min-h-[380px] p-6 rounded-xl border-2 border-dashed border-[#D4C6B7] bg-[#F7F2EC]/80 hover:bg-[#FAF7F2] hover:border-[#BFA069] transition-all duration-300 cursor-pointer text-center shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EDE5DA] group-hover:bg-[#25201C] group-hover:text-[#FAF7F2] text-[#785A44] flex items-center justify-center transition-colors duration-300 mb-4 shadow-xs">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#25201C] group-hover:text-[#BFA069] transition-colors">
                    Add Workspace Piece
                  </h4>
                  <p className="text-xs text-[#785A44] mt-2 max-w-xs leading-relaxed font-light">
                    Curate an executive teak desk, acoustic slat study nook, library credenza, or atelier chair with custom imagery.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase group-hover:bg-[#BFA069] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Slide-Out Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-[#25201C]/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#FAF7F2] p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                  <h3 className="font-serif text-xl font-semibold text-[#25201C]">Filter Collection</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-5 h-5 text-[#785A44]" />
                  </button>
                </div>

                {/* Category Mobile */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold mb-2">Category</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={`px-2.5 py-1 text-xs rounded border ${
                          selectedCategory === c ? 'bg-[#25201C] text-[#FAF7F2]' : 'bg-[#F7F2EC] text-[#4A3B31]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room Mobile */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#785A44] font-semibold mb-2">Room</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {rooms.map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRoom(r)}
                        className={`px-2.5 py-1 text-xs rounded border ${
                          selectedRoom === r ? 'bg-[#25201C] text-[#FAF7F2]' : 'bg-[#F7F2EC] text-[#4A3B31]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Mobile */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#785A44] uppercase font-semibold">Max Price</span>
                    <span className="font-semibold text-[#25201C]">₹{priceRange.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="100000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#BFA069]"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#EDE5DA] space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-[#25201C] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg"
                >
                  Apply Filters ({products.length})
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full py-2 bg-transparent text-[#785A44] text-xs font-medium"
                >
                  Reset All
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Add Custom Wall Décor Piece / Upload Image Modal */}
      {showAddDecorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#25201C]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddDecorModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-[#FAF7F2] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE5DA] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curate Wall Décor</span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-0.5">
                    Add Wall Piece / Image
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDecorModal(false)}
                  className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#785A44] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddDecorPiece} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Piece Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={decorTitle}
                    onChange={(e) => setDecorTitle(e.target.value)}
                    placeholder="e.g. Pichwai Lotus Handwoven Gold Tapestry"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] placeholder:text-[#9E8F80] focus:outline-none focus:border-[#BFA069] focus:ring-1 focus:ring-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={decorPrice}
                      onChange={(e) => setDecorPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={decorDimensions}
                      onChange={(e) => setDecorDimensions(e.target.value)}
                      placeholder="e.g. 80cm × 80cm × 5cm"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Material & Craft Technique
                  </label>
                  <input
                    type="text"
                    value={decorMaterial}
                    onChange={(e) => setDecorMaterial(e.target.value)}
                    placeholder="e.g. 24K Gold Leaf & Reclaimed Seasoned Teak"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Wall Décor Image or Upload Custom
                  </label>

                  {/* Preset Thumbnails */}
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Kalpavriksha Tree', url: '/assets/aistudio/ww10_tree.jpg' },
                      { label: 'Lotus Leaf', url: '/assets/aistudio/ww1_fbea5c60.jpg' },
                      { label: 'Sunburst Trio', url: '/assets/aistudio/ww2_37808fa1.jpg' },
                      { label: 'Barasingha Stag', url: '/assets/aistudio/ww3_e3c75c38.jpg' },
                      { label: 'Jaipur Tiles', url: '/assets/aistudio/ww4_6b895031.jpg' },
                      { label: 'Arched Panels', url: '/assets/aistudio/ww5_f908eb0a.jpg' },
                      { label: 'Kathputli Trio', url: '/assets/aistudio/ww6_7b1f056c.webp' },
                      { label: 'Macramé Pine', url: '/assets/aistudio/ww6_e6bcc859.jpg' },
                      { label: 'Diamond Macramé', url: '/assets/aistudio/ww9_253e0b2a.jpg' },
                      { label: 'Tanjore Gold', url: '/images/wall_decor_tanjore_lotus.jpg' },
                      { label: 'Makrana Marble', url: '/images/wall_decor_makrana_marble_jali.jpg' },
                      { label: 'Dhokra Bronze', url: '/images/wall_decor_dhokra_brass_sculpture.jpg' },
                      { label: 'Surya Mandala', url: '/images/wall_decor_brass_mandala.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setDecorSelectedImage(img.url);
                          setDecorCustomImage('');
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          decorSelectedImage === img.url && !decorCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/80 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setDecorCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={decorCustomImage.startsWith('data:') ? '' : decorCustomImage}
                      onChange={(e) => setDecorCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {decorCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={decorCustomImage}
                          alt="Custom upload preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom image selected for upload
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDecorModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDecor}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingDecor ? 'Adding Piece...' : 'Add to Wall Décor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Table Piece / Upload Image Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#25201C]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddTableModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-[#FAF7F2] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE5DA] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curate Tables</span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-0.5">
                    Add Table Piece / Image
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#785A44] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddTablePiece} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Table Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={tableTitle}
                    onChange={(e) => setTableTitle(e.target.value)}
                    placeholder="e.g. Aarav Fluted Walnut & Honed Carrara Coffee Table"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] placeholder:text-[#9E8F80] focus:outline-none focus:border-[#BFA069] focus:ring-1 focus:ring-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={tablePrice}
                      onChange={(e) => setTablePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={tableDimensions}
                      onChange={(e) => setTableDimensions(e.target.value)}
                      placeholder="e.g. 120cm × 60cm × 42cm"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Material & Stone / Timber Craft
                  </label>
                  <input
                    type="text"
                    value={tableMaterial}
                    onChange={(e) => setTableMaterial(e.target.value)}
                    placeholder="e.g. Honed Carrara Marble & American Walnut"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Table Design or Upload Custom
                  </label>

                  {/* Preset Thumbnails */}
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Fluted Walnut', url: '/assets/aistudio/tt1_fa575fea.jpg' },
                      { label: 'Nested Stools', url: '/assets/aistudio/tt2_5e2ebaee.jpg' },
                      { label: 'Tiered Pebble', url: '/assets/aistudio/tt3_a841802a.jpg' },
                      { label: 'Tufted Velvet', url: '/assets/aistudio/tt4_1ff0ffd9.jpg' },
                      { label: 'Brass Slat & Marble', url: '/assets/aistudio/tt5_43c31fa2.jpg' },
                      { label: 'Yin-Yang Swivel', url: '/assets/aistudio/tt6_f9415148.jpg' },
                      { label: 'Nero Marquina', url: '/assets/aistudio/tt7_c017338d.jpg' },
                      { label: 'Offset Walnut', url: '/assets/aistudio/tt8_4564a4f5.jpg' },
                      { label: 'Calacatta Gold', url: '/assets/aistudio/tt9_e0fd9dd5.jpg' },
                      { label: 'Wire Cage Cone', url: '/assets/aistudio/tt10_670ed757.jpg' },
                      { label: 'Wire Dining Set', url: '/assets/aistudio/tt11_dff3045e.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setTableSelectedImage(img.url);
                          setTableCustomImage('');
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          tableSelectedImage === img.url && !tableCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/80 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setTableCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={tableCustomImage.startsWith('data:') ? '' : tableCustomImage}
                      onChange={(e) => setTableCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {tableCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={tableCustomImage}
                          alt="Custom table preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom table image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTableModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingTable}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingTable ? 'Adding Table...' : 'Add to Tables'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Seating Piece / Upload Image Modal */}
      {showAddSeatingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#25201C]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddSeatingModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-[#FAF7F2] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE5DA] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#BFA069] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curate Seating & Lounges</span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-0.5">
                    Add Seating Piece / Image
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSeatingModal(false)}
                  className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#785A44] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddSeatingPiece} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Seating Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={seatingTitle}
                    onChange={(e) => setSeatingTitle(e.target.value)}
                    placeholder="e.g. Darbar Extra-Long Fluted Linen Banquet Sofa"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] placeholder:text-[#9E8F80] focus:outline-none focus:border-[#BFA069] focus:ring-1 focus:ring-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={seatingPrice}
                      onChange={(e) => setSeatingPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={seatingDimensions}
                      onChange={(e) => setSeatingDimensions(e.target.value)}
                      placeholder="e.g. 240cm × 95cm × 85cm"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Material & Upholstery Craft
                  </label>
                  <input
                    type="text"
                    value={seatingMaterial}
                    onChange={(e) => setSeatingMaterial(e.target.value)}
                    placeholder="e.g. Belgian Linen, Solid Sheesham & Goose Down"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Seating Arrangement or Upload Custom
                  </label>

                  {/* Preset Thumbnails */}
                  <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 mb-3">
                    {[
                      { label: 'Grand Salon', url: '/assets/aistudio/ss1_55a5ec5d.jpg' },
                      { label: 'Floor Futon', url: '/assets/aistudio/ss2_93f587ac.jpg' },
                      { label: 'Majlis Lounge', url: '/assets/aistudio/ss3_8567e6d2.jpg' },
                      { label: 'Bay Banquette', url: '/assets/aistudio/ss4_270dee77.jpg' },
                      { label: 'Wing Chairs', url: '/assets/aistudio/ss5_ac14e8fa.jpg' },
                      { label: 'Low Sectional', url: '/assets/aistudio/ss6_199dd1e1.jpg' },
                      { label: 'Window Daybed', url: '/assets/aistudio/ss7_040d4e86.jpg' },
                      { label: 'Hammock Swing', url: '/assets/aistudio/ss8_50d74264.jpg' },
                      { label: 'Ivory Atelier', url: '/assets/aistudio/ss9_f2e43a9a.jpg' },
                      { label: 'Fluted Banquet', url: '/assets/aistudio/ss10_c8705476.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setSeatingSelectedImage(img.url);
                          setSeatingCustomImage('');
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          seatingSelectedImage === img.url && !seatingCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/80 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setSeatingCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={seatingCustomImage.startsWith('data:') ? '' : seatingCustomImage}
                      onChange={(e) => setSeatingCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {seatingCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={seatingCustomImage}
                          alt="Custom seating preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom seating image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSeatingModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingSeating}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingSeating ? 'Adding Seating...' : 'Add to Seating'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Vase Piece Modal */}
      {showAddVaseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE5DA] overflow-hidden my-8">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA069]">
                    Artisan Botanical Vessel Curation
                  </span>
                  <h3 className="font-serif text-2xl text-[#25201C] font-normal mt-0.5">
                    Curate a New Vase / Vessel
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddVaseModal(false)}
                  className="p-1 rounded-full text-[#785A44] hover:text-[#25201C] hover:bg-[#F5EFEB] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVasePiece} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Vessel Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={vaseTitle}
                    onChange={(e) => setVaseTitle(e.target.value)}
                    placeholder="e.g. Rajhans Imperial 24K Gold Wing Swan Vase Pair"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={vasePrice}
                      onChange={(e) => setVasePrice(e.target.value)}
                      placeholder="7800"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={vaseDimensions}
                      onChange={(e) => setVaseDimensions(e.target.value)}
                      placeholder="e.g. 28cm H × 14cm Ø"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Material & Craft Technique
                  </label>
                  <input
                    type="text"
                    value={vaseMaterial}
                    onChange={(e) => setVaseMaterial(e.target.value)}
                    placeholder="e.g. Glazed Kaolin Porcelain & 24K Gold Detailing"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Vase Preset or Upload Custom Image
                  </label>

                  {/* Preset Thumbnails */}
                  <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 mb-3">
                    {[
                      { label: 'Gold Swans', url: '/assets/aistudio/vv9_03ea6ed0.jpg' },
                      { label: 'White Trio', url: '/assets/aistudio/vv1_ab318524.jpg' },
                      { label: 'Gold Face Bust', url: '/assets/aistudio/vv2_12701ae3.jpg' },
                      { label: 'Relief Peony', url: '/assets/aistudio/vv3_4623a54f.jpg' },
                      { label: 'Parijat 3D', url: '/assets/aistudio/vv4_3eb41fa9.jpg' },
                      { label: 'Floating Rose', url: '/assets/aistudio/vv5_bd4dca3e.jpg' },
                      { label: 'Bear Plinth', url: '/assets/aistudio/vv6_4cf37eb1.jpg' },
                      { label: 'Carriage Cart', url: '/assets/aistudio/vv7_b9f6e625.jpg' },
                      { label: 'Smoked Glass', url: '/assets/aistudio/vv8_8f5c78dc.jpg' },
                      { label: 'Fluted Glass', url: '/assets/aistudio/vv10_28b55cd0.jpg' },
                      { label: 'Pedestal Bowl', url: '/assets/aistudio/vv11_0035591a.jpg' },
                      { label: 'Fairy Jar', url: '/assets/aistudio/vv12_6645c174.jpg' },
                      { label: 'Rose Cloche', url: '/assets/aistudio/vv14_d8d987ef.jpg' },
                      { label: 'Vintage Lantern', url: '/assets/aistudio/vv15_52ac4875.jpg' },
                      { label: 'Crimson Bell', url: '/assets/aistudio/vv16_33e21caf.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setVaseSelectedImage(img.url);
                          setVaseCustomImage('');
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          vaseSelectedImage === img.url && !vaseCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/80 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setVaseCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={vaseCustomImage.startsWith('data:') ? '' : vaseCustomImage}
                      onChange={(e) => setVaseCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {vaseCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={vaseCustomImage}
                          alt="Custom vase preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom vase image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddVaseModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingVase}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingVase ? 'Adding Vase...' : 'Add to Vases'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Mirror Piece Modal */}
      {showAddMirrorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE5DA] overflow-hidden my-8">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA069]">
                    Artisan Reflective Mirror Curation
                  </span>
                  <h3 className="font-serif text-2xl text-[#25201C] font-normal mt-0.5">
                    Curate a New Mirror / Sanctuary Piece
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMirrorModal(false)}
                  className="p-1 rounded-full text-[#785A44] hover:text-[#25201C] hover:bg-[#F5EFEB] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMirrorPiece} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Mirror Title / Architectural Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={mirrorTitle}
                    onChange={(e) => setMirrorTitle(e.target.value)}
                    placeholder="e.g. Chandra Floating Vanity Mirror with Halo Backlight & Oak Shelf"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={mirrorPrice}
                      onChange={(e) => setMirrorPrice(e.target.value)}
                      placeholder="26500"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={mirrorDimensions}
                      onChange={(e) => setMirrorDimensions(e.target.value)}
                      placeholder="e.g. 180cm H × 70cm W × 3.5cm D"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Frame Craft & Lighting Spec
                  </label>
                  <input
                    type="text"
                    value={mirrorMaterial}
                    onChange={(e) => setMirrorMaterial(e.target.value)}
                    placeholder="e.g. Solid Brushed Brass & Shatter-Proof Silver Float Glass"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Mirror Preset or Upload Custom Image
                  </label>

                  {/* Preset Thumbnails */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                    {[
                      { label: 'Halo Vanity', url: '/assets/aistudio/mm10_5f3ba795.jpg' },
                      { label: 'Brass Arch', url: '/assets/aistudio/mm15_d8590e3e.jpg' },
                      { label: 'Jaali Trio', url: '/assets/aistudio/mm16_28efb11b.jpg' },
                      { label: 'Hollywood 12', url: '/assets/aistudio/mm12_b0c66761.jpg' },
                      { label: 'Travel Case', url: '/assets/aistudio/mm11_c503a8c8.jpg' },
                      { label: 'Diamond Bevel', url: '/assets/aistudio/mm14_edf39f2f.jpg' },
                      { label: 'Square Ring', url: '/assets/aistudio/mm13_2d3bf25f.jpg' },
                      { label: 'Rococo Oval', url: '/assets/aistudio/mm1_96b4985d.jpg' },
                      { label: 'Minimal LED', url: '/assets/aistudio/mm2_413181a9.jpg' },
                      { label: 'Kutch Lippan', url: '/assets/aistudio/mm3_7921b962.jpg' },
                      { label: 'Twin Floating', url: '/assets/aistudio/mm5_b6b42150.jpg' },
                      { label: 'Wavy Contour', url: '/assets/aistudio/mm6_0114c6d4.jpg' },
                      { label: 'Dual Halo', url: '/assets/aistudio/mm7_aed788f2.jpg' },
                      { label: 'Wardrobe S', url: '/assets/aistudio/mm8_b30ad2f1.jpg' },
                      { label: 'Segmented Round', url: '/assets/aistudio/mm9_b6aadce6.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setMirrorSelectedImage(img.url);
                          setMirrorCustomImage('');
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          mirrorSelectedImage === img.url && !mirrorCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/80 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setMirrorCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={mirrorCustomImage.startsWith('data:') ? '' : mirrorCustomImage}
                      onChange={(e) => setMirrorCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {mirrorCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={mirrorCustomImage}
                          alt="Custom mirror preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom mirror image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddMirrorModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingMirror}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingMirror ? 'Adding Mirror...' : 'Add to Mirrors'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Accessory Piece Modal */}
      {showAddAccessoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE5DA] overflow-hidden my-8">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA069]">
                    Artisan Home Accents & Sculptures Curation
                  </span>
                  <h3 className="font-serif text-2xl text-[#25201C] font-normal mt-0.5">
                    Curate a New Accessory Piece
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAccessoryModal(false)}
                  className="p-1 rounded-full text-[#785A44] hover:text-[#25201C] hover:bg-[#F5EFEB] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAccessoryPiece} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Accessory Title / Installation Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessoryTitle}
                    onChange={(e) => setAccessoryTitle(e.target.value)}
                    placeholder="e.g. Svarnamalika Dual-Ring Ginkgo & Lotus Metal Wall Sculpture"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={accessoryPrice}
                      onChange={(e) => setAccessoryPrice(e.target.value)}
                      placeholder="18500"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={accessoryDimensions}
                      onChange={(e) => setAccessoryDimensions(e.target.value)}
                      placeholder="e.g. 150cm W × 75cm H × 6cm D"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Materials & Metalcraft Specification
                  </label>
                  <input
                    type="text"
                    value={accessoryMaterial}
                    onChange={(e) => setAccessoryMaterial(e.target.value)}
                    placeholder="e.g. Pure Hand-Hammered Brass & Patina Verdigris Lotus Petals"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Accessory Preset or Upload Custom Image
                  </label>

                  {/* Preset Thumbnails */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-3 max-h-48 overflow-y-auto p-1 bg-[#F5EFEB] rounded-lg border border-[#EDE5DA]">
                    {[
                      { label: 'Bell Chime', url: '/assets/aistudio/aa9.jpg' },
                      { label: 'Bird Cottage', url: '/assets/aistudio/aa8.jpg' },
                      { label: 'Shubh Mandala', url: '/assets/aistudio/aa7.jpg' },
                      { label: 'Lovebirds', url: '/assets/aistudio/aa6.jpg' },
                      { label: 'Musicians Trio', url: '/assets/aistudio/aa5.jpg' },
                      { label: 'Lotus Bells', url: '/assets/aistudio/aa4.jpg' },
                      { label: 'Sunburst Mirrors', url: '/assets/aistudio/aa3.jpg' },
                      { label: 'Ginkgo Lotus', url: '/assets/aistudio/aa20_664be128.jpg' },
                      { label: 'Kalpavriksha', url: '/assets/aistudio/aa19_170a1e5c.jpg' },
                      { label: 'Mandala Fan', url: '/assets/aistudio/aa18_46ea6ae6.jpg' },
                      { label: 'Royal Peacock', url: '/assets/aistudio/aa17_06aa20d8.jpg' },
                      { label: 'Veranda Arms', url: '/assets/aistudio/aa16_903e1905.jpg' },
                      { label: 'Bodhi Bedhead', url: '/assets/aistudio/aa15_efbd42e3.jpg' },
                      { label: 'Jewel Plumed', url: '/assets/aistudio/aa14_6962b34e.jpg' },
                      { label: 'Mountain Ridge', url: '/assets/aistudio/aa13_3fb5ce2a.jpg' },
                      { label: 'Tree Shelves', url: '/assets/aistudio/aa12_e2881eae.jpg' },
                      { label: 'Ombre Sunburst', url: '/assets/aistudio/aa10_86387140.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setAccessorySelectedImage(img.url);
                          setAccessoryCustomImage('');
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          accessorySelectedImage === img.url && !accessoryCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/80 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setAccessoryCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={accessoryCustomImage.startsWith('data:') ? '' : accessoryCustomImage}
                      onChange={(e) => setAccessoryCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {accessoryCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={accessoryCustomImage}
                          alt="Custom accessory preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom accessory image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAccessoryModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAccessory}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingAccessory ? 'Adding Accessory...' : 'Add to Accessories'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Living Room Piece Modal */}
      {showAddLivingRoomModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE5DA] overflow-hidden my-8">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA069]">
                    Architectural Living Room Sanctuaries & Salon Suites
                  </span>
                  <h3 className="font-serif text-2xl text-[#25201C] font-normal mt-0.5">
                    Curate a Living Room Piece
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLivingRoomModal(false)}
                  className="p-1 rounded-full text-[#785A44] hover:text-[#25201C] hover:bg-[#F5EFEB] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLivingRoomPiece} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Piece Title / Suite Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={livingRoomTitle}
                    onChange={(e) => setLivingRoomTitle(e.target.value)}
                    placeholder="e.g. Indra Grand Double-Height Curved Bouclé Sectional Suite"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Category
                    </label>
                    <select
                      value={livingRoomCategory}
                      onChange={(e) => setLivingRoomCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    >
                      <option value="Seating">Seating</option>
                      <option value="Tables">Tables</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Wall Décor">Wall Décor</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={livingRoomPrice}
                      onChange={(e) => setLivingRoomPrice(e.target.value)}
                      placeholder="185000"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={livingRoomDimensions}
                      onChange={(e) => setLivingRoomDimensions(e.target.value)}
                      placeholder="e.g. 380cm W × 220cm D × 78cm H"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Materials & Architecture Specification
                  </label>
                  <input
                    type="text"
                    value={livingRoomMaterial}
                    onChange={(e) => setLivingRoomMaterial(e.target.value)}
                    placeholder="e.g. Cloud Bouclé Upholstery, Kiln-Dried Teak Internal Frame"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Preset Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Living Room Preset or Upload Custom Image
                  </label>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3 max-h-48 overflow-y-auto p-1 bg-[#F5EFEB] rounded-lg border border-[#EDE5DA]">
                    {[
                      { label: 'Indra Bouclé', url: '/assets/aistudio/rr12_0e3f4ae3.jpg', price: '185000', cat: 'Seating', mat: 'Cloud Bouclé & Teak', dim: '380cm W × 220cm D × 78cm H' },
                      { label: 'Nirvana Calacatta', url: '/assets/aistudio/rr13_3c4da6e3.jpg', price: '42500', cat: 'Tables', mat: 'Calacatta & Fluted Walnut', dim: '135cm L × 75cm W × 42cm H' },
                      { label: 'Emerald Velvet', url: '/assets/aistudio/rr9_a8dbe345.jpg', price: '145000', cat: 'Seating', mat: 'Jewel Cotton Velvet & Brass', dim: '320cm W × 195cm D × 82cm H' },
                      { label: 'Prana Minimal', url: '/assets/aistudio/rr20_5c9173e5.jpg', price: '98000', cat: 'Seating', mat: 'Slub Linen & Solid Oak', dim: '260cm W × 100cm D × 80cm H' },
                      { label: 'Vana Zen Atrium', url: '/assets/aistudio/rr19_ce122d90.jpg', price: '56000', cat: 'Seating', mat: 'Wool Weave & Travertine', dim: '92cm W × 88cm D × 74cm H' },
                      { label: 'Kuro Midnight', url: '/assets/aistudio/rr17_de05b96e.jpg', price: '168000', cat: 'Seating', mat: 'Obsidian Velvet & Beaten Brass', dim: '300cm W × 180cm D × 80cm H' },
                      { label: 'Chandrakanta 3-Halo', url: '/assets/aistudio/rr15_cb4e3471.jpg', price: '89000', cat: 'Lighting', mat: 'K9 Optical Crystal & Brass', dim: '100cm, 80cm, 60cm Rings' },
                      { label: 'Malwa Cottage', url: '/assets/aistudio/rr1_3269170f.jpg', price: '78000', cat: 'Seating', mat: 'Washed Linen & Seagrass', dim: '240cm W × 98cm D × 84cm H' },
                      { label: 'Rajputana Settee', url: '/assets/aistudio/rr16_2827b174.jpg', price: '112000', cat: 'Furniture', mat: 'Teak Jharokha & Bouclé', dim: '220cm W × 90cm D × 88cm H' },
                      { label: 'Mayura Sled Suite', url: '/assets/aistudio/rr7_8af2c8a7.jpg', price: '158000', cat: 'Seating', mat: 'Amber Velvet & Gold Rails', dim: '340cm W × 210cm D × 80cm H' },
                      { label: 'Botanical Sage', url: '/assets/aistudio/rr2_bb8a9b23.jpg', price: '64000', cat: 'Seating', mat: 'Distressed Sage & Linen', dim: '210cm W × 95cm D × 82cm H' },
                      { label: 'Grand Sculptural', url: '/assets/aistudio/rr21_08065242.jpg', price: '195000', cat: 'Furniture', mat: 'Charcoal Suite & Brass', dim: '400cm W × 250cm D × 80cm H' },
                      { label: 'Slatted Timber', url: '/assets/aistudio/rr3_5f48397b.jpg', price: '135000', cat: 'Wall Décor', mat: 'Slatted Oak & Marble', dim: '300cm W × 240cm H' },
                      { label: 'Japandi Baithak', url: '/assets/aistudio/rr4_7131bdbe.jpg', price: '72000', cat: 'Seating', mat: 'Low Platform Teak', dim: '250cm W × 110cm D × 65cm H' },
                      { label: 'Organic Bouclé', url: '/assets/aistudio/rr5_928a3073.jpg', price: '84000', cat: 'Seating', mat: 'Curved Cream Bouclé', dim: '230cm W × 96cm D × 76cm H' },
                      { label: 'Metropolitan Glass', url: '/assets/aistudio/rr6_3aeef0d2.jpg', price: '128000', cat: 'Seating', mat: 'Granite Grey Weave', dim: '290cm W × 160cm D × 78cm H' },
                      { label: 'Travertine Plinth', url: '/assets/aistudio/rr8_ae20b627.jpg', price: '86000', cat: 'Tables', mat: 'Honed Travertine Table', dim: '140cm L × 80cm W × 38cm H' },
                      { label: 'Emerald Fluted', url: '/assets/aistudio/rr10_2f5c6190.jpg', price: '38000', cat: 'Tables', mat: 'Fluted Wood Center Table', dim: '90cm Ø × 42cm H' },
                      { label: 'Fluted Drum Plinth', url: '/assets/aistudio/rr14_52a50071.jpg', price: '41000', cat: 'Tables', mat: 'White Marble & Tambour', dim: '120cm L × 70cm W × 40cm H' },
                      { label: 'Layered Botanical', url: '/assets/aistudio/rr18_0366e991.jpg', price: '48000', cat: 'Accessories', mat: 'Terracotta & Jute Ensemble', dim: 'Assorted Curated Ensemble' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setLivingRoomSelectedImage(img.url);
                          setLivingRoomCustomImage('');
                          setLivingRoomTitle(img.label);
                          setLivingRoomPrice(img.price);
                          setLivingRoomCategory(img.cat);
                          setLivingRoomMaterial(img.mat);
                          setLivingRoomDimensions(img.dim);
                        }}
                        className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          livingRoomSelectedImage === img.url && !livingRoomCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/85 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setLivingRoomCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={livingRoomCustomImage.startsWith('data:') ? '' : livingRoomCustomImage}
                      onChange={(e) => setLivingRoomCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {livingRoomCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={livingRoomCustomImage}
                          alt="Custom living room preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddLivingRoomModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingLivingRoom}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingLivingRoom ? 'Adding Piece...' : 'Add to Living Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Dining Room Piece Modal */}
      {showAddDiningRoomModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE5DA] overflow-hidden my-8">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA069]">
                    Grand Banquet Suites, Tables & Feast Sanctuaries
                  </span>
                  <h3 className="font-serif text-2xl text-[#25201C] font-normal mt-0.5">
                    Curate a Dining Room Piece
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDiningRoomModal(false)}
                  className="p-1 rounded-full text-[#785A44] hover:text-[#25201C] hover:bg-[#F5EFEB] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDiningRoomPiece} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Piece Title / Suite Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={diningRoomTitle}
                    onChange={(e) => setDiningRoomTitle(e.target.value)}
                    placeholder="e.g. Royal Circular Live-Edge Dining Suite with Lion Ring Chairs"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Category
                    </label>
                    <select
                      value={diningRoomCategory}
                      onChange={(e) => setDiningRoomCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    >
                      <option value="Tables">Tables</option>
                      <option value="Seating">Seating</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Wall Décor">Wall Décor</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={diningRoomPrice}
                      onChange={(e) => setDiningRoomPrice(e.target.value)}
                      placeholder="118000"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={diningRoomDimensions}
                      onChange={(e) => setDiningRoomDimensions(e.target.value)}
                      placeholder="e.g. 240cm L × 110cm W × 76cm H"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Materials & Architecture Specification
                  </label>
                  <input
                    type="text"
                    value={diningRoomMaterial}
                    onChange={(e) => setDiningRoomMaterial(e.target.value)}
                    placeholder="e.g. Solid Live-Edge Teak Slab & Cast Wrought Iron Birdcage Base"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Preset Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Dining Room Preset or Upload Custom Image
                  </label>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3 max-h-48 overflow-y-auto p-1 bg-[#F5EFEB] rounded-lg border border-[#EDE5DA]">
                    {[
                      { label: 'Royal Lion Ring', url: '/assets/aistudio/dd17_ca68cf99.jpg', price: '165000', cat: 'Tables', mat: 'Live-Edge Wood & Crystal', dim: '180cm Ø × 76cm H' },
                      { label: 'Raindrop Crystal', url: '/assets/aistudio/dd16_193be8d1.jpg', price: '185000', cat: 'Lighting', mat: 'Crystal Raindrop & Obsidian', dim: '260cm L × 110cm W' },
                      { label: 'Courtyard Teak', url: '/assets/aistudio/dd4_c82df8eb.jpg', price: '125000', cat: 'Tables', mat: 'Solid Teak Slab & Brass', dim: '280cm L × 100cm W × 78cm H' },
                      { label: 'Scarlet Penthouse', url: '/assets/aistudio/dd5_e22dc47e.jpg', price: '148000', cat: 'Seating', mat: 'Scarlet Velvet & Linear LED', dim: '240cm L × 100cm W × 76cm H' },
                      { label: 'Mid-Century Cognac', url: '/assets/aistudio/dd6_ade01685.jpg', price: '135000', cat: 'Seating', mat: 'Cognac Velvet & Marble', dim: '150cm Ø × 76cm H' },
                      { label: 'Rococo Statuario', url: '/assets/aistudio/dd7_4c096321.jpg', price: '198000', cat: 'Tables', mat: 'Statuario Marble & Mirror', dim: '300cm L × 120cm W × 77cm H' },
                      { label: 'Rattan Verandah', url: '/assets/aistudio/dd8_fddff871.jpg', price: '89000', cat: 'Seating', mat: 'Light Oak & Woven Rattan', dim: '220cm L × 95cm W × 75cm H' },
                      { label: 'Charcoal Tiered', url: '/assets/aistudio/dd9_27a41308.jpg', price: '175000', cat: 'Lighting', mat: 'Charcoal Plinths & Brass', dim: '240cm L × 105cm W × 76cm H' },
                      { label: 'Chinoiserie Emerald', url: '/assets/aistudio/dd10_a2054700.jpg', price: '142000', cat: 'Seating', mat: 'Emerald Velvet & Timber', dim: '260cm L × 100cm W × 76cm H' },
                      { label: 'Calacatta Tapered', url: '/assets/aistudio/dd11_5514654f.jpg', price: '115000', cat: 'Tables', mat: 'Calacatta & Bouclé', dim: '220cm L × 100cm W × 76cm H' },
                      { label: 'Lantern Keyhole', url: '/assets/aistudio/dd12_45d57365.jpg', price: '98000', cat: 'Furniture', mat: 'Black Lacquer & Lantern', dim: '240cm L × 100cm W × 76cm H' },
                      { label: 'Walnut Fluted', url: '/assets/aistudio/dd13_28457488.jpg', price: '108000', cat: 'Tables', mat: 'Solid Walnut & Wishbone', dim: '240cm L × 100cm W × 76cm H' },
                      { label: 'Nordic Papercord', url: '/assets/aistudio/dd14_01bc93c7.jpg', price: '92000', cat: 'Seating', mat: 'Teak & Papercord Armchairs', dim: '260cm L × 100cm W × 76cm H' },
                      { label: 'Organic Branch', url: '/assets/aistudio/dd15_7145c9b4.jpg', price: '155000', cat: 'Lighting', mat: 'Gilded Leaf Branches', dim: '180cm L × 110cm W × 76cm H' },
                      { label: 'Trumpet Gold Drum', url: '/assets/aistudio/dd18_a34b8703.jpg', price: '138000', cat: 'Tables', mat: 'Hammered Brass & Marble', dim: '140cm Ø × 76cm H' },
                      { label: 'Blush Geometric', url: '/assets/aistudio/dd19_6016ca52.jpg', price: '162000', cat: 'Seating', mat: 'Blush Tufting & Ring Rings', dim: '280cm L × 110cm W × 76cm H' },
                      { label: 'Waterfall Quartz', url: '/assets/aistudio/dd20_05430a44.jpg', price: '128000', cat: 'Furniture', mat: 'Bleached Oak & Multi-Bulb', dim: '240cm L × 100cm W × 76cm H' },
                      { label: 'Bay-Window Nook', url: '/assets/aistudio/dd22_2a77805e.jpg', price: '76000', cat: 'Tables', mat: 'Round Pedestal & Bistro', dim: '120cm Ø × 75cm H' },
                      { label: 'Neoclassical Blue', url: '/assets/aistudio/dd2_3994d807.jpg', price: '145000', cat: 'Seating', mat: 'Polished Mahogany & Damask', dim: '260cm L × 110cm W × 76cm H' },
                      { label: 'Country Ladderback', url: '/assets/aistudio/dd1_43bca05f.jpg', price: '85000', cat: 'Furniture', mat: '8-Seater Weathered Oak', dim: '280cm L × 100cm W × 77cm H' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setDiningRoomSelectedImage(img.url);
                          setDiningRoomCustomImage('');
                          setDiningRoomTitle(img.label);
                          setDiningRoomPrice(img.price);
                          setDiningRoomCategory(img.cat);
                          setDiningRoomMaterial(img.mat);
                          setDiningRoomDimensions(img.dim);
                        }}
                        className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          diningRoomSelectedImage === img.url && !diningRoomCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/85 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setDiningRoomCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={diningRoomCustomImage.startsWith('data:') ? '' : diningRoomCustomImage}
                      onChange={(e) => setDiningRoomCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {diningRoomCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={diningRoomCustomImage}
                          alt="Custom dining room preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDiningRoomModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDiningRoom}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingDiningRoom ? 'Adding Piece...' : 'Add to Dining Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Bedroom Piece Modal */}
      {showAddBedroomModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE5DA] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE5DA] bg-[#F5EFEB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25201C] text-[#FAF7F2] flex items-center justify-center font-serif font-bold text-sm">
                  R
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#25201C]">
                    Curate Bedroom Piece / Suite
                  </h3>
                  <p className="text-[11px] text-[#785A44]">
                    Select an architectural bedroom photography preset or upload a custom image
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBedroomModal(false)}
                className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#785A44] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleAddBedroomPiece} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Piece Title / Suite Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={bedroomTitle}
                    onChange={(e) => setBedroomTitle(e.target.value)}
                    placeholder="e.g. Circular Sanctuary Luxury Bed with Domed Curtain Canopy"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Category
                    </label>
                    <select
                      value={bedroomCategory}
                      onChange={(e) => setBedroomCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Wall Décor">Wall Décor</option>
                      <option value="Seating">Seating</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={bedroomPrice}
                      onChange={(e) => setBedroomPrice(e.target.value)}
                      placeholder="168000"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={bedroomDimensions}
                      onChange={(e) => setBedroomDimensions(e.target.value)}
                      placeholder="e.g. 240cm Ø Round Bed × 240cm H"
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-1">
                    Materials & Architecture Specification
                  </label>
                  <input
                    type="text"
                    value={bedroomMaterial}
                    onChange={(e) => setBedroomMaterial(e.target.value)}
                    placeholder="e.g. Circular Platform Wood Base, Gossamer Netting & Micro-LED Cascades"
                    className="w-full px-3.5 py-2.5 bg-[#F7F2EC] border border-[#D4C6B7] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                {/* Preset Image Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785A44] mb-2">
                    Select Bedroom Preset or Upload Custom Image
                  </label>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3 max-h-48 overflow-y-auto p-1 bg-[#F5EFEB] rounded-lg border border-[#EDE5DA]">
                    {[
                      { label: 'Celestial Velvet Penthouse', url: '/assets/aistudio/bb18_b2d2b29f.jpg', price: '185000', cat: 'Furniture', mat: 'Royal Blue Velvet & Starry Optic Ceiling', dim: 'King 200cm × 210cm' },
                      { label: 'Circular Sanctuary Bed', url: '/assets/aistudio/bb13_e1c43a33.jpg', price: '168000', cat: 'Furniture', mat: 'Circular Round Bed & Domed Canopy', dim: '240cm Ø Round Bed' },
                      { label: 'Royal Bridal Four-Poster', url: '/assets/aistudio/bb12_5b223105.jpg', price: '145000', cat: 'Furniture', mat: 'Carved Sheesham & Organza Canopy', dim: 'King 195cm × 210cm × 230cm H' },
                      { label: 'Champagne Glam Suite', url: '/assets/aistudio/bb11_88456fb7.jpg', price: '138000', cat: 'Furniture', mat: 'Tufted Champagne Silk & Mirrored Stands', dim: 'King 190cm × 210cm' },
                      { label: 'Blush Garland Alcove', url: '/assets/aistudio/bb14_65fe7de2.jpg', price: '98000', cat: 'Lighting', mat: 'Rose Floral Framing & Star Lights', dim: 'Queen 160cm × 200cm' },
                      { label: 'Lavender Dream Pavilion', url: '/assets/aistudio/bb19_c92cc82f.jpg', price: '112000', cat: 'Furniture', mat: 'Four-Poster Iron Canopy & Lilac Drapes', dim: 'Queen 165cm × 205cm' },
                      { label: 'Cozy Canopy String Lights', url: '/assets/aistudio/bb20_6c9934da.jpg', price: '72000', cat: 'Lighting', mat: 'Gossamer Canopy & Micro LED Cascades', dim: 'Universal Canopy' },
                      { label: 'Boho Floor Bed Sanctuary', url: '/assets/aistudio/bb17_da4ec64a.jpg', price: '64000', cat: 'Furniture', mat: 'Low Platform Pine & Fairy Light Ivy', dim: 'Queen 160cm × 200cm' },
                      { label: 'Twilight Window Nook', url: '/assets/aistudio/bb16_bb849bdb.jpg', price: '58000', cat: 'Accessories', mat: 'Hanging Ivy Vines & Fairy Lights', dim: 'Full/Queen 150cm × 200cm' },
                      { label: 'Organza Alcove Cocoon', url: '/assets/aistudio/bb15_8c48c9a3.jpg', price: '86000', cat: 'Lighting', mat: 'Twin Draped Netting & Amber Lights', dim: 'Queen 160cm × 200cm' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.url}
                        onClick={() => {
                          setBedroomSelectedImage(img.url);
                          setBedroomCustomImage('');
                          setBedroomTitle(img.label);
                          setBedroomPrice(img.price);
                          setBedroomCategory(img.cat);
                          setBedroomMaterial(img.mat);
                          setBedroomDimensions(img.dim);
                        }}
                        className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          bedroomSelectedImage === img.url && !bedroomCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/85 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setBedroomCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={bedroomCustomImage.startsWith('data:') ? '' : bedroomCustomImage}
                      onChange={(e) => setBedroomCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {bedroomCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={bedroomCustomImage}
                          alt="Custom bedroom preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBedroomModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBedroom}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingBedroom ? 'Adding Piece...' : 'Add to Bedroom'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Entryway Piece Modal */}
      {showAddEntrywayModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#25201C]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#D4C6B7] shadow-2xl overflow-hidden my-8">
            <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#BFA069] font-medium">
                    Curator Studio • Entryway Suite
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-1">
                    Curate Entryway Sanctuary Piece
                  </h3>
                  <p className="text-xs text-[#785A44] mt-1 font-light">
                    Add a signature console, architectural foyer mirror, welcoming bench, or foyer accent to the Riwaaz collection.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEntrywayModal(false)}
                  className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#785A44] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEntrywayPiece} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                    Piece Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={entrywayTitle}
                    onChange={(e) => setEntrywayTitle(e.target.value)}
                    placeholder="e.g., Arched Teak Foyer Console, Hand-Carved Heritage Plinth"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Category
                    </label>
                    <select
                      value={entrywayCategory}
                      onChange={(e) => setEntrywayCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Mirrors">Mirrors</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Rugs">Rugs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={entrywayPrice}
                      onChange={(e) => setEntrywayPrice(e.target.value)}
                      placeholder="86000"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Artisanal Materials
                    </label>
                    <input
                      type="text"
                      value={entrywayMaterial}
                      onChange={(e) => setEntrywayMaterial(e.target.value)}
                      placeholder="e.g., Fluted Teak, Brass Accent & Travertine"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={entrywayDimensions}
                      onChange={(e) => setEntrywayDimensions(e.target.value)}
                      placeholder="140cm L × 45cm W × 85cm H"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                {/* Imagery Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium">
                      Select Curated Entryway Image
                    </label>
                    <span className="text-[11px] text-[#9E8F80]">17 authentic foyer captures</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3 max-h-56 overflow-y-auto p-2 bg-white rounded-lg border border-[#EDE5DA]">
                    {[
                      { url: '/assets/aistudio/EE19_8c088fc8.jpg', label: 'Grand Palace Foyer' },
                      { url: '/assets/aistudio/EE18_73cef766.jpg', label: 'Fluted Teak Console' },
                      { url: '/assets/aistudio/EE17_d0067f2f.jpg', label: 'Brass Planter & Mirror' },
                      { url: '/assets/aistudio/EE16_eabec5f7.jpg', label: 'Arched Entry Vestibule' },
                      { url: '/assets/aistudio/EE15_9cc66d73.jpg', label: 'Warm Linen Bench' },
                      { url: '/assets/aistudio/ee14_22fd5e29.jpg', label: 'Minimalist Gallery Entry' },
                      { url: '/assets/aistudio/ee13_19a6c5fc.jpg', label: 'Sculptural Marble Pedestal' },
                      { url: '/assets/aistudio/ee11_e9329950.jpg', label: 'Artisan Sconce & Niche' },
                      { url: '/assets/aistudio/ee10_59d45bd4.jpg', label: 'Botanical Console Setting' },
                      { url: '/assets/aistudio/ee9_4fdb23ab.jpg', label: 'Travertine Foyer Plinth' },
                      { url: '/assets/aistudio/ee8_ffa57b13.jpg', label: 'Sunken Shoe Niche Bench' },
                      { url: '/assets/aistudio/ee7_9cc66d73.jpg', label: 'Woven Jute & Timber Foyer' },
                      { url: '/assets/aistudio/ee6_91ffa344.jpg', label: 'Fluted Oak Wardrobe' },
                      { url: '/assets/aistudio/ee4_2e709369.jpg', label: 'Brass Lantern Hallway' },
                      { url: '/assets/aistudio/ee3_550a87bb.jpg', label: 'Acoustic Oak Slat Entry' },
                      { url: '/assets/aistudio/ee2_50ea25c8.jpg', label: 'Terracotta Foyer Urn' },
                      { url: '/assets/aistudio/EE1_8a8dee9f.jpg', label: 'Courtyard Arrival Foyer' }
                    ].map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => {
                          setEntrywaySelectedImage(img.url);
                          setEntrywayCustomImage('');
                        }}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          entrywaySelectedImage === img.url && !entrywayCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/85 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setEntrywayCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={entrywayCustomImage.startsWith('data:') ? '' : entrywayCustomImage}
                      onChange={(e) => setEntrywayCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {entrywayCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={entrywayCustomImage}
                          alt="Custom entryway preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEntrywayModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEntryway}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingEntryway ? 'Adding Piece...' : 'Add to Entryway'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Workspace Piece Modal */}
      {showAddWorkspaceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#25201C]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#D4C6B7] shadow-2xl overflow-hidden my-8">
            <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-[#EDE5DA]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#BFA069] font-medium">
                    Curator Studio • Workspace Atelier
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-[#25201C] mt-1">
                    Curate Workspace Atelier Piece
                  </h3>
                  <p className="text-xs text-[#785A44] mt-1 font-light">
                    Add an executive walnut desk, acoustic slat study nook, library credenza, or atelier chair to the Riwaaz collection.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddWorkspaceModal(false)}
                  className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#785A44] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddWorkspacePiece} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                    Piece Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={workspaceTitle}
                    onChange={(e) => setWorkspaceTitle(e.target.value)}
                    placeholder="e.g., Curved Executive Teak Bureau, Acoustic Slatted Atelier Desk"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Category
                    </label>
                    <select
                      value={workspaceCategory}
                      onChange={(e) => setWorkspaceCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    >
                      <option value="Tables">Tables & Desks</option>
                      <option value="Seating">Seating</option>
                      <option value="Storage">Storage & Credenzas</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={workspacePrice}
                      onChange={(e) => setWorkspacePrice(e.target.value)}
                      placeholder="89000"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Artisanal Materials
                    </label>
                    <input
                      type="text"
                      value={workspaceMaterial}
                      onChange={(e) => setWorkspaceMaterial(e.target.value)}
                      placeholder="e.g., Solid Walnut, Acoustic Fluted Slats & Brass"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium mb-1.5">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={workspaceDimensions}
                      onChange={(e) => setWorkspaceDimensions(e.target.value)}
                      placeholder="160cm L × 75cm W × 76cm H"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EDE5DA] rounded-lg text-sm text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />
                  </div>
                </div>

                {/* Imagery Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-wider text-[#785A44] font-medium">
                      Select Curated Workspace Image
                    </label>
                    <span className="text-[11px] text-[#9E8F80]">20 studio captures</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3 max-h-56 overflow-y-auto p-2 bg-white rounded-lg border border-[#EDE5DA]">
                    {[
                      { url: '/assets/aistudio/ww20_a4a17a7b.jpg', label: 'Curved Executive Teak' },
                      { url: '/assets/aistudio/ww19_20a9df89.jpg', label: 'Concrete Architecture Study' },
                      { url: '/assets/aistudio/ww18_1f1ae22c.jpg', label: 'Fluted Acoustic Nook' },
                      { url: '/assets/aistudio/ww17_a12bcf65.jpg', label: 'Botanical Daylight Atelier' },
                      { url: '/assets/aistudio/ww16_0ef78177.jpg', label: 'Walnut Writing Bureau' },
                      { url: '/assets/aistudio/ww15_f949cd5f.jpg', label: 'Dual Monitor Teak Setup' },
                      { url: '/assets/aistudio/ww14_5d2701e9.jpg', label: 'Sculptural Library Credenza' },
                      { url: '/assets/aistudio/ww13_0dfe5856.jpg', label: 'Sunken Garden Office' },
                      { url: '/assets/aistudio/ww12_1bc9bfeb.jpg', label: 'Leather Atelier Chair' },
                      { url: '/assets/aistudio/ww11_0d5ca3f6.jpg', label: 'Japanese Oak Study' },
                      { url: '/assets/aistudio/ww10_5702635c.jpg', label: 'Floating Walnut Desk' },
                      { url: '/assets/aistudio/ww9_db4bb014.jpg', label: 'Floor Library Lounge' },
                      { url: '/assets/aistudio/ww8_1ce020b0.jpg', label: 'Minimalist Slate Bureau' },
                      { url: '/assets/aistudio/ww7_eb37aecc.jpg', label: 'Nordic Oak Executive' },
                      { url: '/assets/aistudio/ww6_aa4866e9.jpg', label: 'Mid-Century Secretarial' },
                      { url: '/assets/aistudio/ww5_848a319c.jpg', label: 'Archway Library Alcove' },
                      { url: '/assets/aistudio/ww4_e8f69582.jpg', label: 'Artisan Task Light Bureau' },
                      { url: '/assets/aistudio/ww3_aaf598e3.jpg', label: 'Monastic Serenity Study' },
                      { url: '/assets/aistudio/ww2_fe415729.jpg', label: 'Industrial Loft Studio' },
                      { url: '/assets/aistudio/ww1_578cc510.jpg', label: 'Heritage Teak Library' }
                    ].map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => {
                          setWorkspaceSelectedImage(img.url);
                          setWorkspaceCustomImage('');
                        }}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          workspaceSelectedImage === img.url && !workspaceCustomImage
                            ? 'border-[#BFA069] ring-2 ring-[#BFA069]/30'
                            : 'border-[#EDE5DA] opacity-75 hover:opacity-100 hover:border-[#D4C6B7]'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-[#25201C]/85 text-[#FAF7F2] text-[9px] truncate px-1 py-0.5 text-center">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="p-3 rounded-lg bg-[#F7F2EC] border border-[#D4C6B7] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25201C] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#382E26] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setWorkspaceCustomImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#9E8F80]">or enter direct image URL</span>
                    </div>

                    <input
                      type="url"
                      value={workspaceCustomImage.startsWith('data:') ? '' : workspaceCustomImage}
                      onChange={(e) => setWorkspaceCustomImage(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-1.5 bg-white border border-[#EDE5DA] rounded text-xs text-[#25201C] focus:outline-none focus:border-[#BFA069]"
                    />

                    {workspaceCustomImage && (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={workspaceCustomImage}
                          alt="Custom workspace preview"
                          className="w-12 h-12 object-cover rounded border border-[#BFA069]"
                        />
                        <span className="text-[11px] text-[#785A44]">
                          Custom image ready for curation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE5DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddWorkspaceModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingWorkspace}
                    className="px-5 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#BFA069] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingWorkspace ? 'Adding Piece...' : 'Add to Workspace'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
