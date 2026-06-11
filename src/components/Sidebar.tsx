import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Home, 
  Package, 
  Workflow, 
  Info, 
  LogIn, 
  Lock,
  LogOut,
  User,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ProfileModal from "./ProfileModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopOpen?: boolean;
  onOpenLogin?: (role: "mahasiswa" | "admin") => void;
}

const Sidebar = ({ isOpen, onClose, isDesktopOpen = true }: SidebarProps) => {
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

  // Load session on render & location change
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
    onClose();
    navigate("/");
  };

  const menuItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Produk", href: "/produk", icon: Package },
    { label: "Tentang", href: "/kontak", icon: Info },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card text-foreground border-r border-border py-6 px-4">
      {/* Header / Brand */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link to="/" className="flex items-center gap-3" onClick={() => onClose()}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight leading-none text-foreground">
              NF Katalog
            </h2>
            <span className="text-[11px] text-muted-foreground font-medium">
              Bisnis Digital
            </span>
          </div>
        </Link>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 space-y-8 overflow-y-auto pr-1">
        {/* Menu Section */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3">
            Menu
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                item.href === "/" 
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Portal Section based on Login Role */}
        {!session ? (
          /* NOT LOGGED IN: Show separate portal access buttons */
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3">
              Akses Portal
            </p>
            <Link
              to="/login?role=mahasiswa"
              onClick={() => onClose()}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <GraduationCap className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:scale-110" />
              Portal Mahasiswa
            </Link>
          </div>
        ) : session.role === "mahasiswa" ? (
          /* LOGGED IN AS STUDENT */
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3">
              Mahasiswa ({session.username})
            </p>
            <Link
              to="/submit"
              onClick={() => onClose()}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                location.pathname === "/submit"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <LogIn className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:scale-110" />
              Ajukan Produk
            </Link>

            <button
              onClick={() => {
                setIsProfileOpen(true);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-left group"
            >
              {session.avatar ? (
                <img 
                  src={session.avatar} 
                  alt="Profile" 
                  className="w-4 h-4 rounded-full object-cover border border-primary/30"
                />
              ) : (
                <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:scale-110" />
              )}
              Edit Profil & Sandi
            </button>
          </div>
        ) : (
          /* LOGGED IN AS ADMIN */
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3">
              Pengelolaan (Admin)
            </p>
            <Link
              to="/admin"
              onClick={() => onClose()}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                location.pathname === "/admin"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Lock className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:scale-110" />
              Panel Admin
            </Link>

            <button
              onClick={() => {
                setIsProfileOpen(true);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-left group"
            >
              {session.avatar ? (
                <img 
                  src={session.avatar} 
                  alt="Profile" 
                  className="w-4 h-4 rounded-full object-cover border border-primary/30"
                />
              ) : (
                <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:scale-110" />
              )}
              Edit Profil & Sandi
            </button>
          </div>
        )}
      </div>

      {/* Logout Action in Sidebar if Logged In */}
      {session && (
        <div className="pt-4 border-t border-border mt-auto mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group text-left"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform duration-200" />
            Keluar Portal
          </button>
        </div>
      )}

      {/* Footer Branding inside Sidebar */}
      <div className={cn("pt-4 border-t border-border mt-auto", session && "mt-0")}>
        <p className="text-[10px] text-muted-foreground text-center">
          © {new Date().getFullYear()} STT NF Bisnis Digital
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — slides in/out smoothly */}
      <aside className={cn(
        "hidden lg:block fixed top-0 bottom-0 left-0 w-64 z-30 transition-transform duration-300 ease-in-out",
        isDesktopOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      >
        <div 
          className={cn(
            "fixed top-0 bottom-0 left-0 w-72 max-w-[80vw] z-50 transition-transform duration-300 ease-out transform",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {sidebarContent}
        </div>
      </div>
      {/* Centralized Profile Modal in Sidebar */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onProfileUpdated={handleProfileUpdate}
      />
    </>
  );
};

export default Sidebar;
