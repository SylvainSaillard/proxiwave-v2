export interface Idea {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  status: 'new' | 'reviewing' | 'accepted' | 'rejected';
  date: string;
}

export interface SprintItem {
  id: string;
  title: string;
  status: 'validated' | 'in_progress' | 'delivered';
}

export interface Sprint {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'upcoming';
  startDate: string;
  endDate: string;
  progress: number;
  items: SprintItem[];
  invoiceAmount: string;
}

export interface Deliverable {
  id: string;
  title: string;
  date: string;
  sprint: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'figma' | 'sheet' | 'doc';
  date: string;
  size: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'validated' | 'in_progress' | 'delivered';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  startWeek: number;
  durationWeeks: number;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  sprint: string;
  startDate: string;
  endDate: string;
  subtasks: Subtask[];
  tags: string[];
}

export interface ProjectMessage {
  id: string;
  sender: string;
  senderInitials: string;
  senderColor: string;
  text: string;
  date: string;
  isClient: boolean;
}

export interface ProjectDetail {
  id: string;
  name: string;
  category: string;
  client: string;
  overallProgress: number;
  daysRemaining: number;
  totalBudget: number;
  budgetUsed: number;
  satisfactionScore: number;
  ideasCount: number;
  validatedCount: number;
  inProgressCount: number;
  deliveredCount: number;
  totalTaskCount: number;
  messagesCount: number;
  ideas: Idea[];
  sprints: Sprint[];
  deliverables: Deliverable[];
  documents: Document[];
  tasks: Task[];
  projectMessages: ProjectMessage[];
}

