export interface Project {
  id: string;
  name: string;
  category: string;
  progress: number;
  date: string;
  deadline: string;
  status: 'in_progress' | 'upcoming' | 'completed';
  team: { initials: string; color: string }[];
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  date: string;
  starred: boolean;
}

export interface User {
  name: string;
  initials: string;
  role: string;
}

export const currentUser: User = {
  name: 'Sylvain S.',
  initials: 'SS',
  role: 'Admin',
};

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Automatisation Reporting',
    category: 'Cabinet de conseil',
    progress: 90,
    date: '2 Jan. 2026',
    deadline: '2 jours',
    status: 'in_progress',
    team: [
      { initials: 'SL', color: 'bg-pw-500' },
      { initials: 'MR', color: 'bg-sky-400' },
      { initials: 'JP', color: 'bg-pw-300' },
    ],
  },
  {
    id: 'p2',
    name: 'Chatbot Interne',
    category: 'Support client',
    progress: 30,
    date: '5 Jan. 2026',
    deadline: '3 semaines',
    status: 'in_progress',
    team: [
      { initials: 'AC', color: 'bg-pw-400' },
      { initials: 'LB', color: 'bg-sky-300' },
    ],
  },
  {
    id: 'p3',
    name: 'Dashboard Médical',
    category: 'Santé',
    progress: 50,
    date: '10 Jan. 2026',
    deadline: '2 semaines',
    status: 'in_progress',
    team: [
      { initials: 'PT', color: 'bg-pw-600' },
      { initials: 'NV', color: 'bg-sky-400' },
      { initials: 'SL', color: 'bg-pw-300' },
    ],
  },
  {
    id: 'p4',
    name: 'Qualification Leads IA',
    category: 'Immobilier',
    progress: 20,
    date: '15 Jan. 2026',
    deadline: '3 semaines',
    status: 'in_progress',
    team: [
      { initials: 'MR', color: 'bg-pw-500' },
      { initials: 'JP', color: 'bg-sky-300' },
    ],
  },
  {
    id: 'p5',
    name: 'Suivi Production',
    category: 'Industrie',
    progress: 0,
    date: '20 Jan. 2026',
    deadline: '4 semaines',
    status: 'upcoming',
    team: [
      { initials: 'AC', color: 'bg-pw-400' },
    ],
  },
  {
    id: 'p6',
    name: 'Analyse Prédictive',
    category: 'Retail',
    progress: 0,
    date: '25 Jan. 2026',
    deadline: '5 semaines',
    status: 'upcoming',
    team: [
      { initials: 'LB', color: 'bg-sky-400' },
      { initials: 'NV', color: 'bg-pw-300' },
    ],
  },
];

export interface GlobalDocument {
  id: string;
  name: string;
  type: 'pdf' | 'figma' | 'sheet' | 'doc' | 'image';
  project: string;
  projectId: string;
  date: string;
  size: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  category: 'deliverable' | 'spec' | 'design' | 'report' | 'invoice';
  starred: boolean;
}

