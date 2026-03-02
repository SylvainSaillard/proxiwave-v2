// T022 — Types applicatifs partagés Proxiwave v2
// Source: specs/001-proxiwave-v2/contracts/server-actions.md

export type UserRole = 'superadmin' | 'admin_client' | 'chef_de_projet';
export type ProjectStatus = 'en_cours' | 'terminé' | 'à_venir';
export type TaskStatus = 'validée' | 'en_cours' | 'livrée';
export type TaskPriority = 'haute' | 'moyenne' | 'basse';
export type SprintStatus = 'terminé' | 'actif' | 'à_venir';
export type SprintItemStatus = 'validé' | 'en_cours' | 'livré';
export type IdeaStatus = 'nouvelle' | 'en_revue' | 'acceptée' | 'refusée';
export type FileType = 'pdf' | 'figma' | 'sheet' | 'doc' | 'image';
export type DocumentCategory =
  | 'livrable'
  | 'spécification'
  | 'design'
  | 'rapport'
  | 'facture';
export type MessageType = 'client' | 'équipe';

// DTO enrichis (avec jointures)
export interface Profile {
  id: string;
  role: UserRole;
  client_id: string | null;
  full_name: string;
  initials: string;
  avatar_color: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  satisfaction_score: number | null;
  budget_total: number | null;
  budget_consumed: number;
  team_members: string[];
  created_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_done: boolean;
  position: number;
}

export interface Task {
  id: string;
  project_id: string;
  sprint_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress_pct: number;
  start_week: string | null;
  duration_weeks: number;
  start_date: string | null;
  end_date: string | null;
  assigned_to: string | null;
  tags: string[];
  created_at: string;
  subtasks?: Subtask[];
}

export interface SprintItem {
  id: string;
  sprint_id: string;
  title: string;
  status: SprintItemStatus;
  position: number;
}

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  status: SprintStatus;
  start_date: string | null;
  end_date: string | null;
  progress_pct: number;
  billing_amount: number | null;
  created_at: string;
  items?: SprintItem[];
}

export interface Idea {
  id: string;
  project_id: string;
  author_id: string;
  title: string;
  status: IdeaStatus;
  start_date: string | null;
  end_date: string | null;
  priority: TaskPriority | null;
  duration_weeks: number | null;
  created_at: string;
  author?: Pick<Profile, 'full_name' | 'initials' | 'avatar_color'>;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  author_id: string;
  content: string;
  message_type: MessageType;
  created_at: string;
  author?: Pick<Profile, 'full_name' | 'initials' | 'avatar_color' | 'role'>;
}

export interface Document {
  id: string;
  project_id: string;
  author_id: string;
  name: string;
  file_type: FileType;
  category: DocumentCategory;
  file_size: number;
  storage_path: string;
  is_favorite: boolean;
  created_at: string;
}

export interface DashboardMessage {
  id: string;
  project_id: string;
  project_name: string;
  content: string;
  author_name: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  en_cours: number;
  termine: number;
  a_venir: number;
}

export interface IdeaStats {
  total: number;
  nouvelle: number;
  en_revue: number;
  acceptee: number;
  refusee: number;
  adoption_rate: number;
}

// Inputs Server Actions
export interface CreateProjectInput {
  client_id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  budget_total?: number;
}

export interface CreateTaskInput {
  project_id: string;
  sprint_id?: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress_pct?: number;
  start_week?: string;
  duration_weeks?: number;
  start_date?: string;
  end_date?: string;
  assigned_to?: string;
  tags?: string[];
}

export interface CreateSprintInput {
  project_id: string;
  name: string;
  status: SprintStatus;
  start_date?: string;
  end_date?: string;
  billing_amount?: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: 'admin_client' | 'chef_de_projet';
  client_id: string;
  full_name: string;
}

export interface CreateClientInput {
  name: string;
  logo_url?: string;
}

export interface DocumentFilters {
  project_id?: string;
  category?: string;
  file_type?: string;
  search?: string;
}
