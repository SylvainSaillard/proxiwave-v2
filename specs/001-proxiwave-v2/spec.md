# Feature Specification: Proxiwave v2 — Plateforme de gestion de projets IA

**Feature Branch**: `001-proxiwave-v2`
**Created**: 2026-02-21
**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accès sécurisé à la plateforme (Priority: P1)

Un utilisateur accède à la plateforme via une page de connexion. Selon son rôle, il est redirigé vers l'espace approprié : vision 360 tous clients pour le superadmin, tous les projets de son client pour l'admin client, ou uniquement ses projets assignés pour le chef de projet.

**Why this priority**: Sans authentification, aucune autre fonctionnalité n'est utilisable en production. C'est le fondement de toute la plateforme.

**Independent Test**: Créer trois comptes (un superadmin, un admin client, un chef de projet), se connecter avec chacun, vérifier que chacun voit uniquement ce à quoi il a droit.

**Acceptance Scenarios**:

1. **Given** un utilisateur non connecté, **When** il accède à n'importe quelle page du dashboard, **Then** il est redirigé vers la page de connexion
2. **Given** un superadmin connecté, **When** il accède au dashboard, **Then** il voit tous les projets de tous les clients avec toutes les fonctionnalités de gestion
3. **Given** un admin client connecté, **When** il accède au dashboard, **Then** il voit tous les projets de son client uniquement
4. **Given** un chef de projet connecté, **When** il accède au dashboard, **Then** il voit uniquement les projets qui lui sont assignés au sein de son client
5. **Given** un utilisateur connecté, **When** il clique sur "Se déconnecter", **Then** sa session est terminée et il est redirigé vers la page de connexion
6. **Given** des identifiants incorrects, **When** l'utilisateur tente de se connecter, **Then** un message d'erreur clair s'affiche sans révéler si c'est l'email ou le mot de passe qui est incorrect

---

### User Story 2 - Tableau de bord projets (Priority: P2)

Un superadmin ou admin client consulte la liste des projets avec leur état d'avancement, les prochaines échéances et les alertes. Le superadmin voit tous les clients et tous les projets (vision 360) ; l'admin client voit uniquement les projets de son client. Le chef de projet voit uniquement ses projets assignés. Chacun peut naviguer vers le détail d'un projet et accéder aux derniers messages.

**Why this priority**: La vue d'ensemble est le point d'entrée central pour l'équipe de gestion au quotidien.

**Independent Test**: Avec des projets réels en base, vérifier que le dashboard affiche les statistiques correctes et que la navigation vers le détail fonctionne.

**Acceptance Scenarios**:

1. **Given** un admin connecté, **When** il accède au dashboard, **Then** il voit la liste des projets avec statut, progression, deadline et équipe assignée
2. **Given** plusieurs projets en base, **When** l'admin consulte les statistiques, **Then** les compteurs (En cours / Terminés / À venir / Total) reflètent les données réelles
3. **Given** la liste de projets, **When** l'admin bascule entre vue grille et vue liste, **Then** les projets s'affichent dans le format sélectionné
4. **Given** la liste de projets, **When** l'admin utilise la barre de recherche, **Then** les projets sont filtrés en temps réel sur le nom et la catégorie
5. **Given** le panneau Messages sur le dashboard, **When** un client envoie un message, **Then** le message apparaît dans le panneau avec son nom et la prévisualisation

---

### User Story 3 - Suivi détaillé d'un projet (Priority: P2)

Un membre de l'équipe ou un client consulte la page de détail d'un projet : progression globale, tâches planifiées sur un diagramme de Gantt, sprints, documents et échanges.

**Why this priority**: Le détail projet est la vue la plus utilisée au quotidien par les deux types d'utilisateurs.

**Independent Test**: Avec un projet réel en base, vérifier que tous les onglets (Tâches, Idées, Messages, Sprints, Documents) affichent les bonnes données.

**Acceptance Scenarios**:

1. **Given** un projet avec des tâches en base, **When** l'utilisateur consulte l'onglet Tâches, **Then** un diagramme de Gantt hebdomadaire affiche les tâches avec leur progression réelle
2. **Given** une tâche dans le Gantt, **When** l'utilisateur clique dessus, **Then** un panneau détail s'ouvre avec sous-tâches, assigné, priorité, tags et dates
3. **Given** un projet avec des sprints, **When** l'utilisateur consulte l'onglet Sprints, **Then** les sprints sont affichés avec leur état, leurs éléments et le montant de facturation associé
4. **Given** un projet, **When** l'utilisateur consulte l'onglet Documents, **Then** il voit les documents liés à ce projet avec type, taille et date
5. **Given** les KPI tabs en haut de la page, **When** l'utilisateur clique sur un KPI (Idées / Messages / Tâches / Sprints / Documents), **Then** la section correspondante s'active

