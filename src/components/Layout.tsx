import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, GraduationCap, Lock, ShieldAlert } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);       // mobile drawer
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true); // desktop sidebar
  const [loginRole, setLoginRole] = useState<"mahasiswa" | "admin" | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);           // mobile drawer
    setIsDesktopSidebarOpen(prev => !prev);    // desktop sidebar
  };

  const handleOpenLogin = (role: "mahasiswa" | "admin") => {
    setLoginRole(role);
    setLoginForm({ username: "", password: "" });
  };

  const handleCloseLogin = () => {
    setLoginRole(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show premium toast
    toast({
      title: loginRole === "admin" ? "Login Admin Berhasil! 🔐" : "Login Mahasiswa Berhasil! 🎓",
      description: `Selamat datang kembali, ${loginForm.username || "User"}!`,
    });
    
    setLoginRole(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isDesktopSidebarOpen} />

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isDesktopOpen={isDesktopSidebarOpen}
        onOpenLogin={handleOpenLogin}
      />

      {/* Main Content Layout Wrapper */}
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col pt-16 lg:pt-20",
        isDesktopSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        <main className="flex-grow">
          {children}
        </main>
      </div>

      {/* Premium Login Dialog */}
      <Dialog open={loginRole !== null} onOpenChange={(open) => !open && handleCloseLogin()}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-2xl animate-fade-in">
          <DialogHeader className="items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 glow-primary-sm">
              {loginRole === "admin" ? (
                <ShieldAlert className="w-6 h-6 text-primary" />
              ) : (
                <GraduationCap className="w-6 h-6 text-primary" />
              )}
            </div>
            <DialogTitle className="text-xl font-extrabold text-foreground">
              {loginRole === "admin" ? "Login Administrator" : "Login Portal Mahasiswa"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {loginRole === "admin" 
                ? "Silakan masukkan kredensial pengelola Anda." 
                : "Silakan login menggunakan NIM dan kata sandi Anda."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLoginSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                {loginRole === "admin" ? "Email / Username" : "NIM (Nomor Induk Mahasiswa)"}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={loginRole === "admin" ? "admin@nfdigital.com" : "0110221000"}
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Kata Sandi
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-11"
              />
            </div>

            <DialogFooter className="pt-4 flex sm:justify-between items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseLogin}
                className="rounded-xl h-11 px-6 border-border text-muted-foreground hover:text-foreground"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-xl h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex items-center gap-2 glow-primary-sm hover:glow-primary"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
