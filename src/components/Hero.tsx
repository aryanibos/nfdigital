import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  UserPlus, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Zap, 
  FileText, 
  LayoutGrid, 
  Palette,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

// New Premium Mockup Images
import portofolioMinimalist from "@/assets/portofolio-minimalist.png";
import panduanFreelancerPemula from "@/assets/panduan-freelancer-pemula.png";
import dashboardFinance from "@/assets/dashboard-finance.png";

const Hero = () => {
  // Smooth scroll to products section
  const handleScrollToProducts = () => {
    const el = document.getElementById("produk");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to products and trigger category filter
  const handleCategoryClick = (categoryName: string) => {
    // Map simplified categories to exact store categories
    let targetCategory = categoryName;
    if (categoryName === "E-Book") targetCategory = "E-Book & Panduan";
    if (categoryName === "Tools") targetCategory = "Source Code";
    if (categoryName === "UI Kit") targetCategory = "UI/UX Kit";

    // Dispatch custom event to communicate with ProductGrid
    const event = new CustomEvent("filter-category", { detail: targetCategory });
    window.dispatchEvent(event);

    const el = document.getElementById("produk");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Popular category items
  const popularCategories = [
    {
      name: "Template",
      desc: "Desain, dokumen, presentasi, dll.",
      icon: FileText,
      colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/20"
    },
    {
      name: "E-Book",
      desc: "Panduan, tips, dan referensi.",
      icon: BookOpen,
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      name: "Tools",
      desc: "Tools digital untuk produktifitas.",
      icon: LayoutGrid,
      colorClass: "text-violet-400 bg-violet-500/10 border-violet-500/20"
    },
    {
      name: "UI Kit",
      desc: "Komponen UI siap pakai untuk desain.",
      icon: Palette,
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    }
  ];

  // Latest mockups items
  const latestProducts = [
    {
      title: "Portofolio Minimalist",
      category: "Template",
      desc: "Template portofolio profesional untuk kreator dan desainer.",
      image: portofolioMinimalist,
      tagColor: "bg-sky-500/20 text-sky-400 border-sky-500/30"
    },
    {
      title: "Panduan Freelancer Pemula",
      category: "E-Book",
      desc: "Panduan lengkap memulai karir freelance dari nol.",
      image: panduanFreelancerPemula,
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      title: "Dashboard Finance",
      category: "Tools",
      desc: "Template dashboard keuangan pribadi untuk Notion.",
      image: dashboardFinance,
      tagColor: "bg-violet-500/20 text-violet-400 border-violet-500/30"
    }
  ];

  // Micro features/milestones
  const features = [
    {
      title: "Koleksi Berkualitas",
      desc: "Produk digital terkurasi dengan standar terbaik.",
      icon: BookOpen,
      iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20"
    },
    {
      title: "Aman & Terpercaya",
      desc: "Setiap produk melalui proses verifikasi.",
      icon: ShieldCheck,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Dibuat oleh Talenta",
      desc: "Mendukung kreator lokal dan komunitas digital.",
      icon: Users,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Akses Instan",
      desc: "Unduh langsung setelah pembayaran.",
      icon: Zap,
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/20"
    }
  ];

  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 lg:pt-28">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] animate-pulse animation-delay-200 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,182,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,182,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Hero content, Call to Actions & Trust badges */}
          <div className="xl:col-span-7 flex flex-col justify-center text-left animate-fade-up">
            
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-primary/20 bg-primary/5 mb-6 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#38b6ff]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-foreground">
                Marketplace Produk Digital STT NF
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight">
              Koleksi produk digital pilihan untuk mendukung{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(199,100%,75%)] to-primary bg-clip-text text-transparent">
                kreativitas dan produktivitasmu.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Temukan berbagai template, e-book, dan tools digital yang dibuat oleh talenta berbakat untuk membantu kamu belajar, bekerja, dan berkarya lebih efektif.
            </p>

            {/* CTA Actions Row */}
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <Button
                onClick={handleScrollToProducts}
                size="lg"
                className="rounded-full bg-primary text-black hover:bg-primary/90 glow-primary-sm hover:glow-primary font-bold px-7 py-6 text-sm sm:text-base flex items-center gap-2 group transition-all"
              >
                Jelajahi Produk
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border hover:border-primary/50 bg-card hover:bg-secondary text-foreground hover:text-primary font-bold px-7 py-6 text-sm sm:text-base flex items-center gap-2 transition-all"
                >
                  Menjadi Kreator
                  <UserPlus className="w-4.5 h-4.5" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges - 4 Column Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border/40">
              {features.map((feat, index) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${feat.iconColor}`}>
                      <FeatIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground mt-1">
                      {feat.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-normal">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Kategori Populer & Produk Terbaru Grid */}
          <div className="xl:col-span-5 flex flex-col gap-8 animate-fade-up animation-delay-200">
            
            {/* 1. Kategori Produk Populer */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Kategori Produk Populer
                </h3>
                <button 
                  onClick={handleScrollToProducts} 
                  className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors group"
                >
                  Lihat semua
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Grid 4 Category Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                {popularCategories.map((cat, idx) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex flex-col items-start text-left p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border mb-3 ${cat.colorClass}`}>
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 leading-normal">
                        {cat.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Produk Terbaru (Row of 3 cards) */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Produk Terbaru
                </h3>
                <button
                  onClick={handleScrollToProducts} 
                  className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors group"
                >
                  Lihat semua
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Grid 3 Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {latestProducts.map((prod, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCategoryClick(prod.category)}
                      className="flex flex-col rounded-2xl bg-card border border-border/80 overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    >
                      {/* Image container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                        <img 
                          src={prod.image} 
                          alt={prod.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Overlay Tag Category */}
                        <span className={`absolute left-3 bottom-3 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${prod.tagColor} backdrop-blur-md`}>
                          {prod.category}
                        </span>
                      </div>

                      {/* Content info */}
                      <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-foreground leading-tight group-hover:text-primary transition-colors truncate">
                            {prod.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {prod.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

