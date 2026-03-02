// Page liste de tous les projets — accessible via sidebar

import { getProjects, getDashboardStats } from '@/actions/projects';
import ProjectsViewClient from '@/components/dashboard/ProjectsViewClient';

export default async function ProjetsPage() {
  const [projects, stats] = await Promise.all([
    getProjects(),
    getDashboardStats(),
  ]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <ProjectsViewClient projects={projects} stats={stats} />
    </div>
  );
}
