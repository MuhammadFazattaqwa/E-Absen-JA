export type DayName = 'Ahad' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
export type Session = 'morning' | 'evening';

export interface Schedule {
  day: DayName;
  session: Session;
  subject: string;
  teacher: string;
  pj: string;
  time: string;
}

export const SCHEDULES: Schedule[] = [
  { day: 'Senin', session: 'morning', subject: 'Psikologi Agama', teacher: 'ustadzah Niha', pj: 'Alvia', time: '05.00' },
  { day: 'Selasa', session: 'morning', subject: "Fathul Mu'in", teacher: 'aba Yahya', pj: 'Silvia', time: '05.00' },
  { day: 'Rabu', session: 'morning', subject: 'Filsafat Ilmu', teacher: 'ustadz Husni', pj: 'Mela', time: '05.00' },
  { day: 'Kamis', session: 'morning', subject: 'Manajemen SDM', teacher: 'ustadzah Abil & ustadzah Indah', pj: 'Sofia', time: '05.00' },
  { day: 'Jumat', session: 'morning', subject: 'Ilmu Kalam', teacher: 'ustadz Mahbub', pj: 'Salisa', time: '05.00' },
  { day: 'Sabtu', session: 'morning', subject: 'Safinatun Najah', teacher: 'ustadzah Azizah & ustadzah Fitri', pj: 'Ina', time: '05.00' },
  { day: 'Ahad', session: 'evening', subject: "Ihya' Ulumuddin", teacher: 'aba Djoko', pj: 'Yusrin', time: '20.00' },
  { day: 'Senin', session: 'evening', subject: 'Filsafat Pendidikan Islam', teacher: 'ustadzah Ani', pj: 'Hibatin', time: '20.00' },
  { day: 'Selasa', session: 'evening', subject: 'Riyadhus Sholihin', teacher: 'aba Yahya', pj: 'Yusrin', time: '20.00' },
  { day: 'Rabu', session: 'evening', subject: 'Sejarah Peradaban Islam', teacher: 'ustadz Ulil & ustadzah Mida', pj: 'Amina', time: '20.00' },
  { day: 'Kamis', session: 'evening', subject: 'Tafsir Jallalain & Istighotsah', teacher: 'aba Djoko', pj: 'Yusrin', time: '20.00' },
  { day: 'Jumat', session: 'evening', subject: "Qurrotul 'Uyun", teacher: 'ustadz Huda & ustadzah Idhoh', pj: 'Nisrina', time: '20.00' },
];

export function getSchedule(day: DayName, session: Session): Schedule | undefined {
  return SCHEDULES.find(s => s.day === day && s.session === session);
}

export function getTodaySchedules(dayName: DayName): { morning?: Schedule; evening?: Schedule } {
  return {
    morning: SCHEDULES.find(s => s.day === dayName && s.session === 'morning'),
    evening: SCHEDULES.find(s => s.day === dayName && s.session === 'evening'),
  };
}

export const DAY_NAMES: DayName[] = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function getDayNameFromDate(date: Date): DayName {
  const dayIndex = date.getDay();
  return DAY_NAMES[dayIndex];
}
