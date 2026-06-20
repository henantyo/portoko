# NEO-ARCH // Futuristic HUD Portfolio & Admin Dashboard

Portofolio personal interaktif bercorak futuristik/sci-fi HUD dengan dashboard admin mandiri (*serverless*, sinkronisasi via `localStorage`). Dibuat khusus untuk siswa RPL dari SMK PGRI Wlingi yang sedang melakukan Praktek Kerja Lapangan (PKL).

---

## 🚀 Fitur Utama
1. **Tema Futuristik / Tech-Glow Clean**: Menggunakan kombinasi warna gelap navy keunguan, grid overlay semi-transparan, scanline halus, dan sudut card HUD tajam (*corner brackets*).
2. **Booting Sequence Terminal**: Simulasi *loading screen* awal "Booting System" yang menampilkan log diagnostik sebelum masuk ke halaman utama.
3. **TanStack Router**: Routing client-side yang cepat, robust, dan modern dengan transisi halaman smooth (Framer Motion).
4. **Dashboard Admin CRUD (/admin)**:
   - Login aman (simulasi enkripsi/dekripsi).
   - CRUD Proyek (Tambahkan gambar, deskripsi, tech stack, link demo, dan andalan).
   - CRUD Keahlian (Pengelompokan kategori dan slider persentase keahlian).
   - CRUD Pengalaman (Linimasa vertikal bergaya sirkuit).
   - Edit Profil (Nama, sekolah, jurusan, kontak WA/Email, sosial media).
5. **Sinkronisasi Otomatis**: Perubahan data di Dashboard Admin langsung tersinkronisasi ke seluruh Landing Page secara real-time menggunakan kustom hook `useLocalStorage`.
6. **Simulasi Terminal Kontak**: Form kontak interaktif bergaya baris perintah terminal (*bash command*).

---

## 📂 Struktur Folder Proyek
```text
├── public/
│   ├── favicon.svg             # Favicon HUD geometris kustom
│   └── images/
│       └── profile.jpg         # Foto profil default
├── src/
│   ├── assets/                 # Aset statis tambahan
│   ├── components/             # Komponen visual HUD utama
│   │   ├── AnimatedBackground.tsx # Animasi gradient blob latar belakang
│   │   ├── BootScreen.tsx      # Terminal boot sequence loader
│   │   ├── CornerBrackets.tsx  # Braket siku-siku dekorasi HUD
│   │   ├── Footer.tsx          # Footer informatif koordinat Blitar
│   │   ├── GridOverlay.tsx     # Overlay grid sirkuit tipis
│   │   ├── GlowButton.tsx      # Tombol neon dengan efek hover shimmer
│   │   ├── Navbar.tsx          # Header HUD lengket (sticky)
│   │   ├── ScanlineOverlay.tsx # Efek CRT scanline bergerak halus
│   │   └── TerminalToast.tsx   # Notifikasi toast log sistem admin
│   ├── data/
│   │   └── seed.ts             # Data default awal (SMK PGRI Wlingi RPL)
│   ├── hooks/
│   │   ├── useLocalStorage.ts  # Sinkronisasi state lokal & localStorage
│   │   └── useTypingEffect.ts  # Efek ketikan teks interaktif di Hero
│   ├── lib/
│   │   └── db.ts               # Inisialisasi database localStorage
│   ├── pages/                  # Halaman utama aplikasi
│   │   ├── Home.tsx            # Beranda dengan ringkasan & statistik cepat
│   │   ├── About.tsx           # Bio lengkap, konsentrasi jurusan, & afiliasi
│   │   ├── Skills.tsx          # Index keahlian dengan loading-bar neon
│   │   ├── Projects.tsx        # Galeri proyek dengan pencarian & filter
│   │   ├── Experience.tsx      # Linimasa vertikal sirkuit
│   │   ├── Contact.tsx         # Terminal bash form kontak simulasi
│   │   ├── AdminLogin.tsx      # Halaman otorisasi admin
│   │   └── AdminDashboard.tsx  # Dashboard CRUD profil/proyek/skill/pengalaman
│   ├── types/
│   │   └── index.ts            # Tipe TypeScript ketat (strict typing)
│   ├── App.tsx                 # Entry routing TanStack Router & Boot Handler
│   ├── index.css               # Tema kustom Tailwind v4 & konfigurasi global
│   └── main.tsx                # Render root React 19
├── index.html                  # HTML template dengan Google Fonts (Space Grotesk, Rajdhani)
├── package.json                # Pengaturan dependensi proyek
├── tsconfig.json               # Konfigurasi TypeScript compiler
└── vite.config.ts              # Konfigurasi bundler Vite
```

---

## 🛠️ Instalasi & Cara Menjalankan Proyek

### Prasyarat
Pastikan Anda sudah menginstal **Node.js (versi 18+)** dan **npm** di komputer Anda.

### Langkah-langkah:

1. **Kloning atau Unduh Proyek** ke komputer lokal Anda.
2. **Masuk ke Direktori Proyek**:
   ```bash
   cd nama-folder-proyek
   ```
3. **Instal Dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```
   Buka peramban (browser) Anda dan akses alamat `http://localhost:5173`.

5. **Membangun Proyek untuk Produksi** (Build):
   ```bash
   npm run build
   ```
   Hasil build akan tersimpan di folder `dist/` yang siap dideploy ke server statis seperti Vercel, Netlify, atau GitHub Pages.

---

## 🔐 Kredensial Login Admin
Untuk mengakses Dashboard Admin (`/admin`), gunakan kredensial berikut:
- **Username**: `admin`
- **Crypto Key (Password)**: `admin123`

*Catatan: Anda dapat mengubah password ini langsung melalui panel edit profil atau mengubahnya di localStorage browser Anda.*

---

## 💻 Teknologi yang Digunakan
- **React 19** - Library UI deklaratif berbasis komponen.
- **TypeScript** - Pemrograman dengan pengetikan statis yang kuat untuk keamanan kode.
- **Vite** - Bundler modern berkecepatan tinggi.
- **TanStack Router** - Routing client-side modern berbasis *type-safe* route tree.
- **Tailwind CSS v4** - Framework CSS berorientasi utilitas dengan kustomisasi CSS variabel.
- **Framer Motion** - Framework animasi tingkat tinggi untuk transisi halus dan interaktif.
- **Lucide React** - Paket ikon vektor modern yang minimalis.
