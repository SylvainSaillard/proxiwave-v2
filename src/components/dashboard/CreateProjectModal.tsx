'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { createProject } from '@/actions/projects';
import type { Client, Profile, ProjectStatus } from '@/types/app';

interface CreateProjectModalProps {
  profile: Profile;
  clients: Client[];
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Intelligence Artificielle',
  'Design & Développement',
  'Marketing Digital',
  'E-commerce',
  'Infrastructure',
  'Conseil & Stratégie',
  'Autre',
];

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'en_cours', label: 'En cours' },
  { value: 'à_venir', label: 'À venir' },
  { value: 'terminé', label: 'Terminé' },
];

export default function CreateProjectModal({
  profile,
  clients,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    status: 'en_cours' as ProjectStatus,
    client_id: profile.role === 'admin_client' ? (profile.client_id ?? '') : '',
    start_date: '',
    end_date: '',
    budget_total: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError('Le nom est requis.');
    if (profile.role === 'superadmin' && !form.client_id)
      return setError('Veuillez sélectionner un client.');

    startTransition(async () => {
      const result = await createProject({
        name: form.name.trim(),
        category: form.category,
        status: form.status,
        client_id: form.client_id,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        budget_total: form.budget_total ? Number(form.budget_total) : undefined,
      });

      if ('error' in result) {
        setError(result.error);
      } else {
        onSuccess();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Nouveau projet</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-warm-100 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du projet <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex : Refonte site web"
              className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
            />
          </div>

          {/* Client — superadmin uniquement */}
          {profile.role === 'superadmin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client <span className="text-red-400">*</span>
              </label>
              <select
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
              >
                <option value="">Sélectionner un client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date début
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date fin
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget total (€)
            </label>
            <input
              type="number"
              name="budget_total"
              value={form.budget_total}
              onChange={handleChange}
              placeholder="Ex : 15000"
              min={0}
              className="w-full rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Actions */}
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
              {isPending ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
