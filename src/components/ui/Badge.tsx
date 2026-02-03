import { AttendanceStatus } from '@/lib/types/database';

interface BadgeProps {
  status: AttendanceStatus;
}

export default function Badge({ status }: BadgeProps) {
  const variants = {
    Hadir: 'badge-hadir',
    Izin: 'badge-izin',
    Sakit: 'badge-sakit',
    Alpa: 'badge-alpa',
  };

  return <span className={`badge ${variants[status]}`}>{status}</span>;
}
