-- ============================================================
-- T013 - Fonctions SQL helper pour RLS
-- Source: specs/001-proxiwave-v2/data-model.md
-- ============================================================

-- Retourne le rôle de l'utilisateur courant
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Retourne le client_id de l'utilisateur courant (NULL pour superadmin)
CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT client_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Vérifie si l'utilisateur courant peut accéder au projet donné
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
