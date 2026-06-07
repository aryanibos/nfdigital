import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  UserPlus, 
  ChevronRight,
  Wallet,
  Users,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/productsStore";

const Hero = () => {
  const [heroStats, setHeroStats] = useState({
    totalPendanaan: "Rp 0",
    jumlahUsaha: "0",
    jumlahProduk: "0"
  });

  const [latestProducts, setLatestProducts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch Dynamic Stats
    const saved = localStorage.getItem("homepage_stats");
    if (saved) {
      try { 
        setHeroStats(JSON.parse(saved)); 
      } catch (e) {}
    } else {
      // Calculate inline fallback from localStorage to prevent flash
      const savedSubs = localStorage.getItem("student_submissions");
      if (savedSubs) {
        try {
          const currentSubs = JSON.parse(savedSubs);
          const approvedSubs = currentSubs.filter((sub: any) => sub.status === "Disetujui");
          const totalFunding = approvedSubs.reduce((acc: number, sub: any) => acc + (Number(sub.fundingAmount) || 0), 0);
          const uniqueNims = new Set(approvedSubs.map((sub: any) => sub.nim));
          const totalUsaha = uniqueNims.size;
          const totalProducts = approvedSubs.length;
          
          const formatCurrency = (num: number) => {
            return new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(num).replace(/,00$/, "");
          };

          setHeroStats({
            totalPendanaan: totalFunding > 0 ? formatCurrency(totalFunding) : "Rp 0",
            jumlahUsaha: totalUsaha.toString(),
            jumlahProduk: totalProducts.toString()
          });
        } catch (err) {}
      }
    }

    // 2. Fetch Latest Products
    const allProducts = getProducts();
    const sorted = [...allProducts].sort((a, b) => b.createdAt - a.createdAt);
    const formatted = sorted.slice(0, 3).map((prod) => {
      let tag = prod.category.toUpperCase();
      let tagColor = "bg-amber-50 text-amber-600 border-amber-100";
      
      if (prod.category.toLowerCase().includes("template")) {
        tag = "TEMPLATE";
        tagColor = "bg-blue-50 text-blue-600 border-blue-100";
      } else if (prod.category.toLowerCase().includes("ebook") || prod.category.toLowerCase().includes("panduan")) {
        tag = "E-BOOK";
        tagColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
      } else if (prod.category.toLowerCase().includes("code") || prod.category.toLowerCase().includes("tool") || prod.category.toLowerCase().includes("ui")) {
        tag = "TOOLS";
        tagColor = "bg-purple-50 text-purple-600 border-purple-100";
      }

      const priceStr = prod.price && Number(prod.price) > 0 
        ? `Rp ${Number(prod.price).toLocaleString("id-ID")}` 
        : "";

      return {
        id: prod.id,
        title: prod.name,
        category: tag,
        desc: prod.description,
        image: prod.image,
        price: priceStr,
        tagColor: tagColor,
        rawCategory: prod.category
      };
    });

    setLatestProducts(formatted);
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
    let targetCategory = categoryName;
    if (categoryName === "E-Book") targetCategory = "E-Book & Panduan";
    if (categoryName === "Tools") targetCategory = "Source Code";
    if (categoryName === "Template") targetCategory = "Desain & Template";

    const event = new CustomEvent("filter-category", { detail: targetCategory });
    window.dispatchEvent(event);

    const el = document.getElementById("produk");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beranda" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16 lg:pt-28 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Hero text and CTAs */}
          <div className="xl:col-span-7 flex flex-col justify-center text-left animate-fade-up">
            
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/30 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Katalog Produk Digital STT NF
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight text-slate-900">
              koleksi katalog produk pilihan untuk mendukung{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent block">
                kreativitas dan produktivitas mahasiswa.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8 max-w-xl">
              Temukan berbagai template, e-book, dan tools digital yang dibuat oleh talenta berbakat untuk membantu kamu belajar, bekerja, dan berkarya lebih efektif.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleScrollToProducts}
                size="lg"
                className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-5.5 text-sm sm:text-base flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20"
              >
                Jelajahi Produk
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
              
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-5.5 text-sm sm:text-base flex items-center gap-2 transition-all"
                >
                  Menjadi Kreator
                  <UserPlus className="w-4.5 h-4.5 text-slate-500" />
                </Button>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: "Produk Terbaru" + Stats Section */}
          <div className="xl:col-span-5 flex flex-col animate-fade-up animation-delay-200 gap-6">
            
            {/* 1. "Produk Terbaru" main card wrapper */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/80">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Produk Terbaru
                </h3>
                <button 
                  onClick={handleScrollToProducts} 
                  className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group"
                >
                  Lihat semua
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Grid of 3 Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {latestProducts.map((prod, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCategoryClick(prod.rawCategory)}
                      className="flex flex-col rounded-2xl bg-white border border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      {/* Image container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                        <img 
                          src={prod.image} 
                          alt={prod.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Overlay Tag Category */}
                        <span className={`absolute left-2.5 bottom-2.5 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border ${prod.tagColor}`}>
                          {prod.category}
                        </span>
                      </div>

                      {/* Content info */}
                      <div className="p-3 flex flex-col gap-1.5 flex-1 justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                            {prod.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed min-h-[3.25rem]">
                            {prod.desc}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-blue-600 mt-1 min-h-[1.25rem]">
                          {prod.price || "\u00A0"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* 2. STATS BANNER PLACED UNDER THE PRODUCT TERBARU CARD */}
            <div className="w-full rounded-3xl bg-white border border-slate-100 shadow-sm shadow-slate-100/50 p-6">
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
                {/* Stat item 1 */}
                <div className="flex flex-col items-center justify-center p-1">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <Wallet className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-extrabold text-slate-800 leading-tight">
                    {heroStats.totalPendanaan}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-medium leading-tight">
                    Total Pendanaan
                  </p>
                </div>

                {/* Stat item 2 */}
                <div className="flex flex-col items-center justify-center p-1">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-extrabold text-slate-850 leading-tight">
                    {heroStats.jumlahUsaha}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-medium leading-tight">
                    Jumlah Usaha Mahasiswa
                  </p>
                </div>

                {/* Stat item 3 */}
                <div className="flex flex-col items-center justify-center p-1">
                  <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                    <Lightbulb className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-extrabold text-slate-850 leading-tight">
                    {heroStats.jumlahProduk}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-medium leading-tight">
                    Jumlah Produk
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
