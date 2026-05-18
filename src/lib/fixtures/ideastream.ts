// IdeaStream — fixtures statiques pour le MVP lecture seule.
//
// Ces données peuplent les 4 écrans (Dashboard, Idea Wall, Idea Detail,
// Projects Overview) avant que le schéma DB IdeaStream soit déployé.
// Quand on basculera sur Supabase, ce fichier sera remplacé par des
// server actions / queries (et conservé comme jeu de tests).
//
// Contenu :
//   - 6 utilisateurs (1 admin + 2 clients + 3 team members)
//   - 5 catégories d'idées
//   - 12 idées dans des statuts variés
//   - 4 projets, 3 sprints
//   - 6 achievements + un profil "viewer" gamifié
//   - 10 entrées d'activity log (Community Pulse)

import type {
  Achievement,
  ActivityLogEntry,
  GamifiedProfile,
  Idea,
  IdeaArtifact,
  IdeaCategory,
  IdeaComment,
  IdeaStreamProject,
  IdeaStreamSprint,
  IdeaUser,
} from '@/types/ideastream';

// ============================================================
// Users
// ============================================================

export const fixtureUsers: IdeaUser[] = [
  {
    id: 'u-1',
    name: 'Sarah Chen',
    initials: 'SC',
    avatarColor: '#8127cf',
    isActive: true,
  },
  {
    id: 'u-2',
    name: 'Marcus Wright',
    initials: 'MW',
    avatarColor: '#3525cd',
  },
  {
    id: 'u-3',
    name: 'Alex Rivera',
    initials: 'AR',
    avatarColor: '#00534a',
    isActive: true,
  },
  {
    id: 'u-4',
    name: 'Sylvain Saillard',
    initials: 'SS',
    avatarColor: '#4f46e5',
    isActive: true,
  },
  {
    id: 'u-5',
    name: 'Léa Dumont',
    initials: 'LD',
    avatarColor: '#9c48ea',
  },
  {
    id: 'u-6',
    name: 'Team Alpha',
    initials: 'TA',
    avatarColor: '#006d62',
  },
];

/** Utilisateur "viewer" — celui qui consulte l'app (pour les "your idea"). */
export const fixtureViewer: GamifiedProfile = {
  ...fixtureUsers[3], // Sylvain
  email: 'sylvainsaillard@proxiwave.com',
  role: 'admin',
  xpPoints: 2450,
  level: 12,
  levelTitle: 'Visionary',
  nextLevelXp: 2900,
  currentStreak: 7,
  longestStreak: 14,
  badgesCount: 12,
  ideasContributed: 24,
  ideasApprovedLastMonth: 3,
};

// ============================================================
// Categories
// ============================================================

export const fixtureCategories: IdeaCategory[] = [
  { id: 'cat-1', slug: 'ui_ux', label: 'UI/UX', color: 'tertiary' },
  { id: 'cat-2', slug: 'backend', label: 'Backend', color: 'secondary' },
  { id: 'cat-3', slug: 'mobile', label: 'Mobile', color: 'tertiary' },
  {
    id: 'cat-4',
    slug: 'feature_request',
    label: 'Feature Request',
    color: 'tertiary',
  },
  {
    id: 'cat-5',
    slug: 'collaboration',
    label: 'Collaboration',
    color: 'secondary',
  },
];

const cat = (slug: string) =>
  fixtureCategories.find((c) => c.slug === slug) ?? fixtureCategories[0];

// ============================================================
// Projects & sprints (rôle secondaire)
// ============================================================

