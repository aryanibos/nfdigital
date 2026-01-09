import { CreditCard, Mail, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CreditCard,
    title: "Pilih & Bayar",
    description: "Pilih aset favoritmu dan selesaikan pembayaran via QRIS/E-Wallet.",
  },
  {
    number: "02",
    icon: Mail,
    title: "Terima Link",
    description: "Link download otomatis dikirim ke email & WhatsApp-mu dalam detik.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Mulai Berkarya",
    description: "Akses selamanya. Gunakan aset untuk project kreatifmu!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Mudah & Cepat
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Cara <span className="text-gradient">Kerja</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Dapatkan aset digital impianmu dalam 3 langkah sederhana
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative group animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                {/* Card */}
                <div className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group-hover:glow-primary-sm">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