export const projectDetails: Record<string, ProjectDetail> = {
  p1: {
    id: 'p1',
    name: 'Automatisation Reporting',
    category: 'Cabinet de conseil',
    client: 'Dupont & Associés',
    overallProgress: 90,
    daysRemaining: 2,
    totalBudget: 45000,
    budgetUsed: 40500,
    satisfactionScore: 4.8,
    ideasCount: 8,
    validatedCount: 12,
    inProgressCount: 2,
    deliveredCount: 14,
    totalTaskCount: 18,
    messagesCount: 6,
    ideas: [
      { id: 'i1', title: 'Ajouter un export Excel automatique', author: 'Marie Dupont', authorInitials: 'MD', authorColor: 'bg-pw-400', status: 'accepted', date: '15 Jan.' },
      { id: 'i2', title: 'Notification Slack quand un rapport est prêt', author: 'Jean Leroy', authorInitials: 'JL', authorColor: 'bg-sky-400', status: 'reviewing', date: '18 Jan.' },
      { id: 'i3', title: 'Dashboard récapitulatif mensuel', author: 'Marie Dupont', authorInitials: 'MD', authorColor: 'bg-pw-400', status: 'accepted', date: '10 Jan.' },
      { id: 'i4', title: 'Intégration calendrier Google', author: 'Sophie Martin', authorInitials: 'SM', authorColor: 'bg-pw-600', status: 'new', date: '20 Jan.' },
      { id: 'i5', title: 'Résumé IA des rapports longs', author: 'Jean Leroy', authorInitials: 'JL', authorColor: 'bg-sky-400', status: 'accepted', date: '8 Jan.' },
    ],
    sprints: [
      {
        id: 's1',
        name: 'Sprint 1',
        status: 'completed',
        startDate: '2 Jan.',
        endDate: '16 Jan.',
        progress: 100,
        items: [
          { id: 'si1', title: 'Analyse des process existants', status: 'delivered' },
          { id: 'si2', title: 'Connexion aux sources de données', status: 'delivered' },
          { id: 'si3', title: 'Template rapport automatisé v1', status: 'delivered' },
          { id: 'si4', title: 'Tests avec données réelles', status: 'delivered' },
        ],
        invoiceAmount: '15 000 €',
      },
      {
        id: 's2',
        name: 'Sprint 2',
        status: 'completed',
        startDate: '17 Jan.',
        endDate: '31 Jan.',
        progress: 100,
        items: [
          { id: 'si5', title: 'Export multi-formats (PDF, Excel)', status: 'delivered' },
          { id: 'si6', title: 'Planification automatique', status: 'delivered' },
          { id: 'si7', title: 'Personnalisation par consultant', status: 'delivered' },
          { id: 'si8', title: 'Formation équipe pilote', status: 'delivered' },
        ],
        invoiceAmount: '15 000 €',
      },
      {
        id: 's3',
        name: 'Sprint 3',
        status: 'active',
        startDate: '1 Fév.',
        endDate: '14 Fév.',
        progress: 65,
        items: [
          { id: 'si9', title: 'Résumé IA des rapports', status: 'delivered' },
          { id: 'si10', title: 'Notification Slack', status: 'in_progress' },
          { id: 'si11', title: 'Dashboard récapitulatif', status: 'in_progress' },
          { id: 'si12', title: 'Déploiement final', status: 'validated' },
        ],
        invoiceAmount: '15 000 €',
      },
    ],
    deliverables: [
      { id: 'd1', title: 'Rapport automatisé v1', date: '14 Jan.', sprint: 'Sprint 1' },
      { id: 'd2', title: 'Export multi-formats', date: '28 Jan.', sprint: 'Sprint 2' },
      { id: 'd3', title: 'Planification auto', date: '30 Jan.', sprint: 'Sprint 2' },
      { id: 'd4', title: 'Résumé IA', date: '5 Fév.', sprint: 'Sprint 3' },
    ],
    documents: [
      { id: 'doc1', name: 'Cahier des charges v2.pdf', type: 'pdf', date: '3 Jan.', size: '2.4 Mo' },
      { id: 'doc2', name: 'Maquettes Figma', type: 'figma', date: '8 Jan.', size: 'Lien' },
      { id: 'doc3', name: 'Suivi budget.xlsx', type: 'sheet', date: '20 Jan.', size: '156 Ko' },
      { id: 'doc4', name: 'PV de recette Sprint 2.pdf', type: 'pdf', date: '31 Jan.', size: '890 Ko' },
    ],
    tasks: [
      {
        id: 't1', title: 'Analyse des process', description: 'Cartographie complète des processus de reporting existants : flux de données, outils utilisés, points de friction et opportunités d\'automatisation.',
        status: 'delivered', priority: 'high', progress: 100, startWeek: 1, durationWeeks: 1,
        assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500',
        sprint: 'Sprint 1', startDate: '2 Jan.', endDate: '8 Jan.',
        subtasks: [
          { id: 'st1', title: 'Interviews équipe reporting', done: true },
          { id: 'st2', title: 'Mapping des flux de données', done: true },
          { id: 'st3', title: 'Rapport d\'audit', done: true },
        ],
        tags: ['Audit', 'Stratégie'],
      },
      {
        id: 't2', title: 'Connexion données', description: 'Mise en place des connecteurs API vers les sources de données (CRM, ERP, Google Sheets) avec authentification sécurisée et synchronisation planifiée.',
        status: 'delivered', priority: 'high', progress: 100, startWeek: 1, durationWeeks: 2,
        assignee: 'Marc R.', assigneeInitials: 'MR', assigneeColor: 'bg-sky-400',
        sprint: 'Sprint 1', startDate: '2 Jan.', endDate: '16 Jan.',
        subtasks: [
          { id: 'st4', title: 'Connecteur CRM Salesforce', done: true },
          { id: 'st5', title: 'Connecteur ERP interne', done: true },
          { id: 'st6', title: 'Synchro Google Sheets', done: true },
          { id: 'st7', title: 'Tests d\'intégration', done: true },
        ],
        tags: ['Backend', 'API'],
      },
      {
        id: 't3', title: 'Template rapport v1', description: 'Création du premier template de rapport automatisé avec mise en page professionnelle, graphiques dynamiques et insertion automatique des KPIs.',
        status: 'delivered', priority: 'medium', progress: 100, startWeek: 2, durationWeeks: 2,
        assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500',
        sprint: 'Sprint 1', startDate: '9 Jan.', endDate: '22 Jan.',
        subtasks: [
          { id: 'st8', title: 'Maquette du template', done: true },
          { id: 'st9', title: 'Intégration des graphiques', done: true },
          { id: 'st10', title: 'Validation client', done: true },
        ],
        tags: ['Design', 'Frontend'],
      },
      {
        id: 't4', title: 'Export multi-formats', description: 'Développement du système d\'export en PDF, Excel et PowerPoint avec options de personnalisation (logo, couleurs, sections).',
        status: 'delivered', priority: 'medium', progress: 100, startWeek: 3, durationWeeks: 2,
        assignee: 'Marc R.', assigneeInitials: 'MR', assigneeColor: 'bg-sky-400',
        sprint: 'Sprint 2', startDate: '16 Jan.', endDate: '29 Jan.',
        subtasks: [
          { id: 'st11', title: 'Export PDF', done: true },
          { id: 'st12', title: 'Export Excel', done: true },
          { id: 'st13', title: 'Export PowerPoint', done: true },
          { id: 'st14', title: 'Options de personnalisation', done: true },
        ],
        tags: ['Backend', 'Export'],
      },
      {
        id: 't5', title: 'Planification auto', description: 'Mise en place de la planification automatique des rapports avec cron jobs, gestion des fuseaux horaires et notifications de livraison.',
        status: 'delivered', priority: 'low', progress: 100, startWeek: 4, durationWeeks: 1,
        assignee: 'Jean P.', assigneeInitials: 'JP', assigneeColor: 'bg-pw-300',
        sprint: 'Sprint 2', startDate: '23 Jan.', endDate: '29 Jan.',
        subtasks: [
          { id: 'st15', title: 'Scheduler cron', done: true },
          { id: 'st16', title: 'Gestion fuseaux horaires', done: true },
          { id: 'st17', title: 'Email de confirmation', done: true },
        ],
        tags: ['Backend', 'Automation'],
      },
      {
        id: 't6', title: 'Résumé IA rapports', description: 'Intégration d\'un modèle IA pour générer automatiquement un résumé exécutif de chaque rapport avec les points clés et recommandations.',
        status: 'delivered', priority: 'high', progress: 100, startWeek: 5, durationWeeks: 1,
        assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500',
        sprint: 'Sprint 3', startDate: '1 Fév.', endDate: '7 Fév.',
        subtasks: [
          { id: 'st18', title: 'Prompt engineering', done: true },
          { id: 'st19', title: 'Intégration API OpenAI', done: true },
          { id: 'st20', title: 'Tests de qualité', done: true },
        ],
        tags: ['IA', 'NLP'],
      },
      {
        id: 't7', title: 'Notification Slack', description: 'Développement du bot Slack pour notifier l\'équipe à chaque nouveau rapport généré, avec preview intégrée et bouton d\'accès direct.',
        status: 'in_progress', priority: 'medium', progress: 60, startWeek: 5, durationWeeks: 2,
        assignee: 'Marc R.', assigneeInitials: 'MR', assigneeColor: 'bg-sky-400',
        sprint: 'Sprint 3', startDate: '1 Fév.', endDate: '14 Fév.',
        subtasks: [
          { id: 'st21', title: 'Bot Slack setup', done: true },
          { id: 'st22', title: 'Template de notification', done: true },
          { id: 'st23', title: 'Preview du rapport dans Slack', done: false },
          { id: 'st24', title: 'Bouton d\'accès direct', done: false },
        ],
        tags: ['Intégration', 'Slack'],
      },
      {
        id: 't8', title: 'Dashboard récap', description: 'Création d\'un dashboard récapitulatif mensuel avec vue d\'ensemble des rapports générés, tendances et métriques clés.',
        status: 'in_progress', priority: 'medium', progress: 35, startWeek: 6, durationWeeks: 2,
        assignee: 'Jean P.', assigneeInitials: 'JP', assigneeColor: 'bg-pw-300',
        sprint: 'Sprint 3', startDate: '8 Fév.', endDate: '21 Fév.',
        subtasks: [
          { id: 'st25', title: 'Wireframes dashboard', done: true },
          { id: 'st26', title: 'Composants graphiques', done: false },
          { id: 'st27', title: 'Filtres et interactions', done: false },
          { id: 'st28', title: 'Responsive mobile', done: false },
        ],
        tags: ['Frontend', 'Dashboard'],
      },
      {
        id: 't9', title: 'Déploiement final', description: 'Déploiement en production avec migration des données, configuration DNS, monitoring et documentation de mise en service.',
        status: 'validated', priority: 'high', progress: 0, startWeek: 7, durationWeeks: 1,
        assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500',
        sprint: 'Sprint 3', startDate: '15 Fév.', endDate: '21 Fév.',
        subtasks: [
          { id: 'st29', title: 'Configuration production', done: false },
          { id: 'st30', title: 'Migration données', done: false },
          { id: 'st31', title: 'Tests de charge', done: false },
          { id: 'st32', title: 'Documentation', done: false },
        ],
        tags: ['DevOps', 'Production'],
      },
    ],
    projectMessages: [
      { id: 'pm1', sender: 'Marie Dupont', senderInitials: 'MD', senderColor: 'bg-pw-400', text: 'Les rapports automatisés fonctionnent très bien, merci !', date: '10 Fév.', isClient: true },
      { id: 'pm2', sender: 'Sophie L.', senderInitials: 'SL', senderColor: 'bg-pw-500', text: 'On avance sur la notification Slack, livraison prévue en fin de semaine.', date: '9 Fév.', isClient: false },
      { id: 'pm3', sender: 'Jean Leroy', senderInitials: 'JL', senderColor: 'bg-sky-400', text: 'Est-ce qu\'on pourrait ajouter un filtre par date sur le dashboard ?', date: '8 Fév.', isClient: true },
      { id: 'pm4', sender: 'Marc R.', senderInitials: 'MR', senderColor: 'bg-sky-400', text: 'Bonne idée, je note ça dans les améliorations futures.', date: '8 Fév.', isClient: false },
      { id: 'pm5', sender: 'Marie Dupont', senderInitials: 'MD', senderColor: 'bg-pw-400', text: 'La formation de l\'équipe pilote s\'est super bien passée !', date: '5 Fév.', isClient: true },
      { id: 'pm6', sender: 'Sophie L.', senderInitials: 'SL', senderColor: 'bg-pw-500', text: 'Parfait, n\'hésitez pas si vous avez des questions.', date: '5 Fév.', isClient: false },
    ],
  },
  p2: {
    id: 'p2',
    name: 'Chatbot Interne',
    category: 'Support client',
    client: 'TechVision SAS',
    overallProgress: 30,
    daysRemaining: 21,
    totalBudget: 32000,
    budgetUsed: 9600,
    satisfactionScore: 4.5,
    ideasCount: 5,
    validatedCount: 6,
    inProgressCount: 4,
    deliveredCount: 3,
    totalTaskCount: 7,
    messagesCount: 4,
    ideas: [
      { id: 'i6', title: 'Réponses multilingues', author: 'Luc Bernard', authorInitials: 'LB', authorColor: 'bg-sky-300', status: 'new', date: '19 Jan.' },
      { id: 'i7', title: 'Escalade vers humain automatique', author: 'Anna Chen', authorInitials: 'AC', authorColor: 'bg-pw-400', status: 'accepted', date: '16 Jan.' },
      { id: 'i8', title: 'FAQ dynamique', author: 'Luc Bernard', authorInitials: 'LB', authorColor: 'bg-sky-300', status: 'reviewing', date: '20 Jan.' },
    ],
    sprints: [
      {
        id: 's4',
        name: 'Sprint 1',
        status: 'active',
        startDate: '5 Jan.',
        endDate: '19 Jan.',
        progress: 60,
        items: [
          { id: 'si13', title: 'Base de connaissances', status: 'delivered' },
          { id: 'si14', title: 'Moteur de réponses IA', status: 'delivered' },
          { id: 'si15', title: 'Interface chat', status: 'in_progress' },
          { id: 'si16', title: 'Tests utilisateurs', status: 'validated' },
        ],
        invoiceAmount: '16 000 €',
      },
      {
        id: 's5',
        name: 'Sprint 2',
        status: 'upcoming',
        startDate: '20 Jan.',
        endDate: '2 Fév.',
        progress: 0,
        items: [
          { id: 'si17', title: 'Escalade humaine', status: 'validated' },
          { id: 'si18', title: 'Analytics conversations', status: 'validated' },
          { id: 'si19', title: 'Déploiement production', status: 'validated' },
        ],
        invoiceAmount: '16 000 €',
      },
    ],
    deliverables: [
      { id: 'd5', title: 'Base de connaissances IA', date: '10 Jan.', sprint: 'Sprint 1' },
      { id: 'd6', title: 'Moteur de réponses v1', date: '14 Jan.', sprint: 'Sprint 1' },
    ],
    documents: [
      { id: 'doc5', name: 'Brief chatbot.pdf', type: 'pdf', date: '4 Jan.', size: '1.8 Mo' },
      { id: 'doc6', name: 'Arborescence conversations.doc', type: 'doc', date: '9 Jan.', size: '340 Ko' },
    ],
    tasks: [
      {
        id: 't10', title: 'Base de connaissances', description: 'Construction de la base de connaissances à partir de la documentation interne, FAQ existantes et tickets de support passés.',
        status: 'delivered', priority: 'high', progress: 100, startWeek: 1, durationWeeks: 2,
        assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400',
        sprint: 'Sprint 1', startDate: '5 Jan.', endDate: '19 Jan.',
        subtasks: [
          { id: 'st33', title: 'Import documentation', done: true },
          { id: 'st34', title: 'Indexation vectorielle', done: true },
          { id: 'st35', title: 'Tests de recherche', done: true },
        ],
        tags: ['IA', 'Data'],
      },
      {
        id: 't11', title: 'Moteur réponses IA', description: 'Développement du moteur de réponses basé sur RAG avec gestion du contexte conversationnel et des réponses structurées.',
        status: 'delivered', priority: 'high', progress: 100, startWeek: 1, durationWeeks: 2,
        assignee: 'Luc B.', assigneeInitials: 'LB', assigneeColor: 'bg-sky-300',
        sprint: 'Sprint 1', startDate: '5 Jan.', endDate: '19 Jan.',
        subtasks: [
          { id: 'st36', title: 'Pipeline RAG', done: true },
          { id: 'st37', title: 'Gestion du contexte', done: true },
          { id: 'st38', title: 'Tests qualité réponses', done: true },
        ],
        tags: ['IA', 'Backend'],
      },
      {
        id: 't12', title: 'Interface chat', description: 'Interface de chat responsive avec bulles de conversation, indicateur de frappe, suggestions de questions et historique.',
        status: 'in_progress', priority: 'medium', progress: 55, startWeek: 2, durationWeeks: 2,
        assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400',
        sprint: 'Sprint 1', startDate: '12 Jan.', endDate: '26 Jan.',
        subtasks: [
          { id: 'st39', title: 'Composant chat', done: true },
          { id: 'st40', title: 'Suggestions de questions', done: true },
          { id: 'st41', title: 'Historique conversations', done: false },
          { id: 'st42', title: 'Responsive mobile', done: false },
        ],
        tags: ['Frontend', 'UX'],
      },
      {
        id: 't13', title: 'Tests utilisateurs', description: 'Sessions de tests avec 10 utilisateurs pilotes pour valider la pertinence des réponses et l\'ergonomie de l\'interface.',
        status: 'in_progress', priority: 'medium', progress: 20, startWeek: 3, durationWeeks: 1,
        assignee: 'Luc B.', assigneeInitials: 'LB', assigneeColor: 'bg-sky-300',
        sprint: 'Sprint 1', startDate: '19 Jan.', endDate: '26 Jan.',
        subtasks: [
          { id: 'st43', title: 'Recrutement testeurs', done: true },
          { id: 'st44', title: 'Sessions de test', done: false },
          { id: 'st45', title: 'Rapport de feedback', done: false },
        ],
        tags: ['QA', 'UX Research'],
      },
      {
        id: 't14', title: 'Escalade humaine', description: 'Système d\'escalade automatique vers un agent humain quand le chatbot ne peut pas répondre, avec transfert de contexte.',
        status: 'validated', priority: 'high', progress: 0, startWeek: 4, durationWeeks: 2,
        assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400',
        sprint: 'Sprint 2', startDate: '26 Jan.', endDate: '9 Fév.',
        subtasks: [
          { id: 'st46', title: 'Détection de frustration', done: false },
          { id: 'st47', title: 'Transfert de contexte', done: false },
          { id: 'st48', title: 'Interface agent', done: false },
        ],
        tags: ['Backend', 'IA'],
      },
      {
        id: 't15', title: 'Analytics conversations', description: 'Dashboard d\'analytics avec métriques de satisfaction, taux de résolution, sujets fréquents et tendances.',
        status: 'validated', priority: 'low', progress: 0, startWeek: 4, durationWeeks: 2,
        assignee: 'Luc B.', assigneeInitials: 'LB', assigneeColor: 'bg-sky-300',
        sprint: 'Sprint 2', startDate: '26 Jan.', endDate: '9 Fév.',
        subtasks: [
          { id: 'st49', title: 'Collecte de métriques', done: false },
          { id: 'st50', title: 'Dashboard analytics', done: false },
          { id: 'st51', title: 'Exports de données', done: false },
        ],
        tags: ['Analytics', 'Frontend'],
      },
      {
        id: 't16', title: 'Déploiement production', description: 'Déploiement final en production avec configuration du domaine, SSL, monitoring et documentation utilisateur.',
        status: 'validated', priority: 'high', progress: 0, startWeek: 6, durationWeeks: 1,
        assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400',
        sprint: 'Sprint 2', startDate: '9 Fév.', endDate: '16 Fév.',
        subtasks: [
          { id: 'st52', title: 'Setup production', done: false },
          { id: 'st53', title: 'Documentation', done: false },
          { id: 'st54', title: 'Formation équipe', done: false },
        ],
        tags: ['DevOps', 'Production'],
      },
    ],
    projectMessages: [
      { id: 'pm7', sender: 'Luc Bernard', senderInitials: 'LB', senderColor: 'bg-sky-300', text: 'Le moteur de réponses est vraiment impressionnant.', date: '16 Jan.', isClient: true },
      { id: 'pm8', sender: 'Anna C.', senderInitials: 'AC', senderColor: 'bg-pw-400', text: 'Merci ! On peaufine l\'interface chat cette semaine.', date: '16 Jan.', isClient: false },
      { id: 'pm9', sender: 'Luc Bernard', senderInitials: 'LB', senderColor: 'bg-sky-300', text: 'On aimerait bien avoir les réponses multilingues aussi.', date: '14 Jan.', isClient: true },
      { id: 'pm10', sender: 'Anna C.', senderInitials: 'AC', senderColor: 'bg-pw-400', text: 'Noté, on l\'ajoute dans les idées à étudier.', date: '14 Jan.', isClient: false },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
