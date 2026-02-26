// T043 — Page de détail projet — identique prototype

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProject,
  getProjectTasks,
  getProjectSprints,
  getProjectIdeas,
  getProjectMessages,
  getProjectDocuments,
} from '@/actions/project-detail';
import ProjectDetailClient from '@/components/dashboard/ProjectDetailClient';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  const [project, tasks, sprints, ideas, messages, documents] = await Promise.all([
    getProject(id),
    getProjectTasks(id),
    getProjectSprints(id),
    getProjectIdeas(id),
    getProjectMessages(id),
    getProjectDocuments(id),
  ]);

  if (!project) notFound();

  return (
    <ProjectDetailClient
      project={project}
      tasks={tasks}
      sprints={sprints}
      ideas={ideas}
      messages={messages}
      documents={documents}
    />
  );
}
