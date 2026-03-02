// T033 / T036 — Page dashboard principale — single-project focus

import { createClient } from '@/lib/supabase/server';
import { getProjects, getFirstActiveProject } from '@/actions/projects';
import {
  getProject,
  getProjectTasks,
  getProjectSprints,
  getProjectIdeas,
  getProjectMessages,
  getProjectDocuments,
} from '@/actions/project-detail';
import ProjectDashboard from '@/components/dashboard/ProjectDashboard';
import type { UserRole } from '@/types/app';

interface DashboardPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { project: projectId } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole: UserRole = 'chef_de_projet';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) userRole = profile.role as UserRole;
  }

  const projects = await getProjects();

  let currentProject = projectId ? await getProject(projectId) : null;
  if (!currentProject) {
    currentProject = await getFirstActiveProject();
  }

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-500">Aucun projet disponible</p>
          <p className="text-xs text-gray-400 mt-1">Créez un projet pour commencer</p>
        </div>
      </div>
    );
  }

  const [tasks, sprints, ideas, messages, documents] = await Promise.all([
    getProjectTasks(currentProject.id),
    getProjectSprints(currentProject.id),
    getProjectIdeas(currentProject.id),
    getProjectMessages(currentProject.id),
    getProjectDocuments(currentProject.id),
  ]);

  return (
    <ProjectDashboard
      projects={projects}
      project={currentProject}
      tasks={tasks}
      sprints={sprints}
      ideas={ideas}
      messages={messages}
      documents={documents}
      userRole={userRole}
    />
  );
}
