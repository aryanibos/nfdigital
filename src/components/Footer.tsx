import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer id="kontak" className="py-12 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <span className="text-xl font-extrabold text-foreground">
              NF<span className="text-primary">Digital</span>Store
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              © 2024 NFDigitalStore. Dibuat dengan kreativitas tanpa batas.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