---

### User Story 4 - Boîte à idées collaborative (Priority: P3)

Un client soumet des idées d'amélioration directement depuis son projet. L'équipe Proxiwave consulte, évalue et change le statut de chaque idée. Les statistiques d'adoption sont visibles en temps réel.

**Why this priority**: Fonctionnalité différenciante pour l'engagement client, non bloquante pour les autres modules.

**Independent Test**: Soumettre une idée en tant que client, vérifier qu'elle apparaît pour l'admin, changer son statut, vérifier que le client voit le changement.

**Acceptance Scenarios**:

1. **Given** un client connecté sur son projet, **When** il soumet une idée, **Then** l'idée est enregistrée avec son nom, la date et le statut "Nouvelle"
2. **Given** une idée soumise, **When** un admin change son statut, **Then** le nouveau statut est immédiatement visible pour le client
3. **Given** l'onglet Boîte à idées, **When** l'utilisateur consulte les statistiques, **Then** les compteurs (acceptées, en revue, nouvelles, taux d'adoption) reflètent les données réelles

---

### User Story 5 - Messagerie projet (Priority: P3)

L'équipe Proxiwave et le client échangent des messages directement dans le contexte d'un projet. Le panneau de messages du dashboard donne à l'équipe une vue centralisée des dernières conversations.

**Why this priority**: La communication en contexte améliore la qualité du suivi, peut se déployer indépendamment des autres modules.

**Independent Test**: Envoyer un message en tant que client, vérifier qu'il apparaît pour l'équipe dans le fil de conversation et dans le panneau messages du dashboard.

**Acceptance Scenarios**:

1. **Given** un utilisateur (client ou équipe) sur la page projet, **When** il envoie un message, **Then** le message s'affiche dans le fil avec son nom, son rôle et l'horodatage
2. **Given** un admin sur le dashboard, **When** un client envoie un message, **Then** il apparaît dans le panneau Messages avec prévisualisation et date
3. **Given** un message client affiché, **When** l'admin y répond depuis le projet, **Then** le client voit la réponse dans son fil de conversation

---

### User Story 6 - Gestion globale des documents (Priority: P3)

L'équipe Proxiwave consulte, filtre et télécharge tous les documents de tous les projets depuis une vue centralisée. Les documents sont catégorisés, favorisables et téléchargeables depuis le stockage de fichiers réel.

**Why this priority**: Utile pour la gestion interne, non bloquant pour le suivi client.

**Independent Test**: Uploader des documents sur plusieurs projets, vérifier que la vue globale les affiche tous, tester les filtres, télécharger un fichier.

**Acceptance Scenarios**:

1. **Given** des documents sur plusieurs projets, **When** l'admin consulte la vue Documents, **Then** tous les documents sont affichés groupés par projet avec leurs métadonnées
2. **Given** la vue Documents, **When** l'admin filtre par catégorie, type ou recherche par nom, **Then** seuls les documents correspondants sont affichés
3. **Given** un document, **When** l'utilisateur clique sur télécharger, **Then** le fichier est téléchargé depuis le stockage de fichiers
4. **Given** un document, **When** l'utilisateur clique sur l'étoile, **Then** il est ajouté aux favoris et l'état est persisté

---

### Edge Cases

- Qu'arrive-t-il si un chef de projet tente d'accéder à l'URL d'un projet qui ne lui est pas assigné (même au sein de son client) ? → Redirection vers son dashboard avec message "accès non autorisé"
- Qu'arrive-t-il si un admin client ou chef de projet tente d'accéder à un projet d'un autre client ? → Redirection avec message "accès non autorisé" (aucune donnée du projet étranger ne doit être exposée, même partiellement)
- Qu'arrive-t-il si un projet n'a pas encore de tâches / sprints / documents ? → Affichage d'un état vide avec message d'invitation à créer du contenu
- Que se passe-t-il si la session expire pendant que l'utilisateur est actif ? → Redirection vers la page de connexion avec conservation de l'URL cible
- Que se passe-t-il si l'upload d'un document échoue (réseau, taille) ? → Message d'erreur explicite avec possibilité de réessayer
- Qu'arrive-t-il si un projet est supprimé par l'admin ? → Les clients qui y avaient accès ne le voient plus dans leur liste

---

## Requirements *(mandatory)*

### Functional Requirements

#### Authentification & Contrôle d'accès
- **FR-001**: Le système DOIT permettre la connexion via email et mot de passe
- **FR-002**: Le système DOIT gérer trois rôles distincts :
  - **Superadmin** (équipe Proxiwave) : vision 360 sur tous les clients et tous les projets, toutes actions de gestion
  - **Admin client** : accès en lecture + messages + idées sur tous les projets de son client ; peut gérer les utilisateurs de son client (créer, inviter, assigner)
  - **Chef de projet** : accès en lecture + messages + idées sur les projets qui lui sont explicitement assignés au sein de son client
- **FR-003**: Le système DOIT isoler les données par client — aucun utilisateur (admin client ou chef de projet) ne peut accéder aux projets ou données d'un autre client
- **FR-004**: Le système DOIT protéger toutes les pages du dashboard contre les accès non authentifiés avec redirection automatique
- **FR-005**: Le superadmin DOIT pouvoir créer des clients (organisations) et y rattacher des projets
- **FR-005b**: Le superadmin DOIT pouvoir créer des comptes admin client et des chefs de projet, et les rattacher à un client
- **FR-005c**: Un admin client DOIT pouvoir créer des chefs de projet au sein de son client et leur assigner des projets

#### Landing Page
- **FR-006**: La landing page DOIT être accessible publiquement sans authentification
- **FR-007**: Le formulaire de contact DOIT envoyer une notification par email à l'équipe Proxiwave à chaque soumission
- **FR-008**: La landing page DOIT proposer un lien/bouton "Se connecter" redirigeant vers la page de connexion

#### Dashboard & Projets
- **FR-009**: Le système DOIT afficher la liste des projets avec : nom, catégorie, statut, barre de progression, deadline et avatars équipe
- **FR-010**: Le système DOIT calculer et afficher les statistiques agrégées en temps réel (En cours, Terminés, À venir, Total)
- **FR-011**: Le système DOIT permettre de basculer entre vue grille et vue liste pour les projets
- **FR-012**: Le système DOIT permettre la recherche et le filtrage de projets depuis la barre de recherche
- **FR-013**: Les admins DOIVENT pouvoir créer un nouveau projet depuis le dashboard

#### Détail Projet
- **FR-014**: Le système DOIT afficher la progression globale du projet sous forme de jauge circulaire calculée depuis les données réelles
- **FR-015**: Le système DOIT afficher un diagramme de Gantt hebdomadaire avec toutes les tâches du projet
- **FR-016**: Chaque tâche DOIT contenir : titre, description, statut, priorité (haute/moyenne/basse), progression en %, assigné, sprint, dates de début/fin, sous-tâches, tags
- **FR-017**: Le système DOIT permettre l'affichage du panneau détail d'une tâche au clic (sous-tâches, priorité, assigné, sprint, dates, tags, progression)
- **FR-018**: Le système DOIT afficher les sprints avec leurs éléments, dates, progression et montant de facturation
- **FR-019**: Le système DOIT afficher le score de satisfaction client associé au projet
- **FR-020**: Le système DOIT afficher la barre de progression des livrables (livrées sur total)

#### Boîte à idées
- **FR-021**: Les clients DOIVENT pouvoir soumettre des idées depuis la page de leur projet
- **FR-022**: Les admins DOIVENT pouvoir changer le statut d'une idée (Nouvelle → En revue → Acceptée / Refusée)
- **FR-023**: Le système DOIT afficher les statistiques d'adoption des idées (compteurs par statut, taux d'adoption)

