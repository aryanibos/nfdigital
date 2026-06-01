# NF Katalog - Bisnis Digital STT Terpadu Nurul Fikri 🎓

NF Katalog adalah portal interaktif dan premium untuk mempublikasikan serta mempromosikan produk digital inovatif karya Mahasiswa Program Studi Bisnis Digital di Sekolah Tinggi Teknologi Terpadu Nurul Fikri (STT NF).

Aplikasi ini dilengkapi dengan antarmuka modern berkelir gelap (*dark mode*) yang memukau, dilengkapi dengan navigasi ganda (Sidebar + Top Navbar), portal pengajuan produk mahasiswa (*Student Portal*), dan panel manajemen admin (*Admin Dashboard*).

---

## 🌟 Fitur Utama

### 1. 🎓 Portal Mahasiswa (Student Portal - `/submit`)
*   **Autentikasi NIM Dinamis**: Mahasiswa dapat masuk secara instan menggunakan NIM mereka.
*   **Pengajuan CRUD Produk Mandiri**: Mahasiswa dapat mendaftarkan produk digital baru, melihat daftar pengajuannya, serta mengedit pengajuan sebelumnya yang masih berstatus menunggu persetujuan.
*   **Konversi Base64 Foto Produk**: Mengunggah foto produk langsung dikonversi menjadi data Base64 secara instan untuk pratinjau lokal yang persisten.
*   **Edit Profil & Unggah Foto Avatar**: Mahasiswa dapat memperbarui nama lengkap, email, bio diri, mengunggah foto profil, serta mengganti kata sandi secara lokal di peramban.

### 2. 🔐 Panel Pengelola / Admin (Admin Portal - `/admin`)
*   **Dasbor Ringkasan Statistik**: Menampilkan statistik total produk, pengajuan disetujui, pengajuan tertunda, dan total mahasiswa aktif.
*   **Verifikasi & Persetujuan Pengajuan**: Admin dapat meninjau detail produk mahasiswa, menguji/memverifikasi kecocokan foto produk menggunakan dialog pratinjau resolusi tinggi, dan menyetujui atau menolak pengajuan tersebut.
*   **CRUD Produk Katalog**: Admin memiliki wewenang penuh untuk membuat, membaca, memperbarui, dan menghapus produk katalog secara manual.
*   **Manajemen Statistik Beranda**: Admin dapat menyunting angka pencapaian statistik langsung dari panel dashboard.

### 3. 👥 Portal Publik & Katalog Utama
*   **Pencarian & Filter Kategori**: Pengunjung dapat mencari produk digital mahasiswa berdasarkan kata kunci nama produk atau memfilternya berdasarkan kategori produk.
*   **Halaman Detail Produk**: Menampilkan deskripsi lengkap produk, status verifikasi resmi admin, detail informasi pembuat (NIM & Jurusan), serta tautan langsung untuk bertransaksi atau berkontak.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan arsitektur modern berkinerja tinggi:

*   **Core**: [React](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling (CSS)**: [Tailwind CSS](https://tailwindcss.com/) (dengan kustomisasi tema premium) + [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **State & Query**: LocalStorage-driven state synchronization untuk simulasi database lintas tab browser.

---

## 🚀 Cara Menjalankan Secara Lokal

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan proyek di komputer lokal Anda:

### Langkah 1: Kloning Repositori
```bash
git clone <URL_REPOSITORI_ANDA>
cd nfdigital
```

### Langkah 2: Instalasi Dependensi
```bash
npm install
```

### Langkah 3: Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:8080](http://localhost:8080) di browser Anda untuk melihat aplikasi berjalan secara langsung.

### Langkah 4: Kompilasi / Build untuk Produksi
```bash
npm run build
```
Hasil kompilasi produksi akan disimpan di dalam direktori `dist/` dan siap dideploy ke server static seperti Vercel, Netlify, atau GitHub Pages.

---

## 🔒 Informasi Kredensial Percobaan

Aplikasi menggunakan sistem database sesi lokal (`localStorage`). Berikut akun bawaan untuk percobaan dasbor:

*   **Akses Admin**:
    *   **NIM / Username**: `admin`
    *   **Kata Sandi**: `admin`
*   **Akses Mahasiswa**:
    *   **NIM / Username**: Masukkan NIM bebas (contoh: `0110221001`)
    *   **Kata Sandi**: Bebas (Kata sandi pertama kali yang Anda ketik akan otomatis didaftarkan sebagai password akun tersebut).

---
© STT Terpadu Nurul Fikri - Bisnis Digital
