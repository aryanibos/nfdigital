import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, Lock, Mail, KeyRound, FileText, CheckCircle, ShieldAlert, Eye, EyeOff } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function ProfileModal({ isOpen, onClose, onProfileUpdated }: ProfileModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [session, setSession] = useState<any>(null);
  
  // Profile Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Password Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show/Hide Password States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      const sessionStr = localStorage.getItem("active_user_session");
      if (sessionStr) {
        try {
          const activeSession = JSON.parse(sessionStr);
          setSession(activeSession);
          
          fetch(`/api/api.php?action=get_user_account&username=${activeSession.username}`)
            .then((res) => res.json())
            .then((userAccount) => {
              setName(userAccount.name || activeSession.name || "");
              setEmail(userAccount.email || "");
              setBio(userAccount.bio || "");
              setAvatar(userAccount.avatar || activeSession.avatar || "");
            })
            .catch((err) => {
              console.error("Failed to load user account from API", err);
              setName(activeSession.name || "");
              setEmail(activeSession.role === "admin" ? "admin@nfdigital.ac.id" : `${activeSession.username}@student.nurulfikri.ac.id`);
              setBio(activeSession.role === "admin" ? "Administrator Utama Portal NF Katalog" : "Mahasiswa Bisnis Digital STT NF");
              setAvatar(activeSession.avatar || "");
            });
        } catch (e) {
          console.error("Failed to load profile", e);
        }
      }
      setActiveTab("profile");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Terlalu Besar ⚠️",
        description: "Ukuran foto profil maksimal adalah 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        toast({
          title: "Foto Berhasil Dipilih 📸",
          description: "Klik Simpan Perubahan untuk memperbarui foto profil Anda.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!name.trim()) {
      toast({
        title: "Nama Harus Diisi ❌",
        description: "Silakan masukkan nama lengkap Anda.",
        variant: "destructive",
      });
      return;
    }

    // Call API to update profile
    fetch("/api/api.php?action=update_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: session.username,
        name,
        email,
        bio,
        avatar,
        password: "" // Blank password preserves existing in DB
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal menyimpan perubahan");

        localStorage.setItem("active_user_session", JSON.stringify(data.session));

        toast({
          title: "Profil Diperbarui! 🎉",
          description: "Data profil Anda berhasil disimpan ke database.",
        });

        if (onProfileUpdated) {
          onProfileUpdated();
        }
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Gagal Menyimpan ❌",
          description: err.message || "Terjadi kesalahan saat menyimpan perubahan profil.",
          variant: "destructive",
        });
      });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Form Belum Lengkap ❌",
        description: "Semua kolom kata sandi wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 5) {
      toast({
        title: "Kata Sandi Terlalu Pendek ⚠️",
        description: "Kata sandi baru minimal harus terdiri dari 5 karakter.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Kata Sandi Tidak Cocok ❌",
        description: "Kata sandi baru dan konfirmasi tidak sesuai.",
        variant: "destructive",
      });
      return;
    }

    // Call API to change password
    fetch("/api/api.php?action=update_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: session.username,
        name,
        email,
        bio,
        avatar,
        currentPassword,
        password: newPassword
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengubah kata sandi");

        localStorage.setItem("active_user_session", JSON.stringify(data.session));

        toast({
          title: "Kata Sandi Berhasil Diubah! 🔑",
          description: "Silakan gunakan kata sandi baru untuk login berikutnya.",
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setActiveTab("profile");
      })
      .catch((err) => {
        toast({
          title: "Gagal Mengubah Kata Sandi ❌",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border-border rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
        
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            Pengaturan Profil
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Kelola detail profil Anda dan ubah keamanan akun secara aman di browser ini.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Headers */}
        <div className="flex bg-secondary/50 p-1 rounded-xl gap-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "profile" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Detail Profil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "password" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Keamanan / Sandi
          </button>
        </div>

        {activeTab === "profile" ? (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center justify-center py-1 relative">
              <div 
                onClick={handleAvatarClick}
                className="group relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary cursor-pointer transition-all duration-300 shadow-md flex items-center justify-center bg-secondary"
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary hover:bg-secondary/80">
                    <User className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-1">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-[8px] font-bold">Pilih Foto</span>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-[9px] text-muted-foreground mt-1">
                Klik lingkaran untuk mengunggah foto profil baru.
              </p>
            </div>

            {/* Profile Form Fields */}
            <div className="space-y-2.5">
              <div className="space-y-1.5">
                <Label htmlFor="profile-username" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  NIM / Username <span className="text-[10px] text-primary/70 font-medium">(Tidak bisa diubah)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="profile-username"
                    value={session?.username || ""}
                    disabled
                    className="rounded-xl bg-secondary/50 border-border text-muted-foreground h-10 pl-9 font-mono text-xs cursor-not-allowed"
                  />
                  <User className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="text-xs font-bold text-foreground">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="rounded-xl bg-secondary/20 border-border focus:border-primary focus:ring-primary/20 h-10 pl-9 text-xs"
                  />
                  <User className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="text-xs font-bold text-foreground">
                  Alamat Email
                </Label>
                <div className="relative">
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@student.nurulfikri.ac.id"
                    className="rounded-xl bg-secondary/20 border-border focus:border-primary focus:ring-primary/20 h-10 pl-9 text-xs"
                  />
                  <Mail className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-bio" className="text-xs font-bold text-foreground">
                  Bio / Deskripsi Singkat
                </Label>
                <div className="relative">
                  <Textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Jelaskan diri Anda secara singkat..."
                    className="rounded-xl bg-secondary/20 border-border focus:border-primary focus:ring-primary/20 min-h-[60px] pl-9 pt-2 text-xs resize-none"
                  />
                  <FileText className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl text-xs font-semibold border-border"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Simpan Profil
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl flex gap-2.5 items-start">
              <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-yellow-500">Informasi Kata Sandi</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                  Kata sandi bawaan pertama kali masuk adalah <strong className="text-foreground">admin</strong> untuk akun admin, dan <strong className="text-foreground">kata sandi bebas apa saja</strong> yang Anda masukkan pertama kali saat login untuk akun mahasiswa.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="current-pw" className="text-xs font-bold text-foreground">
                  Kata Sandi Saat Ini
                </Label>
                <div className="relative">
                  <Input
                    id="current-pw"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan sandi saat ini"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="rounded-xl bg-secondary/20 border-border focus:border-primary focus:ring-primary/20 h-10 pl-9 pr-10 text-xs"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-pw" className="text-xs font-bold text-foreground">
                  Kata Sandi Baru
                </Label>
                <div className="relative">
                  <Input
                    id="new-pw"
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan sandi baru (min. 5 karakter)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl bg-secondary/20 border-border focus:border-primary focus:ring-primary/20 h-10 pl-9 pr-10 text-xs"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-pw" className="text-xs font-bold text-foreground">
                  Konfirmasi Kata Sandi Baru
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-pw"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Ulangi sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl bg-secondary/20 border-border focus:border-primary focus:ring-primary/20 h-10 pl-9 pr-10 text-xs"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl text-xs font-semibold border-border"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Ubah Sandi
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
