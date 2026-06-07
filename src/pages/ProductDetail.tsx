import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag, FileText, Layers, Star, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
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
    longDescription: "Template Notion Life Planner 2024 adalah solusi lengkap untuk mengorganisir seluruh aspek kehidupanmu. Dengan desain yang elegan dan fungsional, template ini membantu kamu melacak goal tahunan, jadwal harian, habit tracker, dan masih banyak lagi.",
    features: [
      "Goal Tracker Tahunan & Bulanan",
      "Habit Tracker dengan visualisasi progress",
      "Jadwal mingguan & harian terintegrasi",
      "Database proyek dengan Kanban view",
      "Finance tracker sederhana",
      "Reading list & notes section"
    ],
    format: "Notion Template",
    compatibility: "Notion Free & Pro",
  },
  {
    id: "ultimate-lightroom-presets",
    name: "Ultimate Lightroom Presets",
    category: "Desain",
    description: "50+ Preset estetik untuk foto Instagram yang lebih kece.",
    image: lightroomPresets,
    featured: false,
    longDescription: "Koleksi 50+ preset Lightroom yang dikurasi dengan cermat untuk memberikan look profesional pada foto-fotomu. Cocok untuk berbagai jenis fotografi mulai dari portrait, landscape, hingga food photography.",
    features: [
      "50+ preset dengan berbagai mood",
      "Kompatibel dengan Lightroom Desktop & Mobile",
      "One-click application",
      "Panduan penggunaan lengkap",
      "Update gratis selamanya",
      "Support via email"
    ],
    format: "XMP & DNG Files",
    compatibility: "Lightroom CC, Lightroom Classic, Lightroom Mobile",
  },
  {
    id: "ebook-jago-freelance",
    name: "E-Book: Jago Freelance",
    category: "E-Book",
    description: "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
    image: ebookFreelance,
    featured: false,
    longDescription: "E-Book komprehensif yang akan membimbingmu dari pemula hingga menjadi freelancer sukses. Berisi strategi praktis, tips negosiasi client, dan cara membangun personal brand yang kuat.",
    features: [
      "200+ halaman konten berkualitas",
      "Studi kasus nyata dari freelancer sukses",
      "Template proposal & kontrak",
      "Strategi pricing yang efektif",
      "Tips mengelola keuangan freelance",
      "Bonus: List platform freelance terbaik"
    ],
    format: "PDF & EPUB",
    compatibility: "Semua device & e-reader",
  },
  {
    id: "saas-ui-kit-figma",
    name: "SaaS UI Kit Figma",
    category: "Desain",
    description: "Kumpulan komponen UI modern untuk desain aplikasi web.",
    image: saasUiKit,
    featured: true,
    longDescription: "UI Kit lengkap untuk mendesain aplikasi SaaS dengan cepat dan konsisten. Dibuat dengan sistem desain yang terstruktur, memudahkan kolaborasi tim dan mempercepat proses development.",
    features: [
      "500+ komponen UI siap pakai",
      "Design system lengkap",
      "Dark & Light mode",
      "Responsive untuk semua ukuran layar",
      "Auto layout & variants",
      "Documentation lengkap"
    ],
    format: "Figma File",
    compatibility: "Figma Free & Professional",
  },
  {
    id: "social-media-templates",
    name: "Social Media Templates",
    category: "Template",
    description: "100+ template Instagram, TikTok, dan YouTube siap pakai.",
    image: socialMediaTemplates,
    featured: false,
    longDescription: "Paket template social media yang akan membuat kontenmu tampil profesional dan menarik. Cocok untuk content creator, bisnis online, dan social media manager.",
    features: [
      "100+ template untuk berbagai platform",
      "Instagram Post, Story, Reels cover",
      "TikTok & YouTube Thumbnail",
      "Editable di Canva & Figma",
      "Font & color guide included",
      "Commercial license"
    ],
    format: "Canva & Figma Templates",
    compatibility: "Canva Free/Pro, Figma",
  },
  {
    id: "video-editing-course",
    name: "Video Editing Course",
    category: "Video",
    description: "Kursus lengkap editing video dari dasar hingga mahir.",
    image: videoCourse,
    featured: false,
    longDescription: "Kursus video editing komprehensif yang akan membawamu dari pemula hingga mahir. Pelajari teknik editing profesional dengan software populer dan ciptakan konten yang memukau.",
    features: [
      "40+ video tutorial HD",
      "Project files untuk latihan",
      "Materi dari basic hingga advanced",
      "Color grading & sound design",
      "Motion graphics dasar",
      "Akses lifetime + update"
    ],
    format: "Video Course (MP4)",
    compatibility: "Premiere Pro, DaVinci Resolve, CapCut",
  },
  {
    id: "react-component-library",
    name: "React Component Library",
    category: "Kode",
    description: "50+ komponen React siap pakai untuk proyek web modern.",
    image: reactComponents,
    featured: false,
    longDescription: "Library komponen React yang dibangun dengan TypeScript dan Tailwind CSS. Setiap komponen sudah teruji, accessible, dan siap digunakan untuk proyek production.",
    features: [
      "50+ komponen production-ready",
      "TypeScript support penuh",
      "Tailwind CSS styling",
      "Fully accessible (WCAG 2.1)",
      "Dark mode support",
      "Storybook documentation"
    ],
    format: "NPM Package / Source Code",
    compatibility: "React 18+, Next.js 13+",
  },
  {
    id: "digital-marketing-ebook",
    name: "Digital Marketing E-Book",
    category: "E-Book",
    description: "Strategi pemasaran digital untuk bisnis online sukses.",
    image: marketingEbook,
    featured: false,
    longDescription: "Panduan komprehensif tentang digital marketing yang mencakup SEO, social media marketing, email marketing, dan paid advertising. Cocok untuk pemilik bisnis dan marketer.",
    features: [
      "150+ halaman strategi praktis",
      "Case study brand Indonesia",
      "Template content calendar",
      "Checklist campaign marketing",
      "ROI calculator spreadsheet",
      "Bonus: Trend marketing 2024"
    ],
    format: "PDF & Google Docs",
    compatibility: "Semua device",
  },
];

