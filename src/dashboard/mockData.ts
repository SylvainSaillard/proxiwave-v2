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
