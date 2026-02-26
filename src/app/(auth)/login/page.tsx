// T027 — Page de connexion

import Image from 'next/image';
import { signIn } from '@/actions/auth';

interface LoginPageProps {
  searchParams: Promise<{ error?: string; redirectedFrom?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-xl overflow-hidden">
              <Image
                src="/logo-proxiwave.png"
                alt="Proxiwave"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Proxiwave</h1>
          <p className="text-sm text-gray-400 mt-1">Connectez-vous à votre espace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-bento border border-warm-100 shadow-sm p-8">
          <form action={signIn} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="vous@exemple.com"
                className="w-full rounded-xl border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-xs font-medium text-red-600">{decodeURIComponent(error)}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-pw-500 text-white text-sm font-bold hover:bg-pw-600 transition-colors shadow-sm"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
