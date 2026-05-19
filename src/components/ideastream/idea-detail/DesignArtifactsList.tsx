// DesignArtifactsList — fichiers attaches a une idee.
//
// Section "Design Artifacts" + bouton "Add File" (desactive MVP) +
// liste de ArtifactItem. Chaque item : icone type fichier, nom,
// taille, link.

import { Figma, FileText, FileImage, FileSpreadsheet, Link as LinkIcon, Plus, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { IdeaArtifact } from '@/types/ideastream';

const fileTypeIcons: Record<IdeaArtifact['fileType'], LucideIcon> = {
  figma: Figma,
  image: FileImage,
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  link: LinkIcon,
};

const fileTypeColor: Record<IdeaArtifact['fileType'], string> = {
  figma: 'text-secondary bg-secondary-fixed',
  image: 'text-primary bg-primary-fixed',
  pdf: 'text-error bg-error-container',
  doc: 'text-primary bg-primary-fixed',
  sheet: 'text-tertiary bg-tertiary-fixed',
  link: 'text-on-surface-variant bg-surface-container',
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface DesignArtifactsListProps {
  artifacts: IdeaArtifact[];
  className?: string;
}

export function DesignArtifactsList({
  artifacts,
  className,
}: DesignArtifactsListProps) {
  return (
    <section
      className={clsx(
        'bg-surface-container-lowest rounded-lg p-5 md:p-6',
        'border border-outline-variant/40 shadow-soft',
        'flex flex-col gap-4',
        className,
      )}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-headline-md text-on-surface">
          Design Artifacts
        </h2>
        <button
          type="button"
          aria-label="Add file"
          className={clsx(
            'inline-flex items-center gap-1 px-3 py-1.5 rounded-full',
            'text-label-md text-primary font-semibold',
            'hover:bg-surface-container-low transition-colors',
          )}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add File
        </button>
      </header>

      {artifacts.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant py-4 text-center">
          No artifacts yet. Drop a Figma link or mockup to get started.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {artifacts.map((artifact) => (
            <ArtifactItem key={artifact.id} artifact={artifact} />
          ))}
        </ul>
      )}
    </section>
  );
}

interface ArtifactItemProps {
  artifact: IdeaArtifact;
}

function ArtifactItem({ artifact }: ArtifactItemProps) {
  const Icon = fileTypeIcons[artifact.fileType];
  const tint = fileTypeColor[artifact.fileType];

  return (
    <li>
      <a
        href={artifact.url}
        target={artifact.fileType === 'figma' || artifact.fileType === 'link' ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={clsx(
          'flex items-center gap-3 p-3 rounded-md',
          'bg-surface-container-low hover:bg-surface-container',
          'transition-colors',
        )}
      >
        <span
          className={clsx(
            'w-10 h-10 rounded-md flex items-center justify-center shrink-0',
            tint,
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-label-lg text-on-surface truncate">
            {artifact.name}
          </span>
          {artifact.fileSize ? (
            <span className="text-label-sm text-on-surface-variant">
              {formatFileSize(artifact.fileSize)}
            </span>
          ) : null}
        </div>
      </a>
    </li>
  );
}
