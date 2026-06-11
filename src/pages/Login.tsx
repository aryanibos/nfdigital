import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, GraduationCap, Lock, KeyRound, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Determine current portal role view
  const searchParams = new URLSearchParams(window.location.search);
  const role = searchParams.get("role") || "mahasiswa";
  const isStudent = role === "mahasiswa";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({
        title: "Gagal Masuk ❌",
        description: isStudent ? "NIM dan kata sandi harus diisi." : "Username dan kata sandi harus diisi.",
        variant: "destructive",
      });
      return;
    }

    const normUsername = username.toLowerCase().trim();
    const isNewAdmin = normUsername === "admin";

    // 10-digit NIM validation for student portal path
    if (isStudent) {
      const nimRegex = /^[0-9]{10}$/;
      if (!nimRegex.test(username.trim())) {
        toast({
          title: "NIM Salah ❌",
          description: "NIM salah, masukkan NIM benar",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Admin path constraint
      if (normUsername !== "admin") {
        toast({
          title: "Gagal Masuk ❌",
          description: "Portal ini khusus untuk login Administrator.",
          variant: "destructive",
        });
        return;
      }
    }

    // Auth logic via API
    fetch("/api/api.php?action=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        role: isStudent ? "mahasiswa" : "admin"
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal masuk");
        }
        
        localStorage.setItem("active_user_session", JSON.stringify(data.session));
        
        toast({
          title: data.session.role === "admin" ? "Login Admin Berhasil! 🔐" : "Login Mahasiswa Berhasil! 🎓",
          description: data.session.role === "admin" 
            ? "Selamat datang kembali di Panel Pengelola."
            : `Selamat datang kembali, ${data.session.name}!`,
        });
        
        navigate(data.session.role === "admin" ? "/admin" : "/submit");
      })
      .catch((err) => {
        toast({
          title: "Gagal Masuk ❌",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-3 glow-primary-sm">
              {isStudent ? (
                <GraduationCap className="w-8 h-8 text-primary" />
              ) : (
                <Lock className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {isStudent ? "Portal Mahasiswa" : "Portal Administrator"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isStudent 
                ? "Silakan masuk menggunakan akun Portal Mahasiswa STT NF" 
                : "Silakan masuk menggunakan akun pengelola Anda"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                {isStudent ? "NIM (Nomor Induk Mahasiswa)" : "Username Admin"}
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder={isStudent ? "Masukkan NIM Anda" : "Masukkan username admin"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12 pl-10"
                />
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Kata Sandi
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12 pl-10"
                />
                <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base glow-primary-sm hover:glow-primary transition-all flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              {isStudent ? "Masuk Mahasiswa" : "Masuk Administrator"}
            </Button>
          </form>

          {/* Quick instructions/credits */}
          <div className="mt-8 border-t border-border pt-4 text-center">
            <p className="text-[11px] text-muted-foreground">
              💡 <strong>Tips Percobaan:</strong>
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-1">
              {isStudent 
                ? "• Masukkan 10 digit NIM bebas & kata sandi bebas untuk didaftarkan otomatis." 
                : "• Masuk sebagai Admin: ketik admin / admin"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Login;
