'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/ui/Navbar';
import { getDayNameFromDate, getSchedule, DayName, Session } from '@/lib/constants/schedules';
import { formatDateForInput } from '@/lib/utils/date';
import { AttendanceStatus } from '@/lib/types/database';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AbsenPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [session, setSession] = useState<Session>('morning');
  const [dayName, setDayName] = useState<DayName>('Ahad');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [pj, setPj] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('Hadir');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const whatsappNumber = session === 'morning' ? '6282229910627' : '6283847423953';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUserId(user.id);
      }
    };
    checkUser();
  }, [router, supabase]);

  useEffect(() => {
    const selectedDate = new Date(date);
    const day = getDayNameFromDate(selectedDate);
    setDayName(day);

    const schedule = getSchedule(day, session);
    if (schedule) {
      setSubject(schedule.subject);
      setTeacher(schedule.teacher);
      setPj(schedule.pj);
    }
  }, [date, session]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAttend = () => {
    setDate(formatDateForInput(new Date()));
    const now = new Date();
    const hour = now.getHours();
    setSession(hour < 12 ? 'morning' : 'evening');
    setStatus('Hadir');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'Hadir' && !photo) {
      toast.error('Foto bukti wajib untuk status Hadir');
      return;
    }

    setLoading(true);

    try {
      let photoPath = '';
      let photoUrl = '';

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const yearMonth = date.substring(0, 7);
        photoPath = `${userId}/${yearMonth}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('attendance-proofs')
          .upload(photoPath, photo);

        if (uploadError) {
          toast.error('Gagal upload foto: ' + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('attendance-proofs')
          .getPublicUrl(photoPath);

        photoUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('attendances')
        .insert({
          user_id: userId,
          date,
          session,
          day_name: dayName,
          subject,
          teacher,
          pj,
          status,
          note: note || null,
          photo_path: photoPath || null,
          photo_url: photoUrl || null,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          toast.error('Anda sudah absen untuk tanggal dan sesi ini');
        } else {
          toast.error('Gagal menyimpan absensi: ' + insertError.message);
        }
        setLoading(false);
        return;
      }

      toast.success('Absensi berhasil disimpan!');
      router.push('/riwayat');
    } catch (error) {
      toast.error('Terjadi kesalahan');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-krem-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-army-900 mb-2">Form Absensi</h1>
          <p className="text-army-600">Isi data kehadiran kajian</p>
        </div>

        <div className="card mb-6">
          <button
            onClick={handleQuickAttend}
            className="btn-secondary w-full"
          >
            ⚡ Absen Hari Ini (Quick)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                Sesi
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as Session)}
                className="input-field"
                required
              >
                <option value="morning">Pagi (05.00)</option>
                <option value="evening">Malam (20.00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-army-700 mb-1">
              Hari
            </label>
            <input
              type="text"
              value={dayName}
              className="input-field bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-army-700 mb-1">
              Kajian
            </label>
            <input
              type="text"
              value={subject}
              className="input-field bg-gray-100"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                Pengajar
              </label>
              <input
                type="text"
                value={teacher}
                className="input-field bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                PJ
              </label>
              <input
                type="text"
                value={pj}
                className="input-field bg-gray-100"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-army-700 mb-1">
              Status Kehadiran
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="input-field"
              required
            >
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Alpa">Alpa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-army-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Tambahkan catatan jika perlu..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-army-700 mb-1">
              Foto Bukti Kehadiran {status === 'Hadir' && <span className="text-red-600">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="input-field"
              required={status === 'Hadir'}
            />
            {photoPreview && (
              <div className="mt-4">
                <p className="text-sm text-army-600 mb-2">Preview:</p>
                <Image
                  src={photoPreview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="rounded-lg border border-army-200 object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Menyimpan...' : 'Simpan Absensi'}
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full block text-center"
          >
            Konfirmasi via WhatsApp
          </a>
          <p className="text-center text-sm text-army-600">
            Nomor otomatis sesuai sesi: {session === 'morning' ? 'Pagi' : 'Malam'}
          </p>
        </form>
      </main>
    </div>
  );
}
