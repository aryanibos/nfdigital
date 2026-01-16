import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/nfdigital-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/#produk" },
    { label: "Tentang", href: "/#tentang" },
    { label: "Kontak", href: "/kontak" },
  ];

  const productLinks = [
    { label: "Template Digital", href: "/#produk" },
    { label: "E-Book & Panduan", href: "/#produk" },
    { label: "Aset Desain", href: "/#produk" },
    { label: "Video & Kursus", href: "/#produk" },
    { label: "Source Code", href: "/#produk" },
    { label: "UI/UX Kit", href: "/#produk" },
    { label: "Preset & Filter", href: "/#produk" },
    { label: "Font & Typography", href: "/#produk" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="NFDigital" className="h-10 w-10 rounded-lg" />
            <span className="text-xl lg:text-2xl font-extrabold text-foreground hidden sm:block">
              NF<span className="text-primary">Digital</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Product Links - Hidden on Desktop, shown only on mobile */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Product Links - Mobile */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Produk Digital</p>
                <div className="flex flex-wrap gap-2">
                  {productLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
