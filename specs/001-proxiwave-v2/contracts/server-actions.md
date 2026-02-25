# Contrats — Server Actions & API Routes

**Généré le**: 2026-02-24 | **Branch**: `001-proxiwave-v2`

Convention :
- `SA` = Server Action (`'use server'`) — pour les mutations depuis composants React
- `RH` = Route Handler (`app/api/.../route.ts`) — pour webhooks ou endpoints publics
- **Accès** : qui peut appeler cette action (rôle minimum requis)

---

## Authentification

### `SA` `login(formData: FormData): Promise<{ error?: string }>`
**Accès** : Public
**Fichier** : `app/(auth)/login/actions.ts`
```
Input:  { email: string, password: string }
Output: void (redirect vers /dashboard) | { error: string }
```
Appelle `supabase.auth.signInWithPassword()`. Redirige vers `/dashboard` après succès.

---

### `SA` `logout(): Promise<void>`
**Accès** : Tout utilisateur authentifié
**Fichier** : `app/(dashboard)/actions.ts`
Appelle `supabase.auth.signOut()`. Redirige vers `/login`.

---

## Projets

### `SA` `listProjects(): Promise<Project[]>`
**Accès** : Tous les rôles (RLS filtre automatiquement par rôle)
**Fichier** : `app/(dashboard)/dashboard/actions.ts`
Retourne les projets accessibles à l'utilisateur courant avec : `id, name, category, status, progress, start_date, end_date, client_id, satisfaction_score`.

---

