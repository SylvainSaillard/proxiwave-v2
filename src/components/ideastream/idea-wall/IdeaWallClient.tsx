// IdeaWallClient — orchestrateur Client de l'ecran Idea Wall.
//
// Reçoit la liste des idees et des categories depuis le Server
// Component parent (page.tsx), gere l'etat local du filtre catégorie
// + search, applique le filtrage, rend la grid.

'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { IdeaCard } from '@/components/ideastream/ideas/IdeaCard';
import { SearchInput } from '@/components/ideastream/ui/SearchInput';
import { FAB } from '@/components/ideastream/ui/FAB';
import { CategoryFilterBar } from './CategoryFilterBar';
import type { Idea, IdeaCategory } from '@/types/ideastream';

export interface IdeaWallClientProps {
  ideas: Idea[];
  categories: IdeaCategory[];
}

export function IdeaWallClient({ ideas, categories }: IdeaWallClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIdeas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (activeCategoryId && idea.category.id !== activeCategoryId) return false;
      if (q) {
        const haystack = `${idea.title} ${idea.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [ideas, activeCategoryId, searchQuery]);

  return (
    <>
      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Search features, bugs, or brainstorms…"
      />

      {/* Filtres categories */}
      <CategoryFilterBar
        categories={categories}
        activeId={activeCategoryId}
        onChange={setActiveCategoryId}
      />

      {/* Compteur */}
      <p className="text-label-md text-on-surface-variant">
        Showing {filteredIdeas.length} of {ideas.length} ideas
      </p>

      {/* Grid des cards */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              variant="standard"
              showMenu
              href={`/ideastream/idea/${idea.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <p className="text-body-md text-on-surface-variant">
            No ideas match your filters yet.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategoryId(null);
              setSearchQuery('');
            }}
            className="text-label-md text-primary font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* "Load More" — visuel uniquement en MVP */}
      {filteredIdeas.length >= 9 ? (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-label-lg font-semibold transition-colors"
          >
            Load More
          </button>
        </div>
      ) : null}

      {/* FAB mobile : Nouvelle idee */}
      <FAB icon={Plus} ariaLabel="New idea" />
    </>
  );
}
