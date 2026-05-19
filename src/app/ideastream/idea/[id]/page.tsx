// IdeaStream — Idea Detail.
//
// Route /ideastream/idea/[id]. Server Component qui resout l'idee
// par id depuis les fixtures, derive le stepper, et assemble les
// panneaux principaux (main gauche / sidebar droite desktop, pile
// mobile).

import { notFound } from 'next/navigation';
import {
  fixtureIdeas,
  fixtureArtifactsByIdea,
  fixtureCommentsByIdea,
  fixtureActivityLog,
  fixtureViewer,
} from '@/lib/fixtures/ideastream';
import {
  LifecycleStepper,
  deriveLifecycleStages,
  IdeaHero,
  DesignArtifactsList,
  ExecutionContextPanel,
  TeamDiscussion,
  ActivityHistoryTimeline,
} from '@/components/ideastream/idea-detail';

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function IdeaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const idea = fixtureIdeas.find((i) => i.id === id);
  if (!idea) notFound();

  const stages = deriveLifecycleStages(idea.status);
  const artifacts = fixtureArtifactsByIdea[idea.id] ?? [];
  const comments = fixtureCommentsByIdea[idea.id] ?? [];
  // Sous-ensemble d'activity log : ici on garde 4 entrees, et plus
  // tard on filtrera par ideaId dans la DB.
  const recentActivity = fixtureActivityLog.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
      {/* Stepper en tête (full width) */}
      <section className="bg-surface-container-lowest rounded-lg p-5 md:p-6 border border-outline-variant/40 shadow-soft">
        <h2 className="text-label-sm text-secondary font-semibold uppercase tracking-wider mb-4">
          Current Stage
        </h2>
        <LifecycleStepper stages={stages} />
      </section>

      {/* Body responsif : main + sidebar desktop, pile mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* MAIN colonne */}
        <div className="flex flex-col gap-6 min-w-0">
          <IdeaHero idea={idea} />
          <DesignArtifactsList artifacts={artifacts} />
          <TeamDiscussion viewer={fixtureViewer} comments={comments} />
        </div>

        {/* SIDEBAR droite */}
        <aside className="flex flex-col gap-6">
          <ExecutionContextPanel idea={idea} />
          <ActivityHistoryTimeline
            entries={recentActivity}
            viewAllHref={`/ideastream/idea/${idea.id}/activity`}
          />
        </aside>
      </div>
    </div>
  );
}
