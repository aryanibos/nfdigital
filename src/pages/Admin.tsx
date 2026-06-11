import { useState, useEffect, useRef } from "react";
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
  Eye,
  Camera,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProducts, saveProduct, deleteProduct, Product } from "@/lib/productsStore";

interface Submission {
  id: string;
  name: string;
  description: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  image: string;
  nim: string;
  jurusan: string;
  fundingAmount?: number | null;
}

const CATEGORIES = [
  "Template",
  "E-Book & Panduan",
  "Aset Desain",
  "Video & Kursus",
  "Source Code",
  "UI/UX Kit",
  "Preset & Filter",
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"submissions" | "catalog" | "stats">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionFilter, setSubmissionFilter] = useState<"Menunggu" | "Disetujui" | "Ditolak" | "Semua">("Menunggu");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Catalog State
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formProduct, setFormProduct] = useState({
    id: "",
    name: "",
    author: "",
    category: "Template",
    subcategory: "Notion",
    description: "",
    image: "",
    featured: false,
    price: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats State (Renamed key names based on new instructions)
  const [stats, setStats] = useState({
    totalPendanaan: "Rp 0",
    jumlahUsaha: "0",
    jumlahProduk: "0"
  });

  const [initialBudgetInput, setInitialBudgetInput] = useState("");

  const [isEditTotalOpen, setIsEditTotalOpen] = useState(false);
  const [newTotalInput, setNewTotalInput] = useState("");

  // Funding Modal States
  const [isFundingDialogOpen, setIsFundingDialogOpen] = useState(false);
  const [fundingTargetId, setFundingTargetId] = useState<string | null>(null);
  const [fundingAmount, setFundingAmount] = useState("");

  // Load dynamic data on mount
  const refreshAllData = async () => {
    try {
      // 1. Get Submissions from API
      const subRes = await fetch("/api/api.php?action=get_submissions");
      const subData = await subRes.json();
      const currentSubs = subData.map((sub: any) => ({
        ...sub,
        status: sub.status === 'Pending' ? 'Menunggu' : (sub.status === 'Disetujui' ? 'Disetujui' : (sub.status === 'Ditolak' ? 'Ditolak' : sub.status))
      }));
      setSubmissions(currentSubs);

      // 2. Get Products from API
      const catalogProds = await getProducts();
      setCatalogProducts(catalogProds);

      // 3. Get Budget from API
      const budgetRes = await fetch("/api/api.php?action=get_budget");
      const budgetData = await budgetRes.json();
      const initialBudget = Number(budgetData.initial_budget);

      const totalSpent = catalogProds.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
      const remainingFunding = initialBudget - totalSpent;

      // Unique students whose products are active in the catalog
      const uniqueNims = new Set(catalogProds.map(p => p.nim).filter(Boolean));
      const totalUsaha = uniqueNims.size;

      // Total number of products in catalog (admin-created + approved submissions)
      const totalProducts = catalogProds.length;

      const formatCurrency = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(num).replace(/,00$/, "");
      };

      const calculatedStats = {
        totalPendanaan: formatCurrency(remainingFunding),
        jumlahUsaha: totalUsaha.toString(),
        jumlahProduk: totalProducts.toString()
      };
      
      setStats(calculatedStats);
      localStorage.setItem("homepage_stats", JSON.stringify(calculatedStats));
    } catch (e) {
      console.error("Failed to refresh admin data", e);
    }
  };

  const handleSaveInitialBudget = async () => {
    const val = Number(initialBudgetInput);
    if (isNaN(val) || val <= 0) {
      toast({
        title: "Input Tidak Valid ❌",
        description: "Masukkan nominal dana tambahan yang benar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const budgetRes = await fetch("/api/api.php?action=get_budget");
      const budgetData = await budgetRes.json();
      const currentBudget = Number(budgetData.initial_budget);
      const newBudget = currentBudget + val;

      await fetch("/api/api.php?action=update_budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial_budget: newBudget })
      });

      setInitialBudgetInput("");
      
      toast({
        title: "Dana Berhasil Ditambahkan! 💰",
        description: `Dana sebesar Rp ${val.toLocaleString("id-ID")} berhasil ditambahkan ke anggaran.`,
      });
      refreshAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveDirectTotal = async () => {
    const val = Number(newTotalInput);
    if (isNaN(val) || val < 0) {
      toast({
        title: "Input Tidak Valid ❌",
        description: "Masukkan nominal pendanaan yang benar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const catalogProds = await getProducts();
      const totalSpent = catalogProds.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
      const newBudget = val + totalSpent;
      
      await fetch("/api/api.php?action=update_budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial_budget: newBudget })
      });

      setIsEditTotalOpen(false);
      setNewTotalInput("");
      
      toast({
        title: "Total Pendanaan Diperbarui! 💰",
        description: `Total pendanaan berhasil disesuaikan menjadi Rp ${val.toLocaleString("id-ID")}`,
      });
      refreshAllData();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const sessionStr = localStorage.getItem("active_user_session");
    if (!sessionStr) {
      toast({
        title: "Akses Ditolak 🔒",
        description: "Silakan login terlebih dahulu untuk mengakses Panel Admin.",
        variant: "destructive",
      });
      navigate("/login?role=admin");
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
        navigate("/login?role=admin");
        return;
      }
    } catch (e) {
      navigate("/login?role=admin");
      return;
    }

    refreshAllData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "Disetujui" | "Ditolak", fundingAmt?: number | null) => {
    const targetSub = submissions.find(s => s.id === id);
    const dbStatus = newStatus === "Disetujui" ? "Disetujui" : "Ditolak";
    const price = fundingAmt !== undefined ? fundingAmt : null;

    try {
      const res = await fetch("/api/api.php?action=update_submission_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: dbStatus,
          price
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");

      toast({
        title: newStatus === "Disetujui" ? "Pengajuan Disetujui! 🎓" : "Pengajuan Ditolak ❌",
        description: `Status pengajuan "${targetSub?.name}" telah diperbarui.`,
      });

      refreshAllData();
    } catch (err: any) {
      toast({
        title: "Gagal Memperbarui ❌",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleApproveClick = (id: string) => {
    setFundingTargetId(id);
    setFundingAmount("");
    setIsFundingDialogOpen(true);
  };

  const handleConfirmApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundingTargetId) return;
    const amt = fundingAmount.trim() !== "" ? Number(fundingAmount) : null;
    handleUpdateStatus(fundingTargetId, "Disetujui", amt);
    setIsFundingDialogOpen(false);
    setFundingTargetId(null);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormProduct({
      id: "",
      name: "",
      author: "",
      category: "Template",
      subcategory: "Notion",
      description: "",
      image: "",
      featured: false,
      price: ""
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormProduct({
      id: product.id,
      name: product.name,
      author: product.author,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
      image: product.image || "",
      featured: product.featured,
      price: product.price ? product.price.toString() : ""
    });
    setIsAddEditOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormProduct({ ...formProduct, image: event.target.result as string });
        toast({
          title: "Gambar Berhasil Dipilih 📸",
          description: "Gambar produk siap disimpan.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduct.name.trim() || !formProduct.author.trim()) return;

    const finalProduct: Product = {
      id: formProduct.id || `manual-${Date.now()}`,
      name: formProduct.name,
      author: formProduct.author,
      category: formProduct.category,
      subcategory: formProduct.subcategory || "Digital Asset",
      description: formProduct.description || "Tidak ada deskripsi.",
      image: formProduct.image || "",
      featured: formProduct.featured,
      createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
      price: formProduct.price ? Number(formProduct.price) : null
    };

    await saveProduct(finalProduct);
    refreshAllData();
    setIsAddEditOpen(false);

    toast({
      title: editingProduct ? "Katalog Diperbarui 📝" : "Katalog Ditambahkan 🎁",
      description: `Produk ${finalProduct.name} berhasil disimpan ke dalam katalog.`,
    });
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      
      // Also update student submissions status if it is a student product in DB
      await fetch("/api/api.php?action=update_submission_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Ditolak" })
      });

      refreshAllData();
      toast({
        title: "Katalog Dihapus 🗑️",
        description: "Produk berhasil dihapus dari katalog utama.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Stats are calculated dynamically on load and status updates

  // Filter helpers for student submissions
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
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Panel Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola produk mahasiswa & edit basis data katalog utama secara dinamis
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-border text-muted-foreground hover:text-destructive flex items-center gap-2 transition-all"
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
        <div className="flex bg-card p-1.5 rounded-2xl border border-border max-w-xl mb-8 gap-1 shadow-md">
          <button
            onClick={() => setActiveTab("submissions")}
            className={cn(
              "flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
              activeTab === "submissions"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListFilter className="w-4 h-4" />
            Pengajuan ({submissions.filter(s => s.status === "Menunggu").length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={cn(
              "flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
              activeTab === "catalog"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FolderOpen className="w-4 h-4" />
            Kelola Katalog ({catalogProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={cn(
              "flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
              activeTab === "stats"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Statistik Home
          </button>
        </div>

        {/* TAB 1: STUDENT SUBMISSIONS */}
        {activeTab === "submissions" && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2.5 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {(["Menunggu", "Disetujui", "Ditolak", "Semua"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSubmissionFilter(filter)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5",
                      submissionFilter === filter
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    {filter === "Menunggu" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                    {filter === "Disetujui" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {filter === "Ditolak" && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                    {filter}
                    <span className="text-[10px] opacity-80 px-1.5 py-0.5 rounded-full bg-secondary text-foreground font-mono">
                      {filter === "Semua" ? submissions.length : countByStatus(filter as any)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions list */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                  Tidak ada pengajuan produk dengan status ini.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredSubmissions.map((sub) => (
                    <div key={sub.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="flex gap-4 items-start md:items-center">
                        <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-inner bg-secondary/50">
                          {sub.image ? (
                            <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                          ) : (
                            <GraduationCap className="w-6 h-6 text-muted-foreground/60" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-foreground text-sm leading-tight">{sub.name}</h3>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1",
                              sub.status === "Disetujui" && "bg-emerald-500/10 text-emerald-500",
                              sub.status === "Menunggu" && "bg-amber-500/10 text-amber-500",
                              sub.status === "Ditolak" && "bg-rose-500/10 text-rose-500"
                            )}>
                              {sub.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Oleh: <strong className="text-foreground">{sub.nim}</strong> • Jurusan: {sub.jurusan}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mt-1 font-medium bg-secondary/30 px-2 py-0.5 rounded border border-border/50 max-w-lg">
                            {sub.description}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 justify-end self-end md:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-border hover:bg-secondary flex items-center gap-1.5 h-9 text-xs"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail Review
                        </Button>

                        {sub.status === "Menunggu" && (
                          <>
                            <Button
                              onClick={() => handleUpdateStatus(sub.id, "Ditolak")}
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-border text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center gap-1 h-9 text-xs"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Tolak
                            </Button>
                            <Button
                              onClick={() => handleApproveClick(sub.id)}
                              size="sm"
                              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1 h-9 text-xs glow-primary-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Setujui
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG MANAGEMENT */}
        {activeTab === "catalog" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-bold text-foreground">{catalogProducts.length}</span> produk dalam katalog utama
              </p>
              <Button
                onClick={handleOpenAdd}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 glow-primary-sm flex items-center gap-2 h-10 px-5"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk
              </Button>
            </div>

            {/* Catalog list */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4">
              {catalogProducts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                  Belum ada produk dalam katalog. Silakan klik Tambah Produk untuk membuat.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {catalogProducts.map((prod) => (
                    <div key={prod.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex gap-4 items-center min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-secondary/50 shadow-inner">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <GraduationCap className="w-5 h-5 text-muted-foreground/60" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-foreground text-sm leading-tight truncate">{prod.name}</h3>
                          <p className="text-[11px] text-muted-foreground mt-1 truncate">
                            Pembuat: <strong className="text-foreground">{prod.author}</strong>
                          </p>
                          {prod.featured && (
                            <span className="inline-block bg-amber-500/10 text-amber-500 text-[9px] font-bold px-1.5 py-0.2 rounded-md mt-1">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-9 h-9 rounded-lg border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Produk"
                          onClick={() => handleOpenEdit(prod)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-9 h-9 rounded-lg border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                          title="Hapus Produk"
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

        {/* TAB 3: HOMEPAGE STATS EDITOR */}
        {activeTab === "stats" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-6 animate-fade-in max-w-2xl">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Statistik Beranda (Terkalkulasi Otomatis)
            </h2>
            <p className="text-xs text-muted-foreground">
              Statistik berikut dihitung secara otomatis berdasarkan nominal anggaran awal yang diinput admin dikurangi total harga produk di katalog.
            </p>

            {/* Input Config Section */}
            <div className="bg-secondary/20 border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Pengaturan Anggaran Pendanaan</h3>
              <div className="space-y-2">
                <Label htmlFor="initialBudget" className="text-xs font-semibold text-muted-foreground">
                  Tambah Dana (Rupiah)
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="initialBudget"
                    type="number"
                    value={initialBudgetInput}
                    onChange={(e) => setInitialBudgetInput(e.target.value)}
                    placeholder="Masukkan nominal dana tambahan. Contoh: 1000000"
                    className="rounded-xl bg-background border-border h-11"
                  />
                  <Button
                    onClick={handleSaveInitialBudget}
                    className="rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5"
                  >
                    Simpan
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  * Nominal ini akan otomatis ditambahkan ke total anggaran pendanaan.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Stat 1 */}
              <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-2xl gap-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Total Pendanaan</span>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-lg font-extrabold text-primary">{stats.totalPendanaan}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const plainVal = stats.totalPendanaan.replace(/[^0-9]/g, "");
                        setNewTotalInput(plainVal);
                        setIsEditTotalOpen(true);
                      }}
                      title="Edit Sisa Total Pendanaan"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-2xl gap-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Jumlah Usaha Mahasiswa</span>
                  <p className="text-lg font-extrabold text-foreground mt-1">{stats.jumlahUsaha}</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-2xl gap-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Jumlah Produk</span>
                  <p className="text-lg font-extrabold text-foreground mt-1">{stats.jumlahProduk}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Dialog: Add/Edit Product in Catalog */}
      <Dialog open={isAddEditOpen} onOpenChange={(open) => !open && setIsAddEditOpen(false)}>
        <DialogContent className="sm:max-w-[450px] bg-card border-border rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              {editingProduct ? "Edit Produk Katalog" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingProduct ? "Perbarui informasi produk katalog utama di bawah ini." : "Lengkapi formulir untuk menambahkan produk baru langsung ke katalog utama."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-3.5 py-2">
            {/* Image Upload for Catalog */}
            <div className="flex flex-col items-center justify-center py-1 relative">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20 hover:border-primary cursor-pointer transition-all duration-300 shadow-md flex items-center justify-center bg-secondary"
              >
                {formProduct.image ? (
                  <img src={formProduct.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary hover:bg-secondary/80">
                    <Camera className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-0.5">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-[8px] font-bold">Foto Produk</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-[9px] text-muted-foreground mt-1">Klik kotak untuk mengunggah foto produk</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">Nama Produk</Label>
              <Input
                type="text"
                placeholder="Masukkan nama produk..."
                value={formProduct.name}
                onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                required
                className="rounded-xl bg-secondary/20 border-border focus:border-primary h-10 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">Nama Pembuat / Mahasiswa</Label>
              <Input
                type="text"
                placeholder="Contoh: Mahasiswa Demo / Alumni BD"
                value={formProduct.author}
                onChange={(e) => setFormProduct({ ...formProduct, author: e.target.value })}
                required
                className="rounded-xl bg-secondary/20 border-border focus:border-primary h-10 text-xs"
              />
            </div>



            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">Harga Produk (Rupiah, Opsional)</Label>
              <Input
                type="number"
                placeholder="Biarkan kosong jika belum memiliki harga"
                value={formProduct.price}
                onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
                className="rounded-xl bg-secondary/20 border-border focus:border-primary h-10 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">Deskripsi Singkat</Label>
              <Textarea
                placeholder="Jelaskan mengenai produk..."
                value={formProduct.description}
                onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                className="rounded-xl bg-secondary/20 border-border focus:border-primary min-h-[60px] text-xs resize-none pt-2"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="feat-checkbox"
                checked={formProduct.featured}
                onChange={(e) => setFormProduct({ ...formProduct, featured: e.target.checked })}
                className="w-4 h-4 text-primary bg-secondary/20 border-border rounded focus:ring-primary/20 accent-primary cursor-pointer"
              />
              <Label htmlFor="feat-checkbox" className="text-xs font-bold text-foreground cursor-pointer">
                Tampilkan sebagai Produk Utama (Featured)
              </Label>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEditOpen(false)}
                className="flex-1 h-10 rounded-xl text-xs font-semibold border-border"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-primary-foreground"
              >
                Simpan ke Katalog
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detail Review Submission (With Image Check!) */}
      <Dialog open={selectedSubmission !== null} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Detail Pengajuan Produk
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tinjau informasi dan gambar produk sebelum memberikan keputusan persetujuan.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-5 py-2">
              {/* Product Image Preview Section */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Gambar Produk</Label>
                {selectedSubmission.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-border bg-secondary/20 shadow-inner">
                    <img 
                      src={selectedSubmission.image} 
                      alt={selectedSubmission.name} 
                      className="w-full max-h-56 object-cover hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 rounded-xl border-2 border-dashed border-border bg-secondary/10 flex flex-col items-center justify-center text-muted-foreground gap-1.5">
                    <GraduationCap className="w-8 h-8 text-muted-foreground/50" />
                    <span className="text-[10px] font-bold">Tidak ada gambar yang diunggah</span>
                  </div>
                )}
              </div>

              {/* Submitter Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-border py-3">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Pengaju</span>
                  <span className="text-xs font-extrabold text-foreground">{selectedSubmission.nim}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Jurusan</span>
                  <span className="text-xs font-bold text-foreground">{selectedSubmission.jurusan}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Nama Produk</span>
                <h3 className="text-sm font-extrabold text-foreground">{selectedSubmission.name}</h3>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Deskripsi Produk</span>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap bg-secondary/30 p-3.5 rounded-xl border border-border font-medium">
                  {selectedSubmission.description}
                </p>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter className="pt-4 flex sm:justify-between items-center gap-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-xl h-10 px-5 border-border text-xs font-bold"
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
                      className="rounded-xl h-10 px-4 border-border text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center gap-1.5 text-xs font-bold"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Tolak
                    </Button>
                    <Button
                      onClick={() => {
                        handleApproveClick(selectedSubmission.id);
                        setSelectedSubmission(null);
                      }}
                      className="rounded-xl h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 text-xs font-bold glow-primary-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Setujui
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
 
      {/* Dialog: Enter Funding Amount on Approval */}
      <Dialog open={isFundingDialogOpen} onOpenChange={(open) => !open && setIsFundingDialogOpen(false)}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="text-center items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-base font-extrabold text-foreground">Setujui & Nominal Pendanaan</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Masukkan total nominal pendanaan untuk produk inovatif mahasiswa ini.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleConfirmApprove} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="funding-amount" className="text-xs font-bold text-foreground">Nominal Pendanaan (Rupiah, Opsional)</Label>
              <Input
                id="funding-amount"
                type="number"
                placeholder="Contoh: 15000000 (Bisa dikosongkan)"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="rounded-xl bg-secondary/20 border-border focus:border-primary h-11 text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Nilai ini opsional, kosongkan/lewati jika belum ditentukan harganya.
              </p>
            </div>

            <DialogFooter className="pt-2 flex sm:justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFundingDialogOpen(false)}
                className="rounded-xl h-10 px-4 text-xs font-bold border-border"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-xl h-10 px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 glow-primary-sm"
              >
                Konfirmasi Setujui
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
 
      {/* Dialog: Edit Total Pendanaan */}
      <Dialog open={isEditTotalOpen} onOpenChange={(open) => !open && setIsEditTotalOpen(false)}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-3xl p-5 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Koreksi Sisa Total Pendanaan
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Masukkan nominal sisa Total Pendanaan baru untuk memperbaiki kesalahan input.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="newTotalInput" className="text-xs font-semibold text-foreground">
                Sisa Pendanaan Baru (Rupiah)
              </Label>
              <Input
                id="newTotalInput"
                type="number"
                value={newTotalInput}
                onChange={(e) => setNewTotalInput(e.target.value)}
                placeholder="Contoh: 985000"
                className="rounded-xl bg-secondary/50 border-border h-11"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditTotalOpen(false)}
                className="rounded-xl h-11 px-5 border-border"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSaveDirectTotal}
                className="rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5"
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </Layout>
  );
};

export default Admin;