export const fixtureSprints: IdeaStreamSprint[] = [
  {
    id: 's-24',
    projectId: 'p-1',
    number: 24,
    name: 'Innovation Cycle #12',
    status: 'active',
    startDate: '2026-05-05',
    endDate: '2026-05-19',
    velocityScore: 78,
    ideasTotal: 6,
    ideasShipped: 4,
    tasksTotal: 18,
    tasksCompleted: 14,
  },
  {
    id: 's-25',
    projectId: 'p-1',
    number: 25,
    status: 'upcoming',
    startDate: '2026-05-20',
    endDate: '2026-06-03',
    velocityScore: 0,
    ideasTotal: 5,
    ideasShipped: 0,
    tasksTotal: 15,
    tasksCompleted: 0,
  },
  {
    id: 's-22',
    projectId: 'p-2',
    number: 22,
    status: 'completed',
    startDate: '2026-04-07',
    endDate: '2026-04-21',
    velocityScore: 92,
    ideasTotal: 8,
    ideasShipped: 8,
    tasksTotal: 24,
    tasksCompleted: 24,
  },
];

export const fixtureProjects: IdeaStreamProject[] = [
  {
    id: 'p-1',
    name: 'E-Commerce Redesign',
    description:
      'Overhauling the user journey for mobile-first shopping experiences with gamified loyalty loops.',
    category: 'Strategic',
    status: 'active',
    color: 'tertiary',
    progressPct: 80,
    teamMembers: [fixtureUsers[0], fixtureUsers[1], fixtureUsers[2]],
    activeSprint: fixtureSprints[0],
    deadline: '2026-06-30',
  },
  {
    id: 'p-2',
    name: 'AI Assistant Hub',
    description:
      'Integrating natural language processing for automated brainstorming summaries and tagging.',
    category: 'Internal',
    status: 'active',
    color: 'secondary',
    progressPct: 45,
    teamMembers: [fixtureUsers[3], fixtureUsers[4]],
    deadline: '2026-07-15',
  },
  {
    id: 'p-3',
    name: 'Market Expansion',
    description:
      'Preparing entry into European markets with localized billing and compliance frameworks.',
    category: 'Beta',
    status: 'active',
    color: 'primary',
    progressPct: 30,
    teamMembers: [fixtureUsers[0], fixtureUsers[4], fixtureUsers[5]],
    deadline: '2026-09-01',
  },
  {
    id: 'p-4',
    name: 'Sprint Engine v2',
    description:
      'Refactoring the velocity engine to support continuous delivery with auto-recalibration.',
    category: 'Core',
    status: 'active',
    color: 'tertiary',
    progressPct: 65,
    teamMembers: [fixtureUsers[1], fixtureUsers[2], fixtureUsers[5]],
    deadline: '2026-08-10',
  },
];

const sprintRef = (id: string) => {
  const s = fixtureSprints.find((x) => x.id === id);
  if (!s) return undefined;
  return { id: s.id, number: s.number, status: s.status };
};

const projectRef = (id: string) => {
  const p = fixtureProjects.find((x) => x.id === id);
  if (!p) return undefined;
  return { id: p.id, name: p.name, category: p.category };
};

// ============================================================
// Ideas
// ============================================================

