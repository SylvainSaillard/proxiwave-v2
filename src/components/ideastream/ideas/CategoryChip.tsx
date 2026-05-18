// CategoryChip — spécialisation de Chip pour la catégorie d'une idée.
//
// La couleur vient de la catégorie elle-même (cf. fixtures).

import { Chip } from '../ui/Chip';
import type { IdeaCategory } from '@/types/ideastream';

export interface CategoryChipProps {
  category: IdeaCategory;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryChip({
  category,
  size = 'sm',
  className,
}: CategoryChipProps) {
  return (
    <Chip
      label={category.label}
      color={category.color}
      size={size}
      className={className}
    />
  );
}
