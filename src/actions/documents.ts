'use server';
// T059 — Server Actions Documents

import { createClient } from '@/lib/supabase/server';
import type { Document } from '@/types/app';

export async function getDocuments(filters?: {
  project_id?: string;
  category?: string;
  file_type?: string;
  search?: string;
}): Promise<Document[]> {
  const supabase = await createClient();
  let query = supabase.from('documents').select('*').order('created_at', { ascending: false });

  if (filters?.project_id) query = query.eq('project_id', filters.project_id);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.file_type) query = query.eq('file_type', filters.file_type);
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Document[];
}

export async function toggleFavorite(id: string, is_favorite: boolean) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('documents') as any)
    .update({ is_favorite })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
