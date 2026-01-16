import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Filter, Grid3X3, List } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import notionPlanner from "@/assets/notion-planner.jpg";
import lightroomPresets from "@/assets/lightroom-presets.jpg";
import ebookFreelance from "@/assets/ebook-freelance.jpg";
import saasUiKit from "@/assets/saas-ui-kit.jpg";
import socialMediaTemplates from "@/assets/social-media-templates.jpg";
import videoCourse from "@/assets/video-course.jpg";
import reactComponents from "@/assets/react-components.jpg";
import marketingEbook from "@/assets/marketing-ebook.jpg";

const allProducts = [
  {
    id: "notion-life-planner-2024",
    name: "Notion Life Planner 2024",
    category: "Template",
    subcategory: "Notion",
    description: "Template Notion all-in-one untuk mengatur jadwal dan target hidupmu.",
    image: notionPlanner,
    featured: true,
    price: "Rp 99.000",
  },
  {
    id: "ultimate-lightroom-presets",
    name: "Ultimate Lightroom Presets",
    category: "Preset & Filter",
    subcategory: "Lightroom",
    description: "50+ Preset estetik untuk foto Instagram yang lebih kece.",
    image: lightroomPresets,
    featured: false,
    price: "Rp 75.000",
  },
  {
    id: "ebook-jago-freelance",
    name: "E-Book: Jago Freelance",
    category: "E-Book & Panduan",
    subcategory: "Bisnis",
    description: "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
    image: ebookFreelance,
    featured: false,
    price: "Rp 49.000",
  },
  {
    id: "saas-ui-kit-figma",
    name: "SaaS UI Kit Figma",
    category: "UI/UX Kit",
    subcategory: "Figma",
    description: "Kumpulan komponen UI modern untuk desain aplikasi web.",
    image: saasUiKit,
    featured: true,
    price: "Rp 149.000",
  },
  {
    id: "social-media-templates",
    name: "Social Media Templates",
    category: "Template",
    subcategory: "Canva",
    description: "100+ template Instagram, TikTok, dan YouTube siap pakai.",
    image: socialMediaTemplates,
    featured: false,
    price: "Rp 89.000",
  },
  {
    id: "video-editing-course",
    name: "Video Editing Course",
    category: "Video & Kursus",
    subcategory: "Premiere Pro",
    description: "Kursus lengkap editing video dari dasar hingga mahir.",
    image: videoCourse,
    featured: false,
    price: "Rp 199.000",
  },
  {
    id: "react-component-library",
    name: "React Component Library",
    category: "Source Code",
    subcategory: "React",
    description: "50+ komponen React siap pakai untuk proyek web modern.",
    image: reactComponents,
    featured: false,
    price: "Rp 129.000",
  },
  {
    id: "digital-marketing-ebook",
    name: "Digital Marketing E-Book",
    category: "E-Book & Panduan",
    subcategory: "Marketing",
    description: "Strategi pemasaran digital untuk bisnis online sukses.",
    image: marketingEbook,
    featured: false,
    price: "Rp 59.000",
  },
  {
    id: "instagram-story-templates",
    name: "Instagram Story Templates",
    category: "Template",
    subcategory: "Instagram",
    description: "50+ template story Instagram yang aesthetic dan engaging.",
    image: socialMediaTemplates,
    featured: false,
    price: "Rp 45.000",
  },
  {
    id: "figma-icon-pack",
    name: "Figma Icon Pack Premium",
    category: "Aset Desain",
    subcategory: "Icon",
    description: "1000+ ikon vektor premium untuk desain UI/UX modern.",
    image: saasUiKit,
    featured: true,
    price: "Rp 79.000",
  },
  {
    id: "content-creator-bundle",
    name: "Content Creator Bundle",
    category: "Video & Kursus",
    subcategory: "YouTube",
    description: "Paket lengkap untuk content creator: intro, outro, lower thirds.",
    image: videoCourse,
    featured: false,
    price: "Rp 159.000",
  },
  {
    id: "productivity-notion-system",
    name: "Productivity Notion System",
    category: "Template",
    subcategory: "Notion",
    description: "Sistem produktivitas lengkap dengan habit tracker dan goal setting.",
    image: notionPlanner,
    featured: false,
    price: "Rp 89.000",
  },
];

const categories = [
  "Semua",
  "Template",
  "E-Book & Panduan",
  "Aset Desain",
  "Video & Kursus",
  "Source Code",
  "UI/UX Kit",
  "Preset & Filter",
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProducts
      .filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = activeCategory === "Semua" 
      ? allProducts 
      : allProducts.filter(product => product.category === activeCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => 
        parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""))
      );
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => 
        parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, ""))
      );
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  }, [activeCategory, searchQuery, sortBy]);

  const handleSuggestionClick = (productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Katalog Lengkap</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 mb-6">
              Semua <span className="text-gradient">Produk Digital</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Jelajahi koleksi lengkap produk digital berkualitas tinggi untuk berbagai kebutuhanmu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-8">
            {/* Search Bar */}
            <div ref={searchRef} className="max-w-2xl mx-auto mb-8 relative">
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
                  className="w-full pl-12 pr-10 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
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
                      <span className="text-sm font-semibold text-primary">{product.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
              {/* Category Pills - Scrollable on mobile */}
              <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                <div className="flex gap-2 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setSearchQuery("");
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeCategory === category
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Options */}
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="name">Nama A-Z</option>
                </select>

                <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{filteredProducts.length}</span> produk
              </p>
              {activeCategory !== "Semua" && (
                <button
                  onClick={() => setActiveCategory("Semua")}
                  className="text-sm text-primary hover:underline"
                >
                  Lihat semua produk
                </button>
              )}
            </div>
          </div>

          {/* Product Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product, index) => (
                <Link
                  to={`/produk/${product.id}`}
                  key={`${product.id}-${index}`}
                  className="flex items-center gap-6 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.featured && (
                        <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{product.price}</p>
                    <span className="text-xs text-muted-foreground">Lihat Detail →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Produk tidak ditemukan</h3>
              <p className="text-muted-foreground mb-4">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
              <button
                onClick={() => {
                  setActiveCategory("Semua");
                  setSearchQuery("");
                }}
                className="text-primary hover:underline"
              >
                Reset pencarian
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
