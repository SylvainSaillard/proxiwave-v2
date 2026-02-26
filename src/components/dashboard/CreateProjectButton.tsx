'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateProjectModal from './CreateProjectModal';
import type { Client, Profile } from '@/types/app';

interface CreateProjectButtonProps {
  profile: Profile;
  clients: Client[];
}

export default function CreateProjectButton({ profile, clients }: CreateProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const canCreate = profile.role === 'superadmin' || profile.role === 'admin_client';
  if (!canCreate) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-10 w-10 rounded-xl bg-pw-500 text-white flex items-center justify-center hover:bg-pw-600 transition-colors shadow-sm"
        title="Nouveau projet"
      >
        <Plus className="h-4 w-4" />
      </button>

      {open && (
        <CreateProjectModal
          profile={profile}
          clients={clients}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
