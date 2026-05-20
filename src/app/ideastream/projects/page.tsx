// IdeaStream — Projects Overview.
//
// Route /ideastream/projects. Vue "sante" des developpements en cours,
// roLE secondaire (l'idee reste l'objet central). MVP lecture seule.
//
// Layout :
//   - Header desktop : tabs Active/Archived + "+ New Stream" + search
//     (laisse en placeholder MVP). Mobile : titre + sous-titre count
//     + bouton "New Stream" inline.
//   - Section 1 : InnovationCycleHero + InitiateSprintCard (desktop
//     grid 2/3 + 1/3 ; mobile pile).
//   - Section 2 : grid ProjectCard (3 cols desktop, 1 col mobile).
//   - Section 3 : bento GrowthInsightCard + ContributionStreakWidget
//     full + SprintWidgetMobile (mobile only).

import { Plus } from 'lucide-react';
import { clsx } from 'clsx';
import {
  InnovationCycleHero,
  InitiateSprintCard,
  ProjectCard,
  GrowthInsightCard,
  SprintWidgetMobile,
} from '@/components/ideastream/projects';
import { ContributionStreakWidget } from '@/components/ideastream/gamification/ContributionStreakWidget';
import {
  fixtureProjects,
  fixtureSprints,
  fixtureIdeas,
  fixtureViewer,
} from '@/lib/fixtures/ideastream';

export default function ProjectsOverviewPage() {
  const viewer = fixtureViewer;
  const activeSprint = fixtureSprints.find((s) => s.status === 'active');
  // Idees en cours dans le sprint actif
  const sprintIdeas = fixtureIdeas.filter(
    (i) => i.sprint?.id === activeSprint?.id,
  );
  // Equipe de l'innovation cycle = membres des projets actifs
  const innovationTeam = fixtureProjects
    .flatMap((p) => p.teamMembers)
    .filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i)
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-display-lg-mobile lg:text-display-lg text-on-surface">
            <span className="hidden md:inline">Projects</span>
            <span className="md:hidden">Projects &amp; Sprints</span>
          </h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Managing {fixtureProjects.length} active streams and current
            velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs desktop */}
          <div className="hidden md:flex items-center gap-2 text-label-md font-semibold">
            <span className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              Active
            </span>
            <span className="px-3 py-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-low cursor-pointer">
              Archived
            </span>
          </div>
          <button
            type="button"
            className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full',
              'bg-secondary text-on-secondary text-label-lg font-semibold',
              'shadow-secondary-glow hover:shadow-soft-lg transition-shadow',
            )}
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
            New Stream
          </button>
        </div>
      </header>

      {/* Section 1 : Innovation Cycle hero + Initiate Sprint */}
      {activeSprint ? (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
          <InnovationCycleHero sprint={activeSprint} team={innovationTeam} />
          <InitiateSprintCard />
        </div>
      ) : null}

      {/* Section 2 : Active projects grid */}
      <section className="flex flex-col gap-4">
        <header className="flex items-end justify-between">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">
            Active Projects
          </h2>
          <button
            type="button"
            className="text-label-md text-primary font-semibold hover:underline"
          >
            View All
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixtureProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              href={`/ideastream/projects/${project.id}`}
            />
          ))}
        </div>
      </section>

      {/* Section 3 : Sprint widget mobile (caché desktop) */}
      {activeSprint ? (
        <SprintWidgetMobile sprint={activeSprint} ideas={sprintIdeas} />
      ) : null}

      {/* Section 4 : Bento bas (Growth Insight + Streak) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GrowthInsightCard
          message={`Your team's completion rate is up 12% compared to the same week in Sprint 21. Keep up the momentum.`}
        />
        <ContributionStreakWidget
          days={viewer.currentStreak}
          label="Contribution Streak"
          variant="full"
          className="md:col-span-2"
        />
      </div>
    </div>
  );
}
