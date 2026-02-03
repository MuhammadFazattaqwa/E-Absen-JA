export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
export type Session = 'morning' | 'evening';
export type DayName = 'Ahad' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  session: Session;
  day_name: DayName;
  subject: string;
  teacher: string;
  pj: string;
  status: AttendanceStatus;
  note?: string;
  photo_path?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceInsert {
  user_id: string;
  date: string;
  session: Session;
  day_name: DayName;
  subject: string;
  teacher: string;
  pj: string;
  status: AttendanceStatus;
  note?: string;
  photo_path?: string;
  photo_url?: string;
}

export interface MonthlyStats {
  month: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  total: number;
  percentage: number;
}