import { getProducts } from "@/lib/productsStore";

const ProductDetail = () => {
  const { id } = useParams();
  
  const allProducts = getProducts();
  const rawProduct = allProducts.find((p) => p.id === id);
  const fallbackProduct = products.find((p) => p.id === id);

  const product = rawProduct ? {
    id: rawProduct.id,
    name: rawProduct.name,
    category: rawProduct.category,
    image: rawProduct.image || fallbackProduct?.image,
    featured: rawProduct.featured,
    longDescription: fallbackProduct?.longDescription || rawProduct.description,
    features: fallbackProduct?.features || [
      "Akses penuh selamanya",
      "Dukungan teknis berkelanjutan",
      "Kompatibel dengan perangkat standar",
      "File siap pakai & mudah dimodifikasi",
      `Dibuat oleh ${rawProduct.author || "Mahasiswa STT NF"}`
    ],
    format: fallbackProduct?.format || rawProduct.subcategory || "Digital Asset",
    compatibility: fallbackProduct?.compatibility || (rawProduct.jurusan ? `Jurusan ${rawProduct.jurusan}` : "Semua Perangkat Modern"),
  } : fallbackProduct;

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">Maaf, produk yang kamu cari tidak tersedia.</p>
          <Link 
            to="/#produk" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Produk
          </Link>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      
      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Link 
            to="/#produk" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Produk
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="relative">
              <div className="sticky top-28">
                <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                </div>
                {product.featured && (
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Featured
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </Badge>
                  {rawProduct?.jurusan && (
                    <Badge className="bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 text-xs font-semibold px-3 py-1 rounded-full">
                      {rawProduct.jurusan}
                    </Badge>
                  )}
                  {product.format && (
                    <Badge className="bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.format}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {product.longDescription}
                </p>
                
                {rawProduct?.price && Number(rawProduct.price) > 0 && (
                  <div className="text-2xl font-extrabold text-blue-600 mb-6">
                    Rp {Number(rawProduct.price).toLocaleString("id-ID")}
                  </div>
                )}
              </div>

              {/* Informasi Pembuat */}
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground/80">
                  Informasi Pembuat
                </h3>
                {(() => {
                  const authorLower = rawProduct?.author?.toLowerCase() || "";
                  const isAdmin = authorLower === "admin" || authorLower === "administrator utama" || rawProduct?.nim === "ADMIN";
                  
                  const creatorName = isAdmin ? "Administrator" : (rawProduct?.author || "Budi Santoso");
                  const creatorRole = isAdmin ? "Pengelola Portal" : `Mahasiswa ${rawProduct?.jurusan || "Bisnis Digital"}`;
                  
                  return (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base">
                          {creatorName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {creatorRole}
                        </p>
                      </div>
                    </div>
                  );
                })()}
                <div className="border-t border-border pt-3.5 flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Calendar className="w-4 h-4 text-muted-foreground/80" />
                  <span>
                    Ditambahkan {new Date(rawProduct?.createdAt || Date.now()).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
};

export default ProductDetail;
