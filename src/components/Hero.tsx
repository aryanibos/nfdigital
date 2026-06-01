import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  UserPlus, 
  FileText, 
  LayoutGrid, 
  Palette,
  BookOpen,
  ChevronRight,
  Wallet,
  Users,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";

// New Premium Mockup Images
import portofolioMinimalist from "@/assets/portofolio-minimalist.png";
import panduanFreelancerPemula from "@/assets/panduan-freelancer-pemula.png";
import dashboardFinance from "@/assets/dashboard-finance.png";

const Hero = () => {
  // Dynamic stats from Admin "Statistik Home"
  const [heroStats, setHeroStats] = useState({
    totalDana: "Rp 12.500.000",
    jumlahDonatur: "15",
    kampanyeAktif: "8"
  });

  useEffect(() => {
    const saved = localStorage.getItem("homepage_stats");
    if (saved) {
      try { setHeroStats(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

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

  // Dynamic stats config pulled from homepage_stats localStorage
  const statItems = [
    {
      key: "totalDana",
      label: "Produk Digital",
      value: heroStats.totalDana,
      icon: Wallet,
    },
    {
      key: "jumlahDonatur",
      label: "Mahasiswa Aktif",
      value: heroStats.jumlahDonatur,
      icon: Users,
    },
    {
      key: "kampanyeAktif",
      label: "Kategori Terdaftar",
      value: heroStats.kampanyeAktif,
      icon: Tag,
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
            <div className="flex flex-wrap items-center gap-4 mb-8">
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

        {/* Full-width Gradient Stats Banner */}
        <div className="mt-12 w-full rounded-3xl overflow-hidden shadow-2xl animate-fade-up animation-delay-300">
          <div
            className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/10"
            style={{ background: "linear-gradient(135deg, #0d6b85 0%, #0b5272 45%, #093d62 100%)" }}
          >
            {statItems.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="flex-1 flex items-center gap-5 px-7 sm:px-8 py-7 group">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:bg-white/15 transition-colors duration-300">
                    <StatIcon className="w-6 h-6 text-white/90" />
                  </div>
                  {/* Value & Label */}
                  <div className="min-w-0">
                    <p className="text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight truncate">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/65 mt-1.5 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

