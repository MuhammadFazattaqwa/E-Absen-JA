import { Attendance } from '@/lib/types/database';
import { formatDate } from './date';

export function exportToCSV(attendances: Attendance[], filename: string = 'riwayat-absensi.csv') {
  const headers = ['Tanggal', 'Sesi', 'Hari', 'Kajian', 'Pengajar', 'PJ', 'Status', 'Catatan', 'URL Foto'];
  
  const rows = attendances.map(a => [
    formatDate(a.date, 'dd/MM/yyyy'),
    a.session === 'morning' ? 'Pagi' : 'Malam',
    a.day_name,
    a.subject,
    a.teacher,
    a.pj,
    a.status,
    a.note || '',
    a.photo_url || '',
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
