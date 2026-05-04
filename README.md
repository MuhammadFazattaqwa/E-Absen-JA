# Rekapan Absensi Ngaji - Jagad Alimussirry

Website untuk mencatat kehadiran kajian pagi dan malam dengan upload foto bukti kehadiran.

## 🎨 Teknologi

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS (tema army green, hijau, krem)
- **Backend**: Supabase (Auth, Database, Storage)
- **Deploy**: Vercel-ready

## 🚀 Fitur

### 1. Autentikasi
- Login/Register dengan email & password
- Session management dengan Supabase Auth
- Protected routes

### 2. Dashboard
- Tampilan kajian hari ini (pagi & malam)
- Widget statistik: streak hadir, total hadir bulan ini, persentase
- Tombol quick action "Absen Sekarang"

### 3. Form Absensi
- Date picker dengan auto-detect hari (Indonesia)
- Auto-fill kajian, pengajar, PJ berdasarkan sesi + hari
- Upload foto bukti kehadiran (wajib untuk status "Hadir")
- Preview foto sebelum upload
- Validasi duplikat absensi
- Loading state & toast notification

### 4. Riwayat
- Tabel riwayat absensi
- Filter: bulan, sesi, status
- Export ke CSV
- Empty state yang cantik

### 5. Rekap
- Statistik bulanan (Hadir/Izin/Sakit/Alpa)
- Persentase kehadiran per bulan
- Total tahunan
- Filter tahun

## 📁 Struktur Folder

```
absensi-ngaji/
├── src/
│   ├── app/
│   │   ├── absen/
│   │   │   └── page.tsx          # Form absensi
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard utama
│   │   ├── login/
│   │   │   └── page.tsx          # Halaman login
│   │   ├── register/
│   │   │   └── page.tsx          # Halaman register
│   │   ├── riwayat/
│   │   │   └── page.tsx          # Riwayat absensi
│   │   ├── rekap/
│   │   │   └── page.tsx          # Rekap bulanan
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home (redirect)
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── ui/
│   │       ├── Navbar.tsx        # Navigation bar
│   │       ├── Badge.tsx         # Status badge
│   │       ├── Loading.tsx       # Loading spinner
│   │       └── EmptyState.tsx    # Empty state
│   └── lib/
│       ├── constants/
│       │   └── schedules.ts      # Master jadwal kajian
│       ├── supabase/
│       │   ├── client.ts         # Supabase browser client
│       │   └── server.ts         # Supabase server client
│       ├── types/
│       │   └── database.ts       # TypeScript types
│       └── utils/
│           ├── date.ts           # Date utilities
│           └── export.ts         # CSV export
├── supabase-schema.sql           # Database schema
├── tailwind.config.ts            # Tailwind config
├── next.config.js                # Next.js config
├── package.json
└── README.md
```

## 🛠️ Setup Step-by-Step

### 1. Clone & Install Dependencies

```bash
cd "c:\Code\Absensi Reward"
npm install
```

### 2. Setup Supabase

#### A. Buat Project Supabase
1. Buka https://supabase.com
2. Buat project baru
3. Catat **Project URL** dan **Anon Key**

#### B. Jalankan SQL Schema
1. Buka Supabase Dashboard > SQL Editor
2. Copy semua isi file `supabase-schema.sql`
3. Paste dan jalankan (Execute)
4. Pastikan tabel `attendances` dan bucket `attendance-proofs` terbuat

#### C. Setup Storage Bucket
1. Buka Supabase Dashboard > Storage
2. Pastikan bucket `attendance-proofs` sudah ada (dibuat otomatis dari SQL)
3. Bucket ini bersifat **PUBLIC** agar foto bisa diakses langsung
4. RLS policies sudah mengatur akses per user

### 3. Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Ganti dengan URL dan Key dari project Supabase Anda.

### 4. Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000

### 5. Deploy ke Vercel

```bash
# Install Vercel CLI (opsional)
npm i -g vercel

# Deploy
vercel

# Atau push ke GitHub dan connect di Vercel Dashboard
```

