'use client';
// T030 — Sidebar dashboard — identique au prototype

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderKanban, FileText, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/dashboard' },
  { icon: FolderKanban, label: 'Projets', path: '/projets' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col items-center gap-2 bg-gray-900 py-6 px-3 rounded-bento w-[72px] shrink-0">
      {/* Logo */}
      <div className="mb-6">
        <div className="h-9 w-9 rounded-xl bg-pw-500 flex items-center justify-center">
          <span className="text-white font-extrabold text-sm">P</span>
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                'h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200',
                isActive
                  ? 'bg-pw-500 text-white shadow-lg shadow-pw-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>

      {/* Bottom settings */}
      <div className="mt-auto">
        <button
          className="h-11 w-11 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
          title="Paramètres"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
