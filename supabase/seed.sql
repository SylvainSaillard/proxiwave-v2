-- ============================================================
-- SEED — Données de test Proxiwave v2
-- Mot de passe pour tous les comptes : proxiwave2026
-- ============================================================
-- NOTE: Les champs confirmation_token, recovery_token, email_change_token_new
-- et email_change doivent être '' (chaîne vide) et NON NULL pour GoTrue.

DO $$
DECLARE
  v_client_id     UUID := 'aaaaaaaa-0001-0000-0000-000000000001';
  v_superadmin_id UUID := 'aaaaaaaa-0002-0000-0000-000000000001';
  v_admin_id      UUID := 'aaaaaaaa-0003-0000-0000-000000000001';
  v_chef_id       UUID := 'aaaaaaaa-0004-0000-0000-000000000001';
  v_project1_id   UUID := 'aaaaaaaa-0005-0000-0000-000000000001';
  v_project2_id   UUID := 'aaaaaaaa-0006-0000-0000-000000000001';
  v_sprint1_id    UUID := 'aaaaaaaa-0007-0000-0000-000000000001';
  v_sprint2_id    UUID := 'aaaaaaaa-0008-0000-0000-000000000001';
  v_task1_id      UUID := 'aaaaaaaa-0009-0000-0000-000000000001';
  v_task2_id      UUID := 'aaaaaaaa-0010-0000-0000-000000000001';
  v_task3_id      UUID := 'aaaaaaaa-0011-0000-0000-000000000001';
  v_task4_id      UUID := 'aaaaaaaa-0012-0000-0000-000000000001';
  v_task5_id      UUID := 'aaaaaaaa-0013-0000-0000-000000000001';
