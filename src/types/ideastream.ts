// IdeaStream — types applicatifs (MVP lecture seule)
//
// Source : specs/002-ideastream/data-model.md (schéma cible refonte).
// Ces types sont en avance sur la DB : pour le MVP, ils sont alimentés
// par des fixtures statiques dans src/lib/fixtures/ideastream.ts.
//
// Convention de naming : camelCase côté TS, snake_case côté DB.
// Quand la migration SQL sera écrite, on ajoutera une couche de
// mapping (cf. src/types/database.ts).

// ============================================================
// Enums & primitives
// ============================================================

/** Cycle de vie d'une idée — du dépôt à la livraison. */
export type IdeaStatus =
  | 'sandbox' // brouillon, pas encore en revue
  | 'approved' // validée, en attente d'attaque
  | 'in_dev' // en développement (sprint actif)
  | 'shipped' // livrée
  | 'rejected'; // refusée

/** Couleur sémantique d'un chip/badge. Pointe vers les tokens design. */
export type IdeaSemanticColor =
  | 'primary' // indigo — défaut, neutre actif
  | 'secondary' // electric purple — collaboration, idéation
  | 'tertiary' // bright teal — succès, livré
  | 'neutral' // outline — désactivé, brouillon
  | 'error'; // rouge — refusé

/** Niveaux de gamification (Newcomer → Visionary → Innovator → Master). */
export type GamificationLevelTitle =
  | 'Newcomer'
  | 'Contributor'
  | 'Innovator'
  | 'Visionary'
  | 'Master Tinkerer';

// ============================================================
// Entités
// ============================================================

/** Utilisateur côté UI (subset de profiles enrichi pour l'affichage). */
export interface IdeaUser {
  id: string;
  name: string;
  /** 1-2 caractères, affichage de fallback si pas d'avatarUrl. */
  initials: string;
  /** URL d'avatar (Supabase Storage ou externe). */
  avatarUrl?: string;
  /** Couleur de fond si initiales (hex ou nom de token). */
  avatarColor?: string;
  /** Indique si l'utilisateur est en ligne (border indigo sur avatar). */
  isActive?: boolean;
}

/** Catégorie d'idée (UI/UX, Backend, Mobile, etc.). */
export interface IdeaCategory {
  id: string;
  slug: string;
  label: string;
  color: IdeaSemanticColor;
}

/** Projet auquel l'idée est rattachée (rôle secondaire). */
export interface IdeaProjectRef {
  id: string;
  name: string;
  /** Tag catégoriel ('Strategic', 'Core', 'Beta'…). */
  category?: string;
}

/** Sprint dans lequel l'idée est en cours d'exécution. */
export interface IdeaSprintRef {
  id: string;
  /** Numéro de sprint (ex: 24, 25). Affiché comme "Sprint 24". */
  number: number;
  status: 'upcoming' | 'active' | 'completed';
}

/** Idée — entité racine d'IdeaStream. */
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  status: IdeaStatus;

  author: IdeaUser;
  /** Avatars additionnels affichés dans la stack (collaborateurs). */
  contributors: IdeaUser[];

  upvotesCount: number;
  commentsCount: number;

  project?: IdeaProjectRef;
  sprint?: IdeaSprintRef;

  /** Date de livraison estimée (si in_dev). */
  estimatedDelivery?: string; // ISO
  /** Date effective de shipping (si shipped). */
  shippedAt?: string;

  /** ISO datetime de création. */
  createdAt: string;
  /** Score de complexité 0-10 (affiché sur l'écran détail). */
  complexityScore?: number;
  /** L'utilisateur courant a-t-il déjà voté pour cette idée ? */
  hasUserVoted: boolean;

  /** Marque "Trending" pour mise en avant Dashboard. */
  isTrending?: boolean;
}

// ============================================================
// Idée — vue détail (sous-éléments)
// ============================================================

