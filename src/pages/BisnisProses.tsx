import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { 
  Lightbulb, 
  Layers, 
  CheckCircle, 
  Rocket, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "1. Ideasi & Riset Pasar",
    desc: "Mahasiswa merumuskan ide produk kreatif berdasarkan riset peluang pasar, permasalahan riil, dan analisis kompetitor.",
    details: ["Brainstorming Ide", "Analisis SWOT", "Kuesioner Validasi Masalah"]
  },
  {
    icon: Layers,
    title: "2. Pembuatan Prototipe (MVP)",
    desc: "Mengembangkan produk versi awal (Minimum Viable Product) berupa aset digital, template, e-book, maupun prototipe sistem.",
    details: ["UI/UX Mockup", "Penyusunan Konten/Aset", "Penyempurnaan MVP"]
  },
  {
    icon: CheckCircle,
    title: "3. Validasi & Pitching",
    desc: "Mempresentasikan hasil karya kepada mentor/dosen dan melakukan uji coba langsung ke target pasar untuk mendapatkan masukan.",
    details: ["Presentasi Pitch Deck", "Pengujian Pengguna (UT)", "Sesi Feedback Dosen"]
  },
  {
    icon: Rocket,
    title: "4. Peluncuran & Pemasaran",
    desc: "Produk diluncurkan secara resmi ke platform katalog ini agar dapat diakses, dinikmati, atau dibeli oleh pengguna umum.",
    details: ["Listing di NF Katalog", "Kampanye Media Sosial", "Distribusi & Monitoring"]
  }
];

const BisnisProses = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Alur Produk Mahasiswa
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-3 mb-6">
              Siklus <span className="text-gradient">Bisnis Proses</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Bagaimana karya inovatif mahasiswa Bisnis Digital STT Terpadu Nurul Fikri bertransformasi dari sekadar ide menjadi produk nyata.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.title}
                  className="bg-card border border-border rounded-2xl p-6 relative hover:border-primary/50 transition-all duration-300 group card-hover shadow-lg"
                >
                  {/* Connector Arrow for Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-primary">
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-200">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Details Tags */}
                  <div className="space-y-2 border-t border-border pt-4">
                    {step.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats / Highlight */}
          <div className="mt-16 bg-card border border-border rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-foreground">
                  Fokus Kurikulum Berbasis Praktik Bisnis Riil
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Kami membekali mahasiswa dengan kemampuan analisis pasar yang tajam serta keahlian teknis untuk membangun produk digital berkualitas tinggi. Melalui katalog ini, hasil karya mahasiswa tervalidasi langsung oleh pasar.
                </p>
              </div>

              <div className="bg-secondary/40 border border-border rounded-2xl p-6 space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Portofolio Siap Kerja</h4>
                    <p className="text-sm text-muted-foreground">Karya yang dipublikasikan di sini menjadi bukti nyata keahlian mahasiswa yang siap dipresentasikan ke industri.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Inovasi Berkelanjutan</h4>
                    <p className="text-sm text-muted-foreground">Setiap semester melahirkan produk-produk baru yang menjawab tren perkembangan teknologi terkini.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  );
};

export default BisnisProses;
