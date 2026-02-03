import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/ui/Navbar';
import { getDayNameFromDate, getTodaySchedules } from '@/lib/constants/schedules';
import { formatDate, getCurrentMonth, getMonthRange } from '@/lib/utils/date';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const today = new Date();
  const dayName = getDayNameFromDate(today);
  const schedules = getTodaySchedules(dayName);
  const { year, month } = getCurrentMonth();
  const { start, end } = getMonthRange(year, month);

  const { data: monthlyAttendances } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', start)
    .lte('date', end);

  const hadirCount = monthlyAttendances?.filter(a => a.status === 'Hadir').length || 0;
  const totalCount = monthlyAttendances?.length || 0;
  const alpaCount = monthlyAttendances?.filter(a => a.status === 'Alpa').length || 0;
  const alpaLimit = 8;
  const alpaRemaining = Math.max(alpaLimit - alpaCount, 0);

  const { data: recentAttendances } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(10);

  let streak = 0;
  if (recentAttendances && recentAttendances.length > 0) {
    for (const att of recentAttendances) {
      if (att.status === 'Hadir') {
        streak++;
      } else {
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-krem-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-army-900 mb-2">Dashboard</h1>
          <p className="text-army-600">{formatDate(today, 'EEEE, dd MMMM yyyy')}</p>
        </div>
        {alpaCount > 0 && (
          <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-900">
            <div className="font-semibold">Peringatan Alpha Bulan Ini</div>
            <div className="text-sm">
              Anda sudah alpha <span className="font-semibold">{alpaCount}</span> kali dari batas{' '}
              <span className="font-semibold">{alpaLimit}</span> kali. Sisa kesempatan:{' '}
              <span className="font-semibold">{alpaRemaining}</span>.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-hijau-500 to-hijau-600 text-white">
            <div className="text-sm opacity-90 mb-1">Streak Hadir</div>
            <div className="text-4xl font-bold">{streak}</div>
            <div className="text-sm opacity-90 mt-1">hari berturut-turut</div>
          </div>

          <div className="card bg-gradient-to-br from-army-500 to-army-600 text-white">
            <div className="text-sm opacity-90 mb-1">Hadir Bulan Ini</div>
            <div className="text-4xl font-bold">{hadirCount}</div>
            <div className="text-sm opacity-90 mt-1">dari {totalCount} kajian</div>
          </div>

          <div className="card bg-gradient-to-br from-krem-500 to-krem-600 text-white">
            <div className="text-sm opacity-90 mb-1">Persentase</div>
            <div className="text-4xl font-bold">
              {totalCount > 0 ? Math.round((hadirCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-sm opacity-90 mt-1">kehadiran</div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-bold text-army-900 mb-4">Kajian Hari Ini - {dayName}</h2>
          <div className="space-y-4">
            {schedules.morning && (
              <div className="border border-army-200 rounded-lg p-4 bg-krem-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-army-600 mb-1">Kajian Pagi • {schedules.morning.time}</div>
                    <h3 className="font-semibold text-army-900">{schedules.morning.subject}</h3>
                  </div>
                  <span className="badge bg-yellow-100 text-yellow-800">Pagi</span>
                </div>
                <div className="text-sm text-army-700">
                  <div>Pengajar: {schedules.morning.teacher}</div>
                  <div>PJ: {schedules.morning.pj}</div>
                </div>
              </div>
            )}

            {schedules.evening && (
              <div className="border border-army-200 rounded-lg p-4 bg-krem-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-army-600 mb-1">Kajian Malam • {schedules.evening.time}</div>
                    <h3 className="font-semibold text-army-900">{schedules.evening.subject}</h3>
                  </div>
                  <span className="badge bg-indigo-100 text-indigo-800">Malam</span>
                </div>
                <div className="text-sm text-army-700">
                  <div>Pengajar: {schedules.evening.teacher}</div>
                  <div>PJ: {schedules.evening.pj}</div>
                </div>
              </div>
            )}
          </div>

          <Link href="/absen" className="btn-primary w-full mt-6 block text-center">
            Absen Sekarang
          </Link>
        </div>
      </main>
    </div>
  );
}
