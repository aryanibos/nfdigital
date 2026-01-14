import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nfdigital-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount] = useState(0);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/#produk" },
    { label: "Kategori", href: "/#kategori" },
    { label: "Kontak", href: "/kontak" },
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

          <div className="hidden md:flex items-center gap-8">
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

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 rounded-full border-border hover:border-primary hover:text-primary transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
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
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2 rounded-full border-border hover:border-primary hover:text-primary transition-all w-full"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Keranjang</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
