'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { createNewClient } from '@/actions/projects';

interface CreateClientModalProps {
  onClose: () => void;
  onSuccess: (client: { id: string; name: string }) => void;
}

export default function CreateClientModal({
  onClose,
  onSuccess,
}: CreateClientModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    logo_url: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError('Le nom du client est requis.');

    startTransition(async () => {
      const result = await createNewClient({
        name: form.name.trim(),
        logo_url: form.logo_url.trim() || undefined,
      });

      if ('error' in result) {
        setError(result.error);
      } else {
        onSuccess({ id: result.id, name: result.name });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Nouveau client</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-warm-100 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du client <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex : Acme Corp"
              autoFocus
              className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL du logo
            </label>
            <input
              name="logo_url"
              value={form.logo_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-warm-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-warm-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-pw-500 py-2.5 text-sm font-semibold text-white hover:bg-pw-600 transition-all disabled:opacity-60"
            >
              {isPending ? 'Création...' : 'Créer le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
