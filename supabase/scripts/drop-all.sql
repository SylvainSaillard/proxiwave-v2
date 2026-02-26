-- ============================================================
-- T009 - NETTOYAGE COMPLET DU PROJET SUPABASE CLOUD
-- Project: rteuevldfahmxsnafexa
-- ⚠️  DESTRUCTIF — Exécuter via SQL Editor du Dashboard
-- ⚠️  Toutes les données existantes seront PERDUES définitivement
-- ============================================================

-- Désactiver les triggers pour éviter les conflits
SET session_replication_role = 'replica';

-- Supprimer toutes les tables du schéma public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    RAISE NOTICE 'Dropped table: %', r.tablename;
  END LOOP;
END $$;

-- Supprimer toutes les fonctions du schéma public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT n.nspname, p.proname, pg_catalog.pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_catalog.pg_proc p
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
  ) LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
    RAISE NOTICE 'Dropped function: %(%)', r.proname, r.args;
  END LOOP;
END $$;

-- Supprimer tous les types custom du schéma public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT typname
    FROM pg_type
    WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      AND typtype = 'e'
  ) LOOP
    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
    RAISE NOTICE 'Dropped type: %', r.typname;
  END LOOP;
END $$;

-- Supprimer toutes les vues du schéma public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT viewname
    FROM pg_views
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.viewname) || ' CASCADE';
    RAISE NOTICE 'Dropped view: %', r.viewname;
  END LOOP;
END $$;

-- Réactiver les triggers
SET session_replication_role = 'origin';

-- Vérification : doit retourner 0 lignes
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
