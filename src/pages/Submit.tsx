import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, LogOut, CheckCircle2, AlertCircle, Clock, FileUp, GraduationCap, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  name: string;
  description: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  image: string;
  nim: string;
  jurusan: string;
}

const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: "koat-coffe",
    name: "koat coffe",
    description: "nanjaabddbbdbdibi",
    status: "Disetujui",
    image: "",
    nim: "0000000000",
    jurusan: "Bisnis Digital"
  }
];

const Submit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageFile: null as File | null,
  });

  // Enforce Auth and Load dynamic submissions filtered by NIM
  useEffect(() => {
    const sessionStr = localStorage.getItem("active_user_session");
    if (!sessionStr) {
      toast({
        title: "Akses Ditolak 🔒",
        description: "Silakan login terlebih dahulu untuk mengakses halaman pengajuan.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const activeSession = JSON.parse(sessionStr);
      if (activeSession.role !== "mahasiswa") {
        toast({
          title: "Akses Ditolak 🔒",
          description: "Portal ini khusus untuk mahasiswa.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      setSession(activeSession);

      // Load submissions
      const saved = localStorage.getItem("student_submissions");
      let allSubs: Submission[] = [];
      if (saved) {
        allSubs = JSON.parse(saved);
      } else {
        allSubs = DEFAULT_SUBMISSIONS;
        localStorage.setItem("student_submissions", JSON.stringify(DEFAULT_SUBMISSIONS));
      }
      
      // Filter so students ONLY see their own submissions!
      const filtered = allSubs.filter(sub => sub.nim === activeSession.nim);
      setSubmissions(filtered);
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imageFile: file
      });
      // Convert to Base64 for instant preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (sub: Submission) => {
    setEditingId(sub.id);
    setPreviewImage(sub.image);
    setImagePreviewUrl(sub.image); // Set current base64 image as preview URL
    setFormData({
      name: sub.name,
      description: sub.description,
      imageFile: null
    });
    
    // Smooth scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });

    toast({
      title: "Mode Edit Aktif ✏️",
      description: `Sekarang mengedit produk: ${sub.name}`,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPreviewImage("");
    setImagePreviewUrl(""); // Clear preview
    setFormData({
      name: "",
      description: "",
      imageFile: null
    });
    
    const fileInput = document.getElementById("product-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Gagal Kirim ❌",
        description: "Semua field harus diisi terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    const currentNim = session?.nim || "0110221045";
    const currentName = session?.name || "Mahasiswa Demo";

    // Function to submit/update once image is converted to Base64
    const submitWithImage = (base64Image: string) => {
      const saved = localStorage.getItem("student_submissions");
      let allSubs: Submission[] = saved ? JSON.parse(saved) : DEFAULT_SUBMISSIONS;

      if (editingId) {
        // UPDATE MODE
        const updatedAll = allSubs.map((sub) => {
          if (sub.id === editingId) {
            return {
              ...sub,
              name: formData.name,
              description: formData.description,
              status: "Menunggu" as const, // Reset status to Menunggu so admin reviews again
              image: base64Image || previewImage // Use new image if uploaded, otherwise keep old
            };
          }
          return sub;
        });

        localStorage.setItem("student_submissions", JSON.stringify(updatedAll));
        
        // Update local filtered list
        const filtered = updatedAll.filter(sub => sub.nim === currentNim);
        setSubmissions(filtered);
        
        toast({
          title: "Pengajuan Diperbarui! ✏️",
          description: "Perubahan produk Anda berhasil disimpan dan diajukan ulang.",
        });

        handleCancelEdit();
      } else {
        // CREATE MODE
        const newSub: Submission = {
          id: `submission-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          status: "Menunggu",
          image: base64Image,
          nim: currentNim,
          jurusan: "Bisnis Digital"
        };

        const updatedAll = [newSub, ...allSubs];
        localStorage.setItem("student_submissions", JSON.stringify(updatedAll));

        // Update local filtered list
        setSubmissions([newSub, ...submissions]);

        // Reset form
        setFormData({
          name: "",
          description: "",
          imageFile: null
        });
        setImagePreviewUrl("");

        // Reset input file element
        const fileInput = document.getElementById("product-image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        toast({
          title: "Pengajuan Terkirim! 🚀",
          description: "Produk Anda telah diajukan ke Admin untuk ditinjau.",
        });
      }
    };

    if (formData.imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        submitWithImage(reader.result as string);
      };
      reader.readAsDataURL(formData.imageFile);
    } else {
      submitWithImage("");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Pengajuan Produk</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {session?.name || "Mahasiswa"} • {session?.nim || "0110221045"} • Bisnis Digital
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-border text-muted-foreground hover:text-destructive flex items-center gap-2"
            onClick={() => {
              localStorage.removeItem("active_user_session");
              toast({
                title: "Keluar Sesi 🔓",
                description: "Anda telah keluar dari portal mahasiswa.",
              });
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </div>

        {/* Form and List Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Submit Form */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-xl">
            <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-primary" />
              {editingId ? "Edit Pengajuan Produk" : "Ajukan Produk Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nama Produk</label>
                <Input
                  type="text"
                  placeholder="Masukkan nama produk inovatifmu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Deskripsi Singkat</label>
                <Textarea
                  placeholder="Jelaskan produkmu secara singkat dan jelas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 min-h-[140px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  {editingId ? "Gambar Produk (Biarkan kosong untuk mempertahankan gambar lama)" : "Gambar Produk"}
                </label>
                <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-6 text-center cursor-pointer bg-secondary/20 relative overflow-hidden">
                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                  
                  {imagePreviewUrl ? (
                    <div className="relative w-full max-h-44 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-background">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Preview" 
                        className="max-h-44 w-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                        <span className="text-white text-xs font-bold bg-primary/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                          <FileUp className="w-3.5 h-3.5" />
                          Ganti Gambar
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 mx-auto flex items-center justify-center">
                        <FileUp className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formData.imageFile ? formData.imageFile.name : "Pilih File Gambar"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Format PNG, JPG, JPEG maks. 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-grow h-12 rounded-xl border-border text-muted-foreground font-semibold text-base"
                  >
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-grow h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base glow-primary-sm hover:glow-primary transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {editingId ? "Simpan Perubahan" : "Kirim Pengajuan"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Submission History */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-extrabold text-foreground mb-6">
              Pengajuan Saya ({submissions.length})
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Belum ada pengajuan produk.
                </div>
              ) : (
                submissions.map((sub) => {
                  return (
                    <div 
                      key={sub.id} 
                      onClick={() => handleStartEdit(sub)}
                      className={cn(
                        "border rounded-2xl p-4 flex gap-4 items-start cursor-pointer hover:bg-secondary/50 transition-all duration-300 group text-left",
                        editingId === sub.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border bg-secondary/30 hover:border-primary/30"
                      )}
                    >
                      {/* Avatar Mock */}
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">{sub.name}</h3>
                            <span className="text-[10px] text-muted-foreground font-medium hidden group-hover:inline flex-shrink-0">
                              (Klik p/ Edit)
                            </span>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1",
                              sub.status === "Disetujui" && "bg-emerald-500/10 text-emerald-500",
                              sub.status === "Menunggu" && "bg-amber-500/10 text-amber-500",
                              sub.status === "Ditolak" && "bg-rose-500/10 text-rose-500"
                            )}>
                              {sub.status === "Disetujui" && <CheckCircle2 className="w-3 h-3" />}
                              {sub.status === "Menunggu" && <Clock className="w-3 h-3" />}
                              {sub.status === "Ditolak" && <AlertCircle className="w-3 h-3" />}
                              {sub.status}
                            </span>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-7 h-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(sub);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </Layout>
  );
};

export default Submit;
