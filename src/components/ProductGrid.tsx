import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import ProductCard from "./ProductCard";
import notionPlanner from "@/assets/notion-planner.jpg";
import lightroomPresets from "@/assets/lightroom-presets.jpg";
import ebookFreelance from "@/assets/ebook-freelance.jpg";
import saasUiKit from "@/assets/saas-ui-kit.jpg";
import socialMediaTemplates from "@/assets/social-media-templates.jpg";
import videoCourse from "@/assets/video-course.jpg";
import reactComponents from "@/assets/react-components.jpg";
import marketingEbook from "@/assets/marketing-ebook.jpg";

const products = [
  {
    id: "notion-life-planner-2024",
    name: "Notion Life Planner 2024",
    category: "Template",
    description: "Template Notion all-in-one untuk mengatur jadwal dan target hidupmu.",
    image: notionPlanner,
    featured: true,
  },
  {
    id: "ultimate-lightroom-presets",
    name: "Ultimate Lightroom Presets",
    category: "Desain",
    description: "50+ Preset estetik untuk foto Instagram yang lebih kece.",
    image: lightroomPresets,
    featured: false,
  },
  {
    id: "ebook-jago-freelance",
    name: "E-Book: Jago Freelance",
    category: "E-Book",
    description: "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
    image: ebookFreelance,
    featured: false,
  },
  {
    id: "saas-ui-kit-figma",
    name: "SaaS UI Kit Figma",
    category: "Desain",
    description: "Kumpulan komponen UI modern untuk desain aplikasi web.",
    image: saasUiKit,
    featured: true,
  },
  {
    id: "social-media-templates",
    name: "Social Media Templates",
    category: "Template",
    description: "100+ template Instagram, TikTok, dan YouTube siap pakai.",
    image: socialMediaTemplates,
    featured: false,
  },
  {
    id: "video-editing-course",
    name: "Video Editing Course",
    category: "Video",
    description: "Kursus lengkap editing video dari dasar hingga mahir.",
    image: videoCourse,
    featured: false,
  },
  {
    id: "react-component-library",
    name: "React Component Library",
    category: "Kode",
    description: "50+ komponen React siap pakai untuk proyek web modern.",
    image: reactComponents,
    featured: false,
  },
  {
    id: "digital-marketing-ebook",
    name: "Digital Marketing E-Book",
    category: "E-Book",
    description: "Strategi pemasaran digital untuk bisnis online sukses.",
    image: marketingEbook,
    featured: false,
  },
];

const categories = ["Semua", "Template", "E-Book", "Desain", "Video", "Kode"];

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    let filtered = activeCategory === "Semua" 
      ? products 
      : products.filter(product => product.category === activeCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery]);

  const handleSuggestionClick = (productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <section id="produk" className="py-20 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Koleksi Kami</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Produk <span className="text-gradient">Digital</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan aset digital berkualitas tinggi yang akan membantu kamu berkarya lebih baik.
          </p>
        </div>

        {/* Search Bar with Autocomplete */}
        <div ref={searchRef} className="max-w-md mx-auto mb-8 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Cari produk digital..."
              className="w-full pl-12 pr-10 py-3.5 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-20 animate-fade-in">
              {suggestions.map((product, index) => (
                <button
                  key={`${product.name}-${index}`}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/10 transition-colors text-left"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery("");
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={`${product.name}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada produk dalam kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