### `SA` `getProject(id: string): Promise<ProjectDetail | null>`
**Accès** : Tous les rôles (RLS vérifie l'accès)
**Fichier** : `app/(dashboard)/dashboard/project/[id]/actions.ts`
Retourne le projet avec toutes ses relations : tâches, sprints, idées, messages récents, documents. Retourne `null` si inaccessible (ne révèle pas l'existence du projet).

---

### `SA` `createProject(data: CreateProjectInput): Promise<{ id: string } | { error: string }>`
**Accès** : `superadmin` uniquement
**Fichier** : `app/(dashboard)/dashboard/actions.ts`
```typescript
type CreateProjectInput = {
  client_id: string
  name: string
  category: string
  status: 'en_cours' | 'terminé' | 'à_venir'
  start_date?: string
  end_date?: string
  budget_total?: number
}
```

---

### `SA` `updateProject(id: string, data: Partial<UpdateProjectInput>): Promise<void | { error: string }>`
**Accès** : `superadmin` uniquement
Champs modifiables : `name`, `category`, `status`, `progress`, `start_date`, `end_date`, `satisfaction_score`, `budget_consumed`, `team_members`.

---

## Tâches

### `SA` `listTasks(projectId: string): Promise<Task[]>`
**Accès** : Tous les rôles (accès vérifié via projet)
Retourne les tâches avec sous-tâches.

---

### `SA` `createTask(data: CreateTaskInput): Promise<{ id: string } | { error: string }>`
**Accès** : `superadmin` uniquement
```typescript
type CreateTaskInput = {
  project_id: string
  sprint_id?: string
  title: string
  status: 'validée' | 'en_cours' | 'livrée'
  priority: 'haute' | 'moyenne' | 'basse'
  progress_pct?: number
  start_week?: string         // ISO date (lundi)
  duration_weeks?: number
  start_date?: string
  end_date?: string
  assigned_to?: string
  tags?: string[]
}
```

---

### `SA` `updateTask(id: string, data: Partial<UpdateTaskInput>): Promise<void | { error: string }>`
**Accès** : `superadmin` uniquement

---

### `SA` `updateSubtask(id: string, is_done: boolean): Promise<void | { error: string }>`
**Accès** : `superadmin` uniquement

---

## Sprints

### `SA` `listSprints(projectId: string): Promise<Sprint[]>`
**Accès** : Tous les rôles
Retourne les sprints avec leurs items.

---

### `SA` `createSprint(data: CreateSprintInput): Promise<{ id: string } | { error: string }>`
**Accès** : `superadmin` uniquement
```typescript
type CreateSprintInput = {
  project_id: string
  name: string
  status: 'terminé' | 'actif' | 'à_venir'
  start_date?: string
  end_date?: string
  billing_amount?: number
}
```

---

### `SA` `updateSprintItemStatus(id: string, status: SprintItemStatus): Promise<void | { error: string }>`
**Accès** : `superadmin` uniquement

---

## Idées

### `SA` `listIdeas(projectId: string): Promise<Idea[]>`
**Accès** : Tous les rôles (accès vérifié via projet)

---

### `SA` `createIdea(data: CreateIdeaInput): Promise<{ id: string } | { error: string }>`
**Accès** : `admin_client`, `chef_de_projet` (pas superadmin — c'est une action client)
```typescript
type CreateIdeaInput = {
  project_id: string
  title: string
}
// author_id = auth.uid() côté serveur — jamais fourni par le client
```

---

### `SA` `updateIdeaStatus(id: string, status: IdeaStatus): Promise<void | { error: string }>`
**Accès** : `superadmin` uniquement
```typescript
type IdeaStatus = 'nouvelle' | 'en_revue' | 'acceptée' | 'refusée'
```
Transitions valides : `nouvelle` → `en_revue` → `acceptée` | `refusée`

---

## Messagerie

### `SA` `listMessages(projectId: string): Promise<ProjectMessage[]>`
**Accès** : Tous les rôles (accès vérifié via projet)

---

### `SA` `sendMessage(data: SendMessageInput): Promise<{ id: string } | { error: string }>`
**Accès** : Tous les rôles
```typescript
type SendMessageInput = {
  project_id: string
  content: string
  // message_type déterminé côté serveur depuis le rôle de l'auteur
  // author_id = auth.uid() côté serveur
}
```
`message_type` est déduit du rôle : superadmin/équipe → `'équipe'` ; admin_client/chef_de_projet → `'client'`.

---

## Documents

### `SA` `listDocuments(filters?: DocumentFilters): Promise<Document[]>`
**Accès** : Tous les rôles
```typescript
type DocumentFilters = {
  project_id?: string
  category?: string
  file_type?: string
  search?: string    // recherche textuelle sur le nom
}
```

---

### `SA` `uploadDocument(formData: FormData): Promise<{ id: string } | { error: string }>`
**Accès** : `superadmin` uniquement
```
Input FormData: { file: File, project_id, name, category }
```
1. Upload vers Supabase Storage (chemin : `documents/{project_id}/{uuid}-{filename}`)
2. Insert dans table `documents` avec `storage_path`

---

### `SA` `deleteDocument(id: string): Promise<void | { error: string }>`
**Accès** : `superadmin` uniquement
Supprime le fichier de Storage + l'entrée en BDD.

---

### `SA` `toggleDocumentFavorite(id: string): Promise<void | { error: string }>`
**Accès** : Tous les rôles ayant accès au projet

---

## Gestion des utilisateurs

### `SA` `listUsers(clientId?: string): Promise<Profile[]>`
**Accès** : `superadmin` (tous) ; `admin_client` (son client uniquement)
`clientId` ignoré pour superadmin (il peut tout voir).

---

### `SA` `createUser(data: CreateUserInput): Promise<{ id: string } | { error: string }>`
**Accès** : `superadmin` uniquement (utilise `supabaseAdmin` — service role)
```typescript
type CreateUserInput = {
  email: string
  password: string
  role: 'admin_client' | 'chef_de_projet'
  client_id: string
  full_name: string
}
```
Crée le compte `auth.users` puis insère dans `profiles`.

---

### `SA` `assignProjectsToUser(userId: string, projectIds: string[]): Promise<void | { error: string }>`
**Accès** : `superadmin` ; `admin_client` (pour les utilisateurs de son client uniquement)
Remplace les assignations existantes dans `project_members`.

---

## Clients (organisations)

### `SA` `listClients(): Promise<Client[]>`
**Accès** : `superadmin` uniquement

---

### `SA` `createClient(data: { name: string; logo_url?: string }): Promise<{ id: string } | { error: string }>`
**Accès** : `superadmin` uniquement

---

## Contact (landing page)

### `RH` `POST /api/contact`
**Accès** : Public (pas d'auth)
**Fichier** : `app/api/contact/route.ts`
```typescript
// Request body
type ContactInput = {
  name: string
  email: string
  message: string
}

// Flow :
// 1. Validation des inputs
// 2. INSERT dans table `contacts` (Supabase — service role)
// 3. Envoi email via Resend → équipe Proxiwave
// 4. Return { success: true }
```

---

## Types TypeScript partagés

```typescript
// types/app.ts

export type UserRole = 'superadmin' | 'admin_client' | 'chef_de_projet'
export type ProjectStatus = 'en_cours' | 'terminé' | 'à_venir'
export type TaskStatus = 'validée' | 'en_cours' | 'livrée'
export type TaskPriority = 'haute' | 'moyenne' | 'basse'
export type SprintStatus = 'terminé' | 'actif' | 'à_venir'
export type SprintItemStatus = 'validé' | 'en_cours' | 'livré'
export type IdeaStatus = 'nouvelle' | 'en_revue' | 'acceptée' | 'refusée'
export type FileType = 'pdf' | 'figma' | 'sheet' | 'doc' | 'image'
export type DocumentCategory = 'livrable' | 'spécification' | 'design' | 'rapport' | 'facture'
export type MessageType = 'client' | 'équipe'
```
