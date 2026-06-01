import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, GraduationCap, Lock, KeyRound } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({
        title: "Gagal Masuk ❌",
        description: "Username/NIM dan password harus diisi.",
        variant: "destructive",
      });
      return;
    }

    // Auth logic
    const accountsStr = localStorage.getItem("user_accounts");
    const accounts = accountsStr ? JSON.parse(accountsStr) : {};
    const normUsername = username.toLowerCase().trim();
    
    // Check if user already has an account
    const existingAccount = accounts[normUsername] || accounts[username];
    
    if (existingAccount) {
      if (existingAccount.password !== password) {
        toast({
          title: "Gagal Masuk ❌",
          description: "Kata sandi salah untuk akun ini.",
          variant: "destructive",
        });
        return;
      }
      
      // Match found, login with updated saved data
      const session = {
        role: normUsername === "admin" ? "admin" : "mahasiswa",
        username: normUsername === "admin" ? "admin" : username,
        name: existingAccount.name || (normUsername === "admin" ? "Administrator Utama" : username),
        nim: normUsername === "admin" ? "ADMIN" : (existingAccount.nim || username),
        avatar: existingAccount.avatar || ""
      };
      localStorage.setItem("active_user_session", JSON.stringify(session));
      
      toast({
        title: normUsername === "admin" ? "Login Admin Berhasil! 🔐" : "Login Mahasiswa Berhasil! 🎓",
        description: normUsername === "admin" 
          ? "Selamat datang kembali di Panel Pengelola."
          : `Selamat datang kembali, ${session.name}!`,
      });
      
      navigate(normUsername === "admin" ? "/admin" : "/submit");
      return;
    }

    // Default account registration on first login
    const isNewAdmin = normUsername === "admin";
    if (isNewAdmin && password !== "admin") {
      toast({
        title: "Gagal Masuk ❌",
        description: "Kata sandi bawaan admin adalah 'admin'.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new account record
    const newSession = {
      role: isNewAdmin ? "admin" : "mahasiswa",
      username: isNewAdmin ? "admin" : username,
      name: isNewAdmin ? "Administrator Utama" : (isNaN(Number(username)) ? username : "Mahasiswa Demo"),
      nim: isNewAdmin ? "ADMIN" : (isNaN(Number(username)) ? "0110221045" : username),
      avatar: ""
    };
    
    // Save to user_accounts database
    accounts[newSession.username] = {
      name: newSession.name,
      nim: newSession.nim,
      email: isNewAdmin ? "admin@nfdigital.ac.id" : `${newSession.username}@student.nurulfikri.ac.id`,
      bio: isNewAdmin ? "Administrator Utama Portal NF Katalog" : "Mahasiswa Bisnis Digital STT NF",
      avatar: "",
      password: password // set their password to whatever they typed on their first login!
    };
    localStorage.setItem("user_accounts", JSON.stringify(accounts));
    localStorage.setItem("active_user_session", JSON.stringify(newSession));
    
    toast({
      title: isNewAdmin ? "Login Admin Berhasil! 🔐" : "Pendaftaran & Login Berhasil! 🎓",
      description: isNewAdmin 
        ? "Selamat datang kembali di Panel Pengelola."
        : `Selamat datang, ${newSession.name}! Sandi Anda telah didaftarkan.`,
    });
    
    navigate(isNewAdmin ? "/admin" : "/submit");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-3 glow-primary-sm">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Portal NF Katalog</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Satu portal masuk untuk Mahasiswa & Admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                NIM / Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan NIM Anda / 'admin'"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12 pl-10"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              Masuk Portal
            </Button>
          </form>

          {/* Quick instructions/credits */}
          <div className="mt-8 border-t border-border pt-4 text-center">
            <p className="text-[11px] text-muted-foreground">
              💡 <strong>Tips Percobaan:</strong>
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-1">
              • Masuk sebagai Admin: ketik <strong>admin</strong> / <strong>admin</strong>
              <br />
              • Masuk sebagai Mahasiswa: masukkan NIM bebas & password bebas
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Login;
