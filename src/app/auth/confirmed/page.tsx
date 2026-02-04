import Link from 'next/link';
import Image from 'next/image';

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-army-100 to-hijau-100 px-4">
      <div className="card max-w-lg w-full text-center">
        <div className="mx-auto mb-4 h-24 w-24 relative">
          <Image
            src="/logo-jagad.png"
            alt="Logo Jagad Alimussirry"
            fill
            className="object-contain"
            sizes="96px"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-army-900 mb-2">
          Registrasi Berhasil
        </h1>
        <p className="text-army-700 mb-6">
          Akun kamu sudah terverifikasi. Silakan login menggunakan email dan
          password yang sudah didaftarkan.
        </p>
        <Link href="/login" className="btn-primary inline-flex justify-center w-full">
          Login Sekarang
        </Link>
      </div>
    </div>
  );
}
