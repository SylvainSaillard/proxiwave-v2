// T033 / T036 — Page dashboard principale

import { getProjects, getDashboardStats, getDashboardMessages } from '@/actions/projects';
import ProjectCard from '@/components/dashboard/ProjectCard';
import MessagesPanel from '@/components/dashboard/MessagesPanel';
import ProjectsViewClient from '@/components/dashboard/ProjectsViewClient';

export default async function DashboardPage() {
  const [projects, stats, messages] = await Promise.all([
    getProjects(),
    getDashboardStats(),
    getDashboardMessages(),
  ]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <ProjectsViewClient projects={projects} stats={stats} />
      <MessagesPanel messages={messages} />
    </div>
  );
}
