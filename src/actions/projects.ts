'use server';
// T036 — Server Actions Projets : liste + stats dashboard

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Project, DashboardStats, DashboardMessage, Client, CreateProjectInput, CreateClientInput } from '@/types/app';

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('status') as any;

  if (error) throw new Error(error.message);

  const projects = (data ?? []) as { status: string }[];
  return {
    total: projects.length,
    en_cours: projects.filter((p) => p.status === 'en_cours').length,
    termine: projects.filter((p) => p.status === 'terminé').length,
    a_venir: projects.filter((p) => p.status === 'à_venir').length,
  };
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Client[];
}

export async function createProject(
  input: CreateProjectInput
): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, client_id')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'superadmin' && profile.role !== 'admin_client')) {
    return { error: 'Accès non autorisé' };
  }

  // Pour admin_client : forcer son propre client_id
  const clientId = profile.role === 'admin_client' ? profile.client_id : input.client_id;
  if (!clientId) return { error: 'Client requis' };

  const { data, error } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      name: input.name,
      category: input.category,
      status: input.status,
      start_date: input.start_date ?? null,
      end_date: input.end_date ?? null,
      budget_total: input.budget_total ?? null,
    } as any)
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { id: (data as any).id };
}

export async function createNewClient(
  input: CreateClientInput
): Promise<{ id: string; name: string } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    return { error: 'Accès non autorisé' };
  }

  if (!input.name.trim()) return { error: 'Le nom du client est requis.' };

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: input.name.trim(),
      logo_url: input.logo_url?.trim() || null,
    } as any)
    .select('id, name')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { id: (data as any).id, name: (data as any).name };
}

export async function getFirstActiveProject(): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'en_cours')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    const { data: fallback } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return (fallback as Project) ?? null;
  }
  return data as Project;
}

export async function getDashboardMessages(): Promise<DashboardMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_messages')
    .select(`
      id,
      project_id,
      content,
      created_at,
      projects ( name ),
      profiles ( full_name )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);

  return ((data ?? []) as any[]).map((m) => ({
    id: m.id,
    project_id: m.project_id,
    project_name: m.projects?.name ?? '',
    content: m.content,
    author_name: m.profiles?.full_name ?? '',
    created_at: m.created_at,
  }));
}
