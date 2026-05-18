// StatusBadge — spécialisation de Chip pour le statut d'une idée.
//
// Le statut détermine à la fois la couleur du chip ET la couleur de la
// border-left de l'IdeaCard. Mapping :
//   - sandbox  → neutral  (brouillon, pas encore en revue)
//   - approved → tertiary (validée, prête pour le sprint)
//   - in_dev   → primary  (en cours de développement)
//   - shipped  → tertiary (livrée — succès)
//   - rejected → error

import { Chip } from '../ui/Chip';
import type { IdeaSemanticColor, IdeaStatus } from '@/types/ideastream';

/** Map statut → couleur sémantique. Exposé pour aligner IdeaCard. */
export const statusColorMap: Record<IdeaStatus, IdeaSemanticColor> = {
  sandbox: 'neutral',
  approved: 'tertiary',
  in_dev: 'primary',
  shipped: 'tertiary',
  rejected: 'error',
};

/** Map statut → libellé court affiché. */
export const statusLabelMap: Record<IdeaStatus, string> = {
  sandbox: 'Sandbox',
  approved: 'Approved',
  in_dev: 'In Dev',
  shipped: 'Shipped',
  rejected: 'Rejected',
};

export interface StatusBadgeProps {
  status: IdeaStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({
  status,
  size = 'sm',
  className,
}: StatusBadgeProps) {
  return (
    <Chip
      label={statusLabelMap[status]}
      color={statusColorMap[status]}
      size={size}
      className={className}
    />
  );
}
