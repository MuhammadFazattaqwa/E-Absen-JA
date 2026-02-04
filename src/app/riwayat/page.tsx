'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/ui/Navbar';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import { Attendance, AttendanceStatus, Session } from '@/lib/types/database';
import { formatDate, getCurrentMonth } from '@/lib/utils/date';
import { exportToCSV } from '@/lib/utils/export';

export default function RiwayatPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);

  const { year, month } = getCurrentMonth();
  const [filterMonth, setFilterMonth] = useState(`${year}-${String(month).padStart(2, '0')}`);
  const [filterSession, setFilterSession] = useState<Session | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | 'all'>('all');

  const fetchAttendances = useCallback(async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!error && data) {
      setAttendances(data);
      setFilteredAttendances(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        fetchAttendances(user.id);
      }
    };
    checkUser();
  }, [fetchAttendances, router, supabase]);

  useEffect(() => {
    let filtered = [...attendances];

    if (filterMonth) {
      filtered = filtered.filter(a => a.date.startsWith(filterMonth));
    }

    if (filterSession !== 'all') {
      filtered = filtered.filter(a => a.session === filterSession);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    setFilteredAttendances(filtered);
  }, [filterMonth, filterSession, filterStatus, attendances]);

  const handleExport = () => {
    exportToCSV(filteredAttendances, `riwayat-absensi-${filterMonth}.csv`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-krem-50">
        <Navbar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-krem-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-army-900 mb-2">Riwayat Absensi</h1>
          <p className="text-army-600">Lihat dan kelola riwayat kehadiran Anda</p>
        </div>

        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                Bulan
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                Sesi
              </label>
              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value as Session | 'all')}
                className="input-field"
              >
                <option value="all">Semua</option>
                <option value="morning">Pagi</option>
                <option value="evening">Malam</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-army-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AttendanceStatus | 'all')}
                className="input-field"
              >
                <option value="all">Semua</option>
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpa">Alpa</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExport}
                disabled={filteredAttendances.length === 0}
                className="btn-secondary w-full"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {filteredAttendances.length === 0 ? (
          <div className="card">
            <EmptyState
              title="Belum ada data"
              description="Belum ada riwayat absensi untuk filter yang dipilih"
              icon="📋"
            />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-army-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-army-700">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-army-700">Sesi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-army-700">Kajian</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-army-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-army-700">Foto</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendances.map((attendance) => (
                  <tr key={attendance.id} className="border-b border-army-100 hover:bg-krem-50">
                    <td className="py-3 px-4 text-sm">
                      <div className="font-medium text-army-900">
                        {formatDate(attendance.date, 'dd MMM yyyy')}
                      </div>
                      <div className="text-xs text-army-600">{attendance.day_name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`badge ${attendance.session === 'morning' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'}`}>
                        {attendance.session === 'morning' ? 'Pagi' : 'Malam'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="font-medium text-army-900">{attendance.subject}</div>
                      <div className="text-xs text-army-600">{attendance.teacher}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge status={attendance.status} />
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {attendance.photo_url ? (
                        <a
                          href={attendance.photo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-army-100 px-3 py-1 text-xs font-semibold text-army-800 transition-colors hover:bg-army-200"
                        >
                          Lihat Foto
                        </a>
                      ) : (
                        <span className="text-army-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
