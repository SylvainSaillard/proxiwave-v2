'use server';
// T043 — Server Actions : détail projet + onglets

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Project, Task, Sprint, Idea, ProjectMessage, Document, IdeaStatus, TaskPriority } from '@/types/app';

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

export async function updateIdeaStatus(
  ideaId: string,
  newStatus: IdeaStatus,
  projectId: string
): Promise<{ success: true; taskCreated?: boolean } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    return { error: 'Seul le superadmin peut changer le statut d\'une idée.' };
  }

  const validTransitions: Record<string, IdeaStatus[]> = {
    nouvelle: ['en_revue'],
    en_revue: ['acceptée', 'refusée'],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: idea, error: fetchError } = await (supabase.from('ideas') as any)
    .select('status, title, project_id, start_date, end_date, priority, duration_weeks')
    .eq('id', ideaId)
    .single();

  if (fetchError || !idea) return { error: 'Idée introuvable.' };

  const allowed = validTransitions[idea.status as string] ?? [];
  if (!allowed.includes(newStatus)) {
    return { error: `Transition "${idea.status}" → "${newStatus}" non autorisée.` };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase.from('ideas') as any)
    .update({ status: newStatus })
    .eq('id', ideaId);

  if (updateError) return { error: updateError.message };

  let taskCreated = false;

  if (newStatus === 'acceptée') {
    const i = idea as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: taskError } = await (supabase.from('tasks') as any).insert({
      project_id: i.project_id,
      title: i.title,
      status: 'validée',
      priority: i.priority ?? 'moyenne',
      progress_pct: 0,
      start_date: i.start_date ?? null,
      end_date: i.end_date ?? null,
      duration_weeks: i.duration_weeks ?? 1,
      tags: [],
    });

    if (!taskError) taskCreated = true;
  }

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true, taskCreated };
}

export async function updateIdeaPrepFields(
  ideaId: string,
  projectId: string,
  fields: { start_date?: string; end_date?: string; priority?: TaskPriority; duration_weeks?: number }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    return { error: 'Seul le superadmin peut préparer une idée.' };
  }

  const update: Record<string, unknown> = {};
  if (fields.start_date !== undefined) update.start_date = fields.start_date || null;
  if (fields.end_date !== undefined) update.end_date = fields.end_date || null;
  if (fields.priority !== undefined) update.priority = fields.priority || null;
  if (fields.duration_weeks !== undefined) update.duration_weeks = fields.duration_weeks || null;

  if (Object.keys(update).length === 0) return { success: true };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('ideas') as any)
    .update(update)
    .eq('id', ideaId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
}

export async function updateTask(
  taskId: string,
  projectId: string,
  fields: {
    title?: string;
    description?: string;
    status?: string;
    priority?: TaskPriority;
    start_date?: string;
    end_date?: string;
    duration_weeks?: number;
    progress_pct?: number;
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    return { error: 'Seul le superadmin peut modifier une tâche.' };
  }

  const update: Record<string, unknown> = {};
  if (fields.title !== undefined) update.title = fields.title;
  if (fields.description !== undefined) update.description = fields.description || null;
  if (fields.status !== undefined) update.status = fields.status;
  if (fields.priority !== undefined) update.priority = fields.priority;
  if (fields.start_date !== undefined) update.start_date = fields.start_date || null;
  if (fields.end_date !== undefined) update.end_date = fields.end_date || null;
  if (fields.duration_weeks !== undefined) update.duration_weeks = fields.duration_weeks;
  if (fields.progress_pct !== undefined) update.progress_pct = fields.progress_pct;

  if (Object.keys(update).length === 0) return { success: true };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('tasks') as any)
    .update(update)
    .eq('id', taskId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/project/${projectId}`);
  return { success: true };
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