/** Fichier ou lien attaché à l'idée (Figma, image, doc, PDF). */
export interface IdeaArtifact {
  id: string;
  ideaId: string;
  uploader: IdeaUser;
  name: string;
  fileType: 'figma' | 'image' | 'pdf' | 'doc' | 'sheet' | 'link';
  /** URL Supabase Storage ou externe. */
  url: string;
  /** Taille en bytes (omitted pour les liens externes). */
  fileSize?: number;
  createdAt: string;
}

/** Commentaire dans le fil "Team Discussion" (nested via parentId). */
export interface IdeaComment {
  id: string;
  ideaId: string;
  author: IdeaUser;
  content: string;
  createdAt: string;
  /** Si défini, le commentaire est une réponse à parentId. */
  parentId?: string;
  /** Réponses imbriquées (résolues côté fixtures pour le MVP). */
  replies?: IdeaComment[];
}

/** Étape du cycle de vie pour le LifecycleStepper. */
export interface LifecycleStage {
  id: 'idea' | 'approval' | 'dev' | 'done';
  label: string;
  state: 'complete' | 'active' | 'pending';
}

// ============================================================
// Gamification
// ============================================================

/** Profil étendu côté UI avec données de gamification. */
export interface GamifiedProfile extends IdeaUser {
  email: string;
  role: 'admin' | 'client' | 'team_member';
  xpPoints: number;
  level: number;
  levelTitle: GamificationLevelTitle;
  /** XP requis pour atteindre le niveau suivant (cumulatif). */
  nextLevelXp: number;
  currentStreak: number; // jours consécutifs
  longestStreak: number;
  badgesCount: number;
  ideasContributed: number;
  ideasApprovedLastMonth: number;
}

/** Badge / accomplissement déverrouillé. */
export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Nom d'icône Lucide. */
  icon: string;
  color: IdeaSemanticColor;
  unlockedAt?: string; // si undefined : pas encore débloqué
}

// ============================================================
// Activity log — Community Pulse
// ============================================================

/** Verbe d'une entrée d'activité (pour le rendu et i18n). */
export type ActivityVerb =
  | 'upvoted'
  | 'commented'
  | 'created_idea'
  | 'shipped_idea'
  | 'approved_idea'
  | 'unlocked_achievement'
  | 'reached_streak'
  | 'reached_xp_milestone';

/** Entrée du Community Pulse (chronologique, dernière en haut). */
export interface ActivityLogEntry {
  id: string;
  actor: IdeaUser;
  verb: ActivityVerb;
  /** Cible (ex: idée upvotée). null si verbe self-contained. */
  targetIdeaTitle?: string;
  /** Si verbe vise un autre utilisateur (ex: "X upvoted YOUR idea"). */
  targetUser?: IdeaUser;
  /** Métadonnées libres (streak_days, achievement_name, etc.). */
  metadata?: Record<string, string | number>;
  createdAt: string;
}

// ============================================================
// Projets — rôle secondaire IdeaStream
// ============================================================

/** Projet avec ses métriques de santé (Projects Overview screen). */
export interface IdeaStreamProject {
  id: string;
  name: string;
  description: string;
  /** Tag catégoriel affiché en chip ('Strategic', 'Internal', etc.). */
  category: string;
  status: 'active' | 'archived' | 'on_hold';
  /** Couleur de la border-left de la card. */
  color: IdeaSemanticColor;
  /** Progression globale 0-100. */
  progressPct: number;
  /** Membres affichés dans l'AvatarGroup de la card. */
  teamMembers: IdeaUser[];
  /** Sprint actif si présent. */
  activeSprint?: IdeaStreamSprint;
  deadline?: string;
}

/** Sprint avec ses métriques de vélocité. */
export interface IdeaStreamSprint {
  id: string;
  projectId: string;
  number: number;
  /** Nom optionnel ('Innovation Cycle #12'). */
  name?: string;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  velocityScore: number; // 0-100
  ideasTotal: number;
  ideasShipped: number;
  /** Tâches du sprint (pour barre 14/18 sur le hero). */
  tasksTotal: number;
  tasksCompleted: number;
}
