import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pesan terkirim! ✨",
      description: "Kami akan balas secepatnya.",
    });
    setFormData({ name: "", email: "", topic: "", message: "" });
  };

  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: "support@nfdigitalstore.com",
    },
    {
      icon: Phone,
      label: "WhatsApp",
      value: "+62 813-1715-2044",
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: "Jl. Situ Indah 116, Tugu, Cimanggis, Depok, Jawa Barat.",
    },
  ];

  return (
    <Layout>

      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Information */}
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground">
                  Yuk, <span className="text-gradient">Ngobrol!</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Punya pertanyaan soal produk, kendala download, atau mau request template khusus? Tim NFDigitalStore
                  siap bantu.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactDetails.map((detail, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <detail.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{detail.label}</p>
                      <p className="text-foreground font-medium">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Maps Embed */}
              <div className="relative mt-8">
                <div className="glass rounded-2xl p-2 overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2415692469544!2d106.84445269999999!3d-6.3627739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed6178a2b32f%3A0x20d7938791acfd4a!2sSTT%20Terpadu%20Nurul%20Fikri%20(Kampus%20A%20-%20Sekretariat)!5e0!3m2!1sid!2sid!4v1767946412059!5m2!1sid!2sid" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0, borderRadius: '0.75rem' }}
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi NFDigitalStore"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-fade-up animation-delay-200">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Kirim Pesan</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
                    <Input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Topik</label>
                    <Select
                      value={formData.topic}
                      onValueChange={(value) => setFormData({ ...formData, topic: value })}
                    >
                      <SelectTrigger className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12">
                        <SelectValue placeholder="Pilih topik" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="kendala">Kendala Download</SelectItem>
                        <SelectItem value="request">Request Produk</SelectItem>
                        <SelectItem value="kerjasama">Kerjasama</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Pesan</label>
                    <Textarea
                      placeholder="Tulis pesanmu di sini..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 min-h-[140px] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base glow-primary-sm hover:glow-primary transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pesan
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
};

export default Contact;
