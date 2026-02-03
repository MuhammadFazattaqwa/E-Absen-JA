'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/ui/Navbar';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import { getCurrentMonth, getMonthRange, getMonthName } from '@/lib/utils/date';

interface MonthStats {
  month: string;
  year: number;
  monthNum: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  total: number;
  percentage: number;
}

export default function RekapPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MonthStats[]>([]);

  const { year, month } = getCurrentMonth();
  const [selectedYear, setSelectedYear] = useState(year);

  const fetchStats = useCallback(async (userId: string) => {
    setLoading(true);
    const monthlyStats: MonthStats[] = [];

    for (let m = 1; m <= 12; m++) {
      const { start, end } = getMonthRange(selectedYear, m);

      const { data, error } = await supabase
        .from('attendances')
        .select('*')
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end);

      if (!error && data) {
        const hadir = data.filter(a => a.status === 'Hadir').length;
        const izin = data.filter(a => a.status === 'Izin').length;
        const sakit = data.filter(a => a.status === 'Sakit').length;
        const alpa = data.filter(a => a.status === 'Alpa').length;
        const total = data.length;
        const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

        if (total > 0) {
          monthlyStats.push({
            month: getMonthName(m),
            year: selectedYear,
            monthNum: m,
            hadir,
            izin,
            sakit,
            alpa,
            total,
            percentage,
          });
        }
      }
    }

    setStats(monthlyStats);
    setLoading(false);
  }, [selectedYear, supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        fetchStats(user.id);
      }
    };
    checkUser();
  }, [fetchStats, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-krem-50">
        <Navbar />
        <Loading />
      </div>
    );
  }

  const totalHadir = stats.reduce((sum, s) => sum + s.hadir, 0);
  const totalIzin = stats.reduce((sum, s) => sum + s.izin, 0);
  const totalSakit = stats.reduce((sum, s) => sum + s.sakit, 0);
  const totalAlpa = stats.reduce((sum, s) => sum + s.alpa, 0);
  const totalAll = stats.reduce((sum, s) => sum + s.total, 0);
  const avgPercentage = totalAll > 0 ? Math.round((totalHadir / totalAll) * 100) : 0;

  return (
    <div className="min-h-screen bg-krem-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-army-900 mb-2">Rekap Absensi</h1>
          <p className="text-army-600">Statistik kehadiran per bulan</p>
        </div>

        <div className="card mb-6">
          <label className="block text-sm font-medium text-army-700 mb-2">
            Pilih Tahun
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input-field max-w-xs"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {stats.length === 0 ? (
          <div className="card">
            <EmptyState
              title="Belum ada data"
              description={`Belum ada rekap absensi untuk tahun ${selectedYear}`}
              icon="📊"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-hijau-500 to-hijau-600 text-white">
                <div className="text-sm opacity-90 mb-1">Total Hadir</div>
                <div className="text-4xl font-bold">{totalHadir}</div>
              </div>

              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="text-sm opacity-90 mb-1">Total Izin</div>
                <div className="text-4xl font-bold">{totalIzin}</div>
              </div>

              <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <div className="text-sm opacity-90 mb-1">Total Sakit</div>
                <div className="text-4xl font-bold">{totalSakit}</div>
              </div>

              <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                <div className="text-sm opacity-90 mb-1">Total Alpa</div>
                <div className="text-4xl font-bold">{totalAlpa}</div>
              </div>
            </div>

            <div className="card mb-8">
              <h2 className="text-xl font-bold text-army-900 mb-4">
                Persentase Kehadiran Tahun {selectedYear}
              </h2>
              <div className="text-center">
                <div className="text-6xl font-bold text-army-900 mb-2">{avgPercentage}%</div>
                <div className="text-army-600">dari {totalAll} total kajian</div>
              </div>
            </div>

            <div className="card overflow-x-auto">
              <h2 className="text-xl font-bold text-army-900 mb-4">Detail Per Bulan</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-army-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-army-700">Bulan</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-army-700">Hadir</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-army-700">Izin</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-army-700">Sakit</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-army-700">Alpa</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-army-700">Total</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-army-700">%</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.monthNum} className="border-b border-army-100 hover:bg-krem-50">
                      <td className="py-3 px-4 text-sm font-medium text-army-900">{stat.month}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="badge badge-hadir">{stat.hadir}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="badge badge-izin">{stat.izin}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="badge badge-sakit">{stat.sakit}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="badge badge-alpa">{stat.alpa}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-army-900">
                        {stat.total}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className={`font-bold ${stat.percentage >= 80 ? 'text-hijau-600' : stat.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {stat.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
