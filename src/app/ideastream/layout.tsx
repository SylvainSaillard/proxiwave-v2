// Layout shell pour les écrans IdeaStream — `/ideastream/*`.
//
// Structure responsive :
//   ┌──────────┬─────────────────────────┐
//   │ Sidebar  │ TopAppBar (sticky)       │  ≥ md
//   │ (desktop)├─────────────────────────┤
//   │          │ <main> children          │
//   └──────────┴─────────────────────────┘
//   ┌────────────────────────────────────┐
//   │ MobileHeader (sticky)              │  < md
//   ├────────────────────────────────────┤
//   │ <main> children                    │
//   │ pb-20 pour laisser place à la tab  │
//   ├────────────────────────────────────┤
//   │ BottomTabBar (fixed)               │
//   └────────────────────────────────────┘
//
// Server Component (les nav sont Client Components encapsulés).

import { Sidebar } from '@/components/ideastream/navigation/Sidebar';
import { BottomTabBar } from '@/components/ideastream/navigation/BottomTabBar';
import { TopAppBar } from '@/components/ideastream/navigation/TopAppBar';
import { MobileHeader } from '@/components/ideastream/navigation/MobileHeader';
import { fixtureViewer } from '@/lib/fixtures/ideastream';

export default function IdeaStreamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // En MVP lecture seule, on lit le profil viewer depuis les fixtures.
  // Plus tard : await getCurrentProfile() depuis Supabase.
  const viewer = fixtureViewer;
  const pointsLabel = `${viewer.xpPoints.toLocaleString('en-US')} Global Points`;
  const xpLabelMobile = `${viewer.xpPoints.toLocaleString('en-US')} Points`;

  return (
    <div className="min-h-screen bg-background text-on-background flex">
      {/* Sidebar desktop — sticky, hidden < md */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* TopAppBar desktop — sticky, hidden < md */}
        <TopAppBar
          pointsLabel={pointsLabel}
          userInitials={viewer.initials}
        />

        {/* MobileHeader — sticky, hidden ≥ md */}
        <MobileHeader
          userInitials={viewer.initials}
          xpLabel={xpLabelMobile}
        />

        {/* Main content — pb-20 sur mobile pour laisser place à la BottomTabBar */}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>

      {/* BottomTabBar mobile — fixed bottom, hidden ≥ md */}
      <BottomTabBar />
    </div>
  );
}
