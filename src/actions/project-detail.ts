'use server';
// T043 — Server Actions : détail projet + onglets

import { createClient } from '@/lib/supabase/server';
import type { Project, Task, Sprint, Idea, ProjectMessage, Document } from '@/types/app';

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Project;
}

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      subtasks ( id, task_id, title, is_done, position )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return (data ?? []) as Task[];
}

export async function getProjectSprints(projectId: string): Promise<Sprint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sprints')
    .select(`
      *,
      sprint_items ( id, sprint_id, title, status, position )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return (data ?? []) as Sprint[];
}

export async function getProjectIdeas(projectId: string): Promise<Idea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ideas')
    .select(`
      *,
      profiles ( full_name, initials, avatar_color )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return ((data ?? []) as any[]).map((i) => ({
    ...i,
    author: i.profiles,
    profiles: undefined,
  })) as Idea[];
}

export async function getProjectMessages(projectId: string): Promise<ProjectMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_messages')
    .select(`
      *,
      profiles ( full_name, initials, avatar_color, role )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return ((data ?? []) as any[]).map((m) => ({
    ...m,
    author: m.profiles,
    profiles: undefined,
  })) as ProjectMessage[];
}

export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      profiles ( full_name, initials, avatar_color )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as Document[];
}

export async function submitIdea(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const project_id = formData.get('project_id') as string;
  const title = formData.get('title') as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('ideas') as any).insert({
    project_id,
    author_id: user.id,
    title,
    status: 'nouvelle',
  });

  if (error) throw new Error(error.message);
}

export async function sendProjectMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const project_id = formData.get('project_id') as string;
  const content = formData.get('content') as string;
  const message_type = formData.get('message_type') as string || 'client';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('project_messages') as any).insert({
    project_id,
    author_id: user.id,
    content,
    message_type,
  });

  if (error) throw new Error(error.message);
}
