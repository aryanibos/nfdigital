import { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Mohon masukkan email yang valid");
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    toast.success("Selamat! Kode diskon sudah dikirim ke emailmu 🎉");
    setEmail("");
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-primary/15 rounded-full blur-[100px] animate-pulse animation-delay-200" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">
              Penawaran Terbatas
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-up animation-delay-100">
            Dapetin Diskon <span className="text-gradient">20%</span> untuk
            Pembelian Pertama!
          </h2>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground mb-10 animate-fade-up animation-delay-200">
            Gabung ke newsletter kami biar gak ketinggalan update aset terbaru
            dan promo eksklusif.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-fade-up animation-delay-300"
          >
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Masukkan email kamu..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 rounded-full bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitted}
              className="h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold group"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Terkirim!
                </>
              ) : (
                <>
                  Klaim Diskon
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Trust Text */}
          <p className="text-sm text-muted-foreground mt-6 animate-fade-up animation-delay-400">
            🔒 Kami tidak akan spam. Emailmu aman bersama kami.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
