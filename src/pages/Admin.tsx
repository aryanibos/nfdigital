import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Award,
  ListFilter,
  Eye
} from "lucide-react";
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

interface ManualProduct {
  id: string;
  name: string;
  author: string;
  category: string;
  year: string;
}

const INITIAL_MANUAL_PRODUCTS: ManualProduct[] = [
  { id: "1", name: "koat coffe", author: "Mahasiswa Demo", category: "UMKM", year: "2026" },
  { id: "2", name: "DigiMarket Pro", author: "Ahmad Rizki Pratama", category: "E-Commerce", year: "2024" },
  { id: "3", name: "EduConnect App", author: "Siti Nurhaliza", category: "Aplikasi Mobile", year: "2024" },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"submissions" | "manual" | "stats">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionFilter, setSubmissionFilter] = useState<"Menunggu" | "Disetujui" | "Ditolak" | "Semua">("Menunggu");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Manual Products State
  const [manualProducts, setManualProducts] = useState<ManualProduct[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", author: "", category: "", year: "2026" });

  // Stats State
  const [stats, setStats] = useState({
    totalDana: "Rp 1000000000",
    jumlahDonatur: "0",
    kampanyeAktif: "0"
  });
  const [editingStat, setEditingStat] = useState<"totalDana" | "jumlahDonatur" | "kampanyeAktif" | null>(null);
  const [editingStatValue, setEditingStatValue] = useState("");

  // Load from localStorage or defaults with Auth Guard
  useEffect(() => {
    const sessionStr = localStorage.getItem("active_user_session");
    if (!sessionStr) {
      toast({
        title: "Akses Ditolak 🔒",
        description: "Silakan login terlebih dahulu untuk mengakses Panel Admin.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const activeSession = JSON.parse(sessionStr);
      if (activeSession.role !== "admin") {
        toast({
          title: "Akses Ditolak 🔒",
          description: "Halaman ini hanya dapat diakses oleh Administrator.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
    } catch (e) {
      navigate("/login");
      return;
    }

    // Submissions
    const savedSubs = localStorage.getItem("student_submissions");
    if (savedSubs) {
      setSubmissions(JSON.parse(savedSubs));
    } else {
      const defaultSubs = [
        { id: "koat-coffe", name: "koat coffe", description: "nanjaabddbbdbdibi", status: "Disetujui" as const, image: "", nim: "0000000000", jurusan: "Bisnis Digital" }
      ];
      setSubmissions(defaultSubs);
      localStorage.setItem("student_submissions", JSON.stringify(defaultSubs));
    }

    // Manual Products
    const savedManual = localStorage.getItem("manual_products");
    if (savedManual) {
      setManualProducts(JSON.parse(savedManual));
    } else {
      setManualProducts(INITIAL_MANUAL_PRODUCTS);
      localStorage.setItem("manual_products", JSON.stringify(INITIAL_MANUAL_PRODUCTS));
    }

    // Stats
    const savedStats = localStorage.getItem("homepage_stats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      localStorage.setItem("homepage_stats", JSON.stringify(stats));
    }
  }, []);

  // Update submission status
  const handleUpdateStatus = (id: string, newStatus: "Disetujui" | "Ditolak") => {
    const updated = submissions.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updated);
    localStorage.setItem("student_submissions", JSON.stringify(updated));
    
    toast({
      title: `Status Diperbarui ✨`,
      description: `Produk berhasil di-${newStatus.toLowerCase()}.`,
    });
  };

  // Add manual product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.author.trim()) return;

    const added: ManualProduct = {
      id: `manual-${Date.now()}`,
      name: newProduct.name,
      author: newProduct.author,
      category: newProduct.category || "Digital Product",
      year: newProduct.year || "2026"
    };

    const updated = [added, ...manualProducts];
    setManualProducts(updated);
    localStorage.setItem("manual_products", JSON.stringify(updated));
    
    setIsAddProductOpen(false);
    setNewProduct({ name: "", author: "", category: "", year: "2026" });

    toast({
      title: "Produk Ditambahkan 🎁",
      description: `Produk ${added.name} berhasil ditambahkan secara manual.`,
    });
  };

  // Delete manual product
  const handleDeleteProduct = (id: string) => {
    const updated = manualProducts.filter(p => p.id !== id);
    setManualProducts(updated);
    localStorage.setItem("manual_products", JSON.stringify(updated));
    toast({
      title: "Produk Dihapus 🗑️",
      description: "Produk manual berhasil dihapus.",
    });
  };

  // Save stat edits
  const handleSaveStat = () => {
    if (!editingStat) return;
    const updatedStats = {
      ...stats,
      [editingStat]: editingStatValue
    };
    setStats(updatedStats);
    localStorage.setItem("homepage_stats", JSON.stringify(updatedStats));
    setEditingStat(null);
    toast({
      title: "Statistik Diperbarui 📈",
      description: "Statistik tampilan beranda berhasil diubah.",
    });
  };

  // Filter count helpers
  const countByStatus = (status: "Menunggu" | "Disetujui" | "Ditolak") => {
    return submissions.filter(sub => sub.status === status).length;
  };

  const filteredSubmissions = submissions.filter(sub => 
    submissionFilter === "Semua" ? true : sub.status === submissionFilter
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Panel Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola produk & pengajuan mahasiswa
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-border text-muted-foreground hover:text-destructive flex items-center gap-2"
            onClick={() => {
              localStorage.removeItem("active_user_session");
              toast({
                title: "Keluar Sesi 🔓",
                description: "Anda telah keluar dari panel admin.",
              });
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-card p-1.5 rounded-2xl border border-border max-w-lg mb-8">
          <button
            onClick={() => setActiveTab("submissions")}
            className={cn(
              "flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300",
              activeTab === "submissions" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pengajuan Mahasiswa
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={cn(
              "flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300",
              activeTab === "manual" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Produk Manual
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={cn(
              "flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300",
              activeTab === "stats" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Statistik Beranda
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">

          {/* TAB 1: SUBMISSIONS */}
          {activeTab === "submissions" && (
            <div className="space-y-6 animate-fade-in">
              {/* Submission Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { filter: "Menunggu", label: `Menunggu (${countByStatus("Menunggu")})` },
                  { filter: "Disetujui", label: `Disetujui (${countByStatus("Disetujui")})` },
                  { filter: "Ditolak", label: `Ditolak (${countByStatus("Ditolak")})` },
                  { filter: "Semua", label: `Semua (${submissions.length})` }
                ].map((item) => (
                  <button
                    key={item.filter}
                    onClick={() => setSubmissionFilter(item.filter as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border",
                      submissionFilter === item.filter
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-card border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Submission List */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center gap-3">
                    <ListFilter className="w-12 h-12 text-muted-foreground/50" />
                    <span>Tidak ada pengajuan.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredSubmissions.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group/row hover:bg-secondary/25 px-4 rounded-2xl transition-colors cursor-pointer"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        <div className="flex gap-4 items-start">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-border group-hover/row:bg-primary/20 transition-colors">
                            <GraduationCap className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-foreground text-base group-hover/row:text-primary transition-colors">{sub.name}</h3>
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                Klik untuk Detail
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {sub.nim} • {sub.jurusan}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl line-clamp-2">
                              {sub.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        {sub.status === "Menunggu" ? (
                          <div className="flex items-center gap-2 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(sub.id, "Ditolak");
                              }}
                              variant="outline"
                              className="rounded-xl border-border text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center gap-1.5 h-10 px-4"
                            >
                              <XCircle className="w-4 h-4" />
                              Tolak
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(sub.id, "Disetujui");
                              }}
                              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 h-10 px-4 glow-primary-sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Setujui
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                              sub.status === "Disetujui" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                            )}>
                              {sub.status === "Disetujui" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              {sub.status}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL PRODUCTS */}
          {activeTab === "manual" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-bold text-foreground">{manualProducts.length}</span> produk manual
                </p>
                <Button
                  onClick={() => setIsAddProductOpen(true)}
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 glow-primary-sm flex items-center gap-2 h-10 px-5"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Produk
                </Button>
              </div>

              {/* Product List */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4">
                {manualProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Belum ada produk manual. Silakan tambah produk baru.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {manualProducts.map((prod) => (
                      <div key={prod.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-border">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-foreground text-sm leading-tight">{prod.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {prod.author} • <span className="text-primary font-semibold">{prod.category}</span> • {prod.year}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-9 h-9 rounded-lg border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              toast({
                                title: "Edit Produk",
                                description: "Fitur edit produk manual akan segera hadir.",
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-9 h-9 rounded-lg border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500"
                            onClick={() => handleDeleteProduct(prod.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-foreground">Statistik Penggalangan Dana</h2>
              <p className="text-sm text-muted-foreground -mt-4">
                Angka ini ditampilkan di hero beranda website.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                {/* Dana Card */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-44">
                  <div>
                    <TrendingUp className="w-6 h-6 text-primary mb-3" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Total Penggalangan Dana
                    </p>
                    <h3 className="text-xl lg:text-2xl font-extrabold text-foreground mt-1">
                      {stats.totalDana}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-border text-xs flex items-center gap-1.5 h-9 w-max mt-4"
                    onClick={() => {
                      setEditingStat("totalDana");
                      setEditingStatValue(stats.totalDana);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </div>

                {/* Donatur Card */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-44">
                  <div>
                    <Users className="w-6 h-6 text-primary mb-3" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Jumlah Donatur
                    </p>
                    <h3 className="text-xl lg:text-2xl font-extrabold text-foreground mt-1">
                      {stats.jumlahDonatur}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-border text-xs flex items-center gap-1.5 h-9 w-max mt-4"
                    onClick={() => {
                      setEditingStat("jumlahDonatur");
                      setEditingStatValue(stats.jumlahDonatur);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </div>

                {/* Kampanye Card */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-44">
                  <div>
                    <Award className="w-6 h-6 text-primary mb-3" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Kampanye Aktif
                    </p>
                    <h3 className="text-xl lg:text-2xl font-extrabold text-foreground mt-1">
                      {stats.kampanyeAktif}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-border text-xs flex items-center gap-1.5 h-9 w-max mt-4"
                    onClick={() => {
                      setEditingStat("kampanyeAktif");
                      setEditingStatValue(stats.kampanyeAktif);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Dialog: Edit Stat */}
      <Dialog open={editingStat !== null} onOpenChange={(open) => !open && setEditingStat(null)}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Nilai Statistik</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Masukkan nilai baru untuk statistik beranda ini.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <label className="text-sm font-semibold text-foreground">Nilai Baru</label>
            <Input
              type="text"
              value={editingStatValue}
              onChange={(e) => setEditingStatValue(e.target.value)}
              className="rounded-xl bg-secondary/50 border-border focus:border-primary h-11"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingStat(null)}
              className="rounded-xl border-border"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveStat}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 glow-primary-sm"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add Manual Product */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Tambah Produk Manual</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tambahkan produk mahasiswa baru secara langsung ke katalog.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProduct} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Nama Produk</label>
              <Input
                type="text"
                placeholder="Contoh: koat coffe"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="rounded-xl bg-secondary/50 border-border focus:border-primary h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Nama Mahasiswa</label>
              <Input
                type="text"
                placeholder="Contoh: Mahasiswa Demo"
                value={newProduct.author}
                onChange={(e) => setNewProduct({ ...newProduct, author: e.target.value })}
                required
                className="rounded-xl bg-secondary/50 border-border focus:border-primary h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Kategori</label>
                <Input
                  type="text"
                  placeholder="Contoh: UMKM"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Tahun</label>
                <Input
                  type="text"
                  placeholder="Contoh: 2026"
                  value={newProduct.year}
                  onChange={(e) => setNewProduct({ ...newProduct, year: e.target.value })}
                  className="rounded-xl bg-secondary/50 border-border focus:border-primary h-11"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProductOpen(false)}
                className="rounded-xl border-border"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 glow-primary-sm"
              >
                Simpan Produk
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detail Review Submission (With Image Check!) */}
      <Dialog open={selectedSubmission !== null} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Detail Pengajuan Produk
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tinjau informasi dan gambar produk sebelum memberikan keputusan persetujuan.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6 py-4">
              {/* Product Image Preview Section */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Gambar Produk</Label>
                {selectedSubmission.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-border bg-secondary/20 shadow-inner">
                    <img 
                      src={selectedSubmission.image} 
                      alt={selectedSubmission.name} 
                      className="w-full max-h-60 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 rounded-xl border-2 border-dashed border-border bg-secondary/10 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <GraduationCap className="w-10 h-10 text-muted-foreground/50" />
                    <span className="text-xs font-medium">Tidak ada gambar yang diunggah</span>
                  </div>
                )}
              </div>

              {/* Submitter Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-border py-4">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Pengaju</span>
                  <span className="text-sm font-bold text-foreground">{selectedSubmission.nim}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Jurusan</span>
                  <span className="text-sm font-semibold text-foreground">{selectedSubmission.jurusan}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Nama Produk</span>
                <h3 className="text-lg font-extrabold text-foreground">{selectedSubmission.name}</h3>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Deskripsi Produk</span>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-secondary/30 p-4 rounded-xl border border-border">
                  {selectedSubmission.description}
                </p>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter className="pt-4 flex sm:justify-between items-center gap-2 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-xl h-11 px-6 border-border"
                >
                  Tutup
                </Button>

                {selectedSubmission.status === "Menunggu" && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        handleUpdateStatus(selectedSubmission.id, "Ditolak");
                        setSelectedSubmission(null);
                      }}
                      variant="outline"
                      className="rounded-xl h-11 px-5 border-border text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak
                    </Button>
                    <Button
                      onClick={() => {
                        handleUpdateStatus(selectedSubmission.id, "Disetujui");
                        setSelectedSubmission(null);
                      }}
                      className="rounded-xl h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-2 glow-primary-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Setujui
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Layout>
  );
};

export default Admin;
