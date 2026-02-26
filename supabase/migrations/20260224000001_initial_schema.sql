-- ============================================================
-- T012 - Schéma initial Proxiwave v2
-- Source: specs/001-proxiwave-v2/data-model.md
-- ============================================================

-- ========================
-- TABLE: clients
-- ========================
CREATE TABLE public.clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  logo_url   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: profiles
-- Extension de auth.users
-- ========================
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('superadmin', 'admin_client', 'chef_de_projet')),
  client_id    UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  full_name    TEXT NOT NULL DEFAULT '',
  initials     TEXT NOT NULL DEFAULT '' CHECK (char_length(initials) <= 2),
  avatar_color TEXT NOT NULL DEFAULT '#6366f1',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: projects
-- ========================
CREATE TABLE public.projects (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id          UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  category           TEXT NOT NULL DEFAULT '',
  status             TEXT NOT NULL CHECK (status IN ('en_cours', 'terminé', 'à_venir')),
  progress           SMALLINT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date         DATE,
  end_date           DATE,
  satisfaction_score SMALLINT CHECK (satisfaction_score >= 0 AND satisfaction_score <= 10),
  budget_total       NUMERIC(12, 2),
  budget_consumed    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  team_members       UUID[] DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: project_members
-- Chef de projet ↔ Project (M:M)
-- ========================
CREATE TABLE public.project_members (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, user_id)
);

-- ========================
-- TABLE: tasks
-- ========================
CREATE TABLE public.tasks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sprint_id      UUID,
  title          TEXT NOT NULL,
  description    TEXT,
  status         TEXT NOT NULL CHECK (status IN ('validée', 'en_cours', 'livrée')),
  priority       TEXT NOT NULL CHECK (priority IN ('haute', 'moyenne', 'basse')),
  progress_pct   SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  start_week     DATE,
  duration_weeks SMALLINT NOT NULL DEFAULT 1 CHECK (duration_weeks > 0),
  start_date     DATE,
  end_date       DATE,
  assigned_to    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tags           TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: subtasks
-- ========================
CREATE TABLE public.subtasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  is_done    BOOLEAN NOT NULL DEFAULT FALSE,
  position   SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: sprints
-- ========================
CREATE TABLE public.sprints (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  status         TEXT NOT NULL CHECK (status IN ('terminé', 'actif', 'à_venir')),
  start_date     DATE,
  end_date       DATE,
  progress_pct   SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  billing_amount NUMERIC(12, 2),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FK tasks → sprints (ajoutée après la création des deux tables)
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_sprint_id_fkey
  FOREIGN KEY (sprint_id) REFERENCES public.sprints(id) ON DELETE SET NULL;

-- ========================
-- TABLE: sprint_items
-- ========================
CREATE TABLE public.sprint_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id  UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('validé', 'en_cours', 'livré')),
  position   SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: ideas
-- ========================
CREATE TABLE public.ideas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'nouvelle'
             CHECK (status IN ('nouvelle', 'en_revue', 'acceptée', 'refusée')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: project_messages
-- ========================
CREATE TABLE public.project_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('client', 'équipe')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: documents
-- ========================
CREATE TABLE public.documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  file_type    TEXT NOT NULL CHECK (file_type IN ('pdf', 'figma', 'sheet', 'doc', 'image')),
  category     TEXT NOT NULL CHECK (category IN ('livrable', 'spécification', 'design', 'rapport', 'facture')),
  file_size    BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL DEFAULT '',
  is_favorite  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: contacts
-- Formulaire landing page (accès public)
-- ========================
CREATE TABLE public.contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- INDEX
-- ========================
CREATE INDEX idx_projects_client_id        ON public.projects(client_id);
CREATE INDEX idx_profiles_client_id        ON public.profiles(client_id);
CREATE INDEX idx_project_members_user_id   ON public.project_members(user_id);
CREATE INDEX idx_tasks_project_id          ON public.tasks(project_id);
CREATE INDEX idx_sprints_project_id        ON public.sprints(project_id);
CREATE INDEX idx_ideas_project_id          ON public.ideas(project_id);
CREATE INDEX idx_project_messages_project  ON public.project_messages(project_id, created_at DESC);
CREATE INDEX idx_documents_project_id      ON public.documents(project_id);
