-- RLS Policies: Proxiwave v2
-- Généré le: 2026-02-24
-- Branch: 001-proxiwave-v2
--
-- Architecture des rôles :
--   superadmin      : vision 360, toutes opérations
--   admin_client    : lecture + idées + messages sur tous les projets de son client
--   chef_de_projet  : lecture + idées + messages sur ses projets assignés uniquement

-- ===========================================================================
-- FONCTIONS HELPER (STABLE = Postgres peut inliner et cacher par requête)
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT client_id FROM public.profiles WHERE id = auth.uid();
$$;

-- ===========================================================================
-- ENABLE RLS
-- ===========================================================================

ALTER TABLE public.clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts         ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- TABLE: clients
-- ===========================================================================

-- superadmin : tous les clients
CREATE POLICY "clients_superadmin_all"
ON public.clients FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

-- admin_client + chef_de_projet : uniquement leur propre client (lecture)
CREATE POLICY "clients_client_roles_own"
ON public.clients FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND id = public.get_my_client_id()
);

-- ===========================================================================
-- TABLE: profiles
-- ===========================================================================

-- Chaque utilisateur lit son propre profil
CREATE POLICY "profiles_self_read"
ON public.profiles FOR SELECT
USING (id = auth.uid());

-- superadmin : tous les profils
CREATE POLICY "profiles_superadmin_all"
ON public.profiles FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

-- admin_client : liste les utilisateurs de son client (lecture seule)
CREATE POLICY "profiles_admin_client_read_own_client"
ON public.profiles FOR SELECT
USING (
  public.get_my_role() = 'admin_client'
  AND client_id = public.get_my_client_id()
);

-- ===========================================================================
-- TABLE: projects
-- ===========================================================================

-- superadmin : tous les projets
CREATE POLICY "projects_superadmin_all"
ON public.projects FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

-- admin_client : tous les projets de son client (lecture)
CREATE POLICY "projects_admin_client_own_client"
ON public.projects FOR SELECT
USING (
  public.get_my_role() = 'admin_client'
  AND client_id = public.get_my_client_id()
);

-- chef_de_projet : uniquement les projets assignés (lecture)
-- ⚠️ Utilise can_access_project (SECURITY DEFINER) pour éviter la récursion RLS
CREATE POLICY "projects_chef_assigned"
ON public.projects FOR SELECT
USING (
  public.get_my_role() = 'chef_de_projet'
  AND public.can_access_project(id)
);

-- ===========================================================================
-- TABLE: project_members
-- ===========================================================================

-- superadmin : toutes les assignations
CREATE POLICY "project_members_superadmin_all"
ON public.project_members FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

-- admin_client : voit les assignations des projets de son client
-- ⚠️ Utilise is_project_of_my_client (SECURITY DEFINER) pour éviter la récursion RLS
-- projects_chef_assigned → project_members → projects → ∞
CREATE POLICY "project_members_admin_client_read"
ON public.project_members FOR SELECT
USING (
  public.get_my_role() = 'admin_client'
  AND public.is_project_of_my_client(project_id)
);

-- chef_de_projet : voit sa propre assignation
CREATE POLICY "project_members_chef_self"
ON public.project_members FOR SELECT
USING (
  public.get_my_role() = 'chef_de_projet'
  AND user_id = auth.uid()
);

-- ===========================================================================
-- HELPER : accès au projet (utilisé par les tables enfants)
-- Retourne true si l'utilisateur courant peut accéder au projet donné
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.can_access_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT CASE public.get_my_role()
    WHEN 'superadmin' THEN true
    WHEN 'admin_client' THEN EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = p_project_id AND client_id = public.get_my_client_id()
    )
    WHEN 'chef_de_projet' THEN EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = p_project_id AND user_id = auth.uid()
    )
    ELSE false
  END;
$$;

-- ===========================================================================
-- TABLES ENFANTS : tasks, subtasks, sprints, sprint_items
-- Même logique : superadmin ALL, autres SELECT via can_access_project()
-- ===========================================================================

-- TASKS --

CREATE POLICY "tasks_superadmin_all"
ON public.tasks FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "tasks_client_roles_read"
ON public.tasks FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
);

-- SUBTASKS --

CREATE POLICY "subtasks_superadmin_all"
ON public.subtasks FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "subtasks_client_roles_read"
ON public.subtasks FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND EXISTS (
    SELECT 1 FROM public.tasks t
    WHERE t.id = task_id AND public.can_access_project(t.project_id)
  )
);

-- SPRINTS --

CREATE POLICY "sprints_superadmin_all"
ON public.sprints FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "sprints_client_roles_read"
ON public.sprints FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
);

-- SPRINT_ITEMS --

CREATE POLICY "sprint_items_superadmin_all"
ON public.sprint_items FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "sprint_items_client_roles_read"
ON public.sprint_items FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND EXISTS (
    SELECT 1 FROM public.sprints s
    WHERE s.id = sprint_id AND public.can_access_project(s.project_id)
  )
);

-- ===========================================================================
-- TABLE: ideas
-- Lecture : tous les rôles avec accès au projet
-- INSERT  : admin_client + chef_de_projet (actions clients)
-- UPDATE  : superadmin uniquement (changement de statut)
-- ===========================================================================

CREATE POLICY "ideas_superadmin_all"
ON public.ideas FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "ideas_client_roles_read"
ON public.ideas FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
);

CREATE POLICY "ideas_client_roles_insert"
ON public.ideas FOR INSERT
WITH CHECK (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
  AND author_id = auth.uid()
);

-- ===========================================================================
-- TABLE: project_messages
-- Lecture + INSERT : tous les rôles avec accès au projet
-- ===========================================================================

CREATE POLICY "messages_superadmin_all"
ON public.project_messages FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "messages_client_roles_read"
ON public.project_messages FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
);

CREATE POLICY "messages_client_roles_insert"
ON public.project_messages FOR INSERT
WITH CHECK (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
  AND author_id = auth.uid()
);

-- ===========================================================================
-- TABLE: documents
-- Lecture : tous les rôles avec accès au projet
-- INSERT/UPDATE/DELETE : superadmin uniquement
-- ===========================================================================

CREATE POLICY "documents_superadmin_all"
ON public.documents FOR ALL
USING (public.get_my_role() = 'superadmin')
WITH CHECK (public.get_my_role() = 'superadmin');

CREATE POLICY "documents_client_roles_read"
ON public.documents FOR SELECT
USING (
  public.get_my_role() IN ('admin_client', 'chef_de_projet')
  AND public.can_access_project(project_id)
);

-- Toggle favori pour tous les utilisateurs ayant accès
CREATE POLICY "documents_toggle_favorite"
ON public.documents FOR UPDATE
USING (public.can_access_project(project_id))
WITH CHECK (public.can_access_project(project_id));

-- ===========================================================================
-- TABLE: contacts (landing page)
-- INSERT : public (pas d'auth)
-- SELECT : superadmin uniquement
-- ===========================================================================

CREATE POLICY "contacts_public_insert"
ON public.contacts FOR INSERT
WITH CHECK (true);

CREATE POLICY "contacts_superadmin_read"
ON public.contacts FOR SELECT
USING (public.get_my_role() = 'superadmin');
