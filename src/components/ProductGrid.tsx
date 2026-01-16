import { useState } from "react";
import ProductCard from "./ProductCard";
import notionPlanner from "@/assets/notion-planner.jpg";
import lightroomPresets from "@/assets/lightroom-presets.jpg";
import ebookFreelance from "@/assets/ebook-freelance.jpg";
import saasUiKit from "@/assets/saas-ui-kit.jpg";

const products = [
  {
    name: "Notion Life Planner 2024",
    category: "Template",
    description: "Template Notion all-in-one untuk mengatur jadwal dan target hidupmu.",
    image: notionPlanner,
    featured: true,
  },
  {
    name: "Ultimate Lightroom Presets",
    category: "Desain",
    description: "50+ Preset estetik untuk foto Instagram yang lebih kece.",
    image: lightroomPresets,
    featured: false,
  },
  {
    name: "E-Book: Jago Freelance",
    category: "E-Book",
    description: "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
    image: ebookFreelance,
    featured: false,
  },
  {
    name: "SaaS UI Kit Figma",
    category: "Desain",
    description: "Kumpulan komponen UI modern untuk desain aplikasi web.",
    image: saasUiKit,
    featured: true,
  },
  {
    name: "Social Media Templates",
    category: "Template",
    description: "100+ template Instagram, TikTok, dan YouTube siap pakai.",
    image: notionPlanner,
    featured: false,
  },
  {
    name: "Video Editing Course",
    category: "Video",
    description: "Kursus lengkap editing video dari dasar hingga mahir.",
    image: lightroomPresets,
    featured: false,
  },
  {
    name: "React Component Library",
    category: "Kode",
    description: "50+ komponen React siap pakai untuk proyek web modern.",
    image: saasUiKit,
    featured: false,
  },
  {
    name: "Digital Marketing E-Book",
    category: "E-Book",
    description: "Strategi pemasaran digital untuk bisnis online sukses.",
    image: ebookFreelance,
    featured: false,
  },
];

const categories = ["Semua", "Template", "E-Book", "Desain", "Video", "Kode"];

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(product => product.category === activeCategory);

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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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
