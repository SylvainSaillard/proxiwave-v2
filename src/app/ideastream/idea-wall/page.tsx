// IdeaStream — Idea Wall.
//
// Route /ideastream/idea-wall. Explorateur de toutes les idees +
// filtrage par categorie + recherche libre.
//
// Server Component qui passe les fixtures au client orchestrateur.
// MVP lecture seule : pas de pagination ni d'écriture.

import { IdeaWallClient } from '@/components/ideastream/idea-wall/IdeaWallClient';
import { ContributionStreakWidget } from '@/components/ideastream/gamification/ContributionStreakWidget';
import {
  fixtureIdeas,
  fixtureCategories,
  fixtureViewer,
} from '@/lib/fixtures/ideastream';

export default function IdeaWallPage() {
  const viewer = fixtureViewer;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Header desktop : titre + sous-titre + compteur points */}
      <header className="hidden md:flex items-end justify-between gap-6 mb-6">
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-display-lg-mobile lg:text-display-lg text-on-surface">
            Idea Wall
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-2">
            Browse, upvote, and collaborate on the next big thing. High-impact
            features prioritized by the community.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
            Total Points
          </span>
          <span className="font-display font-bold text-headline-lg text-primary tabular-nums">
            {viewer.xpPoints.toLocaleString('en-US')}
          </span>
        </div>
      </header>

      {/* Header mobile compact */}
      <header className="md:hidden mb-4">
        <h1 className="font-display font-bold text-headline-lg text-on-surface">
          Idea Wall
        </h1>
      </header>

      {/* Search + filters + grid (Client) */}
      <div className="flex flex-col gap-4 md:gap-5">
        <IdeaWallClient ideas={fixtureIdeas} categories={fixtureCategories} />
      </div>

      {/* Streak widget floating desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-20">
        <ContributionStreakWidget
          days={viewer.currentStreak}
          variant="compact"
        />
      </div>
    </div>
  );
}