export const fixtureIdeas: Idea[] = [
  {
    id: 'i-1',
    title: 'AI-Powered Roadmap Generator',
    description:
      'Automatically generate visual project roadmaps from natural language idea prompts using our new neural pipeline.',
    category: cat('feature_request'),
    status: 'in_dev',
    author: fixtureUsers[0],
    contributors: [fixtureUsers[1], fixtureUsers[2], fixtureUsers[3]],
    upvotesCount: 128,
    commentsCount: 14,
    project: projectRef('p-2'),
    sprint: sprintRef('s-24'),
    estimatedDelivery: '2026-06-12',
    createdAt: '2026-05-15T09:32:00Z',
    hasUserVoted: true,
    isTrending: true,
  },
  {
    id: 'i-2',
    title: 'Closed-Loop Logistics Hub',
    description:
      'Implementing a reusable packaging ecosystem for sub-1km deliveries to reduce waste.',
    category: cat('feature_request'),
    status: 'in_dev',
    author: fixtureUsers[1],
    contributors: [fixtureUsers[0], fixtureUsers[4]],
    upvotesCount: 212,
    commentsCount: 21,
    project: projectRef('p-1'),
    sprint: sprintRef('s-24'),
    createdAt: '2026-05-10T14:11:00Z',
    hasUserVoted: false,
    isTrending: true,
  },
  {
    id: 'i-3',
    title: 'Skill-Swapping Marketplace',
    description:
      'A platform for employees to trade skills outside their expertise — Coding, Design, Strategy.',
    category: cat('collaboration'),
    status: 'approved',
    author: fixtureUsers[2],
    contributors: [fixtureUsers[3], fixtureUsers[5]],
    upvotesCount: 89,
    commentsCount: 9,
    project: projectRef('p-4'),
    sprint: sprintRef('s-25'),
    createdAt: '2026-05-08T11:48:00Z',
    hasUserVoted: false,
    isTrending: true,
  },
  {
    id: 'i-4',
    title: 'Neural Sync Design Review',
    description:
      "Use AI to suggest and synthesize design feedback across all reviewers in one consolidated stream.",
    category: cat('ui_ux'),
    status: 'shipped',
    author: fixtureUsers[3],
    contributors: [fixtureUsers[0], fixtureUsers[1]],
    upvotesCount: 176,
    commentsCount: 32,
    project: projectRef('p-2'),
    shippedAt: '2026-04-22',
    createdAt: '2026-03-01T10:00:00Z',
    hasUserVoted: true,
  },
  {
    id: 'i-5',
    title: 'Real-time Collaborative Whiteboard',
    description:
      'Allow multiple users to sketch and brainstorm together with low-latency cursor sync.',
    category: cat('ui_ux'),
    status: 'approved',
    author: fixtureUsers[4],
    contributors: [fixtureUsers[0], fixtureUsers[2], fixtureUsers[3]],
    upvotesCount: 142,
    commentsCount: 18,
    project: projectRef('p-1'),
    sprint: sprintRef('s-24'),
    createdAt: '2026-05-12T08:23:00Z',
    hasUserVoted: false,
  },
  {
    id: 'i-6',
    title: 'AI-Driven Sentiment Analysis for Feedback',
    description:
      'Automatically categorize customer feedback into sentiment buckets and route to the right team.',
    category: cat('backend'),
    status: 'sandbox',
    author: fixtureUsers[5],
    contributors: [],
    upvotesCount: 67,
    commentsCount: 5,
    createdAt: '2026-05-16T15:50:00Z',
    hasUserVoted: false,
  },
  {
    id: 'i-7',
    title: 'Offline Cache for Mobile Ideation',
    description:
      'Ensure users can record ideas even without network — sync on reconnect with conflict resolution.',
    category: cat('mobile'),
    status: 'shipped',
    author: fixtureUsers[1],
    contributors: [fixtureUsers[0], fixtureUsers[3], fixtureUsers[4]],
    upvotesCount: 245,
    commentsCount: 27,
    project: projectRef('p-1'),
    shippedAt: '2026-04-15',
    createdAt: '2026-02-14T12:00:00Z',
    hasUserVoted: true,
  },
  {
    id: 'i-8',
    title: 'Dynamic Bento Grid Layouts',
    description:
      'Implement a responsive masonry-style layout with smart card sizing based on content density.',
    category: cat('ui_ux'),
    status: 'in_dev',
    author: fixtureUsers[2],
    contributors: [fixtureUsers[4], fixtureUsers[5]],
    upvotesCount: 98,
    commentsCount: 11,
    project: projectRef('p-2'),
    sprint: sprintRef('s-25'),
    estimatedDelivery: '2026-06-20',
    createdAt: '2026-05-09T07:15:00Z',
    hasUserVoted: false,
  },
  {
    id: 'i-9',
    title: 'Role-Based Permissions',
    description:
      'Granular access control for external stakeholders and client observers on specific projects.',
    category: cat('backend'),
    status: 'approved',
    author: fixtureUsers[0],
    contributors: [fixtureUsers[1]],
    upvotesCount: 45,
    commentsCount: 7,
    project: projectRef('p-3'),
    sprint: sprintRef('s-25'),
    createdAt: '2026-05-11T16:42:00Z',
    hasUserVoted: false,
  },
  {
    id: 'i-10',
    title: 'Advanced Data Export',
    description:
      'Export idea analytics and roadmaps directly to PowerPoint, PDF, or interactive CSV reports.',
    category: cat('feature_request'),
    status: 'in_dev',
    author: fixtureUsers[3],
    contributors: [fixtureUsers[2]],
    upvotesCount: 176,
    commentsCount: 13,
    project: projectRef('p-4'),
    sprint: sprintRef('s-24'),
    estimatedDelivery: '2026-06-05',
    createdAt: '2026-05-07T13:28:00Z',
    hasUserVoted: true,
  },
  {
    id: 'i-11',
    title: 'AI-Powered Sprint Retrospective Analyzer',
    description:
      'A machine learning integration that parses anonymous team feedback from retro sessions to identify recurring friction points. By analyzing sentiment and keyword frequency across historical data, the system can surface blockers proactively.',
    category: cat('collaboration'),
    status: 'approved',
    author: fixtureUsers[0],
    contributors: [fixtureUsers[1], fixtureUsers[2]],
    upvotesCount: 128,
    commentsCount: 8,
    project: projectRef('p-2'),
    sprint: sprintRef('s-24'),
    estimatedDelivery: '2026-06-12',
    complexityScore: 8,
    createdAt: '2026-05-16T08:00:00Z',
    hasUserVoted: false,
  },
  {
    id: 'i-12',
    title: 'Neural-Feedback Rewards for Collaborative Sprint Cycles',
    description:
      'Integrate a bio-feedback loop into the PM tool to reward deep work states and consistent peer review contributions with dynamic team-tier upgrades.',
    category: cat('collaboration'),
    status: 'approved',
    author: fixtureUsers[2],
    contributors: [fixtureUsers[3], fixtureUsers[5]],
    upvotesCount: 142,
    commentsCount: 12,
    project: projectRef('p-2'),
    sprint: sprintRef('s-24'),
    estimatedDelivery: '2026-06-12',
    complexityScore: 8,
    createdAt: '2026-05-14T10:15:00Z',
    hasUserVoted: false,
  },
];

