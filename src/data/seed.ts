import { Profile, Skill, Project, Experience } from '../types';

export const DEFAULT_PROFILE: Profile = {
  name: 'Ahmad Farhan',
  title: 'Full-Stack Developer & PKL Intern',
  bio: 'Siswa RPL dari SMK PGRI Wlingi yang berfokus pada pengembangan aplikasi web modern dengan teknologi cutting-edge. Menggabungkan estetika fungsional dan performa tinggi.',
  aboutLong: 'Saya adalah siswa kelas XII jurusan Rekayasa Perangkat Lunak (RPL) di SMK PGRI Wlingi. Memiliki ketertarikan mendalam dalam dunia Web Development, khususnya ekosistem JavaScript/TypeScript dan PHP. Saat ini saya sedang menjalani program Praktek Kerja Lapangan (PKL) dan aktif membangun proyek-proyek web interaktif yang berorientasi pada performa tinggi dan desain futuristik.',
  school: 'SMK PGRI Wlingi',
  major: 'Rekayasa Perangkat Lunak (RPL)',
  // avatar disimpan lokal (base64) biar tidak butuh fetch dari URL eksternal
  avatar: '',
  cvUrl: '#',
  email: 'ahmadfarhan.dev@gmail.com',
  whatsapp: '6281234567890',
  github: 'https://github.com/henantyo',
  linkedin: 'https://linkedin.com/in/ahmadfarhan',
  instagram: 'https://instagram.com/ahmadfarhan.dev',
};

export const DEFAULT_SKILLS: Skill[] = [
  // Frontend
  { id: 's1', name: 'React.js', category: 'Frontend', level: 85 },
  { id: 's2', name: 'TypeScript', category: 'Frontend', level: 80 },
  { id: 's3', name: 'Tailwind CSS', category: 'Frontend', level: 90 },
  { id: 's4', name: 'Next.js', category: 'Frontend', level: 70 },
  
  // Backend
  { id: 's5', name: 'Node.js', category: 'Backend', level: 75 },
  { id: 's6', name: 'Express.js', category: 'Backend', level: 80 },
  { id: 's7', name: 'Laravel / PHP', category: 'Backend', level: 85 },
  { id: 's8', name: 'MySQL / PostgreSQL', category: 'Backend', level: 80 },
  
  // Tools
  { id: 's9', name: 'Git & GitHub', category: 'Tools', level: 85 },
  { id: 's10', name: 'VS Code', category: 'Tools', level: 90 },
  { id: 's11', name: 'Figma', category: 'Tools', level: 75 },
  { id: 's12', name: 'Docker', category: 'Tools', level: 60 },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'E-Library SMK PGRI Wlingi',
    description: 'Sistem informasi perpustakaan sekolah digital berbasis web dengan fitur peminjaman otomatis, katalog buku dinamis, dan dashboard laporan admin.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800',
    techStack: ['Laravel', 'React', 'Tailwind CSS', 'MySQL'],
    githubUrl: 'https://github.com/henantyo/e-library-smk',
    featured: true,
  },
  {
    id: 'p2',
    title: 'Smart Gate QR Scanner',
    description: 'Sistem presensi siswa real-time menggunakan QR Code terenkripsi yang dipindai melalui web camera, terintegrasi langsung dengan database sekolah.',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800',
    techStack: ['Node.js', 'Express', 'Socket.io', 'React', 'MongoDB'],
    githubUrl: 'https://github.com/henantyo/smart-gate-qr',
    featured: true,
  },
  {
    id: 'p3',
    title: 'NEO-ARCH HUD Portfolio',
    description: 'Portfolio personal bertema sci-fi HUD futuristik dengan dashboard admin mandiri untuk mengelola data proyek, keahlian, dan riwayat kerja tanpa menyentuh kode.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'TanStack Router'],
    githubUrl: 'https://github.com/henantyo/neo-arch-portfolio',
    featured: true,
  },
  {
    id: 'p4',
    title: 'Sistem Informasi PKL Terpadu',
    description: 'Platform manajemen kegiatan PKL untuk monitoring jurnal harian siswa, absensi, dan penilaian pembimbing industri secara digital.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    techStack: ['React', 'Context API', 'Tailwind CSS', 'LocalStorage'],
    githubUrl: 'https://github.com/henantyo/si-pkl-terpadu',
    featured: false,
  },
];

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'e1',
    role: 'Full-Stack Developer Intern (PKL)',
    company: 'Quantum Tech Solutions',
    period: 'Januari 2025 - Sekarang',
    description: 'Membangun dan memelihara aplikasi web internal klien menggunakan stack React.js dan Laravel. Berkolaborasi dengan tim senior untuk merancang arsitektur database dan mengoptimalkan performa API.',
    current: true,
  },
  {
    id: 'e2',
    role: 'Ketua IT Club (Cyber Team)',
    company: 'SMK PGRI Wlingi',
    period: 'Juli 2023 - Desember 2024',
    description: 'Memimpin komunitas IT sekolah dalam pelatihan pemrograman dasar, desain web, dan persiapan kompetisi LKS (Lomba Kompetensi Siswa) tingkat kabupaten.',
    current: false,
  },
  {
    id: 'e3',
    role: 'Freelance Web Developer',
    company: 'Fiverr & Kontrak Lokal',
    period: 'Maret 2023 - November 2024',
    description: 'Mengerjakan berbagai proyek pembuatan landing page interaktif, website profil sekolah, dan sistem kasir sederhana untuk UMKM di sekitar wilayah Blitar.',
    current: false,
  },
];
