// T031 — TopBar dashboard — Server Component avec profil utilisateur

import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { getClients } from '@/actions/projects';
import { signOut } from '@/actions/auth';
import CreateProjectButton from './CreateProjectButton';
import type { Profile } from '@/types/app';

interface TopBarProps {
  profile: Profile | null;
}

export default async function TopBar({ profile }: TopBarProps) {
  const clients = profile?.role === 'superadmin' ? await getClients() : [];

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4">
      {/* Left — Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 tracking-tight hover:text-pw-600 transition-colors"
        >
          Proxiwave
        </Link>
      </div>

      {/* Center — Search */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="w-full rounded-xl border border-warm-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        {profile && (
          <CreateProjectButton profile={profile} clients={clients} />
        )}

        <button className="relative h-10 w-10 rounded-xl bg-white border border-warm-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-warm-300 transition-all">
          <Bell className="h-4 w-4" />
        </button>

        {/* User avatar */}
        {profile && (
          <form action={signOut} className="flex items-center gap-3 ml-2">
            <button
              type="submit"
              title="Se déconnecter"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: profile.avatar_color }}
              >
                {profile.initials}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{profile.full_name}</p>
                <p className="text-xs text-gray-400">{profile.role}</p>
              </div>
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
