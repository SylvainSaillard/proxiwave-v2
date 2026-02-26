// T068 — Footer landing

export default function Footer() {
  return (
    <footer className="py-10 px-5 sm:px-8 border-t border-warm-100">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pw-500 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">P</span>
          </div>
          <span className="text-sm font-semibold text-pw-700">Proxiwave</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <span>© 2026 Proxiwave. Tous droits réservés.</span>
          <a href="/mentions-legales" className="hover:text-gray-600 transition-colors">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
}
