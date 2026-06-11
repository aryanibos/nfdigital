// Dynamic Products Store Utility
import notionPlanner from "@/assets/notion-planner.jpg";
import lightroomPresets from "@/assets/lightroom-presets.jpg";
import ebookFreelance from "@/assets/ebook-freelance.jpg";
import saasUiKit from "@/assets/saas-ui-kit.jpg";
import socialMediaTemplates from "@/assets/social-media-templates.jpg";
import videoCourse from "@/assets/video-course.jpg";
import reactComponents from "@/assets/react-components.jpg";
import marketingEbook from "@/assets/marketing-ebook.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  author: string;
  nim?: string;
  jurusan?: string;
  featured: boolean;
  createdAt: number;
  price?: number | null;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "notion-life-planner-2024",
    name: "Notion Life Planner 2024",
    category: "Template",
    subcategory: "Notion",
    description: "Template Notion all-in-one untuk mengatur jadwal dan target hidupmu.",
    image: notionPlanner,
    author: "Fakultas Bisnis Digital",
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12, // 12 days ago
  },
  {
    id: "ultimate-lightroom-presets",
    name: "Ultimate Lightroom Presets",
    category: "Preset & Filter",
    subcategory: "Lightroom",
    description: "50+ Preset estetik untuk foto Instagram yang lebih kece.",
    image: lightroomPresets,
    author: "Mahasiswa BD",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 11,
  },
  {
    id: "ebook-jago-freelance",
    name: "E-Book: Jago Freelance",
    category: "E-Book & Panduan",
    subcategory: "Bisnis",
    description: "Panduan lengkap memulai karir freelance dari nol hingga cuan.",
    image: ebookFreelance,
    author: "Himpunan Mahasiswa",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: "saas-ui-kit-figma",
    name: "SaaS UI Kit Figma",
    category: "UI/UX Kit",
    subcategory: "Figma",
    description: "Kumpulan komponen UI modern untuk desain aplikasi web.",
    image: saasUiKit,
    author: "Alumni Bisnis Digital",
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "social-media-templates",
    name: "Social Media Templates",
    category: "Template",
    subcategory: "Canva",
    description: "100+ template Instagram, TikTok, dan YouTube siap pakai.",
    image: socialMediaTemplates,
    author: "Zacky Maulana",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "video-editing-course",
    name: "Video Editing Course",
    category: "Video & Kursus",
    subcategory: "Premiere Pro",
    description: "Kursus lengkap editing video dari dasar hingga mahir.",
    image: videoCourse,
    author: "Dosen Pembimbing",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "react-component-library",
    name: "React Component Library",
    category: "Source Code",
    subcategory: "React",
    description: "50+ komponen React siap pakai untuk proyek web modern.",
    image: reactComponents,
    author: "Lab Komputer STT NF",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: "digital-marketing-ebook",
    name: "Digital Marketing E-Book",
    category: "E-Book & Panduan",
    subcategory: "Marketing",
    description: "Strategi pemasaran digital untuk bisnis online sukses.",
    image: marketingEbook,
    author: "Pakar Bisnis STT NF",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "instagram-story-templates",
    name: "Instagram Story Templates",
    category: "Template",
    subcategory: "Instagram",
    description: "50+ template story Instagram yang aesthetic dan engaging.",
    image: socialMediaTemplates,
    author: "Syarif Hidayatullah",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "figma-icon-pack",
    name: "Figma Icon Pack Premium",
    category: "Aset Desain",
    subcategory: "Icon",
    description: "1000+ ikon vektor premium untuk desain UI/UX modern.",
    image: saasUiKit,
    author: "Hana Nabila",
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "content-creator-bundle",
    name: "Content Creator Bundle",
    category: "Video & Kursus",
    subcategory: "YouTube",
    description: "Paket lengkap untuk content creator: intro, outro, lower thirds.",
    image: videoCourse,
    author: "Rian Syah",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "productivity-notion-system",
    name: "Productivity Notion System",
    category: "Template",
    subcategory: "Notion",
    description: "Sistem produktivitas lengkap dengan habit tracker dan goal setting.",
    image: notionPlanner,
    author: "Dhea Ananda",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];

export const initializeProducts = (): Product[] => {
  const saved = localStorage.getItem("katalog_produk");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse katalog_produk", e);
    }
  }
  localStorage.setItem("katalog_produk", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
};

const API_URL = "/api/api.php";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}?action=get_products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch products from API, falling back to local storage", e);
    return initializeProducts();
  }
};

export const saveProduct = async (product: Product): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}?action=save_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to save product to API");
  } catch (e) {
    console.error("Failed to save product to API, falling back to local storage", e);
  }
  
  // Keep local storage synchronized as fallback
  const current = initializeProducts();
  const index = current.findIndex((p) => p.id === product.id);
  if (index !== -1) {
    current[index] = product;
  } else {
    current.unshift(product);
  }
  localStorage.setItem("katalog_produk", JSON.stringify(current));
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}?action=delete_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to delete product from API");
  } catch (e) {
    console.error("Failed to delete product from API, falling back to local storage", e);
  }

  // Keep local storage synchronized as fallback
  const current = initializeProducts();
  const filtered = current.filter((p) => p.id !== id);
  localStorage.setItem("katalog_produk", JSON.stringify(filtered));
};
