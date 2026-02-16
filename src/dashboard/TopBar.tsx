import { Search, Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { currentUser } from './mockData';

export default function TopBar() {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4">
      {/* Left — Title */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
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
            placeholder={t('dashboard.search_placeholder')}
            className="w-full rounded-xl border border-warm-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        <button className="h-10 w-10 rounded-xl bg-pw-500 text-white flex items-center justify-center hover:bg-pw-600 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
        </button>

        <button className="relative h-10 w-10 rounded-xl bg-white border border-warm-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-warm-300 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 ml-2">
          <div className="h-10 w-10 rounded-xl bg-pw-500 flex items-center justify-center text-white text-sm font-bold">
            {currentUser.initials}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{currentUser.name}</p>
            <p className="text-xs text-gray-400">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
