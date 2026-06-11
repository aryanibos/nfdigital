import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Filter, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
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

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Load dynamic products from central store
  useEffect(() => {
    getProducts().then(setAllProducts);
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

  // Autocomplete suggestions
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
  }, [searchQuery, allProducts]);

  // Filter and sort products
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
    if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category));
    }
    
    return filtered;
  }, [activeCategory, searchQuery, sortBy, allProducts]);

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
    <Layout>
      <section className="pt-24 pb-8 border-b border-border bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="container mx-auto px-4 lg:px-8 text-center py-6">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
            Katalog Digital
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-5 mb-4">
            Semua <span className="text-gradient">Produk</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Jelajahi seluruh hasil inovasi, template, e-book, dan aset digital mahasiswa Bisnis Digital STT NF.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background min-h-[60vh]">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col gap-6 bg-card border border-border rounded-3xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search input with suggestions */}
              <div ref={searchRef} className="w-full md:max-w-md relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Cari produk..."
                    className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-25">
                    {suggestions.map((product, index) => (
                      <button
                        key={`${product.id}-${index}`}
                        onClick={() => handleSuggestionClick(product.name)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/10 transition-colors text-left"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-8 h-8 rounded-lg object-cover border border-border"
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

              {/* Sorting and View Mode togglers */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-secondary/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium cursor-pointer"
                  >
                    <option value="newest" className="bg-card">Terbaru</option>
                    <option value="name" className="bg-card">Nama (A-Z)</option>
                    <option value="category" className="bg-card">Kategori</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid" 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list" 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results count display */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-bold text-foreground">{filteredProducts.length}</span> produk
            </p>
          </div>

          {/* Product Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginatedProducts.map((product, index) => (
                <Link
                  to={`/produk/${product.id}`}
                  key={`${product.id}-${index}`}
                  className="flex items-center gap-6 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                      {product.featured && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-primary font-bold">Lihat Detail →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty Search States */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Produk tidak ditemukan</h3>
              <p className="text-sm text-muted-foreground mb-4">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
              <button
                onClick={() => {
                  setActiveCategory("Semua");
                  setSearchQuery("");
                }}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Reset pencarian
              </button>
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

      <Footer />
    </Layout>
  );
};

export default Products;
