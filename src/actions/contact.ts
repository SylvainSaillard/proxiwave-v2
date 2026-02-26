'use server';
// T069 — Server Action contact form

import { createClient } from '@/lib/supabase/server';

export async function submitContact(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('contacts') as any).insert({ name, email, message });

  if (error) throw new Error(error.message);
}
