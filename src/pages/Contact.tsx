import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
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
      value: "+62 812-XXXX-XXXX (Fast Response)",
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: "Jl. Kreativitas Digital No. 88, Jakarta Selatan, Indonesia.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Information */}
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground">
                  Yuk, <span className="text-gradient">Ngobrol!</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Punya pertanyaan soal produk, kendala download, atau mau request template khusus? Tim NFDigitalStore siap bantu.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 group"
                  >
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

              {/* Map Placeholder */}
              <div className="relative mt-8">
                <div className="glass rounded-2xl p-8 h-48 flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-8 w-24 h-px bg-primary/50"></div>
                    <div className="absolute top-8 left-4 w-32 h-px bg-primary/30"></div>
                    <div className="absolute top-16 left-12 w-20 h-px bg-primary/40"></div>
                    <div className="absolute top-24 left-6 w-28 h-px bg-primary/20"></div>
                    <div className="absolute top-32 left-16 w-16 h-px bg-primary/50"></div>
                    <div className="absolute top-4 right-8 w-20 h-px bg-primary/30"></div>
                    <div className="absolute top-12 right-4 w-24 h-px bg-primary/40"></div>
                    <div className="absolute top-20 right-12 w-18 h-px bg-primary/20"></div>
                    <div className="absolute top-28 right-6 w-22 h-px bg-primary/50"></div>
                    <div className="absolute left-8 top-4 w-px h-20 bg-primary/30"></div>
                    <div className="absolute left-16 top-8 w-px h-24 bg-primary/40"></div>
                    <div className="absolute left-24 top-2 w-px h-28 bg-primary/20"></div>
                    <div className="absolute right-8 top-6 w-px h-22 bg-primary/30"></div>
                    <div className="absolute right-16 top-4 w-px h-26 bg-primary/40"></div>
                    <div className="absolute right-24 top-10 w-px h-18 bg-primary/20"></div>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 glow-primary-sm">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">Basecamp Kami</p>
                    <p className="text-sm text-muted-foreground">Jakarta Selatan, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-fade-up animation-delay-200">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Kirim Pesan
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nama Lengkap
                    </label>
                    <Input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Topik
                    </label>
                    <Select
                      value={formData.topic}
                      onValueChange={(value) =>
                        setFormData({ ...formData, topic: value })
                      }
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
                    <label className="text-sm font-medium text-foreground">
                      Pesan
                    </label>
                    <Textarea
                      placeholder="Tulis pesanmu di sini..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
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
    </div>
  );
};

export default Contact;