/** Sous-ensemble Trending pour la Dashboard. */
export const fixtureTrendingIdeas = fixtureIdeas.filter((i) => i.isTrending);

// ============================================================
// Idea detail satellites
// ============================================================

export const fixtureArtifactsByIdea: Record<string, IdeaArtifact[]> = {
  'i-12': [
    {
      id: 'a-1',
      ideaId: 'i-12',
      uploader: fixtureUsers[2],
      name: 'Engine_v1.2_Mockups.fig',
      fileType: 'figma',
      url: 'https://figma.com/file/example',
      fileSize: 1_842_000,
      createdAt: '2026-05-15T09:00:00Z',
    },
    {
      id: 'a-2',
      ideaId: 'i-12',
      uploader: fixtureUsers[0],
      name: 'Engagement_Flow_Diagram.pdf',
      fileType: 'pdf',
      url: '/storage/example.pdf',
      fileSize: 612_000,
      createdAt: '2026-05-15T11:30:00Z',
    },
  ],
};

export const fixtureCommentsByIdea: Record<string, IdeaComment[]> = {
  'i-12': [
    {
      id: 'c-1',
      ideaId: 'i-12',
      author: fixtureUsers[0],
      content:
        "The neuro-feedback loop concept is brilliant. Could we integrate it with the existing Slack notifications for real-time streaks?",
      createdAt: '2026-05-16T10:30:00Z',
      replies: [
        {
          id: 'c-1-1',
          ideaId: 'i-12',
          author: fixtureUsers[1],
          parentId: 'c-1',
          content:
            "Already exploring the API hooks for this. It seems feasible for the Q3 release.",
          createdAt: '2026-05-16T11:15:00Z',
        },
      ],
    },
  ],
};

// ============================================================
// Achievements
// ============================================================

