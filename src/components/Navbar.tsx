import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, LogIn, LogOut, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ProfileModal from "./ProfileModal";

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

const Navbar = ({ onToggleSidebar, isSidebarOpen = true }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileUpdate = () => {
    const sessionStr = localStorage.getItem("active_user_session");
    if (sessionStr) {
      try {
        setSession(JSON.parse(sessionStr));
      } catch (e) {}
    }
  };

  // Load session state
  useEffect(() => {
    const sessionStr = localStorage.getItem("active_user_session");
    if (sessionStr) {
      try {
        setSession(JSON.parse(sessionStr));
      } catch (e) {
        setSession(null);
      }
    } else {
      setSession(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("active_user_session");
    setSession(null);
    toast({
      title: "Keluar Sesi 🔓",
      description: "Anda telah keluar dari portal.",
    });
    navigate("/");
  };

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/produk" },
    { label: "Tentang", href: "/kontak" },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border h-16 lg:h-20 transition-all duration-300",
      isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
    )}>
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        
        {/* Left Section: Toggle & Brand */}
        <div className="flex items-center gap-3">
          {/* Toggle Sidebar Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 rounded-xl bg-secondary/80 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all duration-200"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center lg:hidden">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight leading-none">
                NF Katalog
              </h1>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
                Bisnis Digital
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Navigation Links & Portal Button */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {navLinks.map((link) => {
            const isActive = 
              link.href === "/" 
                ? location.pathname === "/"
                : location.pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "px-2 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hidden md:block",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Unified Dynamic Portal Access Button in Top Navbar */}
          {!session ? (
            <Link
              to="/login"
              className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-2 glow-primary-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Portal</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-secondary/80 hover:bg-secondary text-foreground flex items-center gap-2 border border-border transition-all hover:border-primary/50 group"
                title="Klik untuk Edit Profil & Kata Sandi"
              >
                {session.avatar ? (
                  <img 
                    src={session.avatar} 
                    alt="Profile" 
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-primary/30"
                  />
                ) : session.role === "admin" ? (
                  <Lock className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                ) : (
                  <User className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                )}
                <span className="max-w-[70px] sm:max-w-[120px] truncate font-semibold">
                  {session.name || (session.role === "admin" ? "Admin" : session.username)}
                </span>
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-secondary/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 border border-border transition-colors"
                title="Keluar Sesi"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>
        
      </div>

      {/* Centralized Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onProfileUpdated={handleProfileUpdate}
      />
    </header>
  );
};

export default Navbar;