BEGIN

  -- ========================
  -- AUTH USERS
  -- ⚠️ GoTrue requiert des chaînes vides (pas NULL) sur les champs token
  -- ========================
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES
  (
    v_superadmin_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'superadmin@proxiwave.fr',
    crypt('proxiwave2026', gen_salt('bf', 10)),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    v_admin_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'admin@acme.fr',
    crypt('proxiwave2026', gen_salt('bf', 10)),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    v_chef_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'chef@acme.fr',
    crypt('proxiwave2026', gen_salt('bf', 10)),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  )
  ON CONFLICT (id) DO NOTHING;

  -- AUTH IDENTITIES
  INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_superadmin_id, 'superadmin@proxiwave.fr', 'email',
     '{"sub":"aaaaaaaa-0002-0000-0000-000000000001","email":"superadmin@proxiwave.fr","email_verified":true}'::jsonb,
     NOW(), NOW(), NOW()),
    (gen_random_uuid(), v_admin_id, 'admin@acme.fr', 'email',
     '{"sub":"aaaaaaaa-0003-0000-0000-000000000001","email":"admin@acme.fr","email_verified":true}'::jsonb,
     NOW(), NOW(), NOW()),
    (gen_random_uuid(), v_chef_id, 'chef@acme.fr', 'email',
     '{"sub":"aaaaaaaa-0004-0000-0000-000000000001","email":"chef@acme.fr","email_verified":true}'::jsonb,
     NOW(), NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- CLIENT
  INSERT INTO public.clients (id, name) VALUES (v_client_id, 'Acme Corp')
  ON CONFLICT (id) DO NOTHING;

  -- PROFILES
  INSERT INTO public.profiles (id, role, client_id, full_name, initials, avatar_color) VALUES
    (v_superadmin_id, 'superadmin',     NULL,        'Sophie Martin', 'SM', '#6366f1'),
    (v_admin_id,      'admin_client',   v_client_id, 'Alice Dupont',  'AD', '#f59e0b'),
    (v_chef_id,       'chef_de_projet', v_client_id, 'Marc Lefebvre', 'ML', '#10b981')
  ON CONFLICT (id) DO NOTHING;

  -- PROJECTS
  INSERT INTO public.projects (id, client_id, name, category, status, progress, start_date, end_date, satisfaction_score, budget_total, budget_consumed, team_members) VALUES
    (v_project1_id, v_client_id, 'Plateforme IA Acme', 'Intelligence Artificielle',
     'en_cours', 65, '2026-01-06', '2026-06-30', 8, 85000, 55000, ARRAY[v_chef_id]),
    (v_project2_id, v_client_id, 'Refonte Site Web', 'Design & Développement',
     'terminé', 100, '2025-09-01', '2025-12-31', 9, 25000, 24500, ARRAY[v_chef_id])
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.project_members (project_id, user_id) VALUES (v_project1_id, v_chef_id)
  ON CONFLICT DO NOTHING;

  -- SPRINTS
  INSERT INTO public.sprints (id, project_id, name, status, start_date, end_date, progress_pct, billing_amount) VALUES
    (v_sprint1_id, v_project1_id, 'Sprint 1 — Fondations',  'terminé', '2026-01-06', '2026-02-02', 100, 15000),
    (v_sprint2_id, v_project1_id, 'Sprint 2 — Intégration', 'actif',   '2026-02-03', '2026-03-30',  60, 20000)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.sprint_items (sprint_id, title, status, position) VALUES
    (v_sprint1_id, 'Architecture technique validée', 'validé',   1),
    (v_sprint1_id, 'Pipeline de données',            'validé',   2),
    (v_sprint1_id, 'Module NLP v1',                  'validé',   3),
    (v_sprint2_id, 'API REST documentée',            'en_cours', 1),
    (v_sprint2_id, 'Interface utilisateur',          'en_cours', 2),
    (v_sprint2_id, 'Tests de charge',                'livré',    3);

  -- TASKS
  INSERT INTO public.tasks (id, project_id, sprint_id, title, description, status, priority, progress_pct, start_date, end_date, duration_weeks, assigned_to, tags) VALUES
    (v_task1_id, v_project1_id, v_sprint1_id,
     'Architecture & infrastructure cloud',
     'Définir l''architecture micro-services et provisionner l''infrastructure AWS.',
     'livrée', 'haute', 100, '2026-01-06', '2026-01-19', 2, v_chef_id, ARRAY['infrastructure','cloud']),
    (v_task2_id, v_project1_id, v_sprint1_id,
     'Pipeline de traitement des données',
     'Mettre en place le pipeline ETL pour l''ingestion et la normalisation des données.',
     'livrée', 'haute', 100, '2026-01-20', '2026-02-02', 2, v_chef_id, ARRAY['data','ETL']),
    (v_task3_id, v_project1_id, v_sprint2_id,
     'Développement API REST',
     'Créer les endpoints REST pour l''interface avec le module IA.',
     'en_cours', 'haute', 70, '2026-02-03', '2026-02-23', 3, v_chef_id, ARRAY['API','backend']),
    (v_task4_id, v_project1_id, v_sprint2_id,
     'Interface utilisateur dashboard',
     'Porter les maquettes Figma en composants React.',
     'en_cours', 'moyenne', 40, '2026-02-24', '2026-03-16', 3, v_chef_id, ARRAY['frontend','UI']),
    (v_task5_id, v_project1_id, NULL,
     'Tests de performance & sécurité',
     'Audit de sécurité OWASP et tests de charge (k6).',
     'validée', 'basse', 0, '2026-03-17', '2026-03-30', 2, NULL, ARRAY['tests','sécurité'])
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.subtasks (task_id, title, is_done, position) VALUES
    (v_task1_id, 'Schéma d''architecture validé',    true,  1),
    (v_task1_id, 'VPC et groupes de sécurité créés', true,  2),
    (v_task1_id, 'CI/CD configuré',                  true,  3),
    (v_task3_id, 'Endpoints authentification',       true,  1),
    (v_task3_id, 'Endpoints projets CRUD',           true,  2),
    (v_task3_id, 'Documentation Swagger',            false, 3),
    (v_task3_id, 'Tests unitaires',                  false, 4),
    (v_task4_id, 'Composants de base portés',        true,  1),
    (v_task4_id, 'Page dashboard',                   false, 2),
    (v_task4_id, 'Page détail projet',               false, 3);

  -- IDEAS
  INSERT INTO public.ideas (project_id, author_id, title, status) VALUES
    (v_project1_id, v_admin_id, 'Ajouter un chatbot IA sur la page d''accueil', 'en_revue'),
    (v_project1_id, v_chef_id,  'Intégrer une analyse prédictive des ventes',   'acceptée'),
    (v_project1_id, v_admin_id, 'Mode sombre pour le dashboard',                'nouvelle'),
    (v_project1_id, v_admin_id, 'Export PDF des rapports mensuels',             'refusée');

  -- MESSAGES
  INSERT INTO public.project_messages (project_id, author_id, content, message_type, created_at) VALUES
    (v_project1_id, v_admin_id,      'Bonjour, où en est-on sur le Sprint 2 ?', 'client', NOW() - INTERVAL '3 days'),
    (v_project1_id, v_superadmin_id, 'Bonjour Alice ! Le Sprint 2 avance bien, l''API est à 70%. Livraison prévue le 23 février.', 'équipe', NOW() - INTERVAL '3 days' + INTERVAL '1 hour'),
    (v_project1_id, v_admin_id,      'Super, merci pour le point. Peut-on avoir une démo la semaine prochaine ?', 'client', NOW() - INTERVAL '1 day'),
    (v_project1_id, v_superadmin_id, 'Absolument, je vous propose mardi 3 mars à 14h. Je vous envoie le lien de visio.', 'équipe', NOW() - INTERVAL '1 day' + INTERVAL '2 hours');

  -- DOCUMENTS
  INSERT INTO public.documents (project_id, author_id, name, file_type, category, file_size, storage_path, is_favorite) VALUES
    (v_project1_id, v_superadmin_id, 'Cahier des charges v2.pdf',     'pdf',   'spécification', 2457600, 'documents/' || v_project1_id || '/cdc-v2.pdf',      true),
    (v_project1_id, v_superadmin_id, 'Maquettes Dashboard.fig',       'figma', 'design',        1048576, 'documents/' || v_project1_id || '/maquettes.fig',   false),
    (v_project1_id, v_superadmin_id, 'Rapport Sprint 1.pdf',          'pdf',   'rapport',       892928,  'documents/' || v_project1_id || '/rapport-s1.pdf',  true),
    (v_project1_id, v_superadmin_id, 'Budget prévisionnel 2026.xlsx', 'sheet', 'facture',       204800,  'documents/' || v_project1_id || '/budget-2026.xlsx', false);

END $$;