Jangan lupa tambahkan environment variables di Vercel Dashboard > Settings > Environment Variables.

## 🎨 Tema Warna

### Army Green
- `army-50` hingga `army-900`
- Dominan untuk navbar, buttons, text

### Hijau
- `hijau-50` hingga `hijau-900`
- Untuk status "Hadir", success states

### Krem
- `krem-50` hingga `krem-900`
- Background, cards, accents

## 📊 Database Schema

### Tabel: attendances

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key ke auth.users |
| date | DATE | Tanggal absensi |
| session | TEXT | 'morning' atau 'evening' |
| day_name | TEXT | Nama hari (Ahad-Sabtu) |
| subject | TEXT | Nama kajian |
| teacher | TEXT | Nama pengajar |
| pj | TEXT | Nama PJ |
| status | TEXT | 'Hadir', 'Izin', 'Sakit', 'Alpa' |
| note | TEXT | Catatan opsional |
| photo_path | TEXT | Path file di storage |
| photo_url | TEXT | Public URL foto |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

**Constraint**: UNIQUE (user_id, date, session) - tidak boleh duplikat

### RLS Policies
- User hanya bisa SELECT/INSERT/UPDATE/DELETE data miliknya sendiri
- Storage policies: user hanya bisa upload/view/delete file di folder mereka

## 📅 Master Jadwal

Jadwal kajian disimpan sebagai konstanta di `src/lib/constants/schedules.ts`:

### Kajian Pagi (05.00)
- **Ahad**: Rasa'il Al-Junaid (aba Djoko) - PJ: Silvia
- **Senin**: Psikologi Agama (ustadzah Niha) - PJ: Alvia
- **Selasa**: Riyadhus Sholihin (aba Yahya) - PJ: Yusrin
- **Rabu**: Filsafat Ilmu (ustadz Husni) - PJ: Mela
- **Kamis**: Manajemen SDM (ustadzah Abil & ustadzah Indah) - PJ: Sofia
- **Jumat**: Ilmu Kalam (ustadz Mahbub) - PJ: Salisa
- **Sabtu**: Safinatun Najah (ustadzah Azizah & ustadzah Fitri) - PJ: Ina

### Kajian Malam (20.00)
- **Ahad**: Ihya' Ulumuddin (aba Djoko) - PJ: Yusrin
- **Senin**: Filsafat Pendidikan Islam (ustadzah Ani) - PJ: Hibatin
- **Selasa**: Fathul Mu'in (aba Yahya) - PJ: Silvia
- **Rabu**: Sejarah Peradaban Islam (ustadz Ulil & ustadzah Mida) - PJ: Amina
- **Kamis**: Tafsir Jallalain & Istighotsah (aba Djoko) - PJ: Yusrin
- **Jumat**: Qurrotul 'Uyun (ustadz Huda & ustadzah Idhoh) - PJ: Nisrina

## 🔐 Keamanan

- Row Level Security (RLS) aktif di semua tabel
- User hanya bisa akses data miliknya sendiri
- Storage bucket dengan policies per user
- Auth session management dengan Supabase

## 📱 Mobile-First Design

- Responsive layout untuk semua ukuran layar
- Touch-friendly buttons dan forms
- Optimized untuk penggunaan mobile

## 🐛 Troubleshooting

### Error: "relation attendances does not exist"
- Pastikan SQL schema sudah dijalankan di Supabase

### Error: "bucket attendance-proofs does not exist"
- Jalankan bagian Storage Bucket di SQL schema

### Foto tidak muncul
- Pastikan bucket `attendance-proofs` bersifat PUBLIC
- Cek RLS policies di Storage

### Tidak bisa login
- Cek environment variables sudah benar
- Pastikan Supabase Auth sudah aktif

## 📝 License

Private project untuk Jagad Alimussirry

## 👨‍💻 Developer

Built with ❤️ by Senior Full-Stack Engineer