export const fixtureAchievements: Achievement[] = [
  {
    id: 'ach-1',
    slug: 'first_implementation',
    name: 'First Implementation',
    description: 'Voted MVS ranked Innovator: Brainstorm.',
    icon: 'Rocket',
    color: 'secondary',
    unlockedAt: '2026-04-02T08:00:00Z',
  },
  {
    id: 'ach-2',
    slug: 'thought_leader',
    name: 'Thought Leader',
    description: 'Gained 1000 upvotes on initial ideation.',
    icon: 'Crown',
    color: 'secondary',
    unlockedAt: '2026-04-22T16:00:00Z',
  },
  {
    id: 'ach-3',
    slug: 'team_player',
    name: 'Team Player',
    description: 'Commented on 50 different ideas.',
    icon: 'Users',
    color: 'tertiary',
    unlockedAt: '2026-05-01T12:00:00Z',
  },
  {
    id: 'ach-4',
    slug: 'fast_starter',
    name: 'Fast Starter',
    description: 'Created 5 ideas in your first week.',
    icon: 'Zap',
    color: 'secondary',
    unlockedAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'ach-5',
    slug: 'collaborator',
    name: 'Collaborator',
    description: 'Comment on 50 different ideas.',
    icon: 'MessageCircle',
    color: 'neutral',
  },
  {
    id: 'ach-6',
    slug: 'visionary',
    name: 'Visionary',
    description: 'Reach Level 12 — Visionary tier.',
    icon: 'Sparkles',
    color: 'primary',
    unlockedAt: '2026-05-12T14:30:00Z',
  },
];

// ============================================================
// Activity log — Community Pulse
// ============================================================

export const fixtureActivityLog: ActivityLogEntry[] = [
  {
    id: 'al-1',
    actor: fixtureUsers[5], // Team Alpha
    verb: 'reached_streak',
    metadata: { streakDays: 18 },
    createdAt: '2026-05-18T18:30:00Z',
  },
  {
    id: 'al-2',
    actor: fixtureUsers[4], // Léa
    verb: 'created_idea',
    targetIdeaTitle: 'Strategy Lab',
    createdAt: '2026-05-18T17:45:00Z',
  },
  {
    id: 'al-3',
    actor: fixtureUsers[0], // Sarah
    verb: 'commented',
    targetIdeaTitle: 'Vertical Farming Pods',
    targetUser: fixtureViewer,
    createdAt: '2026-05-18T16:20:00Z',
  },
  {
    id: 'al-4',
    actor: fixtureUsers[2], // Alex
    verb: 'upvoted',
    targetIdeaTitle: 'Smart Tags',
    targetUser: fixtureViewer,
    createdAt: '2026-05-18T15:10:00Z',
  },
  {
    id: 'al-5',
    actor: fixtureUsers[5], // Team Alpha
    verb: 'reached_xp_milestone',
    metadata: { points: 1000 },
    createdAt: '2026-05-18T14:00:00Z',
  },
  {
    id: 'al-6',
    actor: fixtureUsers[1], // Marcus
    verb: 'shipped_idea',
    targetIdeaTitle: 'Offline Cache for Mobile Ideation',
    createdAt: '2026-05-18T11:30:00Z',
  },
  {
    id: 'al-7',
    actor: fixtureUsers[3], // Sylvain
    verb: 'unlocked_achievement',
    metadata: { achievementName: 'Visionary' },
    createdAt: '2026-05-18T09:15:00Z',
  },
  {
    id: 'al-8',
    actor: fixtureUsers[0], // Sarah
    verb: 'approved_idea',
    targetIdeaTitle: 'Role-Based Permissions',
    createdAt: '2026-05-17T20:45:00Z',
  },
  {
    id: 'al-9',
    actor: fixtureUsers[4], // Léa
    verb: 'upvoted',
    targetIdeaTitle: 'Closed-Loop Logistics Hub',
    createdAt: '2026-05-17T18:30:00Z',
  },
  {
    id: 'al-10',
    actor: fixtureUsers[2], // Alex
    verb: 'commented',
    targetIdeaTitle: 'AI-Powered Roadmap Generator',
    createdAt: '2026-05-17T16:00:00Z',
  },
];
