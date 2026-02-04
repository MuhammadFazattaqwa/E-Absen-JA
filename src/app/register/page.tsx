'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirmed`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      if (!data.session) {
        toast.success('Registrasi berhasil. Cek email untuk verifikasi sebelum login.');
        setLoading(false);
        return;
      }

      toast.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-army-100 to-hijau-100 px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-20 w-20 relative">
            <Image
              src="/logo-jagad.png"
              alt="Logo Jagad Alimussirry"
              fill
              className="object-contain"
              sizes="80px"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-army-900 mb-2">
            Daftar Akun
          </h1>
          <p className="text-army-600">Jagad Alimussirry</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-army-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-army-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-army-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-army-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-army-700 font-medium hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