#### Messagerie
- **FR-024**: Les utilisateurs (client et équipe) DOIVENT pouvoir envoyer des messages dans le contexte d'un projet
- **FR-025**: Le système DOIT distinguer visuellement les messages clients (à gauche) des messages équipe (à droite)
- **FR-026**: Le panneau Messages du dashboard DOIT afficher les derniers messages de tous les projets avec prévisualisation

#### Documents
- **FR-027**: Les admins DOIVENT pouvoir uploader des documents, les associer à un projet et les catégoriser (Livrable, Spécification, Design, Rapport, Facture)
- **FR-028**: Le système DOIT permettre le téléchargement des documents depuis le stockage de fichiers
- **FR-029**: Le système DOIT permettre de marquer des documents comme favoris (état persisté)
- **FR-030**: La vue globale DOIT permettre de filtrer les documents par catégorie, type de fichier, projet et recherche textuelle

### Key Entities

- **Client (organisation)** : identifiant unique, nom, logo, projets associés, utilisateurs rattachés
- **Utilisateur** : identifiant unique, email, rôle (superadmin / admin_client / chef_de_projet), nom, initiales, couleur avatar, client associé (null pour superadmin), projets assignés (pour chef_de_projet)
- **Projet** : nom, catégorie, client associé, statut (en_cours/terminé/à_venir), progression globale, dates (début/fin), membres de l'équipe, score de satisfaction, budget total, budget consommé
- **Tâche** : titre, description, statut (validée/en_cours/livrée), priorité (haute/moyenne/basse), progression (%), semaine de début, durée en semaines, assigné, sprint associé, dates de début/fin, tags
- **Sous-tâche** : titre, état (fait/non fait), rattachée à une tâche
- **Sprint** : nom, statut (terminé/actif/à_venir), dates, progression, éléments, montant de facturation
- **Élément de sprint** : titre, statut (validé/en_cours/livré)
- **Idée** : titre, auteur, statut (nouvelle/en_revue/acceptée/refusée), date, projet associé
- **Message projet** : texte, auteur, date, projet associé, type (client/équipe)
- **Message dashboard** : expéditeur, prévisualisation, date, favori, projet associé
- **Document** : nom, type de fichier (pdf/figma/sheet/doc/image), catégorie, projet associé, auteur, date, taille, favori, URL de stockage
- **Entrée de contact** : nom, email, message, date de réception

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un utilisateur peut se connecter et accéder à son espace en moins de 10 secondes
- **SC-002**: Toutes les pages du dashboard se chargent avec les données en moins de 2 secondes sur une connexion standard
- **SC-003**: Aucun utilisateur client (admin_client ou chef_de_projet) ne peut jamais accéder aux données d'un autre client — zéro fuite inter-client (isolation par RLS Supabase)
- **SC-004**: Les données affichées sont toujours synchronisées avec la base de données après chaque action ou rechargement
- **SC-005**: Un admin peut créer un projet complet avec des tâches et des sprints en moins de 5 minutes
- **SC-006**: 100% des fonctionnalités du prototype (landing + dashboard + détail projet + documents) sont reproduites avec des données persistantes réelles
- **SC-007**: Le formulaire de contact déclenche une notification à l'équipe dans les 60 secondes suivant la soumission
- **SC-008**: Les documents uploadés sont disponibles au téléchargement immédiatement après l'upload

