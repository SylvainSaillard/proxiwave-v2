// Not-found IdeaStream — affichee quand l'utilisateur tape une route
// /ideastream/* qui n'existe pas encore (ex: /ideastream/team,
// /ideastream/achievements, /ideastream/projects/[id], etc.).
//
// MVP : les routes Team, Achievements, Settings, Support, Profile et
// project detail seront livrees dans les phases suivantes. En attendant,
// on affiche un placeholder coherent avec le design system v4 plutot
// qu'un 404 brut.
//
// Next.js applique automatiquement le layout /ideastream parent
// (sidebar, top app bar, bottom tab bar) autour de ce composant.

import Link from 'next/link';
import { Hammer, ArrowLeft } from 'lucide-react';

export default function IdeaStreamNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col items-center text-center gap-6">
      <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
        <Hammer className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.8} aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-on-surface">
          Coming soon
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant max-w-xl">
          This corner of IdeaStream is still in active construction. The
          dashboard, idea wall, idea detail and projects overview are the
          screens shipped in the v4 MVP — everything else lights up in the
          next iteration.
        </p>
      </div>

      <Link
        href="/ideastream/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm md:text-base font-semibold shadow-primary-glow hover:shadow-primary-glow-lg transition-shadow"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to the dashboard
      </Link>
    </div>
  );
}
