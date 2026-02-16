import { Home, FolderKanban, MessageSquare, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Accueil', active: true },
  { icon: FolderKanban, label: 'Projets', active: false },
  { icon: MessageSquare, label: 'Messages', active: false },
  { icon: Settings, label: 'Paramètres', active: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col items-center gap-2 bg-gray-900 py-6 px-3 rounded-bento w-[72px] shrink-0">
      {/* Logo */}
      <div className="mb-6">
        <img src="/logo-proxiwave.png" alt="Proxiwave" className="h-9 w-9" />
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              'h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200',
              item.active
                ? 'bg-pw-500 text-white shadow-lg shadow-pw-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            )}
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
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
