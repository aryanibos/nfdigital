import ProductCard from "./ProductCard";
import notionPlanner from "@/assets/notion-planner.jpg";
import lightroomPresets from "@/assets/lightroom-presets.jpg";
import ebookFreelance from "@/assets/ebook-freelance.jpg";
import saasUiKit from "@/assets/saas-ui-kit.jpg";

const products = [
  {
    name: "Notion Life Planner 2024",
    category: "Productivity",
    price: "Rp 49.000",
    description: "Template Notion all-in-one untuk mengatur jadwal dan target hidupmu.",
    image: notionPlanner,
    featured: true,
  },
  {
    name: "Ultimate Lightroom Presets",
    category: "Photography",
    price: "Rp 75.000",
    description: "50+ Preset estetik untuk foto Instagram yang lebih kece.",
    image: lightroomPresets,
    featured: false,
  },
  {
    name: "E-Book: Jago Freelance",
    category: "Education",
    price: "Rp 35.000",
    description: "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
    image: ebookFreelance,
    featured: false,
  },
  {
    name: "SaaS UI Kit Figma",
    category: "Design",
    price: "Rp 150.000",
    description: "Kumpulan komponen UI modern untuk desain aplikasi web.",
    image: saasUiKit,
    featured: true,
  },
];

const ProductGrid = () => {
  return (
    <section id="produk" className="py-20 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Koleksi Kami</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Produk <span className="text-gradient">Terlaris</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan aset digital berkualitas tinggi yang akan membantu kamu berkarya lebih baik.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {/* Featured Product - Large */}
          <div className="lg:row-span-2">
            <ProductCard {...products[0]} />
          </div>

          {/* Regular Products */}
          <div className="animate-slide-up animation-delay-100">
            <ProductCard {...products[1]} />
          </div>
          <div className="animate-slide-up animation-delay-200">
            <ProductCard {...products[2]} />
          </div>

          {/* Featured Product - Large */}
          <div className="lg:col-span-2 animate-slide-up animation-delay-300">
            <ProductCard {...products[3]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
