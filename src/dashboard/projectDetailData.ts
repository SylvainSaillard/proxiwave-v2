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

export interface Task {
  id: string;
  title: string;
  status: 'validated' | 'in_progress' | 'delivered';
  progress: number;
  startWeek: number;
  durationWeeks: number;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
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
      { id: 't1', title: 'Analyse des process', status: 'delivered', progress: 100, startWeek: 1, durationWeeks: 1, assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500' },
      { id: 't2', title: 'Connexion données', status: 'delivered', progress: 100, startWeek: 1, durationWeeks: 2, assignee: 'Marc R.', assigneeInitials: 'MR', assigneeColor: 'bg-sky-400' },
      { id: 't3', title: 'Template rapport v1', status: 'delivered', progress: 100, startWeek: 2, durationWeeks: 2, assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500' },
      { id: 't4', title: 'Export multi-formats', status: 'delivered', progress: 100, startWeek: 3, durationWeeks: 2, assignee: 'Marc R.', assigneeInitials: 'MR', assigneeColor: 'bg-sky-400' },
      { id: 't5', title: 'Planification auto', status: 'delivered', progress: 100, startWeek: 4, durationWeeks: 1, assignee: 'Jean P.', assigneeInitials: 'JP', assigneeColor: 'bg-pw-300' },
      { id: 't6', title: 'Résumé IA rapports', status: 'delivered', progress: 100, startWeek: 5, durationWeeks: 1, assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500' },
      { id: 't7', title: 'Notification Slack', status: 'in_progress', progress: 60, startWeek: 5, durationWeeks: 2, assignee: 'Marc R.', assigneeInitials: 'MR', assigneeColor: 'bg-sky-400' },
      { id: 't8', title: 'Dashboard récap', status: 'in_progress', progress: 35, startWeek: 6, durationWeeks: 2, assignee: 'Jean P.', assigneeInitials: 'JP', assigneeColor: 'bg-pw-300' },
      { id: 't9', title: 'Déploiement final', status: 'validated', progress: 0, startWeek: 7, durationWeeks: 1, assignee: 'Sophie L.', assigneeInitials: 'SL', assigneeColor: 'bg-pw-500' },
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
      { id: 't10', title: 'Base de connaissances', status: 'delivered', progress: 100, startWeek: 1, durationWeeks: 2, assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400' },
      { id: 't11', title: 'Moteur réponses IA', status: 'delivered', progress: 100, startWeek: 1, durationWeeks: 2, assignee: 'Luc B.', assigneeInitials: 'LB', assigneeColor: 'bg-sky-300' },
      { id: 't12', title: 'Interface chat', status: 'in_progress', progress: 55, startWeek: 2, durationWeeks: 2, assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400' },
      { id: 't13', title: 'Tests utilisateurs', status: 'in_progress', progress: 20, startWeek: 3, durationWeeks: 1, assignee: 'Luc B.', assigneeInitials: 'LB', assigneeColor: 'bg-sky-300' },
      { id: 't14', title: 'Escalade humaine', status: 'validated', progress: 0, startWeek: 4, durationWeeks: 2, assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400' },
      { id: 't15', title: 'Analytics conversations', status: 'validated', progress: 0, startWeek: 4, durationWeeks: 2, assignee: 'Luc B.', assigneeInitials: 'LB', assigneeColor: 'bg-sky-300' },
      { id: 't16', title: 'Déploiement production', status: 'validated', progress: 0, startWeek: 6, durationWeeks: 1, assignee: 'Anna C.', assigneeInitials: 'AC', assigneeColor: 'bg-pw-400' },
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
