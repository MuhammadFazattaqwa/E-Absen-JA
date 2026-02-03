-- =====================================================
-- REKAPAN ABSENSI NGAJI - JAGAD ALIMUSSIRRY
-- Database Schema untuk Supabase
-- =====================================================

-- 1. TABEL ATTENDANCES
-- Menyimpan record absensi user
CREATE TABLE IF NOT EXISTS public.attendances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('morning', 'evening')),
  day_name TEXT NOT NULL CHECK (day_name IN ('Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
  subject TEXT NOT NULL,
  teacher TEXT NOT NULL,
  pj TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpa')),
  note TEXT,
  photo_path TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Constraint: tidak boleh duplikat absensi untuk user yang sama pada tanggal + sesi yang sama
  CONSTRAINT unique_user_date_session UNIQUE (user_id, date, session)
);

-- 2. INDEXES untuk performa query
CREATE INDEX IF NOT EXISTS idx_attendances_user_id ON public.attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_attendances_date ON public.attendances(date);
CREATE INDEX IF NOT EXISTS idx_attendances_session ON public.attendances(session);
CREATE INDEX IF NOT EXISTS idx_attendances_status ON public.attendances(status);
CREATE INDEX IF NOT EXISTS idx_attendances_user_date ON public.attendances(user_id, date);

-- 3. FUNCTION untuk auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGER untuk auto-update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.attendances
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa melihat data absensinya sendiri
CREATE POLICY "Users can view their own attendances"
  ON public.attendances
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert data absensinya sendiri
CREATE POLICY "Users can insert their own attendances"
  ON public.attendances
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa update data absensinya sendiri
CREATE POLICY "Users can update their own attendances"
  ON public.attendances
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa delete data absensinya sendiri
CREATE POLICY "Users can delete their own attendances"
  ON public.attendances
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================
-- Jalankan di Supabase Dashboard > Storage atau via SQL:

-- Buat bucket 'attendance-proofs' (public untuk kemudahan akses foto)
INSERT INTO storage.buckets (id, name, public)
VALUES ('attendance-proofs', 'attendance-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: User hanya bisa upload file ke folder mereka sendiri
CREATE POLICY "Users can upload their own attendance proofs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'attendance-proofs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: User hanya bisa melihat file mereka sendiri
CREATE POLICY "Users can view their own attendance proofs"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'attendance-proofs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: User hanya bisa delete file mereka sendiri
CREATE POLICY "Users can delete their own attendance proofs"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'attendance-proofs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- =====================================================
-- CATATAN:
-- 1. Bucket 'attendance-proofs' dibuat PUBLIC agar foto bisa diakses langsung via URL
--    tanpa perlu signed URL. Ini aman karena RLS policy membatasi upload/delete
--    hanya untuk user yang bersangkutan.
-- 2. Struktur folder di storage: {user_id}/{yyyy-mm}/{filename}
-- 3. Jika ingin bucket PRIVATE, ubah public=false dan generate signed URL di aplikasi
-- =====================================================
