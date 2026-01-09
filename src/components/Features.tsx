import { Shield, Zap, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Transaksi Aman",
    description: "Pembayaran terenkripsi dengan standar keamanan tinggi.",
  },
  {
    icon: Zap,
    title: "Akses Instan",
    description: "Langsung download setelah pembayaran berhasil.",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Tim kami siap membantu kapanpun kamu butuhkan.",
  },
];

const Features = () => {
  return (
    <section id="kategori" className="py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="glass rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center group animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:glow-primary-sm transition-all duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
