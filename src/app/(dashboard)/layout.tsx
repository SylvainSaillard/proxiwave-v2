// T032 — Layout du groupe (dashboard) — Server Component
// Charge le profil une seule fois, partagé par toutes les pages du groupe

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import type { Profile } from '@/types/app';

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-cream flex p-3 sm:p-4 gap-4">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white rounded-bento overflow-hidden border border-warm-100">
        <TopBar profile={profile as Profile | null} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