---

## Assumptions

- **A-001**: Un client (organisation) peut avoir plusieurs projets et plusieurs utilisateurs (admin_client et chef_de_projet)
- **A-001b**: Un chef de projet peut être assigné à plusieurs projets au sein du même client (relation plusieurs-à-plusieurs entre chef_de_projet et projet)
- **A-001c**: Un client peut avoir plusieurs admin_client ; chacun a accès à la totalité des projets de ce client
- **A-002**: Seul le superadmin peut créer des projets, des sprints, des tâches et uploader des documents ; les utilisateurs côté client (admin_client et chef_de_projet) ont un accès en lecture avec possibilité de soumettre des idées et des messages
- **A-003**: La landing page reste à contenu statique dans cette version ; une interface d'édition CMS n'est pas dans le périmètre
- **A-004**: Les notifications en temps réel (nouveau message, nouvelle idée) sont souhaitables mais optionnelles pour la v2 ; les données se rafraîchissent au rechargement de page ou via polling léger
- **A-005**: Le design du prototype est **validé et gelé** — UI/UX, palette pw-*, cream, warm-*, bento cards, layout, typographie, animations Framer Motion doivent être reproduits à l'identique. Aucune modification visuelle n'est dans le périmètre de v2.
- **A-005b**: La base de données cible est **Supabase Cloud** (project ref: `rteuevldfahmxsnafexa`). Avant toute migration, toutes les tables existantes et toutes les Edge Functions éventuelles doivent être supprimées.
- **A-006**: La création de comptes se fait via une interface admin (superadmin ou admin_client selon le niveau), sans workflow d'invitation par email automatique dans un premier temps
- **A-007**: Le stockage de fichiers (documents) utilise le service de stockage intégré à Supabase