export const globalDocuments: GlobalDocument[] = [
  { id: 'gd1', name: 'Cahier des charges v2.pdf', type: 'pdf', project: 'Automatisation Reporting', projectId: 'p1', date: '3 Jan. 2026', size: '2.4 Mo', author: 'Sophie L.', authorInitials: 'SL', authorColor: 'bg-pw-500', category: 'spec', starred: true },
  { id: 'gd2', name: 'Maquettes Figma', type: 'figma', project: 'Automatisation Reporting', projectId: 'p1', date: '8 Jan. 2026', size: 'Lien', author: 'Marc R.', authorInitials: 'MR', authorColor: 'bg-sky-400', category: 'design', starred: false },
  { id: 'gd3', name: 'Suivi budget.xlsx', type: 'sheet', project: 'Automatisation Reporting', projectId: 'p1', date: '20 Jan. 2026', size: '156 Ko', author: 'Jean P.', authorInitials: 'JP', authorColor: 'bg-pw-300', category: 'report', starred: false },
  { id: 'gd4', name: 'PV de recette Sprint 2.pdf', type: 'pdf', project: 'Automatisation Reporting', projectId: 'p1', date: '31 Jan. 2026', size: '890 Ko', author: 'Sophie L.', authorInitials: 'SL', authorColor: 'bg-pw-500', category: 'deliverable', starred: true },
  { id: 'gd5', name: 'Brief chatbot.pdf', type: 'pdf', project: 'Chatbot Interne', projectId: 'p2', date: '4 Jan. 2026', size: '1.8 Mo', author: 'Anna C.', authorInitials: 'AC', authorColor: 'bg-pw-400', category: 'spec', starred: false },
  { id: 'gd6', name: 'Arborescence conversations.doc', type: 'doc', project: 'Chatbot Interne', projectId: 'p2', date: '9 Jan. 2026', size: '340 Ko', author: 'Luc B.', authorInitials: 'LB', authorColor: 'bg-sky-300', category: 'spec', starred: false },
  { id: 'gd7', name: 'Rapport livraison Sprint 1.pdf', type: 'pdf', project: 'Automatisation Reporting', projectId: 'p1', date: '16 Jan. 2026', size: '1.2 Mo', author: 'Sophie L.', authorInitials: 'SL', authorColor: 'bg-pw-500', category: 'deliverable', starred: false },
  { id: 'gd8', name: 'Facture Sprint 1.pdf', type: 'pdf', project: 'Automatisation Reporting', projectId: 'p1', date: '17 Jan. 2026', size: '320 Ko', author: 'Jean P.', authorInitials: 'JP', authorColor: 'bg-pw-300', category: 'invoice', starred: false },
  { id: 'gd9', name: 'Wireframes chatbot.figma', type: 'figma', project: 'Chatbot Interne', projectId: 'p2', date: '12 Jan. 2026', size: 'Lien', author: 'Anna C.', authorInitials: 'AC', authorColor: 'bg-pw-400', category: 'design', starred: true },
  { id: 'gd10', name: 'Dashboard specs.pdf', type: 'pdf', project: 'Dashboard Médical', projectId: 'p3', date: '11 Jan. 2026', size: '3.1 Mo', author: 'Pierre T.', authorInitials: 'PT', authorColor: 'bg-pw-600', category: 'spec', starred: false },
  { id: 'gd11', name: 'Maquettes dashboard.figma', type: 'figma', project: 'Dashboard Médical', projectId: 'p3', date: '14 Jan. 2026', size: 'Lien', author: 'Nadia V.', authorInitials: 'NV', authorColor: 'bg-sky-400', category: 'design', starred: false },
  { id: 'gd12', name: 'Rapport avancement Q1.xlsx', type: 'sheet', project: 'Qualification Leads IA', projectId: 'p4', date: '18 Jan. 2026', size: '420 Ko', author: 'Marc R.', authorInitials: 'MR', authorColor: 'bg-pw-500', category: 'report', starred: false },
  { id: 'gd13', name: 'Facture Sprint 2.pdf', type: 'pdf', project: 'Automatisation Reporting', projectId: 'p1', date: '1 Fév. 2026', size: '310 Ko', author: 'Jean P.', authorInitials: 'JP', authorColor: 'bg-pw-300', category: 'invoice', starred: false },
  { id: 'gd14', name: 'Capture écran prototype.png', type: 'image', project: 'Chatbot Interne', projectId: 'p2', date: '15 Jan. 2026', size: '2.8 Mo', author: 'Anna C.', authorInitials: 'AC', authorColor: 'bg-pw-400', category: 'design', starred: false },
];

export const messages: Message[] = [
  {
    id: 'm1',
    sender: 'David Martin',
    avatar: 'DM',
    preview: 'Bonjour, pouvez-vous me donner un point sur l\'avancement du projet ?',
    date: '21 Jan.',
    starred: false,
  },
  {
    id: 'm2',
    sender: 'Stéphanie Roux',
    avatar: 'SR',
    preview: 'Le premier livrable est excellent ! On peut passer à la suite.',
    date: '19 Jan.',
    starred: true,
  },
  {
    id: 'm3',
    sender: 'William Dupont',
    avatar: 'WD',
    preview: 'J\'aimerais quelques ajustements sur le dernier rapport envoyé.',
    date: '17 Jan.',
    starred: false,
  },
  {
    id: 'm4',
    sender: 'Alona Petit',
    avatar: 'AP',
    preview: 'Très impressionnée par les résultats. Continuez comme ça !',
    date: '15 Jan.',
    starred: false,
  },
  {
    id: 'm5',
    sender: 'Hira Benali',
    avatar: 'HB',
    preview: 'Quand commencez-vous la refonte de l\'app ? Le projet précédent était parfait.',
    date: '14 Jan.',
    starred: false,
  },
];
