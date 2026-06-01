import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getProducts, Product } from "@/lib/productsStore";

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

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Load products on mount
  useEffect(() => {
    setProducts(getProducts());
  }, []);

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

  // Reset to page 1 if query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

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
  }, [searchQuery, products]);

  // Filter and sort products (newest first)
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
    
    // Sort by createdAt descending
    return [...filtered].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [activeCategory, searchQuery, products]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse duration-[10000ms]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">Koleksi Produk</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 mb-4">
            Produk <span className="text-gradient">Digital</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan aset digital berkualitas tinggi karya Mahasiswa Bisnis Digital STT NF.
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
              className="w-full pl-12 pr-10 py-3.5 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-md"
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
                  key={`${product.id || product.name}-${index}`}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/10 transition-colors text-left"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-10 h-10 rounded-lg object-cover border border-border"
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
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery("");
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product, index) => (
            <div 
              key={`${product.id || product.name}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Empty States */}
        {paginatedProducts.length === 0 && (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl max-w-lg mx-auto">
            <p className="text-muted-foreground text-sm font-medium">Tidak ada produk dalam kategori ini.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16 animate-fade-in">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
