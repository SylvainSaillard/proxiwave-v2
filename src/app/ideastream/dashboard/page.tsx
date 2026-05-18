// IdeaStream — Dashboard ("Spark a Change").
//
// Premier écran de la refonte v4. MVP lecture seule : toutes les
// données viennent de src/lib/fixtures/ideastream.ts.
//
// Layout responsif :
//   - Mobile : pile verticale (hero, journey, stats grid, trending,
//     achievements, pulse).
//   - Desktop : hero pleine largeur, puis grid 2 cols (journey | stats),
//     trending pleine largeur, grid 2 cols (achievements | pulse).
//
// Server Component pur.

import { Trophy, Flame, Sparkles } from 'lucide-react';
import {
  SparkAChangeHero,
  StatBlock,
  TrendingIdeasSection,
  CommunityPulseFeed,
} from '@/components/ideastream/dashboard';
import {
  InnovationJourneyCard,
  AchievementsList,
} from '@/components/ideastream/gamification';
import {
  fixtureViewer,
  fixtureTrendingIdeas,
  fixtureActivityLog,
  fixtureAchievements,
} from '@/lib/fixtures/ideastream';

export default function IdeaStreamDashboardPage() {
  const viewer = fixtureViewer;
  const trending = fixtureTrendingIdeas;
  // Filtrer les achievements unlocked pour la card "Recent Achievements".
  const recentAchievements = fixtureAchievements
    .filter((a) => Boolean(a.unlockedAt))
    .sort((a, b) =>
      (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''),
    );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
      {/* 1. Hero "Spark a Change" */}
      <SparkAChangeHero />

      {/* 2. Innovation Journey + stats — pile mobile, 2 cols desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:gap-6">
        <InnovationJourneyCard profile={viewer} />

        {/* Stats compactes desktop (3 cols), mobile (3 cols also) */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          <StatBlock
            value={`${viewer.currentStreak} Days`}
            label="Streak"
            icon={Flame}
            iconColor="secondary"
          />
          <StatBlock
            value={viewer.badgesCount}
            label="Total Badges"
            icon={Trophy}
            iconColor="primary"
          />
          <StatBlock
            value={viewer.ideasContributed}
            label="Earned"
            icon={Sparkles}
            iconColor="tertiary"
          />
        </div>
      </div>

      {/* 2b. Stat "24 Ideas Contributed" — mobile only, mise en avant */}
      <div className="lg:hidden">
        <StatBlock
          value={viewer.ideasContributed}
          label="Ideas Contributed"
          subtext={`${viewer.ideasApprovedLastMonth} ideas approved last month`}
        />
      </div>

      {/* 3. Trending Ideas */}
      <TrendingIdeasSection ideas={trending} />

      {/* 4. Achievements + Community Pulse — pile mobile, 2 cols desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <AchievementsList achievements={recentAchievements} />
        <CommunityPulseFeed entries={fixtureActivityLog.slice(0, 6)} />
      </div>
    </div>
  );
}
